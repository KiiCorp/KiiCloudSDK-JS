var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KiiApplication } from "./app";
import { isSuccess } from "./httpResponse";
import { KiiServerCodeEntry } from "./serverCode";
import { parseErrorResponse, InvalidArgumentException } from "./exception";
import { KiiTopic } from "./topic";
import { safeCalculateExpiresAtAsNumber, validateServerCodeEntryName, validateServerCodeEntryVersion, isCallback, } from "./utilities";
import { KiiAppAdminContext } from "./appAdminContext";
import { KiiThingContext } from "./thingContext";
import { error } from "./utilities";
export const KiiSite = {
    US: "https://api.kii.com/api",
    JP: "https://api-jp.kii.com/api",
    SG: "https://api-sg.kii.com/api",
    EU: "https://api-eu.kii.com/api",
};
/**
 * The main SDK class
 *
 * This class must be initialized before any Kii SDK functions are performed. This class also allows the application to make some high-level user calls and access some application-wide data at any time using static methods.
 */
export class Kii {
    constructor(appID, appKey, baseURL) {
        this.logging = true;
    }
    /**
     * Kii SDK Build Number
     * @returns current build number of the SDK
     */
    static getBuildNumber() {
        return "1";
    }
    /**
     * Kii SDK Version Number
     * @returns current version number of the SDK
     */
    static getSDKVersion() {
        return "3.0.0";
    }
    /**
     * @hidden internal only, called when a user is authenticated
     */
    static getBaseURL() {
        return KiiApplication.globalApp.getBaseURL();
    }
    /**
     * Retrieve the current app ID
     * @returns The current app ID
     */
    static getAppID() {
        return KiiApplication.globalApp.getAppID();
    }
    /** @hidden */
    static getAdditionalHeaders() {
        return this.additionalHeaders;
    }
    /** @hidden */
    static setAdditionalHeaders(additionalHeaders) {
        this.additionalHeaders = additionalHeaders;
    }
    /**
     * Retrieve the current app key
     * @returns The current app key
     */
    static getAppKey() {
        return KiiApplication.globalApp.getAppKey();
    }
    /** @hidden */
    static isLogging() {
        return this._instance.logging;
    }
    /** @hidden */
    static setLogging(logging) {
        this._instance.logging = logging;
    }
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
    static setAccessTokenExpiration(expiresIn, app = KiiApplication.globalApp) {
        if (this._instance == null && !app) {
            throw error("Kii is not initialized", undefined);
        }
        if (expiresIn < 0) {
            throw error("expiresIn should not negative number", undefined);
        }
        app.setAccessTokenExpiration(expiresIn);
    }
    /**
     * Returns access token lifetime in seconds.
     *
     * If access token lifetime has not set explicitly by {@link Kii.setAccessTokenExpiration}, returns 0.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns access token lifetime in seconds.
     */
    static getAccessTokenExpiration(app = KiiApplication.globalApp) {
        if (this._instance == null && !app) {
            throw error("Kii is not initialized", undefined);
        }
        return app.getAccessTokenExpiration();
    }
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
    static initialize(appID, appKey) {
        return this.initializeWithSite(appID, appKey, KiiSite.US);
    }
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
    static initializeWithSite(appID, appKey, site) {
        this._instance = new Kii(appID, appKey, site);
        const app = new KiiApplication(appID, appKey, site);
        KiiApplication.globalApp = app;
        return app;
    }
    /** @hidden */
    static logger(message) {
        if (this._instance.logging) {
            console.log(message);
        }
    }
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
    static bucketWithName(bucketName) {
        return KiiApplication.globalApp.bucketWithName(bucketName);
    }
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
    static encryptedBucketWithName(bucketName) {
        return KiiApplication.globalApp.encryptedBucketWithName(bucketName);
    }
    /**
     * Creates a reference to a group with the given name
     * @param groupName groupName An application-specific group name
     * @returns A new KiiGroup reference
     * @example
     * ```typescript
     * const group = Kii.groupWithName("myGroup");
     * ```
     */
    static groupWithName(groupName) {
        return KiiApplication.globalApp.groupWithName(groupName);
    }
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
    static groupWithNameAndMembers(groupName, members) {
        return null;
    }
    /** @hidden */
    static logOut() { }
    /** @hidden */
    static loggedIn() {
        return false;
    }
    /** @hidden */
    static getCurrentUser() {
        return KiiApplication.globalApp.getCurrentUser();
    }
    /** @hidden */
    static setCurrentUser(user) {
        KiiApplication.globalApp.setCurrentUser(user, user.getAccessToken() || "");
    }
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
    static authenticateAsAppAdmin(clientId, clientSecret, app = KiiApplication.globalApp) {
        return __awaiter(this, arguments, void 0, function* () {
            // sustain the compatibility with v2
            if (isCallback(arguments[0])) {
                clientId = arguments[1];
                clientSecret = arguments[2];
                app = arguments[3] || KiiApplication.globalApp;
            }
            const url = `/apps/${app.getAppID()}/oauth2/token`;
            const body = {
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret,
            };
            const tokenExpiration = app.getAccessTokenExpiration();
            if (tokenExpiration > 0) {
                const now = new Date();
                const currentTime = now.getTime();
                body["expiresAt"] = safeCalculateExpiresAtAsNumber(app.getAccessTokenExpiration(), currentTime);
            }
            const request = app.newRequest("POST", url);
            request.isSendAccessToken(false);
            const response = yield request.send(JSON.stringify(body));
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, undefined, null);
            }
            const userId = response.body["id"];
            const accessToken = response.body["access_token"];
            const adminApp = new KiiApplication(app.getAppID(), app.getAppKey(), app.getBaseURL(), true);
            adminApp.setAccessToken(accessToken);
            if (tokenExpiration > 0) {
                adminApp.setAccessTokenExpiration(tokenExpiration);
            }
            return new KiiAppAdminContext(adminApp);
        });
    }
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
    static serverCodeEntry(entryName, version, environmentVersion) {
        if (!validateServerCodeEntryName(entryName)) {
            throw new InvalidArgumentException("entryName is invalid", undefined);
        }
        if (version != undefined && !validateServerCodeEntryVersion(version)) {
            throw new InvalidArgumentException("version is invalid", undefined);
        }
        return new KiiServerCodeEntry(entryName, version, environmentVersion, KiiApplication.globalApp);
    }
    /**
     * Instantiate topic belongs to application.
     * @param topicName name of the topic. Must be a not empty string.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns topic instance.
     */
    static topicWithName(topicName, app = KiiApplication.globalApp) {
        if (typeof topicName !== "string" || topicName === "") {
            throw new InvalidArgumentException("topicName should not null or empty", undefined);
        }
        return new KiiTopic("", topicName, app);
    }
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
    static listTopics(paginationKey, app = KiiApplication.globalApp) {
        return app.listTopics(paginationKey);
    }
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
    static authenticateAsThing(vendorThingID, password, app = KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            // NOTE: the 3rd arg might be a callback, and it might be null (= unused)
            if (!(app instanceof KiiApplication)) {
                app = KiiApplication.globalApp;
            }
            if (!vendorThingID || !password) {
                throw Error("vendorThingID or password is invalid");
            }
            const url = `/oauth2/token`;
            const body = {
                username: `VENDOR_THING_ID:${vendorThingID}`,
                password: password,
            };
            const request = app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.OauthTokenRequest+json");
            request.isSendAccessToken(false);
            const response = yield request.send(JSON.stringify(body));
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, undefined, null);
            }
            const thingID = response.body.id;
            const accessToken = response.body.access_token;
            if (!thingID || !accessToken) {
                throw Error("invalid format response when authenticate thing ");
            }
            const thingApp = new KiiApplication(app.getAppID(), app.getAppKey(), app.getBaseURL());
            thingApp.setAccessToken(accessToken);
            return new KiiThingContext({
                thingId: thingID,
                vendorThingID: vendorThingID,
            }, thingApp);
        });
    }
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
    static authenticateAsThingWithToken(thingID, token, app = KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            // NOTE: the 3rd arg might be a callback, and it might be null (= unused)
            if (!(app instanceof KiiApplication)) {
                app = KiiApplication.globalApp;
            }
            if (!thingID || !token) {
                throw Error("thingID or token is invalid");
            }
            const thingApp = new KiiApplication(app.getAppID(), app.getAppKey(), app.getBaseURL());
            thingApp.setAccessToken(token);
            return Promise.resolve(new KiiThingContext({
                thingId: thingID,
            }, thingApp));
        });
    }
}
export class KiiSDKClientInfo {
    static getSDKClientInfo() {
        if (KiiSDKClientInfo.clientInfo.length == 0) {
            KiiSDKClientInfo.clientInfo = `sn=jss;sv=${Kii.getSDKVersion()}`;
        }
        return KiiSDKClientInfo.clientInfo;
    }
}
KiiSDKClientInfo.clientInfo = "";
