"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KiiRequestError = exports.parseErrorResponse = exports.UnsupportedOperationException = exports.InvalidCountryException = exports.InvalidURIException = exports.IllegalStateException = exports.InvalidArgumentException = exports.ArithmeticException = exports.InvalidEmailException = exports.InvalidPhoneNumberException = exports.InvalidDisplayNameException = exports.InvalidUsernameException = exports.InvalidUserIdentifierException = exports.InvalidPasswordException = void 0;
class InvalidPasswordException extends Error {
    constructor(message, target) {
        super(message);
        this.target = target;
    }
}
exports.InvalidPasswordException = InvalidPasswordException;
class InvalidUserIdentifierException extends Error {
    constructor(message, target) {
        super(message);
        this.target = target;
    }
}
exports.InvalidUserIdentifierException = InvalidUserIdentifierException;
class InvalidUsernameException extends Error {
    constructor(message = "Unable to set username. Must be between 3 and 64 characters, which can include alphanumeric characters as well as underscores '_' and periods '.'", target) {
        super(message);
        this.target = target;
    }
}
exports.InvalidUsernameException = InvalidUsernameException;
class InvalidDisplayNameException extends Error {
    constructor(message = "Unable to set displayName. Must be between 1-50 characters.", target) {
        super(message);
        this.target = target;
    }
}
exports.InvalidDisplayNameException = InvalidDisplayNameException;
class InvalidPhoneNumberException extends Error {
    constructor(message, target) {
        super(message);
        this.target = target;
    }
}
exports.InvalidPhoneNumberException = InvalidPhoneNumberException;
class InvalidEmailException extends Error {
    constructor(message, target) {
        super(message);
        this.target = target;
    }
}
exports.InvalidEmailException = InvalidEmailException;
class ArithmeticException extends Error {
    constructor(message, target) {
        super(`ArithmeticException: ${message}`);
        this.target = target;
    }
}
exports.ArithmeticException = ArithmeticException;
class InvalidArgumentException extends Error {
    constructor(msg, target) {
        super(`InvalidArgument: ${msg}`);
        this.msg = msg;
        this.target = target;
    }
}
exports.InvalidArgumentException = InvalidArgumentException;
class IllegalStateException extends Error {
    constructor(msg, target) {
        super(`IllegalState: ${msg}`);
        this.msg = msg;
        this.target = target;
    }
}
exports.IllegalStateException = IllegalStateException;
class InvalidURIException extends Error {
    constructor(message = "Unable to set URI. Must be of the form kiicloud://some/path/to/object/or/entity", target) {
        super(message);
        this.target = target;
    }
}
exports.InvalidURIException = InvalidURIException;
class InvalidCountryException extends Error {
    constructor(message = "Unable to set country code. Must be 2 alphabetic characters. Ex: US, JP, CN", target) {
        super(message);
        this.target = target;
    }
}
exports.InvalidCountryException = InvalidCountryException;
// Those were in v2 but not very necessary since:
// 1. Used only one specific place, 2. only valid on JS, 3. it can be InvalidArgumentException
// export class InvalidLocalPhoneNumberException extends Error {}
// export class InvalidACLAction extends Error {}
// export class InvalidACLSubject extends Error {}
// export class InvalidACLGrant extends Error {}
// export class InvalidLimitException extends Error {}
class UnsupportedOperationException extends Error {
    constructor(message = "Unable to set URI. Must be of the form kiicloud://some/path/to/object/or/entity", target) {
        super(`UnsupportedOperationException: ${message}`);
        this.target = target;
    }
}
exports.UnsupportedOperationException = UnsupportedOperationException;
const parseErrorResponse = (request, response, target, extraFields) => {
    let errString = "";
    if (typeof response.body === "string") {
        if (response.body) {
            errString += `: ${response.body}`;
            return genRequestError(response.status, "", errString, target, extraFields);
        }
        else {
            return genRequestError(response.status, "", errString, target, extraFields);
        }
    }
    if (typeof response.body === "object") {
        const errorCode = response.body["errorCode"];
        if (errorCode != null) {
            errString += `${errorCode}`;
        }
        const message = response.body["message"];
        if (message != null) {
            errString += `: ${message}`;
        }
        return genRequestError(response.status, errorCode !== null && errorCode !== void 0 ? errorCode : "", errString, target, extraFields);
    }
    return genRequestError(response.status, "", errString, target, extraFields);
};
exports.parseErrorResponse = parseErrorResponse;
const genRequestError = (status, code, message, target, extraFields) => {
    const e = new KiiRequestError(status, code, message, target);
    if (!extraFields) {
        return e;
    }
    Object.assign(e, extraFields);
    return e;
};
class KiiRequestError extends Error {
    constructor(status, code, message, target) {
        super(message);
        this.status = status;
        this.code = code;
        this.target = target;
    }
}
exports.KiiRequestError = KiiRequestError;
