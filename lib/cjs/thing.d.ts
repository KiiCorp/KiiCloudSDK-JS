import { KiiApplication } from "./app";
import { KiiUser } from "./user";
import { KiiGroup } from "./group";
import { KiiThingQuery, KiiThingQueryResult } from "./thingQuery";
import { KiiPushSubscription } from "./push";
import { KiiTopic } from "./topic";
import { KiiBucket, KiiEncryptedBucket, IBucketOwner } from "./bucket";
/**
 * @class Represents a Thing object
 * @note KiiThing does not support removal of fields from Server.
 * @property {Object} fields of this thing.
 * For details refer to {@link KiiThing.register}
 */
export declare class KiiThing implements IBucketOwner {
    fields: ThingFields | null;
    private app;
    private online;
    private onlineStatusModifiedAt;
    private thingID;
    private vendorThingID;
    private accessToken;
    private created;
    private disabled;
    /** @hidden */
    constructor(fields?: ThingFields | null, app?: KiiApplication);
    private renewThingFields;
    /**
     * Get thing ID.
     * @return {String} thing id
     */
    getThingID(): string | null;
    /** @hidden */
    setThingID(thingID: string): void;
    /**
     * Get vendor thing ID.
     * @return {String} vendor thing id
     */
    getVendorThingID(): string | undefined;
    /** @hidden */
    setVendorThingID(vendorThingID: string): void;
    /**
     * Get access token of this thing.
     * @return {String} access token of this thing.
     */
    getAccessToken(): string;
    /** @hidden */
    setAccessToken(token: string): void;
    /**
     * Get created time of this thing.
     * @return {Date} created time of this thing.
     */
    getCreated(): Date | null;
    /**
     *  Get disabled status of this thing.
     * @return {Boolean} true if thing is disabled, false otherwise.
     */
    getDisabled(): boolean;
    /**
     *  Get online status of the thing.
     * @return {Boolean} true if the thing is online, false otherwise.
     * The return value will be null initially until the thing is connected for the first time.
     */
    isOnline(): boolean | null;
    /**
     *  Get online status modified date of the thing.
     * @return {Date} online status modified time of this thing. The date will be null initially until the thing is connected for the first time.
     */
    getOnlineStatusModifiedAt(): Date | null;
    /** @hidden */
    getPath(): string;
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
    static register(fields: ThingFields, app?: KiiApplication): Promise<KiiThing>;
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
    static executeQuery(thingQuery: KiiThingQuery, app?: KiiApplication): Promise<KiiThingQueryResult>;
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
    refresh(): Promise<KiiThing>;
    private refreshRequest;
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
    update(): Promise<KiiThing>;
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
    deleteThing(): Promise<KiiThing>;
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
    isOwner<T extends KiiUser | KiiGroup>(owner: T): Promise<[KiiThing, T, boolean]>;
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
    registerOwner<T extends KiiUser | KiiGroup>(owner: T): Promise<[KiiThing, T]>;
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
    registerOwnerWithPassword<T extends KiiUser | KiiGroup>(owner: T, password: string): Promise<[KiiThing, T]>;
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
    static registerOwnerWithThingID<T extends KiiUser | KiiGroup>(thingID: string, owner: T, app?: KiiApplication): Promise<T>;
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
    static registerOwnerWithThingIDAndPassword<T extends KiiUser | KiiGroup>(thingID: string, owner: T, password: string, app?: KiiApplication): Promise<T>;
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
    static registerOwnerWithVendorThingID<T extends KiiUser | KiiGroup>(vendorThingID: string, owner: T, app?: KiiApplication): Promise<T>;
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
    static registerOwnerWithVendorThingIDAndPassword<T extends KiiUser | KiiGroup>(vendorThingID: string, owner: T, password: string, app?: KiiApplication): Promise<T>;
    private static registerOwnerWithIdentifier;
    private static registerOwnerWithIdentifierAndPassword;
    private getOwnerURL;
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
    unregisterOwner<T extends KiiUser | KiiGroup>(owner: T): Promise<[KiiThing, T]>;
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
    disable(): Promise<KiiThing>;
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
    enable(): Promise<KiiThing>;
    private changeStatus;
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
    updatePassword(newPassword: string): Promise<KiiThing>;
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
    static loadWithVendorThingID(vendorThingID: string, app?: KiiApplication): Promise<KiiThing>;
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
    static loadWithThingID(thingID: string, app?: KiiApplication): Promise<KiiThing>;
    private static load;
    /**
     * Instantiate bucket belongs to this thing.
     * @param {String} bucketName name of the bucket.
     * @return {KiiBucket} bucket instance.
     */
    bucketWithName(bucketName: string): KiiBucket;
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
    encryptedBucketWithName(bucketName: string): KiiEncryptedBucket;
    /**
     * Instantiate topic belongs to this thing.
     * @param {String} topicName name of the topic. Must be a not empty string.
     * @return {KiiTopic} topic instance.
     */
    topicWithName(topicName: string): KiiTopic;
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
    listTopics(paginationKey?: string): Promise<[KiiTopic[], string | null]>;
    /**
     * Instantiate push subscription for this thing.
     * @return {KiiPushSubscription} push subscription object.
     */
    pushSubscription(): KiiPushSubscription;
    /** @hidden */
    private getHttpURI;
    /**
     * @hidden used from appAdminContext
     */
    static thingWithID(thingID: string, app?: KiiApplication): KiiThing;
    /** @hidden */
    getSubscriberPath(): string;
}
export interface ThingFields extends ArbitraryThingProps {
    _vendorThingID?: string;
    _password?: string;
    _thingType?: string;
    _vendor?: string;
    _firmwareVersion?: string;
    _lot?: string;
    _productName?: string;
    _stringField1?: string;
    _stringField2?: string;
    _stringField3?: string;
    _stringField4?: string;
    _stringField5?: string;
    _numberField1?: number;
    _numberField2?: number;
    _numberField3?: number;
    _numberField4?: number;
    _numberField5?: number;
    _accessToken?: string | undefined;
    _created?: number;
    _thingID?: string | null;
    _disabled?: boolean;
    _online?: boolean;
    _onlineStatusModifiedAt?: number;
    nextPaginationKey?: string;
}
export interface ArbitraryThingProps {
    [key: string]: any;
}
