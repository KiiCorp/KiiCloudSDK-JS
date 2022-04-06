"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KiiThingContext = void 0;
const exception_1 = require("./exception");
const kii_1 = require("./kii");
const bucket_1 = require("./bucket");
const group_1 = require("./group");
const push_1 = require("./push");
const thing_1 = require("./thing");
const topic_1 = require("./topic");
const user_1 = require("./user");
class KiiThingContext {
    /** @hidden */
    constructor(spec, app) {
        this.app = app;
        this.thingId = spec.thingId; // id of thing
        if (spec.vendorThingID) {
            this.vendorThingID = spec.vendorThingID; // vendor thing id of thing
        }
    }
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
    bucketWithName(bucketName) {
        return new bucket_1.KiiBucket(bucketName, null, this.app);
    }
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
    encryptedBucketWithName(bucketName) {
        return new bucket_1.KiiEncryptedBucket(bucketName, null, this.app);
    }
    /**
     * Creates a reference to an object operated by thing using object`s URI.
     * @param String object URI.
     * @returns {KiiObject} A working KiiObject instance
     * @throws {InvalidURIException} If the URI is null, empty or does not have correct format.
     */
    objectWithURI(objectURI) {
        return this._objectWithURI(objectURI);
    }
    /**
     * Creates a reference to a topic in App scope operated by thing.
     * <br><br>The Topic will be created/accessed within this app's scope
     * @param {String} topicName name of the topic. Must be a not empty string.
     * @return {KiiTopic} topic instance.
     */
    topicWithName(topicName) {
        if (typeof topicName !== "string" || topicName === "") {
            throw new exception_1.InvalidArgumentException("topicName should not null or empty", this);
        }
        return new topic_1.KiiTopic("", topicName, this.app);
    }
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
    listTopics(paginationKey) {
        return __awaiter(this, arguments, void 0, function* () {
            // NOTE: the 1rd arg might be a callback, and it might be null (= unused)
            if (!paginationKey &&
                arguments.length === 2 &&
                typeof arguments[1] === "string") {
                paginationKey = arguments[1];
            }
            return kii_1.Kii.listTopics(paginationKey, this.app);
        });
    }
    /**
     * Gets authenticated KiiThing instance.
     * <br>Returned thing instance only have thingID, vendorThingID and accessToken.
     * (vendorThingID is not included when you used
     * {@link Kii.authenticateAsThing} to obtain KiiThingContext.)
     * <br>Please execute {@link KiiThing.refresh} to obtain other properties.
     * @return {KiiThing} return authenticated KiiThing instance.
     */
    getAuthenticatedThing() {
        const thingContext = thing_1.KiiThing.thingWithID(this.thingId, this.app);
        if (this.vendorThingID) {
            thingContext.setVendorThingID(this.vendorThingID);
        }
        thingContext.setAccessToken(this.app.getAccessToken());
        return thingContext;
    }
    /**
     * Instantiate push installation for this thing.
     * @return {KiiPushInstallation} push installation object.
     */
    pushInstallation() {
        return new push_1.KiiPushInstallation(null, this.app);
    }
    /** @hidden */
    _getToken() {
        return this.app.getAccessToken();
    }
    // Workaround of CMO-4855
    // TODO: extract common logic of KiiObject
    _objectWithURI(objectUri) {
        if (!objectUri) {
            throw new exception_1.InvalidURIException(undefined, this);
        }
        const valid = objectUri.indexOf("kiicloud://") === 0;
        const newURI = objectUri.substr("kiicloud://".length);
        const components = newURI.split("/");
        const compLength = components.length;
        if (compLength < 4 || !valid) {
            throw new exception_1.InvalidURIException(undefined, this);
        }
        const bucketIndex = compLength === 4 ? 1 : 3;
        const bucketName = components[bucketIndex];
        let subject = null;
        if (components[0] === "groups" && compLength === 6) {
            subject = group_1.KiiGroup.groupWithID(components[1], this.app);
        }
        else if (components[0] === "users" && compLength === 6) {
            subject = user_1.KiiUser.userWithID(components[1], this.app);
        }
        else if (components[0] === "things" && compLength === 6) {
            subject = thing_1.KiiThing.thingWithID(components[1], this.app);
        }
        else if (compLength !== 4) {
            throw new exception_1.InvalidURIException(undefined, this);
        }
        const bucket = new bucket_1.KiiBucket(bucketName, subject, this.app);
        const obj = bucket.createObject();
        obj.setUUID(components[compLength - 1]);
        return obj;
    }
}
exports.KiiThingContext = KiiThingContext;
