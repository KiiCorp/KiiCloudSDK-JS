import { KiiHttpRequest, KiiHttpResponse } from "./httpRequest";
export declare class InvalidPasswordException extends Error {
    constructor(message: string, target: any);
}
export declare class InvalidUserIdentifierException extends Error {
    constructor(message: string, target: any);
}
export declare class InvalidUsernameException extends Error {
    constructor(message: string | undefined, target: any);
}
export declare class InvalidDisplaynameException extends Error {
    constructor(message: string | undefined, target: any);
}
export declare class InvalidPhoneNumberException extends Error {
    constructor(message: string, target: any);
}
export declare class InvalidEmailException extends Error {
    constructor(message: string, target: any);
}
export declare class ArithmeticException extends Error {
    constructor(message: string, target: any);
}
export declare class InvalidArgumentException extends Error {
    private msg;
    constructor(msg: string, target: any);
}
export declare class IllegalStateException extends Error {
    private msg;
    constructor(msg: string, target: any);
}
export declare class InvalidURIException extends Error {
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
