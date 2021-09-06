"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const logging_1 = __importDefault(require("../utils/logging"));
exports.command = "log <message>";
exports.desc = "Tests the logging capabilities";
const builder = (yargs) => yargs.positional("message", { type: "string", demandOption: true });
exports.builder = builder;
const handler = (argv) => {
    const { message } = argv;
    const l = (0, logging_1.default)(argv);
    l.fatal(message);
    l.error(message);
    l.warn(message);
    l.log(message);
    l.info(message);
    l.success(message);
    l.debug(message);
    l.trace(message);
};
exports.handler = handler;
