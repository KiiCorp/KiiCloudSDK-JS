"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KiiErrorParser = exports.REG_NETWORK_ERROR = exports.REG_SERVER_ERROR_KII_SERVER_CODE_VERSION_NOT_FOUND = exports.REG_SERVER_ERROR_KII_SERVER_CODE = exports.REG_SERVER_ERROR_KII_USER_OR_OBJECT = exports.REG_SERVER_ERROR_KII_XHR_WRAPPER = exports.REG_SERVER_ERROR_KII_REQUEST = exports.SERVER_ERROR_CODES = void 0;
exports.SERVER_ERROR_CODES = {
    APP_NOT_FOUND: 404,
    APP_DISABLED: 403,
    UNAUTHORIZED: 401,
    USER_NOT_FOUND: 404,
    THING_NOT_FOUND: 404,
    THING_DISABLED: 401,
    THING_ALREADY_EXISTS: 409,
    THING_TYPE_NOT_FOUND: 404,
    FIRMWARE_VERSION_NOT_FOUND: 404,
    WRONG_TOKEN: 403,
    WRONG_REFRESH_TOKEN: 403,
    INVALID_BUCKET: 400,
    OPERATION_NOT_ALLOWED: 409,
    OPERATION_NOT_SUPPORTED: 403,
    AUTHENTICATION_FAILED: 401,
    USER_DISABLED: 401,
    INVALID_DATA_TYPE: 400,
    INVALID_INPUT_DATA: 400,
    INVALID_JSON: 400,
    INVALID_JSON_SCHEMA: 400,
    MISSING_DATA: 400,
    RESOURCE_TEMPORARILY_UNAVAILABLE: 503,
    WRONG_PASSWORD: 401,
    OAUTH2_ERROR: 400,
    THING_END_NODE_DOES_NOT_BELONG_TO_GATEWAY: 404,
    THING_END_NODE_ALREADY_BELONGS_TO_GATEWAY: 409,
    UNDEFINED_ERROR: 500,
    OPERATION_NOT_IMPLEMENTED: 501,
    LOCK_FAILED: 503,
    QUERY_NOT_SUPPORTED: 400,
    QUERY_TIMEOUT: 503,
    TEMPORARY_UNAVAILABLE_ERROR: 503,
    APP_ALREADY_EXISTS: 409,
    BUCKET_ALREADY_EXISTS: 409,
    BUCKET_NOT_FOUND: 404,
    FILTER_NOT_FOUND: 404,
    INVALID_ACCOUNT_STATUS: 400,
    INVALID_OBJECT_ID: 400,
    INVALID_VERIFICATION_CODE: 403,
    OBJECT_NOT_FOUND: 404,
    OBJECT_VERSION_IS_STALE: 409,
    OBJECT_ALREADY_EXISTS: 409,
    OBJECT_CONFLICT: 409,
    PUBLICATION_NOT_FOUND: 404,
    PUBLICATION_EXPIRED: 410,
    USER_ALREADY_EXISTS: 409,
    USER_ADDRESS_NOT_FOUND: 404,
    VERIFICATION_CODE_NOT_FOUND: 404,
    ACCOUNT_TYPE_NOT_SUPPORTED: 400,
    OBJECT_BODY_NOT_FOUND: 404,
    OBJECT_BODY_RANGE_NOT_SATISFIABLE: 416,
    OBJECT_BODY_INTEGRITY_NOT_ASSURED: 412,
    OBJECT_BODY_UPLOAD_NOT_FOUND: 404,
    OBJECT_BODY_UPLOAD_ALREADY_EXISTS: 409,
    BUCKET_TYPE_NOT_SUPPORTED: 400,
    GROUP_NOT_FOUND: 404,
    GROUP_ALREADY_EXISTS: 409,
    INSTALLATION_NOT_FOUND: 404,
    INSTALLATION_ALREADY_EXISTS: 409,
    ACL_NOT_FOUND: 404,
    ACL_ALREADY_EXISTS: 409,
    VERSIONED_UPDATES_NOT_SUPPORTED: 400,
    NO_ACCOUNT_PROVIDED: 400,
    FACEBOOK_USER_ALREADY_LINKED: 409,
    QQ_USER_ALREADY_LINKED: 409,
    GOOGLE_USER_ALREADY_LINKED: 409,
    USER_ALREADY_LINKED: 409,
    USER_NOT_LINKED: 409,
    UNIQUE_CONSTRAINT_VIOLATED: 409,
    GCMKEY_ALREADY_EXISTS: 409,
    GCMKEY_NOT_FOUND: 404,
    APNSKEY_NOT_FOUND: 404,
    JSON_WEB_KEY_NOT_FOUND: 404,
    JPUSHKEY_NOT_FOUND: 404,
    PUSH_SUBSCRIPTION_ALREADY_EXISTS: 409,
    PUSH_SUBSCRIPTION_NOT_FOUND: 404,
    TOPIC_ALREADY_EXISTS: 409,
    TOPIC_NOT_FOUND: 404,
    USER_LOCALE_NOT_FOUND: 404,
    TEMPLATE_NOT_FOUND: 404,
    USER_COUNTRY_NOT_FOUND: 404,
    USER_DISPLAY_NAME_NOT_FOUND: 404,
    SERVER_CODE_VERSION_NOT_FOUND: 404,
    SERVER_CODE_HOOK_VERSION_NOT_FOUND: 404,
    SCHEDULE_EXECUTION_NOT_FOUND: 404,
    ENDPOINT_INVOCATION_ERROR: 400,
    SERVER_CODE_VERIFICATION_ERROR: 400,
    PAYLOAD_ID_NOT_FOUND: 404,
    REPLACEMENT_SQL_QUERY_NOT_FOUND: 404,
    APP_CONFIG_PARAMETER_NOT_FOUND: 404,
    TRANSACTION_ID_NOT_FOUND: 404,
    TRANSACTION_ID_ALREADY_EXISTS: 409,
    CLIENT_CREDENTIALS_NOT_FOUND: 404,
    ACCESS_CODE_NOT_FOUND: 404,
    THING_OWNERSHIP_NOT_FOUND: 404,
    THING_OWNERSHIP_ALREADY_EXISTS: 409,
    INVALID_THING_OWNERSHIP_CODE: 409,
    MQTT_ENDPOINT_NOT_FOUND: 404,
    TASK_NOT_FOUND: 404,
    TASK_NOT_RECURRENT: 400,
    INVALID_STATUS: 409,
    PHONE_NUMBER_VERIFICATION_CODE_EXPIRED: 410,
    PIN_CODE_EXPIRED: 410,
    ADDRESS_VERIFICATION_CODE_NOT_FOUND: 404,
    MQTT_ENDPOINT_NOT_READY: 503,
    INDEX_FAILED: 500,
};
exports.REG_SERVER_ERROR_KII_REQUEST = new RegExp("(^[A-Z_]+): (.*)");
exports.REG_SERVER_ERROR_KII_XHR_WRAPPER = new RegExp(" statusCode: (\\d{3}) error code: ([A-Z_]+) message: (.*)$");
exports.REG_SERVER_ERROR_KII_USER_OR_OBJECT = new RegExp(" statusCode: (\\d{3}) error code: ([A-Z_]+) error message: (.*)$");
exports.REG_SERVER_ERROR_KII_SERVER_CODE = new RegExp(" statusCode: (\\d{3}) executedSteps: \\d+ error code: ([A-Z_]+) message: (.*) detailMessage: (.*)$");
exports.REG_SERVER_ERROR_KII_SERVER_CODE_VERSION_NOT_FOUND = new RegExp(" statusCode: (\\d{3}) executedSteps: null error code: ([A-Z_]+) message: (.*)$");
exports.REG_NETWORK_ERROR = new RegExp("statusCode: (\\d{1,3})$");
/**
 * A Parser for error string or error object returned by SDK.
 */
