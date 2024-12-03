import { AddressInfo } from "net";
import App from "./app";
import * as http from "http";
import logger from "./lib/winston-logger";

const app: App = new App();

let server: http.Server;

/**
 * Error handler for server events.
 * This function handles errors that occur when the server is trying to start.
 * @param error - Error object containing details of the error.
 */
function serverError(error: NodeJS.ErrnoException): void {
  // Checking if the error is not related to 'listen', if so, rethrow the error
  if (error.syscall !== "listen") {
    throw error;
  }
  // Rethrowing the error in other cases
  throw error;
}

/**
 * Function called when the server starts listening for incoming connections.
 * Logs the listening message to the logger.
 */
function serverListening(): void {
  // Get the address information of the server
  const addressInfo: AddressInfo = server.address() as AddressInfo;

  // Log the server listening URL with the specified or default port
  logger.info(`Listening on http://localhost:${process.env.PORT || 8080}`);
}

// Initialize the application by calling the init method
app
  .init()
  .then(() => {
    // Set the port configuration for the express app
    app.express.set("port", process.env.PORT || 8080);

    // Assign the created HTTP server to the server variable
    server = app.httpServer;

    // Attach the error handler to handle any server errors
    server.on("error", serverError);

    // Attach the listening handler that logs when the server starts listening
    server.on("listening", serverListening);

    // Start the server and make it listen on the specified port (either from env or default 8080)
    server.listen(process.env.PORT || 8080);
  })
  .catch((err: Error) => {
    // Log a message when there is an error during app initialization
    logger.info("app.init error");

    // Log the name, message, and stack of the error
    logger.error(err.name);
    logger.error(err.message);
    logger.error(err.stack);
  });

/**
 * Global handler for unhandled promise rejections.
 * Logs any unhandled promise rejections that occur within the application.
 */
process.on("unhandledRejection", (reason: Error) => {
  // Log the unhandled rejection error and its message
  logger.error("Unhandled Promise Rejection: reason:", reason.message);
  logger.error(reason.stack);
});
