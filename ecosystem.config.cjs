module.exports = {
  apps: [
    {
      name: "api-gateway",
      script: "./api-gateway/server.js",
      env: {
        PORT: 5000,
        AUTH_SERVICE_URL: "http://localhost:5001",
        PATIENT_SERVICE_URL: "http://localhost:5002",
        DOCTOR_SERVICE_URL: "http://localhost:5003",
        APPOINTMENT_SERVICE_URL: "http://localhost:5004"
      }
    },
    {
      name: "auth-service",
      script: "./auth-service/server.js",
      env: {
        PORT: 5001,
        // Add your DB strings here or use a .env file in the auth-service folder
        // MONGO_URI: "your_mongo_uri",
        // JWT_SECRET: "your_secret"
      }
    },
    {
      name: "patient-service",
      script: "./patient-service/server.js",
      env: {
        PORT: 5002,
      }
    },
    {
      name: "doctor-service",
      script: "./doctor-service/server.js",
      env: {
        PORT: 5003,
      }
    },
    {
      name: "appointment-service",
      script: "./appointment-service/server.js",
      env: {
        PORT: 5004,
      }
    }
  ]
};
