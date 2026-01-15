#!/bin/bash
set -e

# --- USER CONFIGURATION ---
PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
REPO_NAME="orion-repo"

echo "🛠️ Step 1: Preparing Google Cloud Project: $PROJECT_ID"
gcloud services enable artifactregistry.googleapis.com run.googleapis.com aiplatform.googleapis.com

# Create Repo if not exists
gcloud artifacts repositories create $REPO_NAME --repository-format=docker --location=$REGION || true

echo "📦 Step 2: Building & Pushing Container Images..."

# Build Scanner
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/scanner ./scanner
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/scanner

# Build Orchestrator
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/orchestrator ./orchestrator
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/orchestrator

# Build Executor
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/executor ./executor
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/executor

# Build Frontend
cd frontend && docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/frontend .
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/frontend
cd ..

echo "🏗️ Step 3: Deploying Infrastructure via Terraform..."
cd terraform
terraform init
terraform apply -var="project_id=$PROJECT_ID" -var="region=$REGION" -auto-approve

echo "✨ DEPLOYMENT COMPLETE!"
echo "🔗 Access your Orion Dashboard at: $(terraform output -raw ui_url)"
