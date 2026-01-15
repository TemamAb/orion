
package config

import (
	"fmt"
	"os"
)

// Config holds the application's configuration.
type Config struct {
	ProjectID     string
	PubSubTopicID string
	EthNodeURL    string
}

// Load loads the configuration from environment variables.
func Load() (*Config, error) {
	projectID := os.Getenv("GCP_PROJECT_ID")
	if projectID == "" {
		return nil, fmt.Errorf("GCP_PROJECT_ID environment variable not set")
	}

	topicID := os.Getenv("PUBSUB_TOPIC_ID")
	if topicID == "" {
		return nil, fmt.Errorf("PUBSUB_TOPIC_ID environment variable not set")
	}

	nodeURL := os.Getenv("ETH_NODE_URL")
	if nodeURL == "" {
		return nil, fmt.Errorf("ETH_NODE_URL environment variable not set")
	}

	return &Config{
		ProjectID:     projectID,
		PubSubTopicID: topicID,
		EthNodeURL:    nodeURL,
	}, nil
}
