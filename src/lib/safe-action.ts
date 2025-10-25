import { createSafeActionClient } from "next-safe-action";

/**
 * Creates a safe action client with custom error handling.
 *
 * By default, next-safe-action masks all server errors with "Something went wrong".
 * This configuration allows us to return the actual error messages to the client.
 */
export const actionClient = createSafeActionClient({
  handleServerError(e) {
    // Log the error for debugging purposes
    console.error("Action error:", e.message);

    // Return the actual error message to the client
    // If you want to mask certain errors, you can add logic here
    if (e instanceof Error) {
      return e.message;
    }

    // Fallback error message
    return "Ha ocurrido un error inesperado";
  },
});
