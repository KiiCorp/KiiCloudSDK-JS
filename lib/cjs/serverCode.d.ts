import { KiiApplication } from "./app";
/**
 * @class Represents a server side code entry in KiiCloud.
 */
export declare class KiiServerCodeEntry {
    private entryName;
    private version;
    private environmentVersion;
    private app;
    /** @hidden */
    constructor(entryName: string, version: string, environmentVersion: string, app: KiiApplication);
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
    execute(argument: any): Promise<[KiiServerCodeEntry, any, KiiServerCodeExecResult]>;
    /**
     * Get the entryName of this server code entry.
     * @returns entryName.
     */
    getEntryName(): string;
}
/**
 * @class Represents a server side code execution result in KiiCloud.
 */
export declare class KiiServerCodeExecResult {
    private returnObject;
    private exeSteps;
    private environmentVersion;
    /** @hidden */
    constructor(returnObject: any, exeSteps: number, environmentVersion: string);
    /**
     * Get calculated number of executed steps.
     * @returns calculated number of executed steps
     */
    getExecutedSteps(): number;
    /**
     * Get the version of Node.js which the server code was executed.
     * @returns version of Node.js
     */
    getEnvironmentVersion(): string;
    /**
     * Get Object returned by server code entry.
     * @returns returned by server code entry.
     */
    getReturnedValue(): any;
}
