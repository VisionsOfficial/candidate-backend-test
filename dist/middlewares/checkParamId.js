"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
function default_1(req, res, next) {
    var _a;
    const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        return res.status(406).json('Malformed param: id');
    }
    next();
}
exports.default = default_1;
//# sourceMappingURL=checkParamId.js.map