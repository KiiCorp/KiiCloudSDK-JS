"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KiiGeoPoint = void 0;
/**
 * Represents Geo Point.
 */
const exception_1 = require("./exception");
class KiiGeoPoint {
    constructor(latitude, longitute) {
        this.latitude = latitude;
        this.longitute = longitute;
    }
    /**
     * Return the latitide of this point.
     */
    getLatitude() {
        return this.latitude;
    }
    /**
     * Return the longitude of this point.
     */
    getLongitude() {
        return this.longitute;
    }
    /** @hidden */
    toObject() {
        return {
            _type: "point",
            lat: this.latitude,
            lon: this.longitute,
        };
    }
    /**
     * Create a geo point with the given latitude and longitude.
     * @param latitude Latitude of the point in degrees. Valid if the value is greater than -90 degrees and less than +90 degrees.
     * @param longitude Longitude of the point in degrees. Valid if the value is greater than -180 degrees and less than +180 degrees.
     * @example
     * ```typescript
     * let point = KiiGeoPoint.geoPoint(35.07, 139.02);
     * ```
     */
    static geoPoint(latitude, longitude) {
        const inRange = (min, max, num) => {
            return !isNaN(num) && num > min && num < max;
        };
        if (!inRange(-90, 90, latitude) || !inRange(-180, 180, longitude)) {
            console.log("NOT IN RANGE");
            throw new exception_1.InvalidArgumentException("Specified latitide or longitude is invalid", undefined);
        }
        return new KiiGeoPoint(latitude, longitude);
    }
    /** @hidden */
    static fromObject(point) {
        // if (point["_type"] !== "point") {
        //   return undefined;
        // }
        const lat = point["lat"];
        const lon = point["lon"];
        if (lat === undefined || lon === undefined) {
            return undefined;
        }
        return KiiGeoPoint.geoPoint(lat, lon);
    }
}
exports.KiiGeoPoint = KiiGeoPoint;
