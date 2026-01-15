
resource "google_monitoring_dashboard" "orion_dashboard" {
  project        = var.project_id
  dashboard_json = jsonencode({
    "displayName" : "Orion Engine Dashboard",
    "gridLayout" : {
      "columns" : "2",
      "widgets" : [
        {
          "title" : "Orchestrator Bot Latency (p95)",
          "xyChart" : {
            "dataSets" : [
              {
                "timeSeriesQuery" : {
                  "timeSeriesFilter" : {
                    "filter" : "metric.type=\"run.googleapis.com/request_latencies\" resource.type=\"cloud_run_revision\" resource.label.service_name=\"orion-orchestrator\"",
                    "aggregation" : {
                      "perSeriesAligner" : "ALIGN_PERCENTILE_95"
                    }
                  }
                },
                "plotType" : "LINE"
              }
            ],
            "chartOptions" : {
              "mode" : "COLOR"
            }
          }
        },
        {
          "title" : "Executor Bot Latency (p95)",
          "xyChart" : {
            "dataSets" : [
              {
                "timeSeriesQuery" : {
                  "timeSeriesFilter" : {
                    "filter" : "metric.type=\"run.googleapis.com/request_latencies\" resource.type=\"cloud_run_revision\" resource.label.service_name=\"orion-executor\"",
                    "aggregation" : {
                      "perSeriesAligner" : "ALIGN_PERCENTILE_95"
                    }
                  }
                },
                "plotType" : "LINE"
              }
            ],
            "chartOptions" : {
              "mode" : "COLOR"
            }
          }
        },
        {
          "title" : "Bot Server Errors (5xx)",
          "xyChart" : {
            "dataSets" : [
              {
                "timeSeriesQuery" : {
                  "timeSeriesFilter" : {
                    "filter" : "metric.type=\"run.googleapis.com/request_count\" resource.type=\"cloud_run_revision\" metric.label.response_code_class=\"5xx\"",
                    "aggregation" : {
                      "perSeriesAligner" : "ALIGN_RATE"
                    }
                  }
                },
                "plotType" : "STACKED_BAR"
              }
            ],
            "chartOptions" : {
              "mode" : "COLOR"
            }
          }
        },
        {
          "title" : "Scanner Output (Published Messages)",
          "xyChart" : {
            "dataSets" : [
              {
                "timeSeriesQuery" : {
                  "timeSeriesFilter" : {
                    "filter" : "metric.type=\"pubsub.googleapis.com/topic/send_request_count\" resource.type=\"pubsub_topic\" resource.label.topic_id=\"orion-scanner-output\"",
                    "aggregation" : {
                      "perSeriesAligner" : "ALIGN_RATE"
                    }
                  }
                },
                "plotType" : "LINE"
              }
            ]
          }
        }
      ]
    }
  })
}

resource "google_monitoring_notification_channel" "email" {
  display_name = "Admin Email"
  type         = "email"
  labels = {
    email_address = "admin@example.com" # Replace with your admin email
  }
}

resource "google_monitoring_alert_policy" "bot_error_rate" {
  display_name = "Orion Bot High Error Rate"
  combiner     = "OR"
  conditions {
    display_name = "High 5xx Error Rate on any Orion Bot"
    condition_threshold {
      filter     = "metric.type=\"run.googleapis.com/request_count\" resource.type=\"cloud_run_revision\" metric.label.response_code_class=\"5xx\""
      duration   = "300s"
      comparison = "COMPARISON_GT"
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_RATE"
      }
      threshold_value = 0.1 # Alert if error rate is > 0.1 requests/sec for 5 minutes
      trigger {
        count = 1
      }
    }
  }
  notification_channels = [
    google_monitoring_notification_channel.email.name
  ]
}
