# Use the official Go image as a base for building the application
FROM golang:1.22-alpine AS builder

# Set the current working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum to download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build the Go application
# CGO_ENABLED=0 is important for creating a static binary
# GOOS=linux ensures the binary is built for Linux, which is common for Docker containers
# -o main specifies the output file name
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Use a minimal base image for the final stage to keep the image size small
FROM alpine:latest

# Set the working directory inside the final image
WORKDIR /root/

# Copy the compiled binary from the builder stage
COPY --from=builder /app/main .

# Copy the .env file.
# IMPORTANT: For production environments, consider using Docker secrets, Kubernetes secrets,
# or environment variables directly in your deployment configuration instead of copying .env file.
COPY .env .

# Expose the port your application listens on.
# Assuming your Go application listens on port 8080. Adjust if different.
EXPOSE 8080

# Command to run the executable when the container starts
CMD ["./main"]
