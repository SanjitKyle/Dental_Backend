module.exports = {
  apps: [
    {
      name: "api-gateway",
      script: "./api-gateway/server.js",
      env: {
        PORT: 5000,
        AUTH_SERVICE_URL: "http://127.0.0.1:5001",
        PATIENT_SERVICE_URL: "http://127.0.0.1:5002",
        DOCTOR_SERVICE_URL: "http://127.0.0.1:5003",
        APPOINTMENT_SERVICE_URL: "http://127.0.0.1:5004",
        ODONTOGRAM_SERVICE_URL: "http://127.0.0.1:5005",
        PRESCRIPTION_SERVICE_URL: "http://127.0.0.1:5006"
      }
    },
    {
      name: "auth-service",
      script: "./auth-service/src/server.js",
      env: {
        PORT: 5001,
        // Add your DB strings here or use a .env file in the auth-service folder
        // MONGO_URI: "your_mongo_uri",
        // JWT_SECRET: "your_secret"
      }
    },
    {
      name: "patient-service",
      script: "./patient-service/src/server.js",
      env: {
        PORT: 5002,
        AUTH_SERVICE_URL: "http://127.0.0.1:5001/api/auth"
      }
    },
    {
      name: "doctor-service",
      script: "./doctor-service/src/server.js",
      env: {
        PORT: 5003,
        AUTH_SERVICE_URL: "http://127.0.0.1:5001/api/auth"
      }
    },
    {
      name: "appointment-service",
      script: "./appointment-service/src/server.js",
      env: {
        PORT: 5004,
      }
    },
    {
      name: "odontogram-service",
      script: "./odontogram-service/src/server.js",
      env: {
        PORT: 5005,
      }
    },
    {
      name: "prescription-service",
      script: "./prescription-service/src/server.js",
      env: {
        PORT: 5006,
      }
    }
  ]
};
