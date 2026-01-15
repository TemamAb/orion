# Orion Enterprise Engine

A sophisticated arbitrage trading platform with AI-powered decision making, built on Google Cloud Platform.

## Architecture

- **Frontend**: React + TypeScript UI served via Cloud Run
- **Scanner**: Go service scanning for arbitrage opportunities
- **Orchestrator**: Python service using Vertex AI for trade decisions
- **Executor**: Node.js service executing trades via Pimlico

## Quick Start

1. **Prerequisites**:
   - Google Cloud SDK (`gcloud`)
   - Terraform
   - Docker

2. **Setup**:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Deploy**:
   ```bash
   ./deploy.sh
   ```

4. **Access**: The script will output the UI URL.

## Development

- Frontend: `cd frontend && npm install && npm run dev`
- Services: Use Docker for local development

## Configuration

- Set secrets in GCP Secret Manager: `PIMLICO_API_KEY`, `EXECUTOR_WALLET_KEY`
- Environment variables handled via Terraform

## Monitoring

- Cloud Monitoring dashboard included
- Logs available in Cloud Logging
