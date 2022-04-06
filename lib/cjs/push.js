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
exports.KiiPushInstallation = exports.KiiPushSubscription = void 0;
const bucket_1 = require("./bucket");
const topic_1 = require("./topic");
const user_1 = require("./user");
const exception_1 = require("./exception");
const httpResponse_1 = require("./httpResponse");
const thing_1 = require("./thing");
const utilities_1 = require("./utilities");
/**
 * Represents a KiiPushSubscription.
 */
class KiiPushSubscription {
    /** @hidden */
    constructor(subscriber, app) {
        this.subscriber = subscriber;
        this.app = app;
    }
    /** @hidden */
    getSubscriber() {
        return this.subscriber;
    }
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
    subscribe(target) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getRequestHTTPURI(target);
            const request = this.app.newRequest("PUT", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                return [this, target];
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    unsubscribe(target) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getRequestHTTPURI(target);
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                return [this, target];
            }
            else {
                throw exception_1.parseErrorResponse(request, response, target, null);
            }
        });
    }
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
    isSubscribed(target) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getRequestHTTPURI(target);
            const request = this.app.newRequest("GET", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                return [this, target, true];
            }
            else if (["FILTER_NOT_FOUND", "PUSH_SUBSCRIPTION_NOT_FOUND"].includes(response.body.errorCode)) {
                return [this, target, false];
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
    /**
     * Get request uri
     */
    getRequestHTTPURI(target) {
        let subscriberPath = "";
        if (this.subscriber instanceof user_1.KiiUser) {
            subscriberPath = `users/${this.subscriber.getID()}`;
        }
        if (this.subscriber instanceof thing_1.KiiThing) {
            subscriberPath = `things/${this.subscriber.getThingID()}`;
        }
        if (target instanceof bucket_1.KiiBucket) {
            return `/apps/${this.app.getAppID()}${target.getPath()}/filters/all/push/subscriptions/${subscriberPath}`;
        }
        else if (target instanceof topic_1.KiiTopic) {
            return `/apps/${this.app.getAppID()}${target.getPath()}/push/subscriptions/${subscriberPath}`;
        }
        return "";
    }
}
exports.KiiPushSubscription = KiiPushSubscription;
/**
 * Represents a KiiPushInstallation object
 */
class KiiPushInstallation {
    /** @hidden */
    constructor(user, app) {
        this.user = user;
        this.app = app;
    }
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
    installGcm(installationRegistrationID, development) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utilities_1.isNonEmptyString(installationRegistrationID)) {
                throw utilities_1.error("installationRegistrationID must not be null or empty.", this);
            }
            return this.install(installationRegistrationID, "ANDROID", development);
        });
    }
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
    installApns(deviceToken, development) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utilities_1.isNonEmptyString(deviceToken)) {
                throw utilities_1.error("deviceToken must not be null or empty.", this);
            }
            return this.install(deviceToken, "IOS", development);
        });
    }
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
    installMqtt(development) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.install("", "MQTT", development);
        });
    }
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
    getMqttEndpoint(installationID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utilities_1.isNonEmptyString(installationID)) {
                throw utilities_1.error("installationID must not be null or empty.", this);
            }
            const url = `/apps/${this.app.getAppID()}/installations/${installationID}/mqtt-endpoint`;
            const request = this.app.newRequest("GET", url);
            const recReq = (retry) => {
                return request.send().then((response) => {
                    if (httpResponse_1.isSuccess(response.status)) {
                        return response.body;
                    }
                    else {
                        if (response.status === 503) {
                            if (--retry > 0) {
                                return new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        return resolve(recReq(retry));
                                    }, 1000);
                                });
                            }
                        }
                        throw exception_1.parseErrorResponse(request, response, this, null);
                    }
                });
            };
            return recReq(3);
        });
    }
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
    uninstall(installationRegistrationID, deviceType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utilities_1.isNonEmptyString(installationRegistrationID)) {
                throw utilities_1.error("installationRegistrationID must not be null or empty.", this);
            }
            if (!this.validateDeviceType(deviceType)) {
                throw utilities_1.error(`Unsupported deviceType ${deviceType}`, this);
            }
            const url = `/apps/${this.app.getAppID()}/installations/${deviceType}:${installationRegistrationID}`;
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                return;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
    validateDeviceType(deviceType) {
        return (deviceType === "ANDROID" || deviceType === "MQTT" || deviceType === "IOS");
    }
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
    uninstallByInstallationID(installationID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utilities_1.isNonEmptyString(installationID)) {
                throw utilities_1.error("installationID must not be null or empty.", this);
            }
            const url = `/apps/${this.app.getAppID()}/installations/${installationID}`;
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                return;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
    install(installationRegistrationID, deviceType, development) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof development !== "boolean") {
                throw utilities_1.error("type of development must be boolean.", this);
            }
            const url = `/apps/${this.app.getAppID()}/installations`;
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.InstallationCreationRequest+json");
            const body = {
                development: development,
                deviceType: deviceType,
            };
            if (installationRegistrationID) {
                body.installationRegistrationID = installationRegistrationID;
            }
            const response = yield request.send(JSON.stringify(body));
            if (httpResponse_1.isSuccess(response.status)) {
                return response.body;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
}
exports.KiiPushInstallation = KiiPushInstallation;
