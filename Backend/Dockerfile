# Use Java 17 as the base image (matching the version in pom.xml)
FROM eclipse-temurin:17-jre-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the compiled executable JAR file to the container
# This assumes you have already run `mvn clean package` and the jar is in the target directory
COPY ./target/*.jar app.jar

# Expose port 8080 (the default port for Spring Boot web applications)
EXPOSE 8080

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
