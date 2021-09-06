"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consola_1 = __importDefault(require("consola"));
function logger(context = undefined, argv = undefined) {
    let level = argv?.verbose ?? 3;
    if (level === 0)
        level = 3;
    const consolaLogger = consola_1.default.create({
        level,
    });
    function createLogger(level, context) {
        return function loggerFunction(msg, ...args) {
            if (context)
                msg = `[${context}] ${msg}`;
            consolaLogger[level](msg, ...args);
        };
    }
    return {
        fatal: createLogger("fatal", context),
        error: createLogger("error", context),
        warn: createLogger("warn", context),
        log: createLogger("log", context),
        info: createLogger("info", context),
        success: createLogger("success", context),
        debug: createLogger("debug", context),
        trace: createLogger("trace", context),
    };
}
exports.default = logger;
