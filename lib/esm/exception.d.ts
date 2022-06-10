import { KiiHttpRequest, KiiHttpResponse } from "./httpRequest";
export declare class InvalidPasswordException extends Error {
    target: any;
    constructor(message: string, target: any);
}
export declare class InvalidUserIdentifierException extends Error {
    target: any;
    constructor(message: string, target: any);
}
export declare class InvalidUsernameException extends Error {
    target: any;
    constructor(message: string | undefined, target: any);
}
export declare class InvalidDisplayNameException extends Error {
    target: any;
    constructor(message: string | undefined, target: any);
}
export declare class InvalidPhoneNumberException extends Error {
    target: any;
    constructor(message: string, target: any);
}
export declare class InvalidEmailException extends Error {
    target: any;
    constructor(message: string, target: any);
}
export declare class ArithmeticException extends Error {
    target: any;
    constructor(message: string, target: any);
}
export declare class InvalidArgumentException extends Error {
    private msg;
    target: any;
    constructor(msg: string, target: any);
}
export declare class IllegalStateException extends Error {
    private msg;
    target: any;
    constructor(msg: string, target: any);
}
export declare class InvalidURIException extends Error {
    target: any;
    constructor(message: string | undefined, target: any);
}
export declare class InvalidCountryException extends Error {
    target: any;
    constructor(message: string | undefined, target: any);
}
export declare class UnsupportedOperationException extends Error {
    target: any;
    constructor(message: string | undefined, target: any);
}
export declare const parseErrorResponse: (request: KiiHttpRequest, response: KiiHttpResponse, target: any, extraFields: {
    [key: string]: any;
} | null) => KiiRequestError;
export declare class KiiRequestError extends Error {
    readonly status: number;
    readonly code: string;
    target?: any;
    constructor(status: number, code: string, message: string, target?: any);
}
