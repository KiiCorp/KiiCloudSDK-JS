import { KiiACL } from ".";
import { KiiApplication } from "./app";
import { KiiObject } from "./object";
import { KiiQuery } from "./query";
import { KiiGroup } from "./group";
import { KiiUser } from "./user";
import { KiiThing } from "./thing";
export interface IBucketOwner {
    getPath(): string;
}
/**
 * Represents a KiiBucket object
 */
export declare class KiiBucket {
    protected bucketName: string;
    private parent;
    private app;
    /**
     * @hidden
     * @throws {InvalidArgumentException} when bucketName is invalid.
     */
    constructor(bucketName: string, parent: IBucketOwner | null, app: KiiApplication);
    private parentIs;
    /** @hidden */
    getUser(): KiiUser | undefined;
    /** @hidden */
    getGroup(): KiiGroup | undefined;
    /** @hidden */
    getThing(): KiiThing | undefined;
    /** @hidden */
    getParent(): KiiUser | KiiGroup | KiiThing | undefined;
    /**
     * The name of this bucket
     * @returns name
     */
    getBucketName(): string;
    /** @hidden */
    protected getQualifiedBucketName(): string;
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
    createObject(): KiiObject;
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
    createObjectWithType(type: string): KiiObject;
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
    createObjectWithID(objectID: string): KiiObject;
    /** @hidden */
    getPath(): string;
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
    acl(): KiiACL;
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
    executeQuery(query: KiiQuery): Promise<[KiiQuery, KiiObject[], KiiQuery | null]>;
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
    countWithQuery(query: KiiQuery | null): Promise<[KiiBucket, KiiQuery | null, number]>;
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
    count(): Promise<[KiiBucket, KiiQuery | null, number]>;
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
    delete(): Promise<void>;
}
/**
 * Represents a encrypted KiiBucket object
 */
export declare class KiiEncryptedBucket extends KiiBucket {
    /**
     * @hidden
     * @inheritdoc
     */
    constructor(bucketName: string, parent: IBucketOwner | null, app: KiiApplication);
    /** @hidden */
    protected getQualifiedBucketName(): string;
}
export interface IKiiQueryResult {
    results: KiiObject[];
    query: KiiQuery;
    nextQuery: KiiQuery | null;
}
