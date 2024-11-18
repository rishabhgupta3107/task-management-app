# Task Management Backend

This is the backend service for the Task Management Application using Spring Boot. It provides APIs for user authentication, task CRUD operations, and includes security features like JWT authentication and CORS management.

## Technologies Used

- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- H2 Database (for development)
- Maven

## Getting Started

### Prerequisites

- Java 11 or higher
- Maven

### Setup

1. **Clone the repository**:
   ```sh
   git clone https://github.com/yourusername/task-management-app.git
   cd task-management-app/backend-springboot

2. Set up environment variables or application properties: Configure the application.properties file in src/main/resources to include your JWT secret key:
   jwt.secret=mySuperSecretKey123


3. Build and run the application:
   ./mvnw spring-boot:run


4. Access the H2 Console: The application uses an H2 in-memory database. Access the H2 console at:
   http://localhost:8080/h2-console

Use the default credentials specified in application.properties.

API Documentation

Authentication

POST /api/auth/login: Authenticates a user and returns a JWT.
Task Management
GET /api/tasks: Retrieves all tasks.
POST /api/tasks: Creates a new task.
PUT /api/tasks/{id}: Updates an existing task.
DELETE /api/tasks/{id}: Deletes a task.

## Running Tests

To run the unit tests, use:
./mvnw clean test

Security Configuration
CSRF protection is disabled.
CORS is configured to allow requests from http://localhost:4200.
JWT is used for authentication.

#### 3.3 Frontend README (`task-management-app/frontend/README.md`)

```markdown
