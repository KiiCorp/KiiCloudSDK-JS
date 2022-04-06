"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuccess = void 0;
const isSuccess = (status) => 200 <= status && status < 300;
exports.isSuccess = isSuccess;
