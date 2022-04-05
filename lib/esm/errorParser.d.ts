export declare const SERVER_ERROR_CODES: any;
export declare const REG_SERVER_ERROR_KII_REQUEST: RegExp;
export declare const REG_SERVER_ERROR_KII_XHR_WRAPPER: RegExp;
export declare const REG_SERVER_ERROR_KII_USER_OR_OBJECT: RegExp;
export declare const REG_SERVER_ERROR_KII_SERVER_CODE: RegExp;
export declare const REG_SERVER_ERROR_KII_SERVER_CODE_VERSION_NOT_FOUND: RegExp;
export declare const REG_NETWORK_ERROR: RegExp;
/**
 * A Parser for error string or error object returned by SDK.
 */
export declare class KiiErrorParser {
    private error;
    /** @hidden */
    constructor(error: any);
    /**
     * Parse an error string or error object returned by SDK.
     * @param {any} error An error string or error object
     * @return {any} return parsed error object.
     * @example
     * ```typescript
     * let err = KiiErrorParser.parse(errorString);
     * let httpStatus = err.status;
     * if (httpStatus == 0) {
     *   // NetworkError
     * } else if (httpStatus == -1) {
     *   // Error is not related the http error. eg. argument error, illegal state error, etc.
     * } else if (httpStatus == -2) {
     *   // Unknown error is detected.
     *   // Please confirm that you are using the latest version of SDK.
     * } else if (httpStatus >= 400 && httpStatus < 600) {
     *   // Http error
     * }
     * let errorCode = err.code;
     * let errorMessage = err.message;
     * ```
     */
    static parse: (error: any) => any;
}
