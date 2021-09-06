"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSuccess = exports.handleError = exports.constructErrorObjectFromString = exports.constructErrorObjectFromError = exports.constructErrorObject = exports.returnError = exports.returnSuccess = void 0;
const yargs_1 = require("yargs");
function returnSuccess(value) {
    return [, value];
}
exports.returnSuccess = returnSuccess;
function returnError(exitCode, error) {
    return [constructErrorObject(exitCode, error)];
}
exports.returnError = returnError;
function constructErrorObject(exitCode, error) {
    if (error instanceof Error) {
        return constructErrorObjectFromError(exitCode, error);
    }
    return constructErrorObjectFromString(exitCode, error);
}
exports.constructErrorObject = constructErrorObject;
function constructErrorObjectFromError(exitCode, error) {
    return {
        code: exitCode,
        original: error,
        message: error.message,
    };
}
exports.constructErrorObjectFromError = constructErrorObjectFromError;
function constructErrorObjectFromString(exitCode, error) {
    return {
        code: exitCode,
        original: new Error(error),
        message: error,
    };
}
exports.constructErrorObjectFromString = constructErrorObjectFromString;
function handleError(logger, error) {
    const { message, code, original } = error;
    logger.fatal(message);
    (0, yargs_1.exit)(code, original);
}
exports.handleError = handleError;
function handleSuccess(logger, results) {
    logger.success(results);
}
exports.handleSuccess = handleSuccess;
