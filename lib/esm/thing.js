var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Kii } from "./kii";
import { KiiApplication } from "./app";
import { parseErrorResponse, InvalidArgumentException } from "./exception";
import { KiiUser } from "./user";
import { KiiGroup } from "./group";
import { isSuccess } from "./httpResponse";
import { isNonEmptyString, error } from "./utilities";
import { KiiThingQueryResult } from "./thingQuery";
import { KiiPushSubscription } from "./push";
import { KiiTopic } from "./topic";
import { KiiBucket, KiiEncryptedBucket } from "./bucket";
/**
 * @class Represents a Thing object
 * @note KiiThing does not support removal of fields from Server.
 * @property {Object} fields of this thing.
 * For details refer to {@link KiiThing.register}
 */
export class KiiThing {
    /** @hidden */
    constructor(fields = null, app = KiiApplication.globalApp) {
        this.fields = fields;
        this.app = app;
        this.online = null;
        this.onlineStatusModifiedAt = null;
        this.thingID = null;
        this.vendorThingID = undefined;
        this.accessToken = "";
        this.created = null;
        this.disabled = undefined;
        if (this.fields) {
            this.renewThingFields(this.fields);
        }
    }
    renewThingFields(respJson) {
        this.online = null;
        this.onlineStatusModifiedAt = null;
        this.fields = respJson;
        this.thingID = respJson._thingID || null;
        this.vendorThingID = respJson._vendorThingID || undefined;
        this.accessToken = respJson._accessToken || "";
        this.created = respJson._created ? new Date(respJson._created) : null;
        this.disabled = respJson._disabled;
        if (respJson._online !== undefined) {
            this.online = respJson._online;
        }
        if (respJson._onlineStatusModifiedAt) {
            this.onlineStatusModifiedAt = new Date(respJson._onlineStatusModifiedAt);
        }
        delete this.fields._thingID;
        delete this.fields._vendorThingID;
        delete this.fields._accessToken;
        delete this.fields._created;
        delete this.fields._disabled;
    }
    /**
     * Get thing ID.
     * @return {String} thing id
     */
    getThingID() {
        return this.thingID;
    }
    /** @hidden */
    setThingID(thingID) {
        this.thingID = thingID;
    }
    /**
     * Get vendor thing ID.
     * @return {String} vendor thing id
     */
    getVendorThingID() {
        return this.vendorThingID;
    }
    /** @hidden */
    setVendorThingID(vendorThingID) {
        this.vendorThingID = vendorThingID;
    }
    /**
     * Get access token of this thing.
     * @return {String} access token of this thing.
     */
    getAccessToken() {
        return this.accessToken || "";
    }
    /** @hidden */
    setAccessToken(token) {
        this.accessToken = token;
    }
    /**
     * Get created time of this thing.
     * @return {Date} created time of this thing.
     */
    getCreated() {
        return this.created;
    }
    /**
     *  Get disabled status of this thing.
     * @return {Boolean} true if thing is disabled, false otherwise.
     */
    getDisabled() {
        return this.disabled === undefined ? false : this.disabled;
    }
    /**
     *  Get online status of the thing.
     * @return {Boolean} true if the thing is online, false otherwise.
     * The return value will be null initially until the thing is connected for the first time.
     */
    isOnline() {
        return this.online;
    }
    /**
     *  Get online status modified date of the thing.
     * @return {Date} online status modified time of this thing. The date will be null initially until the thing is connected for the first time.
     */
    getOnlineStatusModifiedAt() {
        return this.onlineStatusModifiedAt;
    }
    /** @hidden */
    getPath() {
        return `/things/${this.thingID}`;
    }
    /**
     * Register thing in KiiCloud.<br>
     * This API doesnt require users login Anonymous user can register thing.
     * <br>
     * Propertis started with '_' in the fields is reserved by Kii Cloud.<br>
     * Those properties are indexed in Kii Cloud storage.<br>
     * Properties not started with '_' is custom properties defined by developer.<br>
     * Custom properties are not indexed in KiiCloud storage.<br>
     * Following properties are readonly and ignored on creation/{@link update} of thing.<br>
     * '_thingID', '_created', '_accessToken' <br>
     * Following properties are readonly after creation and will be ignored on {@link update} of thing.<br>
     * '_vendorThingID', '_password'<br>
     * As Property prefixed with '_' is reserved by Kii Cloud,
     * properties other than ones described in the parameter secion
     * and '_layoutPosition' are ignored on creation/{@link update} of thing.<br>
     * Those ignored properties won't be removed from fields object passed as argument.
     * However it won't be reflected to fields object property of created/updated Thing.
     * @param {Object} fields of the thing to be registered.
     * @param {String} fields._vendorThingID thing identifier given by thing vendor.
     * @param {String} fields._password thing password given by thing vendor.
     * @param {String} [fields._thingType] thing type given by thing vendor.
     * @param {String} [fields._vendor] vendor identifier given by thing vendor.
     * @param {String} [fields._firmwareVersion] firmware version given by thing vendor.
     * @param {String} [fields._lot] lot identifier given by thing vendor.
     * @param {String} [fields._productName] product name given by thing vendor.
     * @param {String} [fields._stringField1] arbitrary string field.
     * @param {String} [fields._stringField2] arbitrary string field.
     * @param {String} [fields._stringField3] arbitrary string field.
     * @param {String} [fields._stringField4] arbitrary string field.
     * @param {String} [fields._stringField5] arbitrary string field.
     * @param {Number} [fields._numberField1] arbitrary number field.
     * @param {Number} [fields._numberField2] arbitrary number field.
     * @param {Number} [fields._numberField3] arbitrary number field.
     * @param {Number} [fields._numberField4] arbitrary number field.
     * @param {Number} [fields._numberField5] arbitrary number field.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * KiiThing.register(
     *     {
     *         _vendorThingID: "thing-XXXX-YYYY-ZZZZZ",
     *         _password: "thing-password",
     *         _thingType: "thermometer",
     *         yourCustomObj: // Arbitrary key can be used.
     *         { // Object, Array, Number, String can be used. Should be compatible with JSON.
     *             yourCustomKey1: "value",
     *             yourCustomKey2: 100
     *         }
     *     }
     * ).then(thing => {
     *     // Register Thing succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    static register(fields, app = KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${app.getAppID()}/things`;
            const request = app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.ThingRegistrationAndAuthorizationRequest+json");
            request.isSendAccessToken(false);
            const response = yield request.send(JSON.stringify(fields));
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, undefined, null);
            }
            return new KiiThing(response.body, app);
        });
    }
    /**
     *  Perform a query to get the owned things.
     * <br><br>The query will be executed against the server, returning a result set.
     * @param KiiThingQuery thingQuery thingQuery.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(result). result is KiiThingQueryResult instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    static executeQuery(thingQuery, app = KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!thingQuery) {
                throw error("thingQuery is null", this);
            }
            const url = `/apps/${app.getAppID()}/things/query`;
            const request = app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.ThingQueryRequest+json");
            const response = yield request.send(JSON.stringify(thingQuery.dictValue()));
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, undefined, null);
            }
            const respJson = response.body;
            const things = [];
            for (const result of respJson.results) {
                things.push(new KiiThing(result, app));
            }
            const queryResult = new KiiThingQueryResult(thingQuery, things, respJson.nextPaginationKey);
            return queryResult;
        });
    }
    /**
     * Retrieve the latest thing information from KiiCloud.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>To let users to own thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing is already registered.
     * thing.refresh().then(thing => {
     *     // Refresh succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const respJson = yield this.refreshRequest();
            this.renewThingFields(respJson);
            return this;
        });
    }
    refreshRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            let qualifiedID = "";
            if (this.thingID) {
                qualifiedID = this.thingID;
            }
            else {
                qualifiedID = `VENDOR_THING_ID:${this.vendorThingID}`;
            }
            const url = `/apps/${this.app.getAppID()}/things/${qualifiedID}`;
            const request = this.app.newRequest("GET", url);
            const response = yield request.send();
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, this, null);
            }
            return response.body;
        });
    }
    /**
     * Update registered thing information in Kii Cloud
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>To let users to own thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @see KiiThing.register
     * @example
     * ```
     * // assume thing is already registered.
     * thing.fields._stringField1 = "new string value";
     * thing.fields.customObject = {
     *     "customField1" : "abcd",
     *     "customField2" : 123
     * };
     * thing.update().then(thing => {
     *     // Update succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const respJson = yield this.refreshRequest();
            if (!this.fields) {
                this.fields = respJson;
            }
            else {
                Object.assign(respJson, this.fields);
                this.fields = respJson;
            }
            const url = `/apps/${this.app.getAppID()}/things/${this.thingID}`;
            const request = this.app.newRequest("PATCH", url);
            request.setContentType("application/vnd.kii.ThingUpdateRequest+json");
            const response = yield request.send(JSON.stringify(this.fields));
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, this, null);
            }
            return this;
        });
    }
    /**
     * Delete registered thing in Kii Cloud.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>To let users to own thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * It will delete bucket, topic which belongs to this thing,
     * entity belongs to the bucket/topic and all ownership information of thing.
     * This operation can not be reverted. Please carefully use this.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing is already registered.
     * thing.deleteThing().then(thing => {
     *     // Delete succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    deleteThing() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}/things/${this.thingID}`;
            const request = this.app.newRequest("DELETE", url);
            request.setContentType("application/vnd.kii.ThingUpdateRequest+json");
            const response = yield request.send();
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, this, null);
            }
            return this;
        });
    }
    /**
     * Check if user/ group is owner of the thing.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login before execute this API.
     * <br>To let users to own Thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {KiiUser or KiiGroup} owner whether the instance is owner of thing or not.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is the KiiThing instance which this method was called on.</li>
     *         <li>params[1] is a KiiUser/KiiGroup instance.</li>
     *         <li>params[2] is Boolean value, true is the user/group is owner of the thing, otherwise false.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing/user is already registered.
     * let user = KiiUser.userWithURI("kiicloud://users/xxxyyyy");
     * thing.isOwner(user).then(params => {
     *     let thing = params[0];
     *     let user = params[1];
     *     let isOwner = params[2];
     *     if (isOwner) {
     *         // user is owner of the thing.
     *     } else {
     *         // user is not owner of the thing.
     *     }
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    isOwner(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getOwnerURL(this.thingID, owner);
            const request = this.app.newRequest("HEAD", url);
            const response = yield request.send(JSON.stringify(this.fields));
            if (response.status === 404) {
                return [this, owner, false];
            }
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, this, null);
            }
            return [this, owner, true];
        });
    }
    /**
     * Register user/group as owner of this thing.
     * <br>Need user login before execute this API.
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {KiiUser or KiiGroup} owner to be registered as owner.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is the KiiThing instance which this method was called on.</li>
     *         <li>params[1] is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @deprecated Use {@link KiiThing.registerOwnerWithPassword} instead.
     * @example
     * ```
     * // assume thing/group is already registered.
     * let group = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * thing.registerOwner(group).then(params => {
     *     // Register owner succeeded.
     *     let thing = params[0];
     *     let group = params[1];
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    registerOwner(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getOwnerURL(this.thingID, owner);
            const request = this.app.newRequest("PUT", url);
            const response = yield request.send(JSON.stringify(this.fields));
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, this, null);
            }
            return [this, owner];
        });
    }
    /**
     * Register user/group as owner of this thing.
     * <br>Need user login before execute this API.
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {KiiUser or KiiGroup} owner to be registered as owner.
     * @param {String} [password] the thing password
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is the KiiThing instance which this method was called on.</li>
     *         <li>params[1] is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing/group is already registered.
     * let group = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * thing.registerOwnerWithPassword(group, "Thing password").then(params => {
     *     // Register owner succeeded.
     *     let thing = params[0];
     *     let group = params[1];
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    registerOwnerWithPassword(owner, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return KiiThing.registerOwnerWithIdentifierAndPassword(this.thingID, owner, password, this.app).then(() => {
                return [this, owner];
            });
        });
    }
    /**
     * Register user/group as owner of specified thing.
     * <br>Need user login before execute this API.
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {String} thingID The ID of thing
     * @param {KiiUser or KiiGroup} owner instance of KiiUser/KiiGroup to be registered as owner.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
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
     * @deprecated Use {@link KiiThing.registerOwnerWithThingIDAndPassword} instead.
     * @example
     * ```
     * // assume thing/group is already registered.
     * let group = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * KiiThing.registerOwnerWithThingID("th.xxxx-yyyy-zzzz", group).then(params => {
     *     // Register owner succeeded.
     *     let group = params[0];
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    static registerOwnerWithThingID(thingID, owner, app = KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            return KiiThing.registerOwnerWithIdentifier(thingID, owner, app);
        });
    }
    /**
     * Register user/group as owner of specified thing.
     * <br>Need user login before execute this API.
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {String} thingID The ID of thing
     * @param {KiiUser or KiiGroup} owner instance of KiiUser/KiiGroup to be registered as owner.
     * @param {String} [password] the thing password
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(owner).
     *       <ul>
     *         <li>owner is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing/group is already registered.
     * let group = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * KiiThing.registerOwnerWithThingIDAndPassword("th.xxxx-yyyy-zzzz", group, "Thing password").then(owner => {
     *     // Register owner succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    static registerOwnerWithThingIDAndPassword(thingID, owner, password, app = KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            return KiiThing.registerOwnerWithIdentifierAndPassword(thingID, owner, password, app);
        });
    }
    /**
     * Register user/group as owner of specified thing.
     * <br>Need user login before execute this API.
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {String} vendorThingID The vendor thing ID of thing
     * @param {KiiUser or KiiGroup} owner instance of KiiUser/KiiGroup to be registered as owner.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
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
     * @deprecated Use {@link KiiThing.registerOwnerWithVendorThingIDAndPassword} instead.
     * @example
     * ```
     * // assume thing/group is already registered.
     * let group = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * KiiThing.registerOwnerWithVendorThingID("xxxx-yyyy-zzzz", group).then(group => {
     *     // Register owner succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    static registerOwnerWithVendorThingID(vendorThingID, owner, app = KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isNonEmptyString(vendorThingID)) {
                return KiiThing.registerOwnerWithIdentifier(null, owner, app);
            }
            return KiiThing.registerOwnerWithIdentifier("VENDOR_THING_ID:" + vendorThingID, owner, app);
        });
    }
    /**
     * Register user/group as owner of specified thing.
     * <br>Need user login before execute this API.
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {String} vendorThingID The vendor thing ID of thing
     * @param {KiiUser or KiiGroup} owner instance of KiiUser/KiiGroup to be registered as owner.
     * @param {String} [password] the thing password
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(owner).
     *       <ul>
     *         <li>owner is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing/group is already registered.
     * let group = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * KiiThing.registerOwnerWithVendorThingIDAndPassword("xxxx-yyyy-zzzz", group, "Thing password").then(owner => {
     *     // Register owner succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    static registerOwnerWithVendorThingIDAndPassword(vendorThingID, owner, password, app = KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isNonEmptyString(vendorThingID)) {
                throw error("identifier is null or empty", undefined);
            }
            return KiiThing.registerOwnerWithIdentifierAndPassword("VENDOR_THING_ID:" + vendorThingID, owner, password, app);
        });
    }
    static registerOwnerWithIdentifier(identifier, owner, app = KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!identifier) {
                throw error("identifier is null or empty", undefined);
            }
            if (!owner) {
                throw error("owner is null", undefined);
            }
            const url = KiiThing.prototype.getOwnerURL(identifier, owner, app);
            const request = app.newRequest("PUT", url);
            const response = yield request.send();
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, undefined, null);
            }
            return owner;
        });
    }
    static registerOwnerWithIdentifierAndPassword(identifier, owner, password, app = KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!identifier) {
                throw error("identifier is null or empty", undefined);
            }
            if (!password) {
                throw error("password is null or empty", undefined);
            }
            if (!owner) {
                throw error("owner is null", undefined);
            }
            const url = `/apps/${app.getAppID()}/things/${identifier}/ownership`;
            const request = app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.ThingOwnershipRequest+json");
            const requestBody = { thingPassword: password };
            if (owner instanceof KiiUser) {
                requestBody.userID = owner.getID();
            }
            else if (owner instanceof KiiGroup) {
                requestBody.groupID = owner.getID();
            }
            const response = yield request.send(JSON.stringify(requestBody));
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, undefined, null);
            }
            return owner;
        });
    }
    getOwnerURL(identifier, owner, injectedApp = null) {
        let type = null;
        let oid = null;
        const app = injectedApp || this.app;
        if (owner instanceof KiiUser) {
            oid = owner.getID();
            type = "user";
        }
        else if (owner instanceof KiiGroup) {
            oid = owner.getID();
            type = "group";
        }
        else {
            throw error("owner should be instance of user or group", this);
        }
        if (!oid) {
            throw error("owner instance does not have id", this);
        }
        return `/apps/${app.getAppID()}/things/${identifier}/ownership/${type}:${oid}`;
    }
    /**
     * Remove ownership of thing from specified user/group.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {KiiUser or KiiGroup} owner to be unregistered.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is the KiiThing instance which this method was called on.</li>
     *         <li>params[1] is a KiiUser/KiiGroup instance which had ownership of the thing removed.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing/group is already registered.
     * let group = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * thing.unregisterOwner(group).then(params => {
     *     // Unregister owner succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    unregisterOwner(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getOwnerURL(this.thingID, owner);
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, this, null);
            }
            return [this, owner];
        });
    }
    /**
     * Disable the thing.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>To let users to own Thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * After succeeded, access token published for thing is disabled.
     * In a result, only the app administrator and owners of thing can access the thing.
     * Used when user lost the thing and avoid using by unknown users.
     * It doesn't throw error when the thing is already disabled.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing is already registered.
     * thing.disable().then(thing => {
     *     // Disable succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    disable() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.changeStatus(true);
        });
    }
    /**
     * Enable the thing.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>To let users to own Thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * After succeeded, If thing is registered with "persistentToken" option,
     * token should be recovered (Access token which is used before disabling can be available).
     * Otherwise, it does not recovered.
     * It doesn't throw error when the thing is already enabled.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing is already registered.
     * thing.enable().then(thing => {
     *     // Disable succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    enable() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.changeStatus(false);
        });
    }
    changeStatus(disable) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}/things/${this.thingID}/status`;
            const request = this.app.newRequest("PUT", url);
            request.setContentType("application/vnd.kii.ThingStatusUpdateRequest+json");
            const response = yield request.send(JSON.stringify({
                disabled: disable,
            }));
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, this, null);
            }
            this.disabled = disable;
            return this;
        });
    }
    /**
     *  Updates thing password. This method can be used only by app admin.
     * <br>
     * @param {String} newPassword new password
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing is already registered and you had an adminContext.
     * adminContext.thingWithID(thing.getThingID()).updatePassword("new password").then(thing => {
     *     // Update succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    updatePassword(newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.app.isAdmin()) {
                throw error("updatePassword can be used only by app admin.", this);
            }
            if (!newPassword) {
                throw new InvalidArgumentException("newPassword is null or empty", this);
            }
            const requestBody = JSON.stringify({ newPassword: newPassword });
            let qualifiedID = "";
            if (this.thingID) {
                qualifiedID = this.thingID;
            }
            else {
                qualifiedID = `VENDOR_THING_ID:${this.vendorThingID}`;
            }
            const url = `/apps/${this.app.getAppID()}/things/${qualifiedID}/password`;
            const request = this.app.newRequest("PUT", url);
            request.setContentType("application/vnd.kii.ChangeThingPasswordRequest+json");
            const response = yield request.send(requestBody);
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, this, null);
            }
            return this;
        });
    }
    /**
     * Load thing with given vendor thing id.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>To let users to own Thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {String} vendorThingID registered vendor thing id.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * KiiThing.loadWithVendorThingID("thing-xxxx-yyyy").then(thing => {
     *     // Load succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    static loadWithVendorThingID(vendorThingID, app = KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const qualifiedID = `VENDOR_THING_ID:${vendorThingID}`;
            return KiiThing.load(qualifiedID, app);
        });
    }
    /**
     * Load thing with thing id given by Kii Cloud.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>To let users to own Thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * thing id can be obtained by {@link getThingID}
     * @param {String} thingID registered thing id.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * KiiThing.loadWithVendorThingID("thing-xxxx-yyyy").then(thing => {
     *     // Load succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    static loadWithThingID(thingID, app = KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            return KiiThing.load(thingID, app);
        });
    }
    static load(qualifiedID, app = KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${app.getAppID()}/things/${qualifiedID}`;
            const request = app.newRequest("GET", url);
            const response = yield request.send();
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, undefined, null);
            }
            const respJson = response.body;
            return new KiiThing(respJson, app);
        });
    }
    /**
     * Instantiate bucket belongs to this thing.
     * @param {String} bucketName name of the bucket.
     * @return {KiiBucket} bucket instance.
     */
    bucketWithName(bucketName) {
        return new KiiBucket(bucketName, this, this.app);
    }
    /**
     *  Creates a reference to a encrypted bucket for this thing
     * <br><br>The bucket will be created/accessed within this thing's scope
     * @param {String} bucketName The name of the bucket the user should create/access
     * @returns {KiiEncryptedBucket} A working KiiEncryptedBucket object
     * @example
     * ```
     * let thing = . . .; // a KiiThing
     * let bucket = thing.encryptedBucketWithName("myBucket");
     * ```
     */
    encryptedBucketWithName(bucketName) {
        return new KiiEncryptedBucket(bucketName, this, this.app);
    }
    /**
     * Instantiate topic belongs to this thing.
     * @param {String} topicName name of the topic. Must be a not empty string.
     * @return {KiiTopic} topic instance.
     */
    topicWithName(topicName) {
        if (typeof topicName !== "string" || topicName === "") {
            throw error("topicName should not null or empty", this);
        }
        return new KiiTopic(this.getPath(), topicName, this.app);
    }
    /**
     * Gets a list of topics in this thing scope
     * @param {String} [paginationKey] You can specify the pagination key with the nextPaginationKey passed by callbacks.success. If empty string or no string object is provided, this API regards no paginationKey specified.
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
     *           <li>error.target is the KiiThing instance which this method was called on. </li>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```
     * let thing = . . .; // a KiiThing
     * thing.listTopics().then(params => {
     *     let topicList = params[0];
     *     let nextPaginationKey = params[1];
     *     // do something with the result
     *     for (let i = 0; i < topicList.length; i++) {
     *         let topic = topicList[i];
     *     }
     *     if (nextPaginationKey != null) {
     *         thing.listTopics(null, nextPaginationKey)
     *         .then(params => {...})
     *         .catch(error => {...});
     *     }
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    listTopics(paginationKey = "") {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `/apps/${this.app.getAppID()}/things/${this.getThingID()}/topics`;
            if (paginationKey && paginationKey.length > 0) {
                url = url + `?paginationKey=${encodeURIComponent(paginationKey)}`;
            }
            const request = this.app.newRequest("GET", url);
            const response = yield request.send();
            if (!isSuccess(response.status)) {
                throw parseErrorResponse(request, response, this, null);
            }
            const nextPaginationKey = response.body["paginationKey"];
            const topics = response.body["topics"];
            const items = topics.map((topic) => this.topicWithName(topic["topicID"]));
            return [items, nextPaginationKey || null];
        });
    }
    /**
     * Instantiate push subscription for this thing.
     * @return {KiiPushSubscription} push subscription object.
     */
    pushSubscription() {
        return new KiiPushSubscription(this, this.app);
    }
    /** @hidden */
    getHttpURI() {
        return `${Kii.getBaseURL()}/apps/${this.app.getAppID()}/things/${this.getThingID()}`;
    }
    /**
     * @hidden used from appAdminContext
     */
    static thingWithID(thingID, app = KiiApplication.globalApp) {
        if (!thingID) {
            throw new InvalidArgumentException("thingID should not null or empty", undefined);
        }
        const thing = new KiiThing(null, app);
        thing.setThingID(thingID);
        return thing;
    }
    /** @hidden */
    getSubscriberPath() {
        return `things/${this.getThingID()}`;
    }
}
