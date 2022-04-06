var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KiiApplication } from "./app";
import { KiiThing } from "./thing";
import { InvalidArgumentException } from "./exception";
import { error } from "./utilities";
export class KiiThingQuery {
    /** @hidden */
    constructor(owner, groups = null) {
        this.owner = null;
        this.groups = null;
        this.limit = 0;
        this.thingType = undefined;
        this.paginationKey = "";
        if (!owner && (!groups || groups.length == 0)) {
            throw new InvalidArgumentException("Both the owner and groups parameter are optional, but at least one of them must be supplied.", undefined);
        }
        this.owner = owner;
        this.groups = groups;
        this.limit = 0;
    }
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
    static thingQuery(owner, groups = null) {
        return new KiiThingQuery(owner, groups);
    }
    /**
     * Set the limit of the given query
     * @param limit The maximum number of items obtained in one request.<br>
     * If specified limit is <= 0, 0 will be applied.
     * This limit behaves in a best effort way. Actual number of returned result
     * can be smaller than the requested number.<br>
     * If the specified limit is greater than the limit of the server or limit is
     * set to 0, limit defined in server will be applied.
     */
    setLimit(limit) {
        if (limit > 0) {
            this.limit = limit;
        }
        else {
            this.limit = 0;
        }
    }
    /**
     * Get the limit of the current query
     * @returns {Number}
     */
    getLimit() {
        return this.limit;
    }
    /**
     * Set the thing type to filter the results.
     * @param thingType Thing type
     */
    setThingType(thingType) {
        this.thingType = thingType;
    }
    /**
     * Get the thing type
     * @returns {String}
     */
    getThingType() {
        return this.thingType;
    }
    /**
     * Set the pagination key.
     * @param paginationKey Pagination key
     */
    setPaginationKey(paginationKey) {
        this.paginationKey = paginationKey;
    }
    /**
     * Get the pagination key.
     * @returns {String}
     */
    getPaginationKey() {
        return this.paginationKey;
    }
    /** @hidden */
    clone() {
        const clone = new KiiThingQuery(KiiThingQuery.clone(this.owner), KiiThingQuery.clone(this.groups));
        clone.limit = this.limit;
        clone.thingType = this.thingType;
        clone.paginationKey = this.paginationKey;
        return clone;
    }
    /** @hidden */
    static clone(obj) {
        if (!obj || typeof obj !== "object" || obj instanceof KiiApplication) {
            return obj;
        }
        const newInstance = new obj.constructor();
        for (const key in obj) {
            newInstance[key] = this.clone(obj[key]);
        }
        return newInstance;
    }
    /** @hidden */
    dictValue() {
        const query = {};
        if (this.limit && this.limit > 0) {
            query.bestEffortLimit = this.limit;
        }
        if (this.paginationKey) {
            query.paginationKey = this.paginationKey;
        }
        const ownerClauses = [];
        if (this.owner) {
            const userOwnerClause = {
                type: "contains",
                field: "userOwners",
                value: this.owner.getID(),
            };
            ownerClauses.push(userOwnerClause);
        }
        if (this.groups && this.groups.length > 0) {
            for (const groupOwner of this.groups) {
                const groupOwnerClause = {
                    type: "contains",
                    field: "groupOwners",
                    value: groupOwner.getID(),
                };
                ownerClauses.push(groupOwnerClause);
            }
        }
        let ownerClause;
        if (ownerClauses.length == 0) {
            throw new InvalidArgumentException("Query clause must include the 'contains' clause.", this);
        }
        else if (ownerClauses.length == 1) {
            ownerClause = ownerClauses[0];
        }
        else {
            ownerClause = {
                type: "or",
                clauses: ownerClauses,
            };
        }
        let thingQuery;
        if (this.thingType !== null && this.thingType !== undefined) {
            thingQuery = {
                clause: {
                    type: "and",
                    clauses: [
                        {
                            type: "eq",
                            field: "_thingType",
                            value: this.thingType,
                        },
                        ownerClause,
                    ],
                },
            };
        }
        else {
            thingQuery = { clause: ownerClause };
        }
        query.thingQuery = thingQuery;
        return query;
    }
}
/**
 * @class Represents a KiiThingQueryResult object
 */
export class KiiThingQueryResult {
    /** @hidden */
    constructor(query, results, paginationKey) {
        this.query = query;
        this.results = results;
        this.paginationKey = paginationKey;
    }
    /**
     * Get the list of KiiThing that matches the query
     * @returns {Array} An array of KiiThing objects
     */
    getResult() {
        return this.results;
    }
    /**
     * When there are many result of query or data in result is large, Query result would be divided into several pages.
     * @returns {Boolean} true if there are pending result of the Query to be retrieved.
     */
    hasNext() {
        return !!this.paginationKey;
    }
    /**
     * Get the KiiThingQuery to get next page of the result.
     * @returns {KiiThingQuery} KiiThingQuery to get next page of the query. null when this result is the last part of the query.
     */
    getNextKiiThingQuery() {
        if (!this.hasNext()) {
            return null;
        }
        const nextQuery = this.query.clone();
        nextQuery.setPaginationKey(this.paginationKey);
        return nextQuery;
    }
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
    getNextResult() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasNext()) {
                const message = "No more pages to fetch";
                throw error(message, this);
            }
            const nextQuery = this.getNextKiiThingQuery();
            if (!nextQuery) {
                const message = "No more pages to fetch";
                throw error(message, this);
            }
            return KiiThing.executeQuery(nextQuery);
        });
    }
}
