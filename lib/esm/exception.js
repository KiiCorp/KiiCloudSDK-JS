export class InvalidPasswordException extends Error {
    constructor(message, target) {
        super(message);
        this.target = target;
    }
}
export class InvalidUserIdentifierException extends Error {
    constructor(message, target) {
        super(message);
        this.target = target;
    }
}
export class InvalidUsernameException extends Error {
    constructor(message = "Unable to set username. Must be between 3 and 64 characters, which can include alphanumeric characters as well as underscores '_' and periods '.'", target) {
        super(message);
        this.target = target;
    }
}
export class InvalidDisplayNameException extends Error {
    constructor(message = "Unable to set displayName. Must be between 1-50 characters.", target) {
        super(message);
        this.target = target;
    }
}
export class InvalidPhoneNumberException extends Error {
    constructor(message, target) {
        super(message);
        this.target = target;
    }
}
export class InvalidEmailException extends Error {
    constructor(message, target) {
        super(message);
        this.target = target;
    }
}
export class ArithmeticException extends Error {
    constructor(message, target) {
        super(`ArithmeticException: ${message}`);
        this.target = target;
    }
}
export class InvalidArgumentException extends Error {
    constructor(msg, target) {
        super(`InvalidArgument: ${msg}`);
        this.msg = msg;
        this.target = target;
    }
}
export class IllegalStateException extends Error {
    constructor(msg, target) {
        super(`IllegalState: ${msg}`);
        this.msg = msg;
        this.target = target;
    }
}
export class InvalidURIException extends Error {
    constructor(message = "Unable to set URI. Must be of the form kiicloud://some/path/to/object/or/entity", target) {
        super(message);
        this.target = target;
    }
}
export class InvalidCountryException extends Error {
    constructor(message = "Unable to set country code. Must be 2 alphabetic characters. Ex: US, JP, CN", target) {
        super(message);
        this.target = target;
    }
}
// Those were in v2 but not very necessary since:
// 1. Used only one specific place, 2. only valid on JS, 3. it can be InvalidArgumentException
// export class InvalidLocalPhoneNumberException extends Error {}
// export class InvalidACLAction extends Error {}
// export class InvalidACLSubject extends Error {}
// export class InvalidACLGrant extends Error {}
// export class InvalidLimitException extends Error {}
export class UnsupportedOperationException extends Error {
    constructor(message = "Unable to set URI. Must be of the form kiicloud://some/path/to/object/or/entity", target) {
        super(`UnsupportedOperationException: ${message}`);
        this.target = target;
    }
}
export const parseErrorResponse = (request, response, target, extraFields) => {
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
const genRequestError = (status, code, message, target, extraFields) => {
    const e = new KiiRequestError(status, code, message, target);
    if (!extraFields) {
        return e;
    }
    Object.assign(e, extraFields);
    return e;
};
export class KiiRequestError extends Error {
    constructor(status, code, message, target) {
        super(message);
        this.status = status;
        this.code = code;
        this.target = target;
    }
}
