FROM maven:latest AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app

COPY --from=build /app/target/lab1arq.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]