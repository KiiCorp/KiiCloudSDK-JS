import { KiiThing } from "./thing";
import { KiiUser } from "./user";
import { KiiGroup } from "./group";
export declare class KiiThingQuery {
    private owner;
    private groups;
    private limit;
    private thingType;
    private paginationKey;
    /** @hidden */
    constructor(owner: KiiUser | null, groups?: KiiGroup[] | null);
    /**
     * Construct KiiThingQuery.<br>
     * Both an owner and groups parameters are optional,
     * but at least one of them must be supplied.
     * @param {KiiUser} [owner] of the thing. The user must be same as
     * Login user or causes unauthorized error.
     * @param {KiiGroup[]} [groups] owns the thing. Login user must belongs
     * to all groups or causes unauthorized error.
     * @throws {InvalidArgumentException}
     * neither an owner nor groups parameters are supplied.
     */
    static thingQuery(owner: KiiUser | null, groups?: KiiGroup[] | null): KiiThingQuery;
    /**
     * Set the limit of the given query
     * @param limit The maximum number of items obtained in one request.<br>
     * If specified limit is <= 0, 0 will be applied.
     * This limit behaves in a best effort way. Actual number of returned result
     * can be smaller than the requested number.<br>
     * If the specified limit is greater than the limit of the server or limit is
     * set to 0, limit defined in server will be applied.
     */
    setLimit(limit: number): void;
    /**
     * Get the limit of the current query
     * @returns {Number}
     */
    getLimit(): number;
    /**
     * Set the thing type to filter the results.
     * @param thingType Thing type
     */
    setThingType(thingType: string): void;
    /**
     * Get the thing type
     * @returns {String}
     */
    getThingType(): string | undefined;
    /**
     * Set the pagination key.
     * @param paginationKey Pagination key
     */
    setPaginationKey(paginationKey: string): void;
    /**
     * Get the pagination key.
     * @returns {String}
     */
    getPaginationKey(): string;
    /** @hidden */
    clone(): KiiThingQuery;
    /** @hidden */
    static clone(obj: any): any;
    /** @hidden */
    dictValue(): any;
}
/**
 * @class Represents a KiiThingQueryResult object
 */
export declare class KiiThingQueryResult {
    private query;
    private results;
    private paginationKey;
    /** @hidden */
    constructor(query: KiiThingQuery, results: KiiThing[], paginationKey: string);
    /**
     * Get the list of KiiThing that matches the query
     * @returns {Array} An array of KiiThing objects
     */
    getResult(): KiiThing[];
    /**
     * When there are many result of query or data in result is large, Query result would be divided into several pages.
     * @returns {Boolean} true if there are pending result of the Query to be retrieved.
     */
    hasNext(): boolean;
    /**
     * Get the KiiThingQuery to get next page of the result.
     * @returns {KiiThingQuery} KiiThingQuery to get next page of the query. null when this result is the last part of the query.
     */
    getNextKiiThingQuery(): null | KiiThingQuery;
    /**
     * Fetch the query result of next page.
     * <br><br>The query will be executed against the server, returning a result set.
     * When the state that #hasNext() is false,
     * method execution is failed and Promise returned by the method is rejected
     * and failure callback is called if the callback is given.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(result). result is KiiThingQueryResult instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    getNextResult(): Promise<KiiThingQueryResult>;
}
