import { KiiGeoPoint } from ".";
/**
 * Represents a KiiQuery object
 */
export declare class KiiQuery {
    private clause;
    private paginationKey;
    private limit;
    private sortField;
    private sortDescending;
    /** @hidden */
    constructor();
    /** @hidden */
    static clone(query: KiiQuery): KiiQuery;
    /** @hidden */
    getPaginationKey(): string;
    /** @hidden */
    setPaginationKey(key: string): void;
    private setClause;
    /**
     * Get the limit of the current query
     */
    getLimit(): number;
    /**
     * setLimit
     * @param limit The desired limit. Must be an integer > 0
     */
    setLimit(limit: number): void;
    /** @hidden */
    toDict(): any;
    /**
     * Create a KiiQuery object based on a KiiClause
     *
     * By passing null as the ‘clause’ parameter, all objects can be retrieved.
     * @param clause The KiiClause to be executed with the query
     */
    static queryWithClause(clause: KiiClause | null): KiiQuery;
    /**
     * Set the query to sort by a field in descending order
     * If a sort has already been set, it will be overwritten.
     * @param field The key that should be used to sort
     */
    sortByDesc(field: string): void;
    /**
     * Set the query to sort by a field in ascending order
     * If a sort has already been set, it will be overwritten.
     * @param field The key that should be used to sort
     */
    sortByAsc(field: string): void;
}
/**
 * Represents a KiiClause expression object
 */
export declare class KiiClause {
    private whereClauses;
    private dictExpression?;
    private whereType;
    private constructor();
    /** @hidden */
    toDict(): Object;
    /** @hidden */
    setWhereType(whereType: string): void;
    /** @hidden */
    setWhereClauses(whereClauses: Array<KiiClause>): void;
    /** @hidden */
    setDictValue(dictExpression: Object): void;
    /** @hidden */
    getWhereType(): string;
    /** @hidden */
    static createWithWhere(whereType: string, whereClauses: Array<KiiClause>): KiiClause;
    /** @hidden */
    static create(operator: string, key: string, value: any): KiiClause;
    /** @hidden (maybe not needed) */
    static all(): KiiClause;
    /**
     * Create a KiiClause with the AND operator concatenating multiple KiiClause objects
     * @param clauses A variable-length list of KiiClause objects to concatenate
     */
    static and(...clauses: KiiClause[]): KiiClause;
    /**
     * Create a KiiClause with the OR operator concatenating multiple KiiClause objects
     *
     * <b>Note:</b>
     * Query performance will be worse as the number of objects in bucket increases, so we recommend you avoid the OR clause if possible.
     * @param clauses A variable-length list of KiiClause objects to concatenate
     */
    static or(...clauses: KiiClause[]): KiiClause;
    /**
     * Create a KiiClause with the NOT operator concatenating a KiiClause object
     *
     * <b>Note:</b>
     * Query performance will be worse as the number of objects in bucket increases, so we recommend you avoid the NOT clause if possible.
     * @param clause KiiClause object to negate
     */
    static not(clause: KiiClause): KiiClause;
    /**
     * Create an expression of the form (key == value)
     * @param key The key to compare
     * @param value The key to compare
     */
    static equals(key: string, value: any): KiiClause;
    /**
     * Create an expression of the form (key != value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static notEquals(key: string, value: any): KiiClause;
    /**
     * Create an expression of the form (key > value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static greaterThan(key: string, value: any): KiiClause;
    /**
     * Create an expression of the form (key >= value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static greaterThanOrEqual(key: string, value: any): KiiClause;
    /**
     * Create an expression of the form (key < value)
     * @param key The key to compare
     * @param value The key to compare
     */
    static lessThan(key: string, value: any): KiiClause;
    /**
     * Create an expression of the form (key <= value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static lessThanOrEqual(key: string, value: any): KiiClause;
    /**
     * Create an expression of the form (key in values)
     * @param key The key to compare
     * @param values to be compared with.
     */
    static in(key: string, values: any[]): KiiClause;
    /**
     * Create an expression of the form (key in values)
     * @param key The key to compare
     * @param values to be compared with.
     */
    static inClause(key: string, values: any[]): KiiClause;
    /**
     * Create an expression of the form (key STARTS WITH value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static startsWith(key: string, value: string): KiiClause;
    /**
     * Create a clause of geo distance. This clause inquires objects in the specified circle.
     * @param key Name of the key to inquire, which holds geo point.
     * @param center Geo point which specify center of the circle.
     * @param radius Radius of the circle. unit is meter. value should be in range of ]0, 20000000]
     * @param putDistanceInto Used for retrieve distance from the center from the query result.Must match the pattern "^[a-zA-Z_][a-zA-Z0-9_]*$".
     * If the specified value is null, query result will not contain the distance.
     * <b>Note:</b> You can get the results in ascending order of distances from center. To do so, build the orderBy field  by
     * "_calculated.{specified value of putDistanceInto}" and pass it in {@link KiiQuery.sortByAsc}. Note that, descending order
     * of distances is not supported. The unit of distance is meter.
     */
    static geoDistance(key: string, center: KiiGeoPoint, radius: number, putDistanceInto: string): KiiClause;
    /**
     * Create a clause of geo box. This clause inquires objects in the specified rectangle.
     * Rectangle would be placed parallel to the equator with specified coordinates of the corner.
     * @param key Key to inquire which holds geo point.
     * @param northEast North-Eest corner of the rectangle.
     * @param southWest South-Wast corner of the rectangle.
     */
    static geoBox(key: string, northEast: KiiGeoPoint, southWest: KiiGeoPoint): KiiClause;
    /**
     * Create an expression to returns all entities that have a specified field and type.
     * @param key name of the specified field.
     * @param fieldType The type of the content of the field.
     * The type of the content of the field must be provided, possible values are "STRING", "INTEGER", "DECIMAL" and "BOOLEAN".
     */
    static hasField(key: string, fieldType: string): KiiClause;
}
