var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KiiBucket, KiiEncryptedBucket } from "./bucket";
import { KiiGroup } from "./group";
import { isSuccess } from "./httpResponse";
import { KiiFetchRequestFactory, KiiJQueryRequestFactory, } from "./requestFactory";
import { KiiTopic } from "./topic";
import { parseErrorResponse } from "./exception";
import { KiiSDKClientInfo } from "./kii";
/**
 * KiiApplication represents an application info.
 *
 * While initializing `Kii`, it automatically generates an KiiApplication instance, and that will be used by default.
 *
 * Optionally, you may create a separate KiiApplication for switching the context.
 * @example example of copying an object from an app to the other
 * ```
 * // Assume myBucket and object xxxx is already registered.
 * const usApp = Kii.initializeWithSite("my-app-id1", "my-app-key1", KiiSite.US);
 * // If no app is injected, the app in which Kii.initializeWithSite() will be used.
 * // i.e. In this case, usApp will be used.
 * const bucketUS = Kii.bucketWithName("myBucket");
 * KiiObject.objectWithURI("kiicloud://buckets/myBucket/objects/xxxx").refresh().then((obj1) => {
 *   // create a separate app
 *   const jpApp = new KiiApplication("my-app-id2", "my-app-key2", KiiSite.JP);
 *   // Assume a myBucket and object yyyy is already registered.
 *   const bucketJP = jpApp.bucketWithName("myBucket");
 *   // Inject the jpApp while creating a object, so that this object will be created on jpApp.
 *   const obj2 = KiiObject.objectWithURI("kiicloud://buckets/myBucket/objects/yyyy", jpApp);
 *   obj1.getKeys().forEach((key) => {
 *     obj2.set(key, obj1.get(key));
 *   });
 *   // authenticate in jpApp to write the object
 *   return KiiUser.authenticate("myusername", "mypassword", jpApp).then(() => {
 *     return obj2.save();
 *   });
 * });
 * ```
 *
 * @example example of using multiple contexts at a time
 * ```
 * const userApp = Kii.initializeWithSite("my-app-id", "my-app-key", KiiSite.US);
 * // authenticate as a normal user. Now the userApp & the default app works as a user context.
 * KiiUser.authenticate("myusername", "mypassword").then((user) => {
 *   // get a list of topics that the user can subscribe.
 *   return userApp.listTopics().then((userTopics) => {
 *     console.log(userTopics);
 *   });
 * });
 *
 * // login as an app admin. This does not affect the user / userApp above.
 * Kii.authenticateAsAppAdmin("your client id", "your client secret").then((adminContext) => {
 *   // this app has an admin context.
 *   const adminApp = adminContext.getApp();
 *   // get a full list of topics.
 *   return adminApp.listTopics().then((allTopics) => {
 *     console.log(allTopics);
 *   });
 * });
 * ```
 */
