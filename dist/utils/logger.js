"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
exports.logger = (0, winston_1.createLogger)({
    levels: winston_1.config.syslog.levels,
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'logs/combined.log' }),
    ],
});
//# sourceMappingURL=logger.js.map