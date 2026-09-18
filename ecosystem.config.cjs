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
        PRESCRIPTION_SERVICE_URL: "http://127.0.0.1:5006",
        ENQUIRY_SERVICE_URL: "http://127.0.0.1:5007",
        STAFF_SERVICE_URL: "http://127.0.0.1:5008"
      }
    },
    {
      name: "auth-service",
      script: "./auth-service/src/server.js",
      env: {
        PORT: 5001,
        MONGODB_URI: "mongodb+srv://kylefront74_db_user:VDYRaFw5PiEhnaFN@cluster0.h9cr4n4.mongodb.net/?appName=Cluster0",
        JWT_SECRET: "HOSPITAL_MAN"
      }
    },
    {
      name: "patient-service",
      script: "./patient-service/src/server.js",
      env: {
        PORT: 5002,
        AUTH_SERVICE_URL: "http://127.0.0.1:5001/api/auth",
        MONGODB_URI: "mongodb+srv://kylefront74_db_user:VDYRaFw5PiEhnaFN@cluster0.h9cr4n4.mongodb.net/?appName=Cluster0",
        JWT_SECRET: "HOSPITAL_MAN"
      }
    },
    {
      name: "doctor-service",
      script: "./doctor-service/src/server.js",
      env: {
        PORT: 5003,
        AUTH_SERVICE_URL: "http://127.0.0.1:5001/api/auth",
        MONGODB_URI: "mongodb+srv://kylefront74_db_user:VDYRaFw5PiEhnaFN@cluster0.h9cr4n4.mongodb.net/?appName=Cluster0",
        JWT_SECRET: "HOSPITAL_MAN"
      }
    },
    {
      name: "appointment-service",
      script: "./appointment-service/src/server.js",
      env: {
        PORT: 5004,
        MONGODB_URI: "mongodb+srv://kylefront74_db_user:VDYRaFw5PiEhnaFN@cluster0.h9cr4n4.mongodb.net/?appName=Cluster0",
        JWT_SECRET: "HOSPITAL_MAN"
      }
    },
    {
      name: "odontogram-service",
      script: "./odontogram-service/src/server.js",
      env: {
        PORT: 5005,
        MONGODB_URI: "mongodb+srv://kylefront74_db_user:VDYRaFw5PiEhnaFN@cluster0.h9cr4n4.mongodb.net/?appName=Cluster0",
        JWT_SECRET: "HOSPITAL_MAN"
      }
    },
    {
      name: "prescription-service",
      script: "./prescription-service/src/server.js",
      env: {
        PORT: 5006,
        MONGODB_URI: "mongodb+srv://kylefront74_db_user:VDYRaFw5PiEhnaFN@cluster0.h9cr4n4.mongodb.net/?appName=Cluster0",
        JWT_SECRET: "HOSPITAL_MAN"
      }
    },
    {
      name: "enquiry-service",
      script: "./enquiry-service/src/server.js",
      env: {
        PORT: 5007,
        MONGODB_URI: "mongodb+srv://kylefront74_db_user:VDYRaFw5PiEhnaFN@cluster0.h9cr4n4.mongodb.net/?appName=Cluster0",
        JWT_SECRET: "HOSPITAL_MAN"
      }
    },
    {
      name: "staff-service",
      script: "./staff-service/src/server.js",
      env: {
        PORT: 5008,
        AUTH_SERVICE_URL: "http://127.0.0.1:5001/api/auth",
        MONGODB_URI: "mongodb+srv://kylefront74_db_user:VDYRaFw5PiEhnaFN@cluster0.h9cr4n4.mongodb.net/?appName=Cluster0",
        JWT_SECRET: "HOSPITAL_MAN"
      }
    }
  ]
};
