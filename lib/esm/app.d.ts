import { KiiBucket, KiiEncryptedBucket } from "./bucket";
import { KiiGroup } from "./group";
import { KiiUser } from "./user";
import { KiiTopic } from "./topic";
import { KiiHttpMethod, KiiHttpRequest, KiiHttpRequestFactory } from "./httpRequest";
declare global {
    var jQuery: any;
}
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
export declare class KiiApplication {
    private appId;
    private appKey;
    private baseURL;
    private admin;
    /**
     * @internal
     * Either a default KiiApplication or an injected KiiApplication.
     */
    static globalApp: KiiApplication;
    private expiresIn;
    private currentUser;
    private accessToken;
    private requestFactory;
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
    constructor(appId: string, appKey: string, baseURL: string, admin?: boolean);
    /** @hidden */
    isAdmin(): boolean;
    /**
     * Retrieve the current app ID
     * @returns The current app ID
     */
    getAppID(): string;
    /**
     * Retrieve the current app key
     * @returns The current app key
     */
    getAppKey(): string;
    /**
     * @hidden
     * Retrieve the current Base URL
     */
    getBaseURL(): string;
    /**
     * @hidden
     * Creates new request object
     * @param method HTTP method
     * @param url URL
     */
    newRequest(method: KiiHttpMethod, url: string): KiiHttpRequest;
    /** @hidden */
    setAccessTokenExpiration(expiresIn: number): void;
    /**
     * Get the access token expiration.
     */
    getAccessTokenExpiration(): number;
    /** @hidden */
    setCurrentUser(user: KiiUser | null, accessToken: string): void;
    /**
     * Get the current user.
     */
    getCurrentUser(): KiiUser | null;
    /**
     * Get the access token for the user - only available if the user is currently logged in
     * @returns Access token
     */
    getAccessToken(): string;
    /** @hidden */
    setAccessToken(accessToken: string): void;
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
    bucketWithName(bucketName: string): KiiBucket;
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
    encryptedBucketWithName(bucketName: string): KiiEncryptedBucket;
    /**
     * Creates a reference to a group with the given name
     * @param groupName groupName An application-specific group name
     * @returns A new KiiGroup reference
     * @example
     * ```typescript
     * const group = app.groupWithName("myGroup");
     * ```
     */
    groupWithName(groupName: string): KiiGroup;
    /** @hidden */
    setRequestFactory(factory: KiiHttpRequestFactory): void;
    /** @hidden */
    logOut(): void;
    /** @hidden */
    loggedIn(): boolean;
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
    listTopics(paginationKey?: string): Promise<[KiiTopic[], string | null]>;
}
