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
exports.KiiAppAdminContext = void 0;
const bucket_1 = require("./bucket");
const group_1 = require("./group");
const user_1 = require("./user");
const topic_1 = require("./topic");
const thing_1 = require("./thing");
const exception_1 = require("./exception");
/**
 *  represents the app admin context
 *  <br><br>
 *  <B>This class must not referred from code accessible from browser.
 *  This class is intended to be used by server side code like Node.js.
 *  If you use this class in code accessible by browser, your application client id and client secret could be stolen.
 *  Attacker will be act as application admin and all the data in your application will be suffered.
 *  </B>
 *
 *  Application administrator context. Entities obtained from this class will be manipulated by application admin.
 */
class KiiAppAdminContext {
    /** @hidden */
    constructor(app) {
        this.app = app;
    }
    /** @hidden */
    getApp() {
        return this.app;
    }
    /**
     * Creates a reference to a bucket operated by app admin.
     * <br><br>The bucket will be created/accessed within this app's scope
     * @param String bucketName The name of the bucket the app should create/access
     * @returns {KiiBucket} A working KiiBucket object
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   let bucket = adminContext.bucketWithName("myBucket");
     *   // KiiBucket operation by app admin is available now.
     * }).catch(error => {
     *   // auth failed.
     * });
     * ```
     */
    bucketWithName(bucketName) {
        const adminBucket = new bucket_1.KiiBucket(bucketName, null, this.app);
        return adminBucket;
    }
    /**
     * Creates a reference to a encrypted bucket operated by app admin.
     * <br><br>The bucket will be created/accessed within this app's scope
     * @param String bucketName The name of the bucket the app should create/access
     * @returns {KiiBucket} A working KiiBucket object
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext) {
     *   let bucket = adminContext.encryptedBucketWithName("myBucket");
     *   // KiiBucket operation by app admin is available now.
     * }).catch(error => {
     *   // auth failed.
     * });
     * ```
     */
    encryptedBucketWithName(bucketName) {
        const bucket = new bucket_1.KiiEncryptedBucket(bucketName, null, this.app);
        return bucket;
    }
    /**
     * Creates a reference to a group operated by app admin.
     * <br><br>
     * <b>Note:</b>
     * Returned instance from this API can not operate existing KiiGroup.<br>
     * If you want to operate existing KiiGroup, please use {@link KiiAppAdminContext.groupWithURI} or {@link KiiAppAdminContext.groupWithID}.
     *
     * @param String group name.
     * @returns {KiiGroup} A working KiiGroup object
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   let group = adminContext.groupWithName("newGroup");
     *   // KiiGroup operation by app admin is available now.
     * }).catch(error => {
     *   // auth failed.
     * });
     * ```
     */
    groupWithName(groupName) {
        const group = group_1.KiiGroup.groupWithName(groupName, this.app);
        return group;
    }
    /**
     * Creates a reference to a user operated by app admin.
     * @param String user id.
     * @returns {KiiUser} A working KiiUser object
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   let user = adminContext.userWithID("userid");
     *   // KiiUser operation by app admin is available now.
     * }).catch(error => {
     *   // auth failed.
     * });
     * ```
     */
    userWithID(userid) {
        const user = user_1.KiiUser.userWithID(userid, this.app);
        return user;
    }
    /**
     * Creates a reference to an object operated by app admin using object`s URI.
     * @param String object URI.
     * @returns {KiiObject} A working KiiObject instance
     * @throws {InvalidURIException} If the URI is null, empty or does not have correct format.
     */
    objectWithURI(objectUri) {
        // Workaround of CMO-4855
        // TODO: extract common logic of KiiObject
        const valid = objectUri.indexOf("kiicloud://") == 0;
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
    // FIXME: unused?
    // Workaround of CMO-4855
    /** @hidden */
    _userWithLoginName(loginName) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_1.KiiUser.findUserByUsernameWithoutLogin(loginName, this.app);
        });
    }
    // FIXME: unused?
    // _getId() {
    //   return this._id;
    // }
    /**
     * Get access token published for app admin.
     * @return {String} access token published for app admin.
     */
    getAccessToken() {
        return this.app.getAccessToken();
    }
    /** @hidden */
    _getToken() {
        return this.app.getAccessToken();
    }
    /**
     * Creates a reference to a group operated by app admin using group's ID.
     * <br><br>
     * <b>Note:</b>
     * Returned instance from this API can operate existing KiiGroup.<br>
     * If you want to create a new KiiGroup, please use {@link KiiAppAdminContext.groupWithName}.
     *
     * @param String group ID.
     * @returns {KiiGroup} A working KiiGroup object
     * @throws {InvalidArgumentException} Thrown if passed groupID is null or empty.
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   let groupID = "0123456789abcdefghijklmno";
     *   let group = adminContext.groupWithID(groupID);
     *   // KiiGroup operation by app admin is available now.
     * }).catch(error => {
     *   // auth failed.
     * });
     * ```
     */
    groupWithID(groupID) {
        if (groupID === null || groupID === "") {
            throw "groupID should not null or empty";
        }
        const group = group_1.KiiGroup.groupWithID(groupID, this.app);
        return group;
    }
    /**
     * Register new group own by specified user on Kii Cloud with specified ID.
     * This method can be used only by app admin.
     *
     * <br><br>If the group that has specified id already exists, registration will be failed.
     *
     * @param {String} groupID ID of the KiiGroup
     * @param {String} groupName Name of the KiiGroup
     * @param {String} user id of owner
     * @param {Array} members An array of KiiUser objects to add to the group
     * @return {Promise} return promise object.
     *       <ul>
     *         <li>fulfill callback function: function(theSavedGroup). theSavedGroup is KiiGroup instance.</li>
     *         <li>reject callback function: function(error). error is an Error instance.
     *           <ul>
     *             <li>error.target is the KiiGroup instance which this method was called on.</li>
     *             <li>error.message</li>
     *             <li>error.addMembersArray is array of KiiUser to be added as memebers of this group.</li>
     *             <li>error.removeMembersArray is array of KiiUser to be removed from the memebers list of this group.</li>
     *           </ul>
     *         </li>
     *       </ul>
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   let owner = KiiUser.userWithID("Owner User Id");
     *   let members = [];
     *   members.push(KiiUser.userWithID("Member User Id"));
     *   return adminContext.registerGroupWithOwnerAndID("Group ID", "Group Name", "Owner User ID", members);
     * }).then(group => {
     *   // do something with the saved group
     * });
     * ```
     */
    registerGroupWithOwnerAndID(groupID, groupName, owner, members) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield group_1.KiiGroup.registerGroupWithIDAndOwner(groupID, groupName, owner, members, this.app);
        });
    }
    /**
     * Creates a reference to a group operated by app admin using group's URI.
     * <br><br>
     * <b>Note:</b>
     * Returned instance from this API can operate existing KiiGroup.<br>
     * If you want to create a new KiiGroup, please use {@link KiiAppAdminContext.groupWithName}.
     *
     * @param String group URI.
     * @returns {KiiGroup} A working KiiGroup object
     * @throws {InvalidURIException} Thrown if the URI is null, empty or does not have correct format.
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   let groupUri = ...; // KiiGroup's URI
     *   let group = adminContext.groupWithURI(groupUri);
     *   // KiiGroup operation by app admin is available now.
     * }).catch(error => {
     *   // auth failed.
     * });
     * ```
     */
    groupWithURI(groupUri) {
        const newURI = groupUri.substr("kiicloud://".length);
        const components = newURI.split("/");
        if (components.length !== 2 || components[0] !== "groups") {
            throw new exception_1.InvalidURIException(undefined, this);
        }
        const group = group_1.KiiGroup.groupWithID(components[1], this.app);
        return group;
    }
    /**
     * Find registered KiiUser with the email.<br>
     * If there are no user registers with the specified email or if there are but not verified email yet,
     * callbacks.failure or reject callback of promise will be called.<br>
     * If the email is null or empty, callbacks.failure or reject callback of promise will be callded.
     * <br><br>
     * <b>Note:</b>
     * <ul>
     * <li>If "Expose Full User Data To Others" is enabled in the application console, the response will contain full of the user data.</li>
     * <li>Otherwise, the response will only contain "userID", "loginName" and "displayName" field values if exist.</li>
     * </ul>
     *
     * @param {String} email The email to find KiiUser who owns it.<br>
     * Don't add prefix of "EMAIL:" described in REST API documentation. SDK will take care of it.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(user).
     *       <ul>
     *         <li>user is a found KiiUser instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiAppAdminContext instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   adminContext.findUserByEmail("user_to_find@example.com").then(user => { // fullfill callback function
     *     // Do something with the found user
     *   }).catch(error => { // reject callback function
     *     let adminContext = error.target;
     *     let anErrorString = error.message;
     *     // Do something with the error response
     *   });
     * }).catch(error => {
     *   // Auth failed.
     * });
     * ```
     */
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_1.KiiUser.findUserByEmailWithoutLogin(email, this.app);
        });
    }
    /**
     * Find registered KiiUser with the phone.<br>
     * If there are no user registers with the specified phone or if there are but not verified phone yet,
     * callbacks.failure or reject callback of promise will be called.<br>
     * If the phone is null or empty, callbacks.failure or reject callback of promise will be called.
     * <br><br>
     * <b>Note:</b>
     * <ul>
     * <li>If "Expose Full User Data To Others" is enabled in the application console, the response will contain full of the user data.</li>
     * <li>Otherwise, the response will only contain "userID", "loginName" and "displayName" field values if exist.</li>
     * </ul>
     *
     * @param {String} phone The phone number to find KiiUser who owns it.<br>
     * Don't add prefix of "PHONE:" described in REST API documentation. SDK will take care of it.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(user).
     *       <ul>
     *         <li>user is a found KiiUser instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiAppAdminContext instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   adminContext.findUserByPhone("phone_number_to_find").then(user => { // fullfill callback function
     *     // Do something with the found user
     *   }).catch(error => { // reject callback function
     *     let adminContext = error.target;
     *     let anErrorString = error.message;
     *     // Do something with the error response
     *   });
     * }).catch(error => {
     *   // Auth failed.
     * });
     * ```
     */
    findUserByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_1.KiiUser.findUserByPhoneWithoutLogin(phone, this.app);
        });
    }
    /**
     * Find registered KiiUser with the user name.<br>
     * If there are no user registers with the specified user name, callbacks.failure or reject callback of promise will be called.<br>
     * If the user name is null or empty, callbacks.failure or reject callback of promise will be called.
     * <br><br>
     * <b>Note:</b>
     * <ul>
     * <li>If "Expose Full User Data To Others" is enabled in the application console, the response will contain full of the user data.</li>
     * <li>Otherwise, the response will only contain "userID", "loginName" and "displayName" field values if exist.</li>
     * </ul>
     *
     * @param {String} username The user name to find KiiUser who owns it.<br>
     * Don't add prefix of "LOGIN_NAME:" described in REST API documentation. SDK will take care of it.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(user).
     *       <ul>
     *         <li>user is a found KiiUser instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiAppAdminContext instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   adminContext.findUserByUsername("user_name_to_find").then(user => { // fullfill callback function
     *     // Do something with the found user
     *   }.catch(error => { // reject callback function
     *     let adminContext = error.target;
     *     let anErrorString = error.message;
     *     // Do something with the error response
     *   });
     * }.catch(error => {
     *   // Auth failed.
     * });
     * ```
     */
    findUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_1.KiiUser.findUserByUsernameWithoutLogin(username, this.app);
        });
    }
    /**
     * Register thing by app admin.
     * Method interface is same as {@link KiiThing.register}.
     * Please refer to KiiThing document for details.
     * @param {Object} fields of the thing to be registered. Please refer to {@link KiiThing.register} for the details of fields.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is KiiThing instance with adminToken.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * adminContext.registerThing(
     *   {
     *     _vendorThingID: "thing-XXXX-YYYY-ZZZZZ",
     *     _password: "thing-password",
     *     _thingType: "thermometer",
     *     yourCustomObj: // Arbitrary key can be used.
     *     { // Object, Array, Number, String can be used. Should be compatible with JSON.
     *       yourCustomKey1: "value",
     *       yourCustomKey2: 100
     *     }
     *   }
     * ).then(thing => {
     *   // Register Thing succeeded.
     *   // Operation using thing instance in the parameter
     *   // is authored by app admin.
     * }).catch(error) {
     *   // Handle error.
     * });
     * ```
     */
    registerThing(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            return thing_1.KiiThing.register(fields, this.app);
        });
    }
    /**
     * Register user/group as owner of specified thing by app admin.
     *
     * @param {String} thingID The ID of thing
     * @param {KiiUser or KiiGroup} owner instnce of KiiUser/KiiGroup to be registered as owner.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * // assume thing/group is already registered.
     * let owner = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * // example to use Promise
     * adminContext.registerOwnerWithThingID("th.xxxx-yyyy-zzzz", owner).then(registeredOwner => {
     *   // Register owner succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    registerOwnerWithThingID(thingID, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return thing_1.KiiThing.registerOwnerWithThingID(thingID, owner, this.app);
        });
    }
    /**
     * Register user/group as owner of specified thing with password by app admin.
     *
     * @param {String} thingID The ID of thing
     * @param {KiiUser or KiiGroup} owner instnce of KiiUser/KiiGroup to be registered as owner.
     * @param {String} password The password of thing
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * // assume thing/group is already registered.
     * let owner = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * // example to use Promise
     * adminContext.registerOwnerWithThingIDAndPassword("th.xxxx-yyyy-zzzz", owner, "password").then(registeredOwner => {
     *   // Register owner succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    registerOwnerWithThingIDAndPassword(thingID, owner, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return thing_1.KiiThing.registerOwnerWithThingIDAndPassword(thingID, owner, password, this.app);
        });
    }
    /**
     * Register user/group as owner of specified thing by app admin.
     *
     * @param {String} vendorThingID The vendor thing ID of thing
     * @param {KiiUser or KiiGroup} owner instance of KiiUser/KiiGroupd to be registered as owner.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * // assume thing/group is already registered.
     * let owner = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * // example to use Promise
     * adminContext.registerOwnerWithVendorThingID("xxxx-yyyy-zzzz", owner).then(registeredOwner => {
     *   // Register owner succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    registerOwnerWithVendorThingID(vendorThingID, owner) {
        return thing_1.KiiThing.registerOwnerWithVendorThingID(vendorThingID, owner, this.app);
    }
    /**
     * Register user/group as owner of specified thing with password by app admin.
     *
     * @param {String} vendorThingID The vendor thing ID of thing
     * @param {KiiUser or KiiGroup} owner instance of KiiUser/KiiGroupd to be registered as owner.
     * @param {String} password The password of thing
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * // assume thing/group is already registered.
     * let owner = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * // example to use Promise
     * adminContext.registerOwnerWithVendorThingIDAndPassword("xxxx-yyyy-zzzz", owner, "password").then(registeredOwner => {
     *   // Register owner succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    registerOwnerWithVendorThingIDAndPassword(vendorThingID, owner, password) {
        return thing_1.KiiThing.registerOwnerWithVendorThingIDAndPassword(vendorThingID, owner, password, this.app);
    }
    /**
     * Creates a reference to a thing operated by app admin.
     * @param String thing id.
     * @returns {KiiThing} A working KiiThing object
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   let thing = adminContext.thingWithID("th.xxxx-yyyy");
     *   // KiiThing operation by app admin is available now.
     * }).catch(error => {
     *   // auth failed.
     * });
     * ```
     */
    thingWithID(thingID) {
        return thing_1.KiiThing.thingWithID(thingID, this.app);
    }
    /**
     * Load thing with vendor thing ID by app admin.
     * Method interface is same as {@link KiiThing.loadWithVendorThingID}.
     * Please refer to KiiThing document for details.
     * @param {String} vendorThingID registered vendor thing id.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is KiiThing instance with adminToken.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * adminContext.loadThingWithVendorThingID("thing-xxxx-yyyy").then(thing => {
     *   // Load succeeded.
     *   // Operation using thing instance in the parameter
     *   // is authored by app admin.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    loadThingWithVendorThingID(vendorThingID) {
        return __awaiter(this, void 0, void 0, function* () {
            return thing_1.KiiThing.loadWithVendorThingID(vendorThingID, this.app);
        });
    }
    /**
     * Load thing with thing ID by app admin.
     * Method interface is same as {@link KiiThing.loadWithThingID}.
     * Please refer to KiiThing document for details.
     * @param {String} thingID registered thing id.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is KiiThing instance with adminToken.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * adminContext.loadThingWithThingID("thing-xxxx-yyyy").then(thing => {
     *   // Load succeeded.
     *   // Operation using thing instance in the parameter
     *   // is authored by app admin.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    loadThingWithThingID(thingID) {
        const fields = {
            _thingID: thingID,
            _accessToken: this.app.getAccessToken(),
        };
        const ret = new thing_1.KiiThing(fields, this.app);
        return ret.refresh();
    }
    /**
     * Creates a reference to a topic operated by app admin
     * @param {String} topicName name of the topic. Must be a not empty string.
     * @return {KiiTopic} topic instance.
     */
    topicWithName(topicName) {
        return new topic_1.KiiTopic("", topicName, this.app);
    }
    /** Gets a list of topics in app scope
     * @param {String} paginationKey You can specify the pagination key with the nextPaginationKey passed by callbacks.success. If empty string or no string object is provided, this API regards no paginationKey specified.
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
     * @example
     * ```typescript
     * adminContext.listTopics().then(params => {
     *   let topicList = params[0];
     *   let nextPaginationKey = params[1];
     *   // do something with the result
     *   for (let i = 0; i < topicList.length; i++) {
     *     let topic = topicList[i];
     *   }
     *   if (nextPaginationKey != null) {
     *     adminContext.listTopics(nextPaginationKey)
     *     .then(result => {...})
     *     .catch(error => {...});
     *   }
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    listTopics(paginationKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.app.listTopics(paginationKey);
        });
    }
}
exports.KiiAppAdminContext = KiiAppAdminContext;
