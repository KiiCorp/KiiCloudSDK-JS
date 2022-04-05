import { KiiUser } from ".";
import { KiiApplication } from "./app";
import { KiiBucket, KiiEncryptedBucket } from "./bucket";
import { KiiGroup } from "./group";
import { KiiTopic } from "./topic";
import { KiiAppAdminContext } from "./appAdminContext";
import { KiiThingContext } from "./thingContext";
export declare const KiiSite: {
    readonly US: "https://api.kii.com/api";
    readonly JP: "https://api-jp.kii.com/api";
    readonly SG: "https://api-sg.kii.com/api";
    readonly EU: "https://api-eu.kii.com/api";
};
/**
 * The main SDK class
 *
 * This class must be initialized before any Kii SDK functions are performed. This class also allows the application to make some high-level user calls and access some application-wide data at any time using static methods.
 */
export declare class Kii {
    private static _instance;
    private static additionalHeaders;
    private logging;
    private constructor();
    /**
     * Kii SDK Build Number
     * @returns current build number of the SDK
     */
    static getBuildNumber(): string;
    /**
     * Kii SDK Version Number
     * @returns current version number of the SDK
     */
    static getSDKVersion(): string;
    /**
     * @hidden internal only, called when a user is authenticated
     */
    static getBaseURL(): string;
    /**
     * Retrieve the current app ID
     * @returns The current app ID
     */
    static getAppID(): string;
    /** @hidden */
    static getAdditionalHeaders(): any;
    /** @hidden */
    static setAdditionalHeaders(additionalHeaders: any): void;
    /**
     * Retrieve the current app key
     * @returns The current app key
     */
    static getAppKey(): string;
    /** @hidden */
    static isLogging(): boolean;
    /** @hidden */
    static setLogging(logging: boolean): void;
    /**
     *
     * the access token lifetime in seconds.
     * If you don't call this method or call it with 0, token won't be expired.
     * Call this method if you like the access token to be expired
     * after a certain period. Once called, token retrieved
     * by each future authentication will have the specified lifetime.
     * Note that, it will not update the lifetime of token received prior
     * calling this method. Once expired, you have to login again to renew the token.
     * @param expiresIn The life time of access token in seconds.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @example
     * ```typescript
     * Kii.setAccessTokenExpiration(3600);
     * ```
     */
    static setAccessTokenExpiration(expiresIn: number, app?: KiiApplication): void;
    /**
     * Returns access token lifetime in seconds.
     *
     * If access token lifetime has not set explicitly by {@link Kii.setAccessTokenExpiration}, returns 0.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns access token lifetime in seconds.
     */
    static getAccessTokenExpiration(app?: KiiApplication): number;
    /**
     * Initialize the Kii SDK
     *
     * Should be the first Kii SDK action your application makes.
     * @param appID The application ID found in your Kii developer console
     * @param appKey The application key found in your Kii developer console
     * @returns KiiApplication instance
     * @example
     * ```typescript
     * Kii.initialize("my-app-id", "my-app-key");
     * ```
     */
    static initialize(appID: string, appKey: string): KiiApplication;
    /**
     * Initialize the Kii SDK with a specific URL
     *
     * Should be the first Kii SDK action your application makes.
     * @param appID The application ID found in your Kii developer console
     * @param appKey The application key found in your Kii developer console
     * @param site site Can be one of the constants KiiSite.US, KiiSite.JP, KiiSite.SG depending on your location.
     * @returns KiiApplication instance
     * @example
     * ```typescript
     * Kii.initializeWithSite("my-app-id", "my-app-key", KiiSite.JP);
     * ```
     */
    static initializeWithSite(appID: string, appKey: string, site: string): KiiApplication;
    /** @hidden */
    static logger(message: string): void;
    /**
     * Creates a reference to a bucket for this app
     *
     * The bucket will be created/accessed within this app's scope
     * @param bucketName The name of the bucket the app should create/access
     * @returns A working KiiBucket object
     * @example
     * ```typescript
     * const bucket = Kii.bucketWithName("myBucket");
     * ```
     */
    static bucketWithName(bucketName: string): KiiBucket;
    /**
     * Creates a reference to a　encrypted bucket for this app
     *
     * The bucket will be created/accessed within this app's scope
     * @param bucketName The name of the bucket the app should create/access
     * @returns A working KiiEncryptedBucket object
     * @example
     * ```typescript
     * const bucket = Kii.encryptedBucketWithName("myBucket");
     * ```
     */
    static encryptedBucketWithName(bucketName: string): KiiEncryptedBucket;
    /**
     * Creates a reference to a group with the given name
     * @param groupName groupName An application-specific group name
     * @returns A new KiiGroup reference
     * @example
     * ```typescript
     * const group = Kii.groupWithName("myGroup");
     * ```
     */
    static groupWithName(groupName: string): KiiGroup;
    /**
     * Creates a reference to a group with the given name and a list of default members
     * @param groupName An application-specific group name
     * @param members An array of KiiUser objects to add to the group
     * @returns A new KiiGroup reference
     * @example
     * ```typescript
     * const group = KiiGroup.groupWithName("myGroup", members);
     * ```
     */
    static groupWithNameAndMembers(groupName: string, members: any[]): any;
    /** @hidden */
    static logOut(): void;
    /** @hidden */
    static loggedIn(): boolean;
    /** @hidden */
    static getCurrentUser(): any;
    /** @hidden */
    static setCurrentUser(user: KiiUser): void;
    /**
     * Authenticate as app admin.
     *
     * This api call must not placed on code which can be accessed by browser.
     * This api is intended to be used by server side code like Node.js.
     * If you use this api in code accessible by browser, your application id and application secret could be stolen.
     * Attacker will be act as appadmin and all the data in your application will be suffered.
     * @param clientId assigned to your application.
     * @param clientSecret assigned to your application.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {Promise} return promise object.
     *     <ul>
     *       <li>fulfill callback function: function(adminContext). adminContext is a KiiAppAdminContext instance.</li>
     *       <li>reject callback function: function(error). error is an Error instance.
     *         <ul>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("your client id", "your client secret").then(adminContext => {　// fulfill callback function
     *   // adminContext : KiiAppAdminContext instance
     *   // Operate entities with adminContext.
     * }).catch(error => { // reject callback function
     *   // Authentication failed.
     *   let errorString = error.message;
     * });
     * ```
     */
    static authenticateAsAppAdmin(clientId: string, clientSecret: string, app?: KiiApplication): Promise<KiiAppAdminContext>;
    /**
     * Instantiate KiiServerCodeEntry.
     * @param entryName Name of the entry.
     * @param version Version of the entry.
     * @param environmentVersion Version of the Node.js. Currently, supported versions are 0 and 6.
     * @returns KiiServerCodeEntry instance.
     * @throws {InvalidArgumentException} Thrown in the following cases:
     * <ul>
     *   <li>entryName or version is not type of string </li>
     *   <li>entryName or version is empty string </li>
     *   <li>entryName is invalid string. Valid entryName pattern is "[a-zA-Z][_a-zA-Z0-9]*$".</li>
     * </ul>
     *
     * @example
     * ```typescript
     * let entry = Kii.serverCodeEntryWithVersion("main", "gulsdf6ful8jvf8uq6fe7vjy6", KiiServerCodeEnvironmentVersion.V0);
     * ```
     */
    static serverCodeEntry(entryName: string, version: string, environmentVersion: string): any;
    /**
     * Instantiate topic belongs to application.
     * @param topicName name of the topic. Must be a not empty string.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns topic instance.
     */
    static topicWithName(topicName: string, app?: KiiApplication): KiiTopic;
    /**
     * Gets a list of topics in app scope
     * @param paginationKey You can specify the pagination key with the nextPaginationKey passed by callbacks.success or fullfill callback of promise. If empty string or no string object is provided, this API regards no paginationKey specified.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *     <ul>
     *       <li>fulfill callback function: function(params).
     *         <ul>
     *           <li>params[0] is array of KiiTopic instances.</li>
     *           <li>params[1] is string of nextPaginationKey.</li>
     *         </ul>
     *       </li>
     *       <li>reject callback function: function(error). error is an Error instance.
     *         <ul>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```typescript
     * Kii.listTopics().then(params => {
     *   let topicList = params[0];
     *   let nextPaginationKey = params[1];
     *   // do something with the result
     *   for (let i = 0; i < topicList.length; i++) {
     *     let topic = topicList[i];
     *   }
     *   if (nextPaginationKey != null) {
     *     Kii.listTopics(nextPaginationKey)
     *     .then(result => {...})
     *     .catch(error => {...});
     *   }
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    static listTopics(paginationKey?: string, app?: KiiApplication): Promise<[KiiTopic[], string | null]>;
    /**
     * Authenticate as Thing.
     *
     * This api is intended to be used in a Thing device, where the user
     * credentials or app admin context is not configured. This Thing must be
     * already registered in Kii Cloud.
     * @param vendorThingID vendorThingID of a registered Thing.
     * @param password password for the registered Thing.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *     <ul>
     *       <li>fulfill callback function: function(thingContext). thingContext is a KiiThingContext instance.</li>
     *       <li>reject callback function: function(error). error is an Error instance.
     *         <ul>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```typescript
     * Kii.authenticateAsThing("vendor thing id", "password of this thing").then(thingContext => {　// fulfill callback function
     *   // thingContext : KiiThingContext instance
     *   // Operate entities with thingContext.
     * }).catch(error => { // reject callback function
     *   // Authentication failed.
     *   let errorString = error.message;
     * });
     * ```
     */
    static authenticateAsThing(vendorThingID: string, password: string, app?: KiiApplication): Promise<KiiThingContext>;
    /**
     * Create a KiiThingContext reference
     *
     * This api is intended to be used in a Thing device, where the user
     * credentials or app admin context is not configured. This Thing must be
     * already registered in Kii Cloud.
     * @param thingID thingID of a registered Thing.
     * @param token token for the registered Thing.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *     <ul>
     *       <li>fulfill callback function: function(thingContext). thingContext is a KiiThingContext instance.</li>
     *       <li>reject callback function: function(error). error is an Error instance.
     *         <ul>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```typescript
     * Kii.authenticateAsThingWithToken("thing_id", "thing_token").then(thingContext => {　// fulfill callback function
     *   // thingContext : KiiThingContext instance
     *   // Operate entities with thingContext.
     * }).catch(error => { // reject callback function
     *   // Creation failed.
     *   let errorString = error.message;
     * });
     * ```
     */
    static authenticateAsThingWithToken(thingID: string, token: string, app?: KiiApplication): Promise<KiiThingContext>;
}
export declare class KiiSDKClientInfo {
    private static clientInfo;
    static getSDKClientInfo(): string;
}
