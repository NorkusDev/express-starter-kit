import express, { Application, Request, Response } from "express";
import * as http from "http";
import addErrorHandler from "./middleware/error-middleware";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";
import registerRoutes from "./routes";
import database from "./database";
import logger from "./lib/winston-logger";

export default class App {
  /**
   * Public express application instance.
   * It is initialized in the init() method.
   */
  public express: Application;

  /**
   * HTTP server instance created using the express app.
   */
  public httpServer: http.Server;

  /**
   * Asynchronous initialization method to start the application.
   * It sets up the Express app, the HTTP server, configures the database,
   * middleware, and routes, and attaches the error handler.
   */
  public async init(): Promise<void> {
    /** Initialize express application */
    this.express = express();

    /** Create an HTTP server using the express instance */
    this.httpServer = http.createServer(this.express);

    /** Await the database configuration method to ensure DB is ready */
    await this.databaseConfiguration();

    /** Apply middleware configurations (security, body parsing, etc.) */
    this.appMiddleware();

    /** Register application routes */
    this.routes();

    /** Attach error-handling middleware (should be placed last) */
    this.express.use(addErrorHandler);
  }

  /**
   * Private method to handle database connection configuration.
   * It tries to authenticate and establish a connection with the database.
   */
  private async databaseConfiguration(): Promise<void> {
    try {
      /** Attempt to authenticate and establish a connection with the database */
      await database.authenticate();
      /** Log success message if connection is established */
      logger.info("Connection has been established successfully.");
    } catch (error) {
      // throw Error(error)
      /** Log an error message if database connection fails */
      logger.error("Unable to connect to the database: ", error);
    }
  }

  /**
   * Private method to configure middlewares for the express app.
   * It includes security measures, body parsers for JSON and URL-encoded data, and CORS support.
   */
  private appMiddleware(): void {
    /** Helmet adds various HTTP headers to secure the app */
    this.express.use(helmet());

    /** JSON body parser to handle large payloads (limit: 100mb) */
    this.express.use(express.json({ limit: "100mb" }));

    /** URL-encoded body parser for form submissions, supporting extended syntax (limit: 100mb) */
    this.express.use(express.urlencoded({ limit: "100mb", extended: true }));

    /** Enable CORS (Cross-Origin Resource Sharing) to allow requests from different origins */
    this.express.use(cors());

    /** Optionally, body-parser could be used explicitly instead of express built-in parsers:
    //  * this.express.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
    //  * this.express.use(bodyParser.json());
     */
  }

  /**
   * Private method to register API routes.
   * It mounts routes with a base path of "/api".
   */
  private routes(): void {
    /** Register routes with a base path of "/api" */
    this.express.use("/api", registerRoutes());
  }
}
