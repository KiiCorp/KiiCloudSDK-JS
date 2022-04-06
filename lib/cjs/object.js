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
exports.KiiObject = void 0;
const _1 = require(".");
const app_1 = require("./app");
const acl_1 = require("./acl");
const exception_1 = require("./exception");
const uri_1 = require("./uri");
const user_1 = require("./user");
const httpResponse_1 = require("./httpResponse");
const kii_1 = require("./kii");
const exception_2 = require("./exception");
const utilities_1 = require("./utilities");
/**
 * Represents a KiiObject object
 */
class KiiObject {
    /** @hidden */
    constructor(bucket, id, app) {
        this.bucket = bucket;
        this.id = id;
        this.app = app;
        this.created = 0;
        this.modified = 0;
        this.objectType = null;
        this.bodyContentType = "";
        this.owner = null;
        this.customInfo = {};
        this.patch = {};
        this.etag = "";
    }
    /** @hidden */
    getPath() {
        let path = this.bucket.getPath() + "/objects/";
        if (this.id) {
            path += this.id;
        }
        return path;
    }
    /**
     * Get the UUID of the given object, assigned by the server
     */
    getUUID() {
        return this.id;
    }
    /** @hidden */
    setUUID(uuid) {
        this.id = uuid;
    }
    /**
     * Get Id of the object or null if the object ID hasn't been assigned.
     */
    getID() {
        return this.id;
    }
    /**
     * Get the server's creation date of this object
     */
    getCreated() {
        return this.created;
    }
    /**
     * Get the modified date of the given object, assigned by the server
     */
    getModified() {
        return this.modified;
    }
    /**
     * Get the application-defined type name of the object
     */
    getObjectType() {
        return this.objectType;
    }
    /** @hidden */
    setObjectType(type) {
        this.objectType = type;
    }
    /** @hidden */
    setBucket(bucket) {
        this.bucket = bucket;
    }
    setObjectTypeFromResponse(dataType) {
        if (dataType == "application/json") {
            this.objectType = null;
        }
        const result = dataType.match(new RegExp(`application\/vnd\.${this.app.getAppID()}\.([^\.+]+)\+json`));
        if (result != null) {
            this.objectType = result[1];
        }
    }
    /**
     * Get the bucket.
     */
    getBucket() {
        return this.bucket;
    }
    /**
     * Get the body content-type.
     * It will be updated after the success of {@link KiiObject.uploadBody} and {@link KiiObject.downloadBody}
     * returns null or undefined when this object doesn't have body content-type information.
     */
    getBodyContentType() {
        return this.bodyContentType;
    }
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
    set(key, value) {
        if (!utilities_1.isNonEmptyString(key) || key.indexOf("_") == 0) {
            // logger "[WARN] Reserved key is used for custom field. key=${key}"
            return;
        }
        this.patch[key] = value;
    }
    /**
     * Gets the value associated with the given key
     * @param key The key to retrieve
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * let score = obj.get("score");
     * ```
     */
    get(key) {
        if (this.patch[key] !== undefined) {
            return this.patch[key];
        }
        return this.customInfo[key];
    }
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
    getKeys() {
        const keys = Object.keys(this.customInfo);
        const patchKeys = Object.keys(this.customInfo);
        patchKeys.forEach((key) => {
            if (this.customInfo[key] === undefined) {
                keys.push(key);
            }
        });
        return keys;
    }
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
    remove(key) {
        delete this.customInfo[key];
        delete this.patch[key];
    }
    /**
     * Set Geo point to this object with the specified key.
     * @param key The key to set.
     * @param point KiiGeoPoint to be tied to the specified key.
     */
    setGeoPoint(key, point) {
        if (point instanceof _1.KiiGeoPoint) {
            this.patch[key] = point.toObject();
        }
        else {
            throw new exception_2.InvalidArgumentException("Specified latitide or longitude is invalid", this);
        }
    }
    /**
     * Gets the geo point associated with the given key.
     * @param key The key of the geo point to retrieve.
     * @returns {KiiGeoPoint} KiiGeoPoint tied to the key. undefined if no exists.
     */
    getGeoPoint(key) {
        const point = this.customInfo[key];
        // if (point === undefined) {
        //   return null;
        // }
        return _1.KiiGeoPoint.fromObject(point);
    }
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
    objectACL() {
        return acl_1.KiiACL.aclWithParent(this, this.app);
    }
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
    objectURI() {
        if (this.bucket && this.id) {
            return `kiicloud:/${this.bucket.getPath()}/objects/${this.id}`;
        }
        return null;
    }
    /** @hidden */
    _getToken() {
        const currUser = user_1.KiiUser.getCurrentUser();
        const token = currUser ? currUser.getAccessToken() : null;
        return token ? token : null;
    }
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
    saveAllFields(overwrite = true) {
        return __awaiter(this, arguments, void 0, function* () {
            // sustain the compatibility with v2
            if (arguments[0] === null) {
                overwrite = arguments[1];
            }
            const body = {};
            Object.assign(body, this.customInfo);
            Object.assign(body, this.patch);
            if (this.getID() == null) {
                yield this.performCreate(body);
            }
            else {
                yield this.performUpdate(body, overwrite);
            }
            this.customInfo = body;
            this.patch = {};
            return this;
        });
    }
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
    save(overwrite = true) {
        return __awaiter(this, arguments, void 0, function* () {
            // sustain the compatibility with v2
            if (arguments[0] === null) {
                overwrite = arguments[1];
            }
            const body = {};
            Object.assign(body, this.patch);
            if (this.getID() == null) {
                yield this.performCreate(body);
                Object.assign(this.customInfo, this.patch);
            }
            else {
                yield this.performPatchUpdate(body, overwrite);
                // server returns all fields on patch update.
                // so we don't need to assign patch to customInfo
            }
            this.patch = {};
            return this;
        });
    }
    performCreate(body) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects`;
            const request = this.app.newRequest("POST", url);
            if (this.objectType == null) {
                request.setContentType("application/json");
            }
            else {
                request.setContentType(`application/vnd.${this.app.getAppID()}.${this.objectType}+json`);
            }
            const response = yield request.send(JSON.stringify(body));
            if (httpResponse_1.isSuccess(response.status)) {
                this.etag = (_b = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("etag")) !== null && _b !== void 0 ? _b : "";
                const objectId = response.body["objectID"];
                if (objectId == null) {
                    throw utilities_1.error("No objectID response", this);
                }
                this.id = objectId;
                if (response.body["createdAt"] != null) {
                    this.created = response.body["createdAt"];
                }
                const dataType = response.body["dataType"];
                this.modified = this.created;
                if (dataType != null) {
                    this.setObjectTypeFromResponse(dataType);
                }
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
    performUpdate(body, overwrite) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = this.getID();
            if (objectId == null) {
                throw utilities_1.error("empty object ID", this);
            }
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}`;
            const request = this.app.newRequest("PUT", url);
            const isSaved = this.getCreated() > 0;
            if (!overwrite) {
                if (isSaved) {
                    if (this.etag.length == 0) {
                        throw utilities_1.error("IllegalState! Call KiiObject#refresh() prior call this method.", this);
                    }
                    request.addHeader("If-Match", this.etag);
                }
                else {
                    request.addHeader("If-None-Match", "*");
                }
            }
            if (this.objectType == null) {
                request.setContentType("application/json");
            }
            else {
                request.setContentType(`application/vnd.${this.app.getAppID()}.${this.objectType}+json"`);
            }
            const response = yield request.send(JSON.stringify(body));
            if (httpResponse_1.isSuccess(response.status)) {
                this.etag = (_b = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("etag")) !== null && _b !== void 0 ? _b : "";
                if (response.body["createdAt"] != null) {
                    this.created = response.body["createdAt"];
                }
                if (response.body["modifiedAt"] != null) {
                    this.modified = response.body["modifiedAt"];
                }
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
    performPatchUpdate(body, overwrite) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = this.getID();
            if (objectId == null) {
                throw utilities_1.error("empty object ID", this);
            }
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}`;
            const request = this.app.newRequest("POST", url);
            request.addHeader("X-HTTP-Method-Override", "PATCH");
            const isSaved = this.getCreated() > 0;
            if (!overwrite) {
                if (isSaved) {
                    if (this.etag.length == 0) {
                        throw utilities_1.error("IllegalState! Call KiiObject#refresh() prior call this method.", this);
                    }
                    request.addHeader("If-Match", this.etag);
                }
                else {
                    if (body && !this.etag) {
                        throw utilities_1.error("IllegalState! Call KiiObject#refresh() prior call this method.", this);
                    }
                    request.addHeader("If-None-Match", "*");
                }
            }
            if (this.objectType == null) {
                request.setContentType("application/json");
            }
            else {
                request.setContentType(`application/vnd.${this.app.getAppID()}.${this.objectType}+json`);
            }
            const response = yield request.send(JSON.stringify(body));
            if (httpResponse_1.isSuccess(response.status)) {
                this.etag = (_b = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("etag")) !== null && _b !== void 0 ? _b : "";
                this.updateWithJSON(response.body);
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
    /** @hidden */
    static objectWithBucket(bucket, type, app = app_1.KiiApplication.globalApp) {
        const object = new KiiObject(bucket, undefined, app);
        object.setObjectType(type);
        return object;
    }
    /** @hidden */
    updateWithJSON(body, patch = true) {
        if (!patch) {
            this.customInfo = {};
        }
        for (let key in body) {
            const value = body[key];
            switch (key) {
                case "_id":
                    // only set uuid when uuid is null/undefined
                    if (this.getID() == null) {
                        this.id = value;
                    }
                    break;
                case "_created":
                    this.created = value;
                    break;
                case "_modified":
                    this.modified = value;
                    break;
                case "_owner":
                    this.owner = user_1.KiiUser.userWithID(value);
                    break;
                case "_dataType":
                    this.objectType = value;
                    break;
                case "_calculated":
                    this.customInfo[key] = value;
                    break;
                case "_version":
                    this.etag = value;
                    break;
                default:
                    if (key[0] != "_") {
                        this.customInfo[key] = value;
                    }
                    break;
            }
        }
    }
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
    refresh() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = this.getID();
            if (objectId == null) {
                throw utilities_1.error("empty object ID", this);
            }
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}`;
            const request = this.app.newRequest("GET", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                this.etag = (_b = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("etag")) !== null && _b !== void 0 ? _b : "";
                this.updateWithJSON(response.body, false);
                return this;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = this.getID();
            if (objectId == null) {
                throw utilities_1.error("empty object ID", this);
            }
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}`;
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                // OK
                return this;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    static objectWithURI(uri, app = app_1.KiiApplication.globalApp) {
        let kiiuri;
        let entity;
        try {
            kiiuri = uri_1.KiiUri.parse(uri, app);
            entity = kiiuri.toEntity();
        }
        catch (e) {
            throw utilities_1.error(e.message, this);
        }
        if (entity instanceof KiiObject) {
            return entity;
        }
        else {
            throw utilities_1.error("uri is not for object.", undefined);
        }
    }
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
    moveBody(targetObjectUri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!targetObjectUri) {
                throw new exception_2.InvalidArgumentException("targetObjectUri is required", this);
            }
            let targetUri;
            let body;
            try {
                targetUri = uri_1.KiiUri.parse(targetObjectUri, this.app);
                body = targetUri.toMoveBodyParam();
            }
            catch (e) {
                throw utilities_1.error(e.message, this);
            }
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}/body/move`;
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.ObjectBodyMoveRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if (httpResponse_1.isSuccess(response.status)) {
                // OK
                return [this, targetObjectUri];
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, {
                    targetObjectUri: targetObjectUri,
                });
            }
        });
    }
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
    uploadBody(srcDataBlob) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}/body`;
            const contentType = srcDataBlob.type.length > 0
                ? srcDataBlob.type
                : "application/octet-stream";
            const request = this.app.newRequest("PUT", url);
            request.addHeader("x-kii-sdk", kii_1.KiiSDKClientInfo.getSDKClientInfo());
            request.setContentType(contentType);
            const response = yield request.send(srcDataBlob);
            if (httpResponse_1.isSuccess(response.status)) {
                const modifiedAt = response.body["modifiedAt"];
                if (modifiedAt !== undefined) {
                    this.modified = modifiedAt;
                }
                this.bodyContentType = contentType;
                return this;
            }
            else {
                let errString = "failed to upload body. statusCode: " + response.status;
                if (response.body.errorCode) {
                    errString += " error code: " + response.body.errorCode;
                }
                if (response.body.message) {
                    errString += " message: " + response.body.message;
                }
                throw utilities_1.error(errString, this);
            }
        });
    }
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
    downloadBody() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}/body`;
            const request = this.app.newRequest("GET", url);
            request.addHeader("x-kii-sdk", kii_1.KiiSDKClientInfo.getSDKClientInfo());
            const response = yield request.sendForDownload();
            if (httpResponse_1.isSuccess(response.status)) {
                const contentType = (_b = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("content-type")) !== null && _b !== void 0 ? _b : "";
                this.bodyContentType = contentType;
                return response.body;
            }
            else {
                let errString = "failed to download body. statusCode: " + response.status;
                if (response.body) {
                    errString += " error code: " + response.body.errorCode;
                }
                if (response.body.message) {
                    errString += " message: " + response.body.message;
                }
                throw utilities_1.error(errString, this);
            }
        });
    }
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
    publishBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.publish({});
        });
    }
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
    publishBodyExpiresAt(expiresAt) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.publish({
                expiresAt: expiresAt,
            });
        });
    }
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
    publishBodyExpiresIn(expiresIn) {
        return this.publish({
            expiresIn: expiresIn,
        });
    }
    publish(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}/body/publish`;
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.ObjectBodyPublicationRequest+json");
            request.addHeader("x-kii-sdk", kii_1.KiiSDKClientInfo.getSDKClientInfo());
            const response = yield request.send(JSON.stringify(body));
            if (httpResponse_1.isSuccess(response.status)) {
                const publishedUrl = response.body["url"];
                return [this, publishedUrl];
            }
            else {
                let errString = "failed to publish body. statusCode: " + response.status;
                if (response.body.errorCode) {
                    errString += " error code: " + response.body.errorCode;
                }
                if (response.body.message) {
                    errString += " error message: " + response.body.message;
                }
                throw utilities_1.error(errString, this);
            }
        });
    }
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
    deleteBody() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}/body`;
            const request = this.app.newRequest("DELETE", url);
            request.addHeader("x-kii-sdk", kii_1.KiiSDKClientInfo.getSDKClientInfo());
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                this.bodyContentType = "";
                return this;
            }
            else {
                let errString = "failed to delete body. statusCode: " + response.status;
                if (response.body) {
                    errString += " error code: " + response.body.errorCode;
                }
                if (response.body.message) {
                    errString += " message: " + response.body.message;
                }
                throw utilities_1.error(errString, this);
            }
        });
    }
    /**
     * Check if given ID is valid for object ID.
     * Valid pattern: ^[a-zA-Z0-9-_\\.]{2,100}$
     * @param objectID objectID to be checked.
     * @returns true if given ID is valid, false otherwise.
     */
    static isValidObjectID(objectID) {
        const pattern = /^[a-zA-Z0-9-_.]{2,100}$/i;
        if (typeof objectID !== "string") {
            return false;
        }
        else if (objectID.match(pattern) !== null) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.KiiObject = KiiObject;
