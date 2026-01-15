
# Use the official Golang image to create a build artifact.
# This is the "builder" stage.
FROM golang:1.21-alpine AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code
COPY . .

# Build the Go app
# -o /app/scanner creates the binary in the /app directory
# CGO_ENABLED=0 and GOOS=linux are for cross-compilation to a lightweight Linux binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/scanner ./...

# ---

# Start a new, lightweight stage from scratch
FROM alpine:latest

# Set the Current Working Directory inside the container
WORKDIR /root/

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/scanner .

# Command to run the executable
CMD ["./scanner"]
