"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const common_1 = require("../lib/common");
const method_1 = require("../lib/method");
const logging_1 = __importDefault(require("../utils/logging"));
exports.command = "run <methodId>";
exports.desc = "Runs a method";
const builder = (yargs) => yargs.positional("methodId", { type: "string", demandOption: true });
exports.builder = builder;
const handler = async (argv) => {
    const l = (0, logging_1.default)("run", argv);
    const { methodId } = argv;
    l.debug("Received method id", methodId);
    const [err, result] = await (0, method_1.runMethod)(methodId);
    if (err)
        (0, common_1.handleError)(l, err);
    (0, common_1.handleSuccess)(l, result);
};
exports.handler = handler;
