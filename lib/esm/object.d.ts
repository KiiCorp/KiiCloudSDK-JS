import { KiiBucket, KiiGeoPoint } from ".";
import { KiiApplication } from "./app";
import { KiiACL, KiiACLParent } from "./acl";
/**
 * Represents a KiiObject object
 */
export declare class KiiObject implements KiiACLParent {
    private bucket;
    private id;
    private app;
    private created;
    private modified;
    private objectType;
    private bodyContentType;
    private owner;
    private customInfo;
    private patch;
    private etag;
    /** @hidden */
    constructor(bucket: KiiBucket, id: string | undefined, app: KiiApplication);
    /** @hidden */
    getPath(): string;
    /**
     * Get the UUID of the given object, assigned by the server
     */
    getUUID(): string | undefined;
    /** @hidden */
    setUUID(uuid: string): void;
    /**
     * Get Id of the object or null if the object ID hasn't been assigned.
     */
    getID(): string | undefined;
    /**
     * Get the server's creation date of this object
     */
    getCreated(): number;
    /**
     * Get the modified date of the given object, assigned by the server
     */
    getModified(): number;
    /**
     * Get the application-defined type name of the object
     */
    getObjectType(): string | null;
    /** @hidden */
    setObjectType(type: string): void;
    /** @hidden */
    setBucket(bucket: KiiBucket): void;
    private setObjectTypeFromResponse;
    /**
     * Get the bucket.
     */
    getBucket(): KiiBucket;
    /**
     * Get the body content-type.
     * It will be updated after the success of {@link KiiObject.uploadBody} and {@link KiiObject.downloadBody}
     * returns null or undefined when this object doesn't have body content-type information.
     */
    getBodyContentType(): string;
    /**
     * Sets a key/value pair to a KiiObject
     *
     * If the key already exists, its value will be written over.
     *
     * NOTE: Before involving floating point value, please consider using integer instead. For example, use percentage, permil, ppm, etc.</br></b>
     * The reason is:
     *  - Will dramatically improve the performance of bucket query.</li>
     *  - Bucket query does not support the mixed result of integer and floating point.
     *    ex.) If you use same key for integer and floating point and inquire object with the integer value, objects which has floating point value with the key would not be evaluated in the query. (and vice versa)</li>
     * @param key The key to set. if null, empty string or string prefixed with '_' is specified, silently ignored and have no effect.
     * We don't check if actual type is String or not.
     * If non-string type is specified, it will be encoded as key by JSON.stringify()
     * @param value The value to be set. Object must be JSON-encodable type (dictionary, array, string, number, boolean)
     * We don't check actual type of the value.
     * It will be encoded as value by JSON.stringify()
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * obj.set("score", 4298);
     * ```
     */
    set(key: string, value: any): void;
    /**
     * Gets the value associated with the given key
     * @param key The key to retrieve
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * let score = obj.get("score");
     * ```
     */
    get(key: string): any;
    /**
     * Gets the array object that contains all keys of custom field.
     * The array of keys from local cache will be returned.
     * To get the latest array of keys from cloud, calling refresh() is necessary prior calling this method.
     * The returned array object does not include reserved keys such as _created, _modified, etc.
     * @returns {Array} keys An array of all keys of custom field.
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * for(let key of obj.keys()) {
     * }
     * ```
     */
    getKeys(): string[];
    /**
     * Removes a pair of key/value from this object.
     * This pair is also removed from server when saveAllFields() is succeeded.
     * @param key The key to be removed
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * obj.remove("score");
     * ```
     */
    remove(key: string): void;
    /**
     * Set Geo point to this object with the specified key.
     * @param key The key to set.
     * @param point KiiGeoPoint to be tied to the specified key.
     */
    setGeoPoint(key: string, point: KiiGeoPoint): void;
    /**
     * Gets the geo point associated with the given key.
     * @param key The key of the geo point to retrieve.
     * @returns {KiiGeoPoint} KiiGeoPoint tied to the key. undefined if no exists.
     */
    getGeoPoint(key: string): KiiGeoPoint | undefined | null;
    /**
     * Get the ACL handle for this file
     *
     * Any KiiACLEntry objects added or revoked from this ACL object will be appended to/removed from the server on ACL save.
     * @returns {KiiACL} A KiiACL object associated with this KiiObject
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * let acl = obj.objectACL();
     * ```
     */
    objectACL(): KiiACL;
    /**
     * Get a specifically formatted string referencing the object
     *
     * The object must exist in the cloud (have a valid UUID).
     * @returns {String} A URI string based on the current object. null if a URI couldn't be generated.
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * let uri = obj.objectURI();
     * ```
     */
    objectURI(): string | null;
    /** @hidden */
    _getToken(): string | null;
    /**
     * Create or update the KiiObject on KiiCloud.
     *
     * When call this method for the object that has not saved on cloud, will send all fields.
     * Call this method for the object that has saved on cloud, Update all field of this object.
     * @param overwrite <ul>
     * <li><b>If overwrite is true:</b>
     *   <ul>
     *     <li>If a KiiObject with the same ID exists in cloud, the local copy will overwrite the remote copy, even if the remote copy is newer. </li>
     *   </ul>
     * <li><b>Otherwise:</b>
     *   <ul>
     *     <li>If a KiiObject with the same ID exists in cloud and the remote copy is newer, save will fail.</li>
     *   </ul>
     * </ul>
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theSavedObject). theSavedObject is KiiObject instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * obj.saveAllFields().then(theSavedObject => {
     *   // do something with the saved object
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    saveAllFields(overwrite?: boolean): Promise<KiiObject>;
    /**
     * Create or update the KiiObject on KiiCloud.
     *
     * When call this method for the object that has not saved on cloud, will send all fields.
     * Call this method for the object that has saved on cloud, Update only updated fields.
     * Do not send fields that has not updated locally. To send all fields regardless of updates, call {@link KiiObject.saveAllFields}.
     * @param overwrite            <ul>
     * <li><b>If overwrite is true:</b>
     *   <ul>
     *     <li>If a KiiObject with the same ID exists in cloud, the local copy will overwrite the remote copy, even if the remote copy is newer. </li>
     *   </ul>
     * <li><b>Otherwise:</b>
     *   <ul>
     *     <li>If a KiiObject with the same ID exists in cloud and the remote copy is newer, save will fail.</li>
     *   </ul>
     * </ul>
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theSavedObject). theSavedObject is KiiObject instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * obj.save().then(theSavedObject => {
     *   // do something with the saved object
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    save(overwrite?: boolean): Promise<KiiObject>;
    private performCreate;
    private performUpdate;
    private performPatchUpdate;
    /** @hidden */
    static objectWithBucket(bucket: KiiBucket, type: string, app?: KiiApplication): KiiObject;
    /** @hidden */
    updateWithJSON(body: any, patch?: boolean): void;
    /**
     * Updates the local object's data with the user data on the server
     *
     * The object must exist on the server.
     * Local data will be overwritten.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theRefreshedObject). theRefreshedObject is KiiObject instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * obj.refresh().then(theRefreshedObject => {
     *   // do something with the refreshed object
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    refresh(): Promise<KiiObject>;
    /**
     * Delete the object from the server
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theDeletedObject). theDeletedObject is KiiObject instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * obj.delete().then(theDeletedObject => {
     *   // do something
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    delete(): Promise<KiiObject>;
    /**
     * Generate a new KiiObject based on a given URI
     * @param uri The URI of the object to be represented
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {KiiObject} A new KiiObject with its parameters filled in from the URI
     * @example
     * ```typescript
     * let group = KiiObject.objectWithURI("kiicloud://myuri");
     * ```
     */
    static objectWithURI(uri: string, app?: KiiApplication): KiiObject;
    /**
     * Move KiiObject body from an object to another object.
     * @param targetObjectUri A KiiObject URI which KiiObject body is moved to.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is Array instance.
     *       <ul>
     *         <li>params[0] is the source KiiObject instance which this method was called on.</li>
     *         <li>params[1] is the target targetObjectUri String.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the source KiiObject instance which this method was called on.</li>
     *         <li>error.targetObjectUri is the targetObjectUri String.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let targetObject = ...; // Target KiiObject
     * let targetObjectUri = targetObject.objectURI();
     * sourceObject.moveBody(targetObjectUri).then(params => {
         let theSrcObject = params[0];
         let theTgtObjectUri = params[1];
     *   // Do something with the objects
     * }).catch(error => {
     *   // Do something with the error response
     * });
     * ```
     */
    moveBody(targetObjectUri: string): Promise<[KiiObject, string]>;
    /**
     * Upload body data of this object.
     * If the KiiObject has not saved on the cloud or deleted,
     * request will be failed.
     *
     * NOTE: this requires XMLHttpRequest Level 2, FileReader and Blob supports. Do not use it in server code.
     * @param srcDataBlob data to be uploaded.
     * type is used to determin content-type managed in Kii Cloud.
     * If type was not specified in the Blob,
     * 'application/octet-stream' will be used.
     * @return {Promise} return promise object.
     * <br>NOTE: Promise will not handle progress event. Please pass callbacks with progress function to handle progress.
     *   <ul>
     *     <li>fulfill callback function: function(theObject). theObject is a KiiObject instance which this method was called on.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let myObject = Kii.bucketWithName('myBucket').createObject();
     * myObject.save().then(obj => {
     *   let srcData = new Blob(['Hello Blob'], {type: 'text/plain'});
     *   obj.uploadBody(srcData).then(obj => { // fullfill callback function
     *     // Upload succeeded.
     *   }).catch(error => { // reject callback function
     *     // Handle error.
     *   });
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    uploadBody(srcDataBlob: Blob): Promise<KiiObject>;
    /**
     * Download body data of this object.
     * If the KiiObject has not saved on the cloud or deleted
     * or exist but does not have body object, request will be failed.
     *
     * NOTE: this requires XMLHttpRequest Level 2, FileReader and Blob supports. Do not use it in server code.<br>
     * @return {Promise} return promise object.
     * <br>NOTE: Promise will not handle progress event. Please pass callbacks with progress function to handle progress.
     *   <ul>
     *     <li>fulfill callback function: function(bodyBlob). bodyBlob is the returned body blob object.</li>
     *     <li>reject callback function: function(error). error is an Error instance.</li>
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let myObject = KiiObject.objectWithURI('put existing object uri here');
     * myObject.downloadBody().then(bodyBlob => {
     *   // Obtaind body contents as bodyBlob.
     *   // content-type managed in Kii Cloud can be obtained from type attr.
     *   let contentType = bodyBlob.type;
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    downloadBody(): Promise<Blob>;
    /**
     * ublish object body.
     * Publish object body and obtain public URL links to the body.
     * It doesn't expires.
     * If the KiiObject has not saved on the cloud or deleted
     * or exist but does not have body object, request will be failed.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(publishedUrl). publishedUrl is the published url string.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let myObject = KiiObject.objectWithURI('put existing object uri here');
     * myObject.publishBody().then(publishedUrl => {
     *   // ex.) You can show publishedUrl in the view.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    publishBody(): Promise<[KiiObject, string]>;
    /**
     * Publish object body with expiration date.
     * Publish object body and obtain public URL links to the body.
     * Expires at specified date
     * If the KiiObject has not saved on the cloud or deleted
     * or exist but does not have body object, request will be failed.
     * @param expiresAt expiration date. should specify future date.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(publishedUrl). publishedUrl is the published url string.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let myObject = KiiObject.objectWithURI('put existing object uri here');
     * let expiresAt = new Date(2014, 11, 24);
     * myObject.publishBodyExpiresAt(expiresAt).then(publishedUrl => {
     *   // ex.) You can show publishedUrl in the view.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    publishBodyExpiresAt(expiresAt: number): Promise<[KiiObject, string]>;
    /**
     * Publish object body with expiration duration.
     * Publish object body and obtain public URL links to the body.
     * Expires in specified duration
     * If the KiiObject has not saved on the cloud or deleted
     * or exist but does not have body object, request will be failed.
     * @param expiresIn duration in seconds. greater than 0.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(publishedUrl). publishedUrl is the published url string.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let myObject = KiiObject.objectWithURI('put existing object uri here');
     * let expiresIn = 60 * 60; // Expires in 1 hour.
     * myObject.publishBodyExpiresIn(expiresIn).then(publishedUrl => {
     *   // ex.) You can show publishedUrl in the view.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    publishBodyExpiresIn(expiresIn: number): Promise<[KiiObject, string]>;
    private publish;
    /**
     * Delete the object body from the server.
     * If the KiiObject has not saved on the cloud or deleted
     * or exist but does not have body object, request will be failed.
     * If succeeded, The object body content type will be nullified.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theDeletedObject). theDeletedObject is the KiiObject instance which this method was called on.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * obj.deleteBody().then(theDeletedObject => {
     *   // do something
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    deleteBody(): Promise<KiiObject>;
    /**
     * Check if given ID is valid for object ID.
     * Valid pattern: ^[a-zA-Z0-9-_\\.]{2,100}$
     * @param objectID objectID to be checked.
     * @returns true if given ID is valid, false otherwise.
     */
    static isValidObjectID(objectID: string): boolean;
}
