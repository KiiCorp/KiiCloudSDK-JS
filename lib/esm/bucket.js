var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KiiACL } from ".";
import { parseErrorResponse, InvalidArgumentException } from "./exception";
import { isSuccess } from "./httpResponse";
import { KiiObject } from "./object";
import { KiiQuery } from "./query";
import { KiiGroup } from "./group";
import { KiiUser } from "./user";
import { KiiThing } from "./thing";
/**
 * Represents a KiiBucket object
 */
export class KiiBucket {
    /**
     * @hidden
     * @throws {InvalidArgumentException} when bucketName is invalid.
     */
    constructor(bucketName, parent, app) {
        this.bucketName = bucketName;
        this.parent = parent;
        this.app = app;
        if (!bucketName) {
            throw new InvalidArgumentException("Specified bucket name is null or empty.", undefined);
        }
    }
    parentIs(parent, cls) {
        if (parent instanceof cls) {
            return true;
        }
        return false;
    }
    /** @hidden */
    getUser() {
        if (this.parentIs(this.parent, KiiUser)) {
            return this.parent;
        }
        return undefined;
    }
    /** @hidden */
    getGroup() {
        if (this.parentIs(this.parent, KiiGroup)) {
            return this.parent;
        }
        return undefined;
    }
    /** @hidden */
    getThing() {
        if (this.parentIs(this.parent, KiiThing)) {
            return this.parent;
        }
        return undefined;
    }
    /** @hidden */
    getParent() {
        return this.getUser() || this.getGroup() || this.getThing();
    }
    /**
     * The name of this bucket
     * @returns name
     */
    getBucketName() {
        return this.bucketName;
    }
    /** @hidden */
    getQualifiedBucketName() {
        return this.bucketName;
    }
    /**
     * Create a KiiObject within the current bucket
     *
     * @returns An empty KiiObject with no specific type
     * @example
     * ```typescript
     * let bucket = . . .; // a KiiBucket
     * let object = bucket.createObject();
     * ```
     */
    createObject() {
        return new KiiObject(this, undefined, this.app);
    }
    /**
     * Create a KiiObject within the current bucket, with type
     *
     * @param type representing the desired object type
     * @returns An empty KiiObject with specified type
     * @example
     * ```typescript
     * const bucket = . . .; // a KiiBucket
     * const object = bucket.createObjectWithType("scores");
     * ```
     */
    createObjectWithType(type) {
        return KiiObject.objectWithBucket(this, type, this.app);
    }
    /**
     * Create a KiiObject within the current bucket, specifying its ID.
     *
     * @param objectID ID of the obeject you want to instantiate.
     * @returns KiiObject instance.
     * @throws {InvalidArgumentException} objectID is not acceptable.
     * Refer to {@link KiiObject.isValidObjectID} for details of acceptable string.
     * @example
     * ```typescript
     * let bucket = . . .; // KiiBucket
     * let object = bucket.createObjectWithID('__OBJECT_ID_');
     * ```
     */
    createObjectWithID(objectID) {
        if (!KiiObject.isValidObjectID(objectID)) {
            throw new InvalidArgumentException("Specified obejctID is invalid.", this);
        }
        return new KiiObject(this, objectID, this.app);
    }
    /** @hidden */
    getPath() {
        if (this.parent == null) {
            return `/buckets/${this.getQualifiedBucketName()}`;
        }
        return `${this.parent.getPath()}/buckets/${this.getQualifiedBucketName()}`;
    }
    /**
     * Get the ACL handle for this bucket
     *
     * Any KiiACLEntry objects added or revoked from this ACL object will be appended to/removed from the server on ACL save.
     * @returns A KiiACL object associated with this KiiBucket
     * @example
     * ```typescript
     * const bucket = . . .; // a KiiBucket
     * const acl = bucket.acl();
     * ```
     */
    acl() {
        return KiiACL.aclWithParent(this, this.app);
    }
    /**
     * Perform a query on the given bucket
     *
     * The query will be executed against the server, returning a result set.
     * @param query An object with callback methods defined
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is Array instance.
     *       <ul>
     *         <li>params[0] is a performed KiiQuery instance.</li>
     *         <li>params[1] is resultSet Array instance. Could be KiiObject, KiiGroup, KiiUser, etc.</li>
     *         <li>params[2] is a KiiQuery instance for next query. If there are no more results to be retrieved, it will be null.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiBucket instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let bucket = . . .; // a KiiBucket
     * let queryObject = . . .; // a KiiQuery
     * bucket.executeQuery(queryObject).then(params => {
     *   let queryPerformed = params[0];
     *   let resultSet = params[1];
     *   let nextQuery = params[2];
     *   // do something with the results
     *   for (let i = 0; i < resultSet.length; i++) {
     *     // do something with the object
     *     // resultSet[i]; // could be KiiObject, KiiGroup, KiiUser, etc
     *   }
     *
     *   // if there are more results to be retrieved
     *   if(nextQuery != null) {
     *     // get them and repeat recursively until no results remain
     *     bucket.executeQuery(nextQuery).then(params => {
     *       // next query success
     *     }).catch(error => {
     *       // next query failed, please handle the error
     *     });
     *   }
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    executeQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.getPath()}/query`;
            const body = query.toDict();
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.QueryRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if (isSuccess(response.status)) {
                const resultset = response.body["results"].map((json) => {
                    const newObject = this.createObject();
                    newObject.updateWithJSON(json);
                    return newObject;
                });
                let nextQuery = null;
                if (response.body["nextPaginationKey"] != null) {
                    nextQuery = KiiQuery.clone(query);
                    nextQuery.setPaginationKey(response.body["nextPaginationKey"]);
                }
                // Fix issue https://github.com/KiiCorp/JavascriptStorageSDK/issues/747
                return [query, resultset, nextQuery];
            }
            else {
                throw parseErrorResponse(request, response, this, null);
            }
        });
    }
    /**
     * Execute count aggregation of specified query on current bucket.
     * Query that passed as nextQuery in success callback of {@link executeQuery}, is not
     * supported, callbacks.failure will be fired in this case.
     * @param query query to be executed. If null, the operation will be same as {@link count}.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is Array instance.
     *       <ul>
     *         <li>params[0] is a KiiBucket instance which this method was called on.</li>
     *         <li>params[1] is a KiiQuery instance.</li>
     *         <li>params[2] is an integer count result. </li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiBucket instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let bucket = . . .; // a KiiBucket
     * let queryObject = . . .; // a KiiQuery
     *
     * bucket.countWithQuery(queryObject, callbacks).then(params => {
     *   let bucket = params[0];
     *   let query = params[1];
     *   let count = params[2];
     *   // do something with the results
     * }).catch(error => {
     *   let bucket = error.target;
     *   let errorString = error.message;
     *   // error happened.
     * });
     * ```
     */
    countWithQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.getPath()}/query`;
            const body = query == null ? KiiQuery.queryWithClause(null).toDict() : query.toDict();
            body.bucketQuery.aggregations = [
                { type: "COUNT", putAggregationInto: "count_field" },
            ];
            if (query === null || query === void 0 ? void 0 : query.getPaginationKey()) {
                body.paginationKey = query.getPaginationKey();
            }
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.QueryRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if (isSuccess(response.status)) {
                const resultCount = response.body["aggregations"]["count_field"];
                // Fix issue https://github.com/KiiCorp/JavascriptStorageSDK/issues/747
                return [this, query, resultCount];
            }
            else {
                throw parseErrorResponse(request, response, this, null);
            }
        });
    }
    /**
     * Execute count aggregation of all clause query on current bucket.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is Array instance.
     *       <ul>
     *         <li>params[0] is a KiiBucket instance which this method was called on.</li>
     *         <li>params[1] is a KiiQuery instance.</li>
     *         <li>params[2] is an integer count result. </li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiBucket instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let bucket = . . .; // a KiiBucket
     * let queryObject = . . .; // a KiiQuery
     *
     * bucket.count().then(params => {
     *   let bucket = params[0];
     *   let query = params[1];
     *   let count = params[2];
     *   // do something with the results
     * }).catch(error => {
     *   let bucket = error.target;
     *   let errorString = error.message;
     *   // error happened.
     * });
     * ```
     */
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.countWithQuery(KiiQuery.queryWithClause(null));
        });
    }
    /**
     * Delete the given bucket from the server
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function:
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiBucket instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let bucket = . . .; // a KiiBucket
     * bucket.delete().then(() => {
     *   // do something with the result
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.getPath()}`;
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if (isSuccess(response.status)) {
                // OK
                return;
            }
            else {
                throw parseErrorResponse(request, response, this, null);
            }
        });
    }
}
/**
 * Represents a encrypted KiiBucket object
 */
export class KiiEncryptedBucket extends KiiBucket {
    /**
     * @hidden
     * @inheritdoc
     */
    constructor(bucketName, parent, app) {
        super(bucketName, parent, app);
    }
    /** @hidden */
    getQualifiedBucketName() {
        return "CRYPTO:" + this.bucketName;
    }
}
