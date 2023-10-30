"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const customError_1 = __importDefault(require("./customError"));
function default_1(req, res, next) {
    // checking every expected field and their type
    // package like express validator are doing all this way better
    const { providerId, consumerId, conditions, target } = req.body;
    const errors = [];
    if (!(0, mongoose_1.isValidObjectId)(providerId)) {
        const err = new customError_1.default('body', 'providerId', providerId);
        errors.push(err);
    }
    if (!(0, mongoose_1.isValidObjectId)(consumerId)) {
        const err = new customError_1.default('body', 'consumerId', consumerId);
        errors.push(err);
    }
    if (typeof conditions === 'object' && !Array.isArray(conditions)) {
        isInstanceOfCondition(conditions, errors);
    }
    else {
        errors.push(new customError_1.default('body', 'conditions', conditions));
    }
    if (!target || typeof target !== 'string') {
        const err = new customError_1.default('body', 'target', target);
        errors.push(err);
    }
    if (errors.length) {
        return res.status(406).json(errors);
    }
    next();
}
exports.default = default_1;
function isInstanceOfCondition(object, errors) {
    if (!('context' in object) ||
        !('type' in object) ||
        !('permission' in object) ||
        typeof object.context !== 'string' ||
        typeof object.type !== 'string' ||
        typeof object.permission !== 'object') {
        errors.push(new customError_1.default('body', 'condition', 'missing fields or invalid value.'));
        return false;
    }
    const perm = object.permission;
    if (!('action' in perm) ||
        !('target' in perm) ||
        !('constraint' in perm) ||
        typeof perm.action !== 'string' ||
        typeof perm.target !== 'string' ||
        !Array.isArray(perm.constraint)) {
        errors.push(new customError_1.default('body', 'condition.permission', 'missing fields or invalid value.'));
        return false;
    }
    const constraint = perm.constraint;
    if (constraint.length) {
        for (const i in constraint) {
            if (!('leftOperand' in constraint[i]) ||
                !('operator' in constraint[i]) ||
                !('rightOperand' in constraint[i]) ||
                typeof constraint[i].leftOperand !== 'string' ||
                typeof constraint[i].operator !== 'string' ||
                typeof constraint[i].rightOperand !== 'object') {
                errors.push(new customError_1.default('body', 'condition.permission', 'missing fields or invalid value.'));
                return false;
            }
            else {
                const rightOp = constraint[i].rightOperand;
                if (!('value' in rightOp) ||
                    !('type' in rightOp) ||
                    typeof rightOp.value !== 'string' ||
                    typeof rightOp.type !== 'string') {
                    errors.push(new customError_1.default('body', `condition.permission[${i}]`, 'invalid value.'));
                    return false;
                }
            }
        }
    }
    return true;
}
//# sourceMappingURL=checkContractCreationPayload.js.map