
provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_project_service" "run" {
  service = "run.googleapis.com"
}

resource "google_project_service" "pubsub" {
  service = "pubsub.googleapis.com"
}

resource "google_project_service" "secretmanager" {
  service = "secretmanager.googleapis.com"
}

resource "google_project_service" "aiplatform" {
  service = "aiplatform.googleapis.com"
}

resource "google_project_service" "monitoring" {
  service = "monitoring.googleapis.com"
}

# --- Service Accounts ---

resource "google_service_account" "scanner_sa" {
  account_id   = "orion-scanner-sa"
  display_name = "Orion Scanner Bot Service Account"
}

resource "google_service_account" "orchestrator_sa" {
  account_id   = "orion-orchestrator-sa"
  display_name = "Orion Orchestrator Bot Service Account"
}

resource "google_service_account" "executor_sa" {
  account_id   = "orion-executor-sa"
  display_name = "Orion Executor Bot Service Account"
}

# --- Pub/Sub Topics ---

resource "google_pubsub_topic" "scanner_topic" {
  name = "orion-scanner-output"
}

resource "google_pubsub_topic" "executor_topic" {
  name = "orion-executor-output"
}

# --- IAM Bindings ---

# Scanner can publish to its output topic
resource "google_project_iam_member" "scanner_pubsub_publisher" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${google_service_account.scanner_sa.email}"
}

# Orchestrator can publish to the executor topic and invoke Vertex AI
resource "google_project_iam_member" "orchestrator_pubsub_publisher" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${google_service_account.orchestrator_sa.email}"
}

resource "google_project_iam_member" "orchestrator_ai_user" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.orchestrator_sa.email}"
}

# Executor can access its secrets
resource "google_project_iam_member" "executor_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.executor_sa.email}"
}

# --- Secret Manager Secrets ---

resource "google_secret_manager_secret" "pimlico_api_key" {
  secret_id = "PIMLICO_API_KEY"
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "executor_wallet_key" {
  secret_id = "EXECUTOR_WALLET_KEY"
  replication {
    automatic = true
  }
}

# --- Cloud Run Services ---

resource "google_cloud_run_v2_service" "scanner_service" {
  name     = "orion-scanner"
  location = var.region
  template {
    containers {
      image = "gcr.io/${var.project_id}/orion-scanner:latest" # Assumes image is pushed to GCR
    }
    service_account = google_service_account.scanner_sa.email
  }
  depends_on = [google_project_service.run]
}

resource "google_cloud_run_v2_service" "orchestrator_service" {
  name     = "orion-orchestrator"
  location = var.region
  template {
    containers {
      image = "gcr.io/${var.project_id}/orion-orchestrator:latest"
      ports {
        container_port = 8080
      }
    }
    service_account = google_service_account.orchestrator_sa.email
  }
  depends_on = [google_project_service.run]
}

resource "google_cloud_run_v2_service" "executor_service" {
  name     = "orion-executor"
  location = var.region
  template {
    containers {
      image = "gcr.io/${var.project_id}/orion-executor:latest"
      ports {
        container_port = 8080
      }
    }
    service_account = google_service_account.executor_sa.email
  }
  depends_on = [google_project_service.run]
}

# --- Pub/Sub Push Subscriptions to trigger Cloud Run ---

resource "google_pubsub_subscription" "orchestrator_sub" {
  name  = "orion-orchestrator-sub"
  topic = google_pubsub_topic.scanner_topic.name

  push_config {
    push_endpoint = google_cloud_run_v2_service.orchestrator_service.uri
    oidc_token {
      service_account_email = google_service_account.orchestrator_sa.email
    }
  }
}

resource "google_pubsub_subscription" "executor_sub" {
  name  = "orion-executor-sub"
  topic = google_pubsub_topic.executor_topic.name

  push_config {
    push_endpoint = google_cloud_run_v2_service.executor_service.uri
    oidc_token {
      service_account_email = google_service_account.executor_sa.email
    }
  }
}