class KiiErrorParser {
    /** @hidden */
    constructor(error) {
        this.error = error;
    }
}
exports.KiiErrorParser = KiiErrorParser;
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
KiiErrorParser.parse = (error) => {
    let errorString = '';
    if ((typeof error).toLowerCase() == "string") {
        errorString = error;
    }
    else {
        errorString = error.message;
    }
    if (errorString.indexOf('0 : http') == 0)
        // Network Error by KiiRequest
        return {
            status: 0,
            code: null,
            message: "Network Error"
        };
    else if (errorString.indexOf('429 : http') == 0)
        // Limitation Error by KiiRequest
        return {
            status: 429,
            code: "TOO_MANY_REQUESTS",
            message: "Number of requests exceeds the limit."
        };
    else if (errorString.indexOf("fail to execute server code. statusCode: 0") == 0)
        // Network Error by ServerCodeEntry
        return {
            status: 0,
            code: null,
            message: "Network Error"
        };
    else if (errorString.indexOf("invalid_grant: ") == 0) {
        // authentication error
        const arr = errorString.split(':', 2);
        return {
            status: 400,
            code: "invalid_grant",
            message: arr[1].substr(1)
        };
    }
    // fix "invalid_grant" only case.
    else if (errorString.indexOf("invalid_grant") == 0) {
        // authentication error
        return {
            status: 400,
            code: "invalid_grant",
            message: errorString
        };
    }
    else {
        // Check the network error
        let arr = exports.REG_NETWORK_ERROR.exec(errorString);
        if (arr) {
            const status = Number(arr[1]);
            if (status === 429)
                // Limitation Error by KiiXHRWrapper, KiiUser, KiiObject or ServerCodeEntry
                return {
                    status: 429,
                    code: "TOO_MANY_REQUESTS",
                    message: "Number of requests exceeds the limit."
                };
            else
                // Network Error by KiiXHRWrapper, KiiUser, KiiObject or ServerCodeEntry
                return {
                    status: 0,
                    code: null,
                    message: "Network Error"
                };
        }
        arr = exports.REG_SERVER_ERROR_KII_REQUEST.exec(errorString);
        if (arr) {
            const code = arr[1];
            const message = arr[2];
            let status = exports.SERVER_ERROR_CODES[code];
            if (!status) {
                //Unknown error code is detected!
                status = -2;
            }
            // Server Error by KiiRequest
            return {
                status: status,
                code: code,
                message: message
            };
        }
        for (let pattern in [exports.REG_SERVER_ERROR_KII_XHR_WRAPPER, exports.REG_SERVER_ERROR_KII_USER_OR_OBJECT, exports.REG_SERVER_ERROR_KII_SERVER_CODE, exports.REG_SERVER_ERROR_KII_SERVER_CODE_VERSION_NOT_FOUND]) {
            const regex = new RegExp(pattern);
            const arr = regex.exec(errorString);
            if (arr) {
                const status = Number(arr[1]);
                const code = arr[2];
                const message = arr[3];
                // Server Error by KiiXHRWrapper
                return {
                    status: status,
                    code: code,
                    message: message
                };
            }
        }
        // failed to parse an error string
        return {
            status: -1,
            code: null,
            message: errorString
        };
    }
};
