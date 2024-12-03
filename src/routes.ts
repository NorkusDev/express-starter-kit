import { RequestHandler, Router } from "express";
import { RouteDefinition } from "./abstraction/route-definition";
import logger from "./lib/winston-logger";
import UserController from "./components/users/users-controller";
import { validate } from "./middleware/validation-middleware";
import { authMiddleware } from "./middleware/auth-middleware";

/**
 * Registers routes for a given controller using the route definitions provided.
 * It dynamically attaches middlewares like authentication, validation, and the route handler itself.
 *
 * @param routes - Array of RouteDefinition objects, each containing information about the route.
 * @returns Router - Express Router instance with all routes registered.
 */
function registerControllerRoutes(routes: RouteDefinition[]): Router {
  // Create a new router instance
  const ctrlRouter = Router();

  // Iterate over each route definition in the routes array
  routes.forEach((route) => {
    const { path, method, validator, auth, handler } = route;

    // Initialize middleware list for this route
    const middlewares: RequestHandler[] = [];

    // If the route requires authentication, add the authMiddleware
    if (auth) {
      middlewares.push(authMiddleware);
    }

    // If the route has validation middleware, spread the validator array into middlewares
    if (validator) {
      middlewares.push(...validator);
    }

    // Add the validate function (assumed to be a generic validation middleware) and the actual route handler
    middlewares.push(validate, handler);

    // Register the route based on the method type (GET, POST, etc.)
    switch (method) {
      case "get":
        ctrlRouter.get(path, ...middlewares);
        break;
      case "post":
        ctrlRouter.post(path, ...middlewares);
        break;
      case "put":
        ctrlRouter.put(path, ...middlewares);
        break;
      case "patch":
        ctrlRouter.patch(path, ...middlewares);
        break;
      case "delete":
        ctrlRouter.delete(path, ...middlewares);
        break;
      default:
        // Throw an error if an unsupported method is encountered
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  });

  // Return the router with all the routes registered
  return ctrlRouter;
}

/**
 * Registers all routes by iterating through the controllers and attaching their routes.
 * It binds each controller's routes to a versioned base path (e.g., /v1/users).
 *
 * @returns Router - Express Router instance with all routes from the controllers.
 */
export default function registerRoutes(): Router {
  try {
    // Create a new root router instance
    const router = Router();

    // Array of controller instances (in this case, just UserController)
    const controllers = [new UserController()];

    // Iterate over each controller and register their routes with the main router
    controllers.forEach((controller) => {
      // Use the controller's base path (e.g., /users) and attach its routes to the router
      router.use(
        `/v1/${controller.basePath}`, // e.g., /v1/users
        registerControllerRoutes(controller.routes()) // Register the routes for the controller
      );
    });

    // Return the main router with all controller routes registered
    return router;
  } catch (error) {
    // Log an error if there's an issue during route registration
    logger.error("Unable to register the routes", error);
  }
}