export class KiiApplication {
    /**
     * Create a new KiiApplication.
     *
     * You don't have to create a KiiApplication by yourself unless you want to handle more than one context at a time.
     *
     * e.g. Either multiple applications or two different context with a same application (like App admin and App user)
     * @param appID The application ID found in your Kii developer console
     * @param appKey The application key found in your Kii developer console
     * @param site Can be one of the constants KiiSite.US, KiiSite.JP, KiiSite.SG depending on your location.
     * @param admin An internal flag to determine if the login user is admin context or not.
     * @returns KiiApplication instance
     * @example
     * ```typescript
     * const app = new KiiApplication("my-app-id", "my-app-key", KiiSite.JP);
     * ```
     */
    constructor(appId, appKey, baseURL, admin = false) {
        this.appId = appId;
        this.appKey = appKey;
        this.baseURL = baseURL;
        this.admin = admin;
        this.expiresIn = 0;
        this.currentUser = null;
        this.accessToken = "";
        this.requestFactory = createDefaultClientFactory();
    }
    /** @hidden */
    isAdmin() {
        return this.admin;
    }
    /**
     * Retrieve the current app ID
     * @returns The current app ID
     */
    getAppID() {
        return this.appId;
    }
    /**
     * Retrieve the current app key
     * @returns The current app key
     */
    getAppKey() {
        return this.appKey;
    }
    /**
     * @hidden
     * Retrieve the current Base URL
     */
    getBaseURL() {
        return this.baseURL;
    }
    /**
     * @hidden
     * Creates new request object
     * @param method HTTP method
     * @param url URL
     */
    newRequest(method, url) {
        const request = this.requestFactory.create(method, `${this.baseURL}${url}`);
        request.addHeader("x-kii-appid", this.appId);
        request.addHeader("x-kii-appkey", this.appKey);
        request.addHeader("x-kii-sdk", KiiSDKClientInfo.getSDKClientInfo());
        if (this.accessToken) {
            request.setAccessToken(this.accessToken);
        }
        request.setContentType("application/json");
        return request;
    }
    /** @hidden */
    setAccessTokenExpiration(expiresIn) {
        this.expiresIn = expiresIn;
    }
    /**
     * Get the access token expiration.
     */
    getAccessTokenExpiration() {
        return this.expiresIn;
    }
    /** @hidden */
    setCurrentUser(user, accessToken) {
        this.currentUser = user;
        this.accessToken = accessToken;
    }
    /**
     * Get the current user.
     */
    getCurrentUser() {
        return this.currentUser;
    }
    /**
     * Get the access token for the user - only available if the user is currently logged in
     * @returns Access token
     */
    getAccessToken() {
        return this.accessToken;
    }
    /** @hidden */
    setAccessToken(accessToken) {
        this.accessToken = accessToken;
    }
    /**
     * Creates a reference to a bucket for this app
     *
     * The bucket will be created/accessed within this app's scope
     * @param bucketName The name of the bucket the app should create/access
     * @returns A working KiiBucket object
     * @example
     * ```typescript
     * const bucket = app.bucketWithName("myBucket");
     * ```
     */
    bucketWithName(bucketName) {
        return new KiiBucket(bucketName, null, this);
    }
    /**
     * Creates a reference to a　encrypted bucket for this app
     *
     * The bucket will be created/accessed within this app's scope
     * @param bucketName The name of the bucket the app should create/access
     * @returns A working KiiEncryptedBucket object
     * @example
     * ```typescript
     * const bucket = app.encryptedBucketWithName("myBucket");
     * ```
     */
    encryptedBucketWithName(bucketName) {
        return new KiiEncryptedBucket(bucketName, null, this);
    }
    /**
     * Creates a reference to a group with the given name
     * @param groupName groupName An application-specific group name
     * @returns A new KiiGroup reference
     * @example
     * ```typescript
     * const group = app.groupWithName("myGroup");
     * ```
     */
    groupWithName(groupName) {
        return KiiGroup.groupWithJSON({ name: groupName }, this);
    }
    /** @hidden */
    setRequestFactory(factory) {
        this.requestFactory = factory;
    }
    /** @hidden */
    logOut() {
        this.currentUser = null;
        this.accessToken = "";
    }
    /** @hidden */
    loggedIn() {
        return this.currentUser != null;
    }
    /**
     * Get a list of topics.
     * @param {String} paginationKey You can specify the pagination key with the nextPaginationKey. If empty string or no string object is provided, this API regards no paginationKey specified.
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
     *           <li>error.target is a KiiAppAdminContext instance which this method was called on.</li>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     */
    listTopics(paginationKey = "") {
        return __awaiter(this, void 0, void 0, function* () {
            let uri = `/apps/${this.getAppID()}/topics`;
            if (typeof paginationKey === "string" && paginationKey !== "") {
                uri = uri + "?paginationKey=" + encodeURIComponent(paginationKey);
            }
            const request = this.newRequest("GET", uri);
            const response = yield request.send();
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, this, null);
            }
            const nextPaginationKey = response.body["paginationKey"] || null;
            const topics = response.body["topics"];
            const items = topics.map((topic) => {
                return new KiiTopic("", topic["topicID"], this);
            });
            return [items, nextPaginationKey];
        });
    }
}
const createDefaultClientFactory = () => {
    if (global.jQuery !== undefined) {
        return new KiiJQueryRequestFactory();
    }
    else if (global.fetch !== undefined) {
        return new KiiFetchRequestFactory();
    }
    else {
        // TODO default implementation?
        return new KiiFetchRequestFactory();
    }
};
