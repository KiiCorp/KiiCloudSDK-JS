import { KiiApplication } from "./app";
import { KiiBucket, KiiEncryptedBucket } from "./bucket";
import { KiiObject } from "./object";
import { KiiPushInstallation } from "./push";
import { KiiThing } from "./thing";
import { KiiTopic } from "./topic";
export declare class KiiThingContext {
    private app;
    private thingId;
    private vendorThingID;
    /** @hidden */
    constructor(spec: KiiThingSpec, app: KiiApplication);
    /**
     * Creates a reference to a bucket in App scope operated by thing.
     * @param String bucketName The name of the bucket the app should create/access
     * @returns {KiiBucket} A working KiiBucket object
     * @example
     * ```
     * Kii.authenticateAsThing("vendorThingID", "password").then(thingAuthContext => {
     *     let bucket = thingAuthContext.bucketWithName("myAppBucket");
     * }).catch(error => {
     *     // auth failed.
     * });
     * ```
     */
    bucketWithName(bucketName: string): KiiBucket;
    /**
     * Creates a reference to a encrypted bucket in App scope operated by thing.
     * <br><br>The bucket will be created/accessed within this app's scope
     * @param String bucketName The name of the bucket the app should create/access
     * @returns {KiiBucket} A working KiiBucket object
     * @example
     * ```
     * Kii.authenticateAsThing("vendorThingID", "password").then(thingAuthContext => {
     *     let bucket = thingAuthContext.encryptedBucketWithName("myAppBucket");
     * }).catch(error => {
     *     // auth failed.
     * });
     * ```
     */
    encryptedBucketWithName(bucketName: string): KiiEncryptedBucket;
    /**
     * Creates a reference to an object operated by thing using object`s URI.
     * @param String object URI.
     * @returns {KiiObject} A working KiiObject instance
     * @throws {InvalidURIException} If the URI is null, empty or does not have correct format.
     */
    objectWithURI(objectURI: string): KiiObject;
    /**
     * Creates a reference to a topic in App scope operated by thing.
     * <br><br>The Topic will be created/accessed within this app's scope
     * @param {String} topicName name of the topic. Must be a not empty string.
     * @return {KiiTopic} topic instance.
     */
    topicWithName(topicName: string): KiiTopic;
    /**
     * Gets a list of topics in app scope
     * @param {String} paginationKey You can specify the pagination key with the nextPaginationKey passed by callbacks.success. If empty string or no string object is provided, this API regards no paginationKey specified.
     * @return {Promise} return promise object.
     *     <ul>
     *       <li>fulfill callback function: function(params). params is Array instance.
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
     * @example
     * ```
     * // Assume you already have thingAuthContext instance.
     * thingAuthContext.listTopics().then(params => {
     *     let topicList = params[0];
     *     let nextPaginationKey = params[1];
     *     // do something with the result
     *     for (let i = 0; i < topicList.length; i++) {
     *         let topic = topicList[i];
     *     }
     *     if (nextPaginationKey != null) {
     *         thingAuthContext.listTopics(null, nextPaginationKey)
     *         .then(params => {...})
     *         .catch(error => {...});
     *     }
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    listTopics(paginationKey?: string): Promise<[KiiTopic[], string | null]>;
    /**
     * Gets authenticated KiiThing instance.
     * <br>Returned thing instance only have thingID, vendorThingID and accessToken.
     * (vendorThingID is not included when you used
     * {@link Kii.authenticateAsThing} to obtain KiiThingContext.)
     * <br>Please execute {@link KiiThing.refresh} to obtain other properties.
     * @return {KiiThing} return authenticated KiiThing instance.
     */
    getAuthenticatedThing(): KiiThing;
    /**
     * Instantiate push installation for this thing.
     * @return {KiiPushInstallation} push installation object.
     */
    pushInstallation(): KiiPushInstallation;
    /** @hidden */
    _getToken(): string;
    private _objectWithURI;
}
export interface KiiThingSpec {
    thingId: string;
    vendorThingID?: string;
}
