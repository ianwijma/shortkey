import { exit } from "yargs";
import { ErrorObject, TupleReturnError, TupleReturnSuccess } from "../@types";
import { LoggingObject } from "../utils/logging";
import { ExitCodes } from "./exitCodes";

export function returnSuccess<T>(value: T): TupleReturnSuccess<T> {
  return [null, value];
}

export function returnError(errorObject: ErrorObject): TupleReturnError {
  return [errorObject, null];
}

export function returnErrorFromString(
  exitCode: ExitCodes,
  error: string
): TupleReturnError {
  return returnError(constructErrorObjectFromString(exitCode, error));
}

export function returnErrorFromError(
  exitCode: ExitCodes,
  error: Error
): TupleReturnError {
  return returnError(constructErrorObjectFromError(exitCode, error));
}

export function constructErrorObject(
  exitCode: ExitCodes,
  error: string | Error
): ErrorObject {
  if (error instanceof Error) {
    return constructErrorObjectFromError(exitCode, error);
  }

  return constructErrorObjectFromString(exitCode, error);
}

export function constructErrorObjectFromError(
  exitCode: ExitCodes,
  error: Error
): ErrorObject {
  return {
    code: exitCode,
    original: error,
    message: error.message,
  };
}

export function constructErrorObjectFromString(
  exitCode: ExitCodes,
  error: string
): ErrorObject {
  return {
    code: exitCode,
    original: new Error(error),
    message: error,
  };
}

export function handleError(logger: LoggingObject, error: ErrorObject): void {
  const { message, code, original } = error;
  logger.fatal(message);
  exit(code, original);
}

export function handleSuccess(logger: LoggingObject, results: any): void {
  logger.success(results);
}
