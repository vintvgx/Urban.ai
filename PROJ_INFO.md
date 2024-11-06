## Project Structure

Full-stack application with React frontend and Express backend

- The application is containerized using Docker and deployed on Google Cloud Run [Dockerfile]
- The container is configured to listen on port 8080

1. Deployment Configuration:

- The service is named `urban-ai-app`
- It's deployed in the `us-east1` region
- The container image is stored in Google Container Registry at:
  `us-east1-docker.pkg.dev/urban-ai-c1cf7/cloud-run-source-deploy/urban.ai/urban-ai-app`

1. Environment Configuration:

```yaml
env:
  - name: REACT_APP_SERVER_URL
    value: https://urban-ai-app-4dpgega65a-ue.a.run.app
  - name: OPENAI_ORG_ID
    value: [your-org-id]
  - name: OPENAI_API_KEY
    value: [your-api-key]
```

This suggests that:

- Your React frontend is configured to communicate with your backend at the specified URL
- The application integrates with OpenAI's services

1. Resource Allocation:

- CPU: 1000m (1 vCPU)
- Memory: 512Mi
- Container Concurrency: 80 requests per instance

## Host: Google Cloud

[GOOGLE CLOUD](https://console.cloud.google.com/welcome?project=urban-ai-c1cf7)

- [DOMAIN](https://console.cloud.google.com/net-services/domains/registrations/list?project=urban-ai-c1cf7)
