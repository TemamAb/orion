
# Use the official Python image as a builder stage
FROM python:3.9-slim as builder

# Set the working directory
WORKDIR /app

# Install build dependencies
RUN pip install --upgrade pip

# Copy and install requirements
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /app/wheels -r requirements.txt

# ---

# Start a new, lightweight stage
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the pre-built wheels from the builder stage
COPY --from=builder /app/wheels /wheels/

# Install the dependencies from the wheels
RUN pip install --no-cache /wheels/*

# Copy the application code
COPY . .

# Run the web server on container startup
# Use Gunicorn for a production-ready server
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
