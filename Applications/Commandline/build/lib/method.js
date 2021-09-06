"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMethod = void 0;
const common_1 = require("./common");
const exitCodes_1 = require("./exitCodes");
async function runMethod(methodId) {
    return (0, common_1.returnError)(exitCodes_1.ExitCodes.METHOD_NOT_ALLOWED, `Method (ID=${methodId}) ran into an issue`);
    return (0, common_1.returnSuccess)(`Method (ID=${methodId}) ran`);
}
exports.runMethod = runMethod;
