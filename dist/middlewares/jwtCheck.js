"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { SECRET } = process.env;
function default_1(req, res, next) {
    if (!req.headers.token || typeof req.headers.token !== 'string') {
        return res.status(401).json('Unauthorized');
    }
    const { token } = req.headers;
    // TODO: Check token payload too
    try {
        (0, jsonwebtoken_1.verify)(token, SECRET);
        next();
    }
    catch (error) {
        return res.status(401).json('Unauthorized');
    }
}
exports.default = default_1;
//# sourceMappingURL=jwtCheck.js.map