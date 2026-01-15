
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"orion/scanner/pkg/config"
	"orion/scanner/pkg/scanner"
)

func main() {
	ctx := context.Background()
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	fmt.Println("Starting Orion Scanner Bot...")
	fmt.Printf("Connecting to blockchain provider at: %s\n", cfg.EthNodeURL)
	fmt.Printf("Publishing to Pub/Sub topic: %s\n", cfg.PubSubTopicID)

	// Initialize the scanner service
	scannerSvc, err := scanner.NewService(ctx, cfg)
	if err != nil {
		log.Fatalf("Failed to initialize scanner service: %v", err)
	}

	// Start scanning for arbitrage opportunities
	// This will be a long-running process, listening for new blocks.
	// For this blueprint, we will simulate a single scan.
	if err := scannerSvc.Scan(ctx); err != nil {
		log.Printf("An error occurred during scanning: %v", err)
		os.Exit(1)
	}

	fmt.Println("Scanner Bot finished its run.")
}
