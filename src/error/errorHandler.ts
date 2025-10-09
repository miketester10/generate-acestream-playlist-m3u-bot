import axios from "axios";
import { logger } from "../logger/logger";

export const errorHandler = (error: unknown): string => {
  let defaultMessage = `❌ An error occurred. Please try again.`;

  if (axios.isAxiosError(error)) {
    const message = error.response?.data || error.message;
    const cause = error.cause || `N/A`;
    logger.error(`❌ Axios Error [${error.status} - ${error.code}]: ${message} [Cause: ${cause}]`);
  } else {
    const message = (error as Error).message;
    logger.error(`❌ Error: ${message}`);
  }

  return defaultMessage;
};
