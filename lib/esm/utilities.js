import { ArithmeticException } from "./exception";
const MAX_DATE_IN_MILLIS = 100000000 * 24 * 60 * 60 * 1000;
const MIN_DATE_IN_MILLIS = -100000000 * 24 * 60 * 60 * 1000;
export const validateEmail = (value) => {
    value = trim(value);
    // ensure this is in proper format
    const pattern = /^[^@]+@[^@]+$/;
    return pattern.test(value);
};
export const trim = (value) => {
    const pattern = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
    return value.replace(pattern, "");
};
export const validatePattern = (pattern, value) => {
    if (typeof value !== "string") {
        return false;
    }
    value = trim(value);
    if (value.match(pattern)) {
        return true;
    }
    else {
        return false;
    }
};
export const validatePhoneNumber = (value) => {
    // ensure this is in proper format
    const pattern = /^[\\+]?[0-9]{10,}$/i;
    return validatePattern(pattern, value);
};
export const isGlobalPhoneNumber = (value) => {
    const pattern = /^[\\+]{1}[0-9]{2}/;
    return validatePattern(pattern, value);
};
export const validateLocalPhone = (value) => {
    value = trim(value);
    const pattern = /^\d+$/;
    return validatePattern(pattern, value);
};
export const assertLocalPhoneIsValid = (value) => {
    return "not Implemented";
};
export const validateCountryCode = (value) => {
    const pattern = /^[a-z]{2}$/i;
    return validatePattern(pattern, value);
};
export const assertCountryCodeIsValid = (value) => {
    return "not Implemented";
};
export const validatePassword = (value) => {
    const pattern = /^[\x20-\x7E]{4,50}$/;
    return validatePattern(pattern, value);
};
export const assertPasswordIsValid = (value) => {
    return "Not implemented";
};
export const validateUsername = (value) => {
    const pattern = /^[a-zA-Z0-9-_\\.]{3,64}$/i;
    return validatePattern(pattern, value);
};
export const validateGroupID = (value) => {
    const pattern = /^[a-z0-9-_.]{1,30}$/;
    return validatePattern(pattern, value);
};
export const validateDisplayName = (value) => {
    return typeof value === "string" && value.length >= 1 && value.length <= 50;
};
export const safeAddTicks = (left, right) => {
    if (isNaN(left) || isNaN(right)) {
        throw new Error("Parameters should be a number");
    }
    if (Math.abs(left + right) > MAX_DATE_IN_MILLIS) {
        throw new ArithmeticException("Addition of " + left + " and " + right + " result in long overflow", undefined);
    }
    return left + right;
};
export const safeMultiplyTicks = (left, right) => {
    if (isNaN(left) || isNaN(right)) {
        throw new Error("Parameters should be a number");
    }
    if (Math.abs(left * right) > MAX_DATE_IN_MILLIS) {
        throw new ArithmeticException("Multiplication of " +
            left +
            " and " +
            right +
            " result in long overflow", undefined);
    }
    return left * right;
};
export const safeCalculateExpiresAtAsNumber = (expirationInSeconds, baseUnixTimeInMills) => {
    let expiresAt = 0;
    try {
        const expirationInMillis = safeMultiplyTicks(expirationInSeconds, 1000);
        expiresAt = safeAddTicks(baseUnixTimeInMills, expirationInMillis);
    }
    catch (e) {
        if (e instanceof ArithmeticException) {
            expiresAt = MAX_DATE_IN_MILLIS;
        }
        else {
            throw e;
        }
    }
    return expiresAt;
};
export const safeCalculateExpiresAtAsDate = (expirationInSeconds, baseUnixTimeInMills) => {
    let expiresAt = 0;
    try {
        const expirationInMillis = safeMultiplyTicks(expirationInSeconds, 1000);
        expiresAt = safeAddTicks(baseUnixTimeInMills, expirationInMillis);
    }
    catch (e) {
        if (e instanceof ArithmeticException) {
            expiresAt = MAX_DATE_IN_MILLIS;
        }
        else {
            throw e;
        }
    }
    return new Date(expiresAt);
};
export const isJSONType = (contentType) => {
    const pattern = /\+?json(;.*)?$/i;
    if (contentType.match(pattern)) {
        return true;
    }
    else {
        return false;
    }
};
export const type = (obj) => {
    if (obj === undefined || obj === null) {
        return obj;
    }
    return typeof obj;
};
export const disableCacheURL = (url) => {
    if (url.indexOf("?") !== -1) {
        url += "&disable_cache=";
    }
    else {
        url += "?disable_cache=";
    }
    url += new Date().getTime();
    return url;
};
export const validateServerCodeEntryName = (value) => {
    const pattern = /^[a-zA-Z][_a-zA-Z0-9]*$/i;
    return validatePattern(pattern, value);
};
export const validateServerCodeEntryArgument = (value) => {
    // null argument is also valid; key in object should has at least 1
    return (value === null ||
        (typeof value === "object" && Object.keys(value).length > 0));
};
export const validateServerCodeEntryVersion = (value) => {
    return typeof value === "string" && value !== "";
};
export const isNonEmptyString = (s) => {
    if (typeof s !== "string")
        return false;
    return s.length > 0;
};
export const error = (message, target) => {
    const e = Error(message);
    e.name = target;
    return e;
};
export const clone = (obj) => {
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
export function isCallback(arg) {
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
