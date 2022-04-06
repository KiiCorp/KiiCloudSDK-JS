var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KiiSDKClientInfo } from "./kii";
import { isSuccess } from "./httpResponse";
import { InvalidArgumentException, parseErrorResponse } from "./exception";
import { error } from "./utilities";
import { validateServerCodeEntryArgument } from "./utilities";
/**
 * @class Represents a server side code entry in KiiCloud.
 */
export class KiiServerCodeEntry {
    /** @hidden */
    constructor(entryName, version, environmentVersion, app) {
        this.entryName = entryName;
        this.version = version;
        this.environmentVersion = environmentVersion;
        this.app = app;
    }
    /**
     * Execute this server code entry.<br>
     * If argument is an empty object or not type of Object, callbacks.failure or reject callback of promise will be called.<br>
     * @param {Object} argument pass to the entry of script in the cloud.
     *    If null is specified, no argument pass to the script.
     * @return {Promise} return promise object.
     *  <ul>
     *    <li>fulfill callback function: function(params). params is Array instance.
     *      <ul>
     *        <li>params[0] is the KiiServerCodeEntry instance which this method was called on.</li>
     *        <li>params[1] is the passed argument object.</li>
     *        <li>params[2] is a KiiServerCodeExecResult instance.</li>
     *      </ul>
     *    </li>
     *    <li>reject callback function: function(error). error is an Error instance.
     *      <ul>
     *        <li>error.target is the KiiServerCodeEntry instance which this method was called on.</li>
     *        <li>error.message</li>
     *        <li>error.argument is passed argument object. </li>
     *      </ul>
     *    </li>
     *  </ul>
     * @example
     * ```
     * // Instantiate with the endpoint.
     * let entry = Kii.serverCodeEntry("main");
     *
     * // Set the custom parameters.
     * let arg = {"username":"name_of_my_friend", "password":"password_for_my_friend"};
     *
     * // Example of executing the Server Code
     * entry.execute(arg).then(params => {
     *   let entry = params[0];
     *   let argument = params[1];
     *   let execResult = params[2];
     *   // do something
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    execute(argument) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!validateServerCodeEntryArgument(argument)) {
                throw new InvalidArgumentException("arugment is invalid", this);
            }
            const requestData = argument || {};
            const versionName = this.version || "current";
            let url = `/apps/${this.app.getAppID()}/server-code/versions/${versionName}/${this.entryName}`;
            if (this.environmentVersion) {
                url += `?environment-version=${this.environmentVersion}`;
            }
            const request = this.app.newRequest("POST", url);
            if (!this.app.getCurrentUser()) {
                request.isSendAccessToken(false);
            }
            request.addHeader("x-kii-sdk", KiiSDKClientInfo.getSDKClientInfo());
            const response = yield request.send(JSON.stringify(requestData));
            if (isSuccess(response.status)) {
                const headers = response.headers;
                if (headers == null) {
                    throw error("Invalid response header", this);
                }
                const stepCount = Number((_a = headers.get("x-step-count")) !== null && _a !== void 0 ? _a : "0");
                const environmentVersion = (_b = headers.get("x-environment-version")) !== null && _b !== void 0 ? _b : "";
                return [
                    this,
                    argument,
                    new KiiServerCodeExecResult(response.body, stepCount, environmentVersion),
                ];
            }
            else {
                throw parseErrorResponse(request, response, this, {
                    argument: argument,
                });
            }
        });
    }
    /**
     * Get the entryName of this server code entry.
     * @returns entryName.
     */
    getEntryName() {
        return this.entryName;
    }
}
/**
 * @class Represents a server side code execution result in KiiCloud.
 */
export class KiiServerCodeExecResult {
    /** @hidden */
    constructor(returnObject, exeSteps, environmentVersion) {
        this.returnObject = returnObject;
        this.exeSteps = exeSteps;
        this.environmentVersion = environmentVersion;
    }
    /**
     * Get calculated number of executed steps.
     * @returns calculated number of executed steps
     */
    getExecutedSteps() {
        return this.exeSteps;
    }
    /**
     * Get the version of Node.js which the server code was executed.
     * @returns version of Node.js
     */
    getEnvironmentVersion() {
        return this.environmentVersion;
    }
    /**
     * Get Object returned by server code entry.
     * @returns returned by server code entry.
     */
    getReturnedValue() {
        return this.returnObject;
    }
}
