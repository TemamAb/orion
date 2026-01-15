
output "scanner_service_url" {
  description = "The URL of the Orion Scanner service."
  value       = google_cloud_run_v2_service.scanner_service.uri
}

output "orchestrator_service_url" {
  description = "The URL of the Orion Orchestrator service."
  value       = google_cloud_run_v2_service.orchestrator_service.uri
}

output "executor_service_url" {
  description = "The URL of the Orion Executor service."
  value       = google_cloud_run_v2_service.executor_service.uri
}

output "scanner_output_topic" {
  description = "The name of the Pub/Sub topic for scanner output."
  value       = google_pubsub_topic.scanner_topic.name
}

output "executor_output_topic" {
  description = "The name of the Pub/Sub topic for executor output."
  value       = google_pubsub_topic.executor_topic.name
}
