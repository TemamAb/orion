
provider "google" {
  project = var.project_id
  region  = var.region
}

variable "project_id" {}
variable "region" { default = "us-central1" }

resource "google_artifact_registry_repository" "orion_repo" {
  location      = var.region
  repository_id = "orion-repo"
  format        = "DOCKER"
}

resource "google_pubsub_topic" "opportunities" { name = "arbitrage-opportunities" }

resource "google_cloud_run_v2_service" "scanner" {
  name     = "orion-scanner"
  location = var.region
  template {
    containers { image = "${var.region}-docker.pkg.dev/${var.project_id}/orion-repo/scanner:latest" }
  }
}

resource "google_cloud_run_v2_service" "orchestrator" {
  name     = "orion-orchestrator"
  location = var.region
  template {
    containers {
        image = "${var.region}-docker.pkg.dev/${var.project_id}/orion-repo/orchestrator:latest"
        env { name = "PROJECT_ID", value = var.project_id }
    }
  }
}

resource "google_cloud_run_v2_service" "executor" {
  name     = "orion-executor"
  location = var.region
  template {
    containers { image = "${var.region}-docker.pkg.dev/${var.project_id}/orion-repo/executor:latest" }
  }
}

resource "google_cloud_run_v2_service" "frontend" {
  name     = "orion-ui"
  location = var.region
  template {
    containers { image = "${var.region}-docker.pkg.dev/${var.project_id}/orion-repo/frontend:latest" }
  }
}

output "ui_url" { value = google_cloud_run_v2_service.frontend.uri }
