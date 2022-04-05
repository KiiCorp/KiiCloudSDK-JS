export declare class KiiGeoPoint {
    private latitude;
    private longitute;
    constructor(latitude: number, longitute: number);
    /**
     * Return the latitide of this point.
     */
    getLatitude(): number;
    /**
     * Return the longitude of this point.
     */
    getLongitude(): number;
    /** @hidden */
    toObject(): any;
    /**
     * Create a geo point with the given latitude and longitude.
     * @param latitude Latitude of the point in degrees. Valid if the value is greater than -90 degrees and less than +90 degrees.
     * @param longitude Longitude of the point in degrees. Valid if the value is greater than -180 degrees and less than +180 degrees.
     * @example
     * ```typescript
     * let point = KiiGeoPoint.geoPoint(35.07, 139.02);
     * ```
     */
    static geoPoint(latitude: number, longitude: number): KiiGeoPoint;
    /** @hidden */
    static fromObject(point: any): KiiGeoPoint | undefined;
}
