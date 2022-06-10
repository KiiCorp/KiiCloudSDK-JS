import { KiiGeoPoint } from ".";
import { InvalidArgumentException } from "./exception";
/**
 * Represents a KiiQuery object
 */
export class KiiQuery {
    /** @hidden */
    constructor() {
        this.clause = undefined;
        this.paginationKey = "";
        this.limit = 0;
        this.sortField = undefined;
        this.sortDescending = undefined;
    }
    /** @hidden */
    static clone(query) {
        const newQuery = new KiiQuery();
        newQuery.clause = query.clause;
        newQuery.limit = query.limit;
        newQuery.sortField = query.sortField;
        newQuery.sortDescending = query.sortDescending;
        return newQuery;
    }
    /** @hidden */
    getPaginationKey() {
        return this.paginationKey;
    }
    /** @hidden */
    setPaginationKey(key) {
        this.paginationKey = key;
    }
    setClause(clause) {
        this.clause = clause;
    }
    /**
     * Get the limit of the current query
     */
    getLimit() {
        return this.limit;
    }
    /**
     * setLimit
     * @param limit The desired limit. Must be an integer > 0
     */
    setLimit(limit) {
        this.limit = limit;
    }
    /** @hidden */
    toDict() {
        const data = {};
        const bucketQuery = {};
        if (this.paginationKey) {
            data["paginationKey"] = this.paginationKey;
        }
        if (this.limit > 0) {
            data["bestEffortLimit"] = this.limit;
        }
        if (this.sortDescending !== undefined) {
            bucketQuery["descending"] = this.sortDescending;
        }
        if (this.clause === undefined) {
            bucketQuery["clause"] = { type: "all" };
        }
        else {
            bucketQuery["clause"] = this.clause.toDict();
        }
        if (this.sortField !== undefined) {
            bucketQuery["orderBy"] = this.sortField;
        }
        data["bucketQuery"] = bucketQuery;
        return data;
    }
    /**
     * Create a KiiQuery object based on a KiiClause
     *
     * By passing null as the ‘clause’ parameter, all objects can be retrieved.
     * @param clause The KiiClause to be executed with the query
     */
    static queryWithClause(clause) {
        const query = new KiiQuery();
        if (clause == null) {
            // query.setClause(KiiClause.all());
        }
        else {
            query.setClause(clause);
        }
        return query;
    }
    /**
     * Set the query to sort by a field in descending order
     * If a sort has already been set, it will be overwritten.
     * @param field The key that should be used to sort
     */
    sortByDesc(field) {
        this.sortField = field;
        this.sortDescending = true;
    }
    /**
     * Set the query to sort by a field in ascending order
     * If a sort has already been set, it will be overwritten.
     * @param field The key that should be used to sort
     */
    sortByAsc(field) {
        this.sortField = field;
        this.sortDescending = false;
    }
}
/**
 * Represents a KiiClause expression object
 */
