import { KiiApplication } from "./app";
import { KiiBucket } from "./bucket";
import { KiiTopic } from "./topic";
import { KiiUser } from "./user";
import { KiiThing } from "./thing";
/**
 * Represents a KiiPushSubscription.
 */
export declare class KiiPushSubscription {
    private subscriber;
    private app;
    /** @hidden */
    constructor(subscriber: KiiUser | KiiThing, app: KiiApplication);
    /** @hidden */
    getSubscriber(): KiiUser | KiiThing;
    /**
     * Subscribe to bucket or topic.
     * @param target to be subscribed. KiiBucket or KiiTopic instance.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiPushSubscription instance.</li>
     *         <li>params[1] is the instance to subscribe.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiPushSubscription instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let topic = Kii.topicWithName("myAppTopic");
     * let user = KiiUser.getCurrentUser();
     * user.pushSubscription().subscribe(topic).then(params => {
     *   let subscription = params[0];
     *   let topic = params[1];
     *   // Succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    subscribe<T extends KiiBucket | KiiTopic>(target: T): Promise<[KiiPushSubscription, T]>;
    /**
     * Unsubscribe to bucket or topic.
     * @param target to be unsubscribed. KiiBucket or KiiTopic instance.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiPushSubscription instance.</li>
     *         <li>params[1] is the instance to unsubscribe.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiPushSubscription instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let topic = Kii.topicWithName("myAppTopic");
     * let user = KiiUser.getCurrentUser();
     * user.pushSubscription().unsubscribe(topic).then(params => {
     *   let subscription = params[0];
     *   let topic = params[1];
     *   // Succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    unsubscribe<T extends KiiBucket | KiiTopic>(target: T): Promise<[KiiPushSubscription, T]>;
    /**
     * Check subscription of bucket, topic.
     * @param target to check subscription. KiiBucket or KiiTopic instance.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiPushSubscription instance.</li>
     *         <li>params[1] is the instance to subscribe.</li>
     *         <li>params[2] is Boolean value. true if subscirbed, otherwise false.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiPushSubscription instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let topic = Kii.topicWithName("myAppTopic");
     * let user = KiiUser.getCurrentUser();
     * user.pushSubscription().isSubscribed(topic).then(params => {
     *   // Succeeded.
     *   let subscription = params[0];
     *   let topic = params[1];
     *   let isSubscribed = params[2];
     *   if (isSubscribed) {
     *     // The topic is subscribed by current user.
     *   } else {
     *     // The topic is not subscribed by current user.
     *   }
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    isSubscribed<T extends KiiBucket | KiiTopic>(target: T): Promise<[KiiPushSubscription, T, boolean]>;
    /**
     * Get request uri
     */
    private getRequestHTTPURI;
}
/**
 * Represents a KiiPushInstallation object
 */
export declare class KiiPushInstallation {
    private user;
    private app;
    /** @hidden */
    constructor(user: KiiUser | null, app: KiiApplication);
    /**
     * Register the id issued by GCM to the Kii cloud for current logged in user.
     * @param installationRegistrationID The ID of registration that identifies the installation externally.
     * @param development Indicates if the installation is for development or production environment.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(response).
     *       <ul>
     *         <li>response.installationID is ID of the installation in the platform.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    installGcm(installationRegistrationID: string, development: boolean): Promise<KiiPushInstallationResponse>;
    /**
     * Register the id issued by APNS to the Kii cloud for current logged in user.
     * @param deviceToken The ID of registration that identifies the installation externally.
     * @param development Indicates if the installation is for development or production environment.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(response).
     *       <ul>
     *         <li>response.installationID is ID of the installation in the platform.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    installApns(deviceToken: string, development: boolean): Promise<KiiPushInstallationResponse>;
    /**
     * Register a MQTT installation to the Kii cloud for current logged in user.
     * @param development Indicates if the installation is for development or production environment.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(response).
     *       <ul>
     *         <li>response.installationID is ID of the installation in the platform.</li>
     *         <li>response.installationRegistrationID is ID of registration that identifies the installation externally.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    installMqtt(development: boolean): Promise<KiiPushInstallationResponse>;
    /**
     * Get MQTT endpoint.<br/>
     * If the MQTT endpoint is not ready, this method retries request up to three times.
     * <br/><br/>
     * Note that only MQTT over tls is supported currently.<br>
     * Don't use portSSL, portWS or portWSS until we support it.
     * @param installationID The ID of the installation in the platform.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(response).
     *       <ul>
     *         <li>response.installationID is ID of the installation in the platform.</li>
     *         <li>response.username is username to use for connecting to the MQTT broker.</li>
     *         <li>response.password is assword to use for connecting to the MQTT broker.</li>
     *         <li>response.mqttTopic is topic to subscribe in the MQTT broker.</li>
     *         <li>response.host is hostname of the MQTT broker.</li>
     *         <li>response.X-MQTT-TTL is the amount of time in seconds that specifies how long the mqttTopic will be valid, after that the client needs to request new MQTT endpoint info.</li>
     *         <li>response.portTCP is port to connect using plain TCP.</li>
     *         <li>response.portSSL is port to connect using SSL/TLS.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiPushSubscription instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    getMqttEndpoint(installationID: string): Promise<MQTTEndpointResponse>;
    /**
     * Unregister the push settings by the id(issued by push provider) that is used for installation.
     * @param installationRegistrationID The ID of registration that identifies the installation externally.
     * @param deviceType The type of the installation.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function().</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiPushSubscription instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    uninstall(installationRegistrationID: string, deviceType: DeviceType): Promise<void>;
    private validateDeviceType;
    /**
     * Unregister the push settings by the id(issued by KiiCloud) that is used for installation.
     * @param installationID The ID of the installation issued by KiiCloud.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function().</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiPushSubscription instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    uninstallByInstallationID(installationID: string): Promise<void>;
    private install;
}
export declare type DeviceType = "ANDROID" | "IOS" | "MQTT";
export interface KiiPushInstallationRequestBody {
    installationRegistrationID?: string;
    deviceType: DeviceType;
    userID?: string;
    thingID?: string;
    development?: boolean;
}
export interface KiiPushInstallationResponse {
    InstallationID: string;
    installationRegistrationID: string;
}
export interface MQTTEndpointResponse {
    installationID: string;
    username: string;
    password: string;
    mqttTopic: string;
    host: string;
    portSSL: number;
    portTCP: number;
    "X-MQTT-TTL": number;
}
