"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCallback = exports.clone = exports.error = exports.isNonEmptyString = exports.validateServerCodeEntryVersion = exports.validateServerCodeEntryArgument = exports.validateServerCodeEntryName = exports.disableCacheURL = exports.type = exports.isJSONType = exports.safeCalculateExpiresAtAsDate = exports.safeCalculateExpiresAtAsNumber = exports.safeMultiplyTicks = exports.safeAddTicks = exports.validateDisplayName = exports.validateGroupID = exports.validateUsername = exports.assertPasswordIsValid = exports.validatePassword = exports.assertCountryCodeIsValid = exports.validateCountryCode = exports.assertLocalPhoneIsValid = exports.validateLocalPhone = exports.isGlobalPhoneNumber = exports.validatePhoneNumber = exports.validatePattern = exports.trim = exports.validateEmail = void 0;
const exception_1 = require("./exception");
const MAX_DATE_IN_MILLIS = 100000000 * 24 * 60 * 60 * 1000;
const MIN_DATE_IN_MILLIS = -100000000 * 24 * 60 * 60 * 1000;
const validateEmail = (value) => {
    value = exports.trim(value);
    // ensure this is in proper format
    const pattern = /^[^@]+@[^@]+$/;
    return pattern.test(value);
};
exports.validateEmail = validateEmail;
const trim = (value) => {
    const pattern = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
    return value.replace(pattern, "");
};
exports.trim = trim;
const validatePattern = (pattern, value) => {
    if (typeof value !== "string") {
        return false;
    }
    value = exports.trim(value);
    if (value.match(pattern)) {
        return true;
    }
    else {
        return false;
    }
};
exports.validatePattern = validatePattern;
const validatePhoneNumber = (value) => {
    // ensure this is in proper format
    const pattern = /^[\\+]?[0-9]{10,}$/i;
    return exports.validatePattern(pattern, value);
};
exports.validatePhoneNumber = validatePhoneNumber;
const isGlobalPhoneNumber = (value) => {
    const pattern = /^[\\+]{1}[0-9]{2}/;
    return exports.validatePattern(pattern, value);
};
exports.isGlobalPhoneNumber = isGlobalPhoneNumber;
const validateLocalPhone = (value) => {
    value = exports.trim(value);
    const pattern = /^\d+$/;
    return exports.validatePattern(pattern, value);
};
exports.validateLocalPhone = validateLocalPhone;
const assertLocalPhoneIsValid = (value) => {
    return "not Implemented";
};
exports.assertLocalPhoneIsValid = assertLocalPhoneIsValid;
const validateCountryCode = (value) => {
    const pattern = /^[a-z]{2}$/i;
    return exports.validatePattern(pattern, value);
};
exports.validateCountryCode = validateCountryCode;
const assertCountryCodeIsValid = (value) => {
    return "not Implemented";
};
exports.assertCountryCodeIsValid = assertCountryCodeIsValid;
const validatePassword = (value) => {
    const pattern = /^[\x20-\x7E]{4,50}$/;
    return exports.validatePattern(pattern, value);
};
exports.validatePassword = validatePassword;
const assertPasswordIsValid = (value) => {
    return "Not implemented";
};
exports.assertPasswordIsValid = assertPasswordIsValid;
const validateUsername = (value) => {
    const pattern = /^[a-zA-Z0-9-_\\.]{3,64}$/i;
    return exports.validatePattern(pattern, value);
};
exports.validateUsername = validateUsername;
const validateGroupID = (value) => {
    const pattern = /^[a-z0-9-_.]{1,30}$/;
    return exports.validatePattern(pattern, value);
};
exports.validateGroupID = validateGroupID;
const validateDisplayName = (value) => {
    return typeof value === "string" && value.length >= 1 && value.length <= 50;
};
exports.validateDisplayName = validateDisplayName;
const safeAddTicks = (left, right) => {
    if (isNaN(left) || isNaN(right)) {
        throw new Error("Parameters should be a number");
    }
    if (Math.abs(left + right) > MAX_DATE_IN_MILLIS) {
        throw new exception_1.ArithmeticException("Addition of " + left + " and " + right + " result in long overflow", undefined);
    }
    return left + right;
};
exports.safeAddTicks = safeAddTicks;
const safeMultiplyTicks = (left, right) => {
    if (isNaN(left) || isNaN(right)) {
        throw new Error("Parameters should be a number");
    }
    if (Math.abs(left * right) > MAX_DATE_IN_MILLIS) {
        throw new exception_1.ArithmeticException("Multiplication of " +
            left +
            " and " +
            right +
            " result in long overflow", undefined);
    }
    return left * right;
};
exports.safeMultiplyTicks = safeMultiplyTicks;
const safeCalculateExpiresAtAsNumber = (expirationInSeconds, baseUnixTimeInMills) => {
    let expiresAt = 0;
    try {
        const expirationInMillis = exports.safeMultiplyTicks(expirationInSeconds, 1000);
        expiresAt = exports.safeAddTicks(baseUnixTimeInMills, expirationInMillis);
    }
    catch (e) {
        if (e instanceof exception_1.ArithmeticException) {
            expiresAt = MAX_DATE_IN_MILLIS;
        }
        else {
            throw e;
        }
    }
    return expiresAt;
};
exports.safeCalculateExpiresAtAsNumber = safeCalculateExpiresAtAsNumber;
const safeCalculateExpiresAtAsDate = (expirationInSeconds, baseUnixTimeInMills) => {
    let expiresAt = 0;
    try {
        const expirationInMillis = exports.safeMultiplyTicks(expirationInSeconds, 1000);
        expiresAt = exports.safeAddTicks(baseUnixTimeInMills, expirationInMillis);
    }
    catch (e) {
        if (e instanceof exception_1.ArithmeticException) {
            expiresAt = MAX_DATE_IN_MILLIS;
        }
        else {
            throw e;
        }
    }
    return new Date(expiresAt);
};
exports.safeCalculateExpiresAtAsDate = safeCalculateExpiresAtAsDate;
const isJSONType = (contentType) => {
    const pattern = /\+?json(;.*)?$/i;
    if (contentType.match(pattern)) {
        return true;
    }
    else {
        return false;
    }
};
exports.isJSONType = isJSONType;
const type = (obj) => {
    if (obj === undefined || obj === null) {
        return obj;
    }
    return typeof obj;
};
exports.type = type;
const disableCacheURL = (url) => {
    if (url.indexOf("?") !== -1) {
        url += "&disable_cache=";
    }
    else {
        url += "?disable_cache=";
    }
    url += new Date().getTime();
    return url;
};
exports.disableCacheURL = disableCacheURL;
const validateServerCodeEntryName = (value) => {
    const pattern = /^[a-zA-Z][_a-zA-Z0-9]*$/i;
    return exports.validatePattern(pattern, value);
};
exports.validateServerCodeEntryName = validateServerCodeEntryName;
const validateServerCodeEntryArgument = (value) => {
    // null argument is also valid; key in object should has at least 1
    return (value === null ||
        (typeof value === "object" && Object.keys(value).length > 0));
};
exports.validateServerCodeEntryArgument = validateServerCodeEntryArgument;
const validateServerCodeEntryVersion = (value) => {
    return typeof value === "string" && value !== "";
};
exports.validateServerCodeEntryVersion = validateServerCodeEntryVersion;
const isNonEmptyString = (s) => {
    if (typeof s !== "string")
        return false;
    return s.length > 0;
};
exports.isNonEmptyString = isNonEmptyString;
const error = (message, target) => {
    const e = Error(message);
    e.name = target;
    return e;
};
exports.error = error;
const clone = (obj) => {
    if (!obj || typeof obj !== "object") {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
        let flags = "";
        if (obj.global)
            flags += "g";
        if (obj.ignoreCase)
            flags += "i";
        if (obj.multiline)
            flags += "m";
        if (obj.sticky)
            flags += "y";
        return new RegExp(obj.source, flags);
    }
    return obj;
    // TO DO implement the next part from coffeescript
    // newInstance = new obj.constructor()
    // for key of obj
    //           newInstance[key] = KiiUtilities._clone obj[key]
    // return newInstance
};
exports.clone = clone;
function isCallback(arg) {
    if (arg === null || typeof arg !== "object") {
        return false;
    }
    const keys = Object.keys(arg);
    if (keys.length > 2) {
        return false;
    }
    if (keys.length === 2 &&
        keys.includes("success") &&
        keys.includes("failure")) {
        return true;
    }
    if (keys.length === 1 &&
        (keys.includes("success") || keys.includes("failure"))) {
        return true;
    }
    return false;
}
exports.isCallback = isCallback;