export class KiiClause {
    constructor() {
        this.whereClauses = [];
        this.whereType = "";
    }
    /** @hidden */
    toDict() {
        let retDict = null;
        if (this.whereClauses.length > 0) {
            if (this.whereType.length > 0) {
                if (this.whereClauses.length === 1) {
                    const clause = this.whereClauses[0];
                    if (this.whereType === "not") {
                        retDict = { type: "not", clause: clause.toDict() };
                    }
                    else {
                        retDict = clause.toDict();
                    }
                }
                else {
                    const clauses = [];
                    this.whereClauses.forEach((clause) => {
                        clauses.push(clause.toDict());
                    });
                    retDict = { type: this.whereType, clauses: clauses };
                }
            }
            else {
                retDict = this.whereClauses[0].toDict();
            }
        }
        else if (this.dictExpression) {
            retDict = this.dictExpression;
        }
        if (!retDict) {
            retDict = { type: "all" };
        }
        return retDict;
    }
    /** @hidden */
    setWhereType(whereType) {
        this.whereType = whereType;
    }
    /** @hidden */
    setWhereClauses(whereClauses) {
        this.whereClauses = whereClauses;
    }
    /** @hidden */
    setDictValue(dictExpression) {
        this.dictExpression = dictExpression;
    }
    /** @hidden */
    getWhereType() {
        return this.whereType;
    }
    /** @hidden */
    static createWithWhere(whereType, whereClauses) {
        const expression = new KiiClause();
        expression.setWhereType(whereType);
        expression.setWhereClauses(whereClauses);
        return expression;
    }
    /** @hidden */
    static create(operator, key, value) {
        const expression = new KiiClause();
        let dict = {};
        if (operator === "=") {
            dict.type = "eq";
            dict.field = key;
            dict.value = value;
        }
        else if (operator === "<") {
            dict.type = "range";
            dict.field = key;
            dict.upperLimit = value;
            dict.upperIncluded = false;
        }
        else if (operator === "<=") {
            dict.type = "range";
            dict.field = key;
            dict.upperLimit = value;
            dict.upperIncluded = true;
        }
        else if (operator === ">") {
            dict.type = "range";
            dict.field = key;
            dict.lowerLimit = value;
            dict.lowerIncluded = false;
        }
        else if (operator === ">=") {
            dict.type = "range";
            dict.field = key;
            dict.lowerLimit = value;
            dict.lowerIncluded = true;
        }
        else if (operator === "in") {
            dict.type = "in";
            dict.field = key;
            dict.values = value;
        }
        else if (operator === "prefix") {
            dict.type = "prefix";
            dict.field = key;
            dict.prefix = value;
        }
        else if (operator === "hasField") {
            dict.type = "hasField";
            dict.field = key;
            dict.fieldType = value;
        }
        expression.setDictValue(dict);
        return expression;
    }
    /** @hidden (maybe not needed) */
    static all() {
        return new KiiClause();
    }
    /**
     * Create a KiiClause with the AND operator concatenating multiple KiiClause objects
     * @param clauses A variable-length list of KiiClause objects to concatenate
     */
    static and(...clauses) {
        return this.createWithWhere("and", clauses);
    }
    /**
     * Create a KiiClause with the OR operator concatenating multiple KiiClause objects
     *
     * <b>Note:</b>
     * Query performance will be worse as the number of objects in bucket increases, so we recommend you avoid the OR clause if possible.
     * @param clauses A variable-length list of KiiClause objects to concatenate
     */
    static or(...clauses) {
        return this.createWithWhere("or", clauses);
    }
    /**
     * Create a KiiClause with the NOT operator concatenating a KiiClause object
     *
     * <b>Note:</b>
     * Query performance will be worse as the number of objects in bucket increases, so we recommend you avoid the NOT clause if possible.
     * @param clause KiiClause object to negate
     */
    static not(clause) {
        return this.createWithWhere("not", [clause]);
    }
    /**
     * Create an expression of the form (key == value)
     * @param key The key to compare
     * @param value The key to compare
     */
    static equals(key, value) {
        if (value.className) {
            value = value.ObjectURI;
        }
        return KiiClause.create("=", key, value);
    }
    /**
     * Create an expression of the form (key != value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static notEquals(key, value) {
        if (value.className) {
            value = value.ObjectURI;
        }
        return this.createWithWhere("not", [KiiClause.equals(key, value)]);
    }
    /**
     * Create an expression of the form (key > value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static greaterThan(key, value) {
        return KiiClause.create(">", key, value);
    }
    /**
     * Create an expression of the form (key >= value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static greaterThanOrEqual(key, value) {
        return KiiClause.create(">=", key, value);
    }
    /**
     * Create an expression of the form (key < value)
     * @param key The key to compare
     * @param value The key to compare
     */
    static lessThan(key, value) {
        return KiiClause.create("<", key, value);
    }
    /**
     * Create an expression of the form (key <= value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static lessThanOrEqual(key, value) {
        return KiiClause.create("<=", key, value);
    }
    /**
     * Create an expression of the form (key in values)
     * @param key The key to compare
     * @param values to be compared with.
     */
    static in(key, values) {
        return KiiClause.create("in", key, values);
    }
    /**
     * Create an expression of the form (key in values)
     * @param key The key to compare
     * @param values to be compared with.
     */
    static inClause(key, values) {
        return KiiClause.create("in", key, values);
    }
    /**
     * Create an expression of the form (key STARTS WITH value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static startsWith(key, value) {
        return KiiClause.create("prefix", key, value);
    }
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
    static geoDistance(key, center, radius, putDistanceInto) {
        const isValidString = (key) => {
            return typeof key === "string" && key.length > 0;
        };
        const isValidGeoPoint = (point) => {
            if (!point) {
                return false;
            }
            return point instanceof KiiGeoPoint;
        };
        if (!isValidString(key)) {
            throw new InvalidArgumentException("Specified key is not a string or is an empty string.", undefined);
        }
        if (!isValidGeoPoint(center)) {
            throw new InvalidArgumentException("center is not a reference of KiiGeoPoint.", undefined);
        }
        const pattern = "^[a-zA-Z_][a-zA-Z0-9_]*$";
        if (putDistanceInto && pattern.match(putDistanceInto) !== null) {
            throw new InvalidArgumentException("putDistanceInto is invalid.", undefined);
        }
        if (putDistanceInto === "") {
            throw new InvalidArgumentException("putDistanceInto is invalid.", undefined);
        }
        if (isNaN(radius) || radius <= 0 || radius > 20000000) {
            throw new InvalidArgumentException("radius is invalid.", undefined);
        }
        const expression = new KiiClause();
        let dict = {};
        dict.type = "geodistance";
        dict.field = key;
        center = center.toObject();
        dict.center = center;
        dict.radius = radius;
        dict.putDistanceInto = putDistanceInto;
        expression.setDictValue(dict);
        return expression;
    }
    /**
     * Create a clause of geo box. This clause inquires objects in the specified rectangle.
     * Rectangle would be placed parallel to the equator with specified coordinates of the corner.
     * @param key Key to inquire which holds geo point.
     * @param northEast North-Eest corner of the rectangle.
     * @param southWest South-Wast corner of the rectangle.
     */
    static geoBox(key, northEast, southWest) {
        const isValidKey = (key) => {
            return typeof key === "string" && key.length > 0;
        };
        const isValidGeoPoint = (point) => {
            if (!point) {
                return false;
            }
            return point instanceof KiiGeoPoint;
        };
        if (!isValidKey(key)) {
            throw new InvalidArgumentException("Specified key is not a string or is an empty string.", undefined);
        }
        if (!isValidGeoPoint(northEast) || !isValidGeoPoint(southWest)) {
            throw new InvalidArgumentException("northEast or southWest is not a reference of KiiGeoPoint.", undefined);
        }
        const expression = new KiiClause();
        let dict = {};
        dict.type = "geobox";
        dict.field = key;
        const ne = northEast.toObject();
        const sw = southWest.toObject();
        dict.box = {
            ne: ne,
            sw: sw,
        };
        expression.setDictValue(dict);
        return expression;
    }
    /**
     * Create an expression to returns all entities that have a specified field and type.
     * @param key name of the specified field.
     * @param fieldType The type of the content of the field.
     * The type of the content of the field must be provided, possible values are "STRING", "INTEGER", "DECIMAL" and "BOOLEAN".
     */
    static hasField(key, fieldType) {
        if (!["STRING", "INTEGER", "DECIMAL", "BOOLEAN"].includes(fieldType)) {
            throw new InvalidArgumentException("fieldType is invalid.", undefined);
        }
        return KiiClause.create("hasField", key, fieldType);
    }
}
