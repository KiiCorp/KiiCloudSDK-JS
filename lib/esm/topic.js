var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { parseErrorResponse } from "./exception";
import { KiiACL } from "./acl";
import { isSuccess } from "./httpResponse";
/**
 * Represents a Topic object.
 */
export class KiiTopic {
    /** @hidden */
    constructor(parentUri, topicName, app) {
        this.parentUri = parentUri;
        this.topicName = topicName;
        this.app = app;
    }
    /**
     * get name of this topic
     * @return {String} name of this topic.
     */
    getName() {
        return this.topicName;
    }
    /**
     * @hidden for acl
     */
    getPath() {
        return `${this.parentUri}/topics/${this.topicName}`;
    }
    /**
     * Checks whether the topic already exists or not.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(existed). true if the topic exists.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiTopic instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume topic is already instantiated.
     * topic.exists().then(existed => {
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    exists() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.parentUri}/topics/${this.topicName}`;
            const request = this.app.newRequest("HEAD", url);
            const response = yield request.send();
            if (isSuccess(response.status)) {
                return true;
            }
            else if (response.status == 404) {
                return false;
            }
            else {
                const e = parseErrorResponse(request, response, this, null);
                e.message = `check topic failed. statusCode: ${response.status}`;
                throw e;
            }
        });
    }
    /**
     * Save this topic on Kii Cloud.
     * Note that only app admin can save application scope topic.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theSavedTopic). theSavedTopic is a KiiTopic instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiTopic instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume topic is already instantiated.
     * topic.save().then(topic => {
     *   // Save topic succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.parentUri}/topics/${this.topicName}`;
            const request = this.app.newRequest("PUT", url);
            const response = yield request.send();
            if (isSuccess(response.status)) {
                return this;
            }
            else {
                throw parseErrorResponse(request, response, this, null);
            }
        });
    }
    /**
     * sendMessage
     * @param message message to be sent.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is the KiiTopic instance which this method was called on.</li>
     *         <li>params[1] is the message object to send.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiTopic instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume topic is already instantiated.
     * let contents = {
     *     message : "hello push!"
     * };
     * let message = new KiiPushMessageBuilder(contents).build();
     * topic.sendMessage(message).then(params => {
     *     // Send message succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.parentUri}/topics/${this.topicName}/push/messages`;
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.SendPushMessageRequest+json");
            const response = yield request.send(JSON.stringify(message));
            if (isSuccess(response.status)) {
                return [this, message];
            }
            else {
                throw parseErrorResponse(request, response, this, null);
            }
        });
    }
    /**
     * Delete the topic.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theDeletedTopic). theDeletedTopic is a KiiTopic instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiTopic instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume topic is already instantiated.
     * topic.deleteTopic().then(topic => {
     *   // Delete topic succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    deleteTopic() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.parentUri}/topics/${this.topicName}`;
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if (isSuccess(response.status)) {
                return this;
            }
            else {
                throw parseErrorResponse(request, response, this, null);
            }
        });
    }
    /**
     * Get ACL object of this topic.
     * Access to topic can be configured by adding/removing KiiACLEntry
     * to/from obtained acl object.
     * @return {KiiACL} acl object of this topic.
     */
    acl() {
        return KiiACL.aclWithParent(this, this.app);
    }
}
/**
 * Builder of push message
 */
export class KiiPushMessageBuilder {
    /**
     * instantiate builder with push message data.
     * By default all push channels (gcm, apns, jpush, mqtt) is enabled.
     * All other properties configured by method of this class won't be set and default
     * value would be applied.
     * Details of properties of message and its default value, please refer to
     * http://documentation.kii.com/rest/#notification_management-leverage__push_to_users__notification-group_scope-send_messages-send_a_push_message_to_the_current_topic
     * @param data sent to all push channels (gcm, apns, jpush, mqtt).
     */
    constructor(data) {
        this.gcm = {
            enabled: true,
        };
        this.apns = {
            enabled: true,
        };
        this.jpush = {
            enabled: true,
        };
        this.mqtt = {
            enabled: true,
        };
        this.sendToDevelopment = false;
        this.sendToProduction = false;
        this.data = data;
    }
    /**
     * build push message.
     * @return {Object} push message object. Can be used in {@link KiiTopic.sendMessage}
     */
    build() {
        const ret = {
            data: this.data,
            gcm: this.gcm,
            apns: this.apns,
            jpush: this.jpush,
            mqtt: this.mqtt,
        };
        if (this.sendToDevelopment) {
            ret.sendToDevelopment = this.sendToDevelopment;
        }
        if (this.sendToProduction) {
            ret.sendToProduction = this.sendToProduction;
        }
        return ret;
    }
    /**
     * Indicate whether send this message to development environment.
     * If this method is not called, true will be applied as default.
     * @param {boolean} flag indicate whether send this message to development env.
     * @return builder instance.
     */
    setSendToDevelopment(flag) {
        this.sendToDevelopment = flag;
        return this;
    }
    /**
     * Indicate whether send this message to production environment.
     * If this method is not called, true will be applied as default.
     * @param {boolean} flag indicate whether send this message to production env.
     * @return {Object} builder instance.
     */
    setSendToProduction(flag) {
        this.sendToProduction = flag;
        return this;
    }
    /**
     * Enable/ Disable message distribution via GCM.
     * If this method is not called, true will be applied as default.
     * @param {boolean} enable flag indicate whether distribute this message to GCM subscribers.
     * @return {Object} builder instance.
     */
    enableGcm(enable) {
        this.gcm.enabled = enable;
        return this;
    }
    /**
     * Enable/ Disable message distribution via APNS.
     * If this method is not called, true will be applied as default.
     * @param {boolean} enable flag indicate whether distribute this message to APNS subscribers.
     * @return {Object} builder instance.
     */
    enableApns(enable) {
        this.apns.enabled = enable;
        return this;
    }
    /**
     * Enable/ Disable message distribution via JPush.
     * If this method is not called, true will be applied as default.
     * @param {boolean} enable flag indicate whether distribute this message to JPush subscribers.
     * @return {Object} builder instance.
     */
    enableJpush(enable) {
        this.jpush.enabled = enable;
        return this;
    }
    /**
     * Enable/ Disable message distribution via MQTT.
     * If this method is not called, true will be applied as default.
     * @param {boolean} enable flag indicate whether distribute this message to MQTT subscribers.
     * @return {Object} builder instance.
     */
    enableMqtt(enable) {
        this.mqtt.enabled = enable;
        return this;
    }
    /**
     * Set specific data for GCM subscribers.
     * If this method is not called, no specific data is not applied
     * and data passed to the constructor would be sent to subscribers.
     * @param {Object} data specific data applied to only GCM subscribers.
     * Contents should be JSON Object with only one-level of nesting,
     * and only strings in values
     * @return {Object} builder instance.
     */
    gcmData(data) {
        this.gcm.data = data;
        return this;
    }
    /**
     * Set collapse_key for GCM subscribers.
     * If this method is not called, no collapse_key is applied.
     * For details please refer to GCM document of collapse_key.
     * @param {String} collapseKey
     * @return {Object} builder instance.
     */
    gcmCollapseKey(collapseKey) {
        this.gcm.collapseKey = collapseKey;
        return this;
    }
    /**
     * Set delay_while_idle for GCM subscribers.
     * If this method is not called, no delay_while_idle is applied.
     * For details please refer to GCM document of delay_while_idle.
     * @param {boolean} delayWhileIdle
     * @return {Object} builder instance.
     */
    gcmDelayWhileIdle(delayWhileIdle) {
        this.gcm.delayWhileIdle = delayWhileIdle;
        return this;
    }
    /**
     * Set time_to_live for GCM subscribers.
     * If this method is not called, no time_to_live is applied.
     * For details please refer to GCM document of time_to_live.
     * @param {Number} timeToLive
     * @return {Object} builder instance.
     */
    gcmTimeToLive(timeToLive) {
        this.gcm.timeToLive = timeToLive;
        return this;
    }
    /**
     * Set restricted_package_name for GCM subscribers.
     * If this method is not called, no restricted_package_name is applied.
     * For details please refer to GCM document of restricted_package_name.
     * @param {String} restrictedPackageName.
     * @return {Object} builder instance.
     */
    gcmRestrictedPackageName(restrictedPackageName) {
        this.gcm.restrictedPackageName = restrictedPackageName;
        return this;
    }
    /**
     * Set specific data for APNS subscribers.
     * If this method is not called, no specific data is not applied
     * and data passed to the constructor would be sent to subscribers.
     * @param {Object} data specific data applied to only APNS subscribers.
     * Contents should be JSON Object with only one-level of nesting,
     * and only strings, integers, booleans or doubles in the values.
     * @return {Object} builder instance.
     */
    apnsData(data) {
        this.apns.data = data;
        return this;
    }
    /**
     * Set alert for APNS subscribers.
     * If this method is not called, no alert is applied.
     * For details please refer to APNS document of alert.
     * @param {Object} alert alert object
     * @return {Object} builder instance.
     */
    apnsAlert(alert) {
        this.apns.alert = alert;
        return this;
    }
    /**
     * Set sound for APNS subscribers.
     * If this method is not called, no sound is applied.
     * For details please refer to APNS document of sound.
     * @param {String} sound
     * @return {Object} builder instance.
     */
    apnsSound(sound) {
        this.apns.sound = sound;
        return this;
    }
    /**
     * Set badge for APNS subscribers.
     * If this method is not called, no badge is applied.
     * For details please refer to APNS document of badge.
     * @param {Number} badge
     * @return {Object} builder instance.
     */
    apnsBadge(badge) {
        this.apns.badge = badge;
        return this;
    }
    /**
     * Set content-available for APNS subscribers.
     * If this method is not called, no content-available is applied.
     * @param {Number} contentAvailable If eqaul or less than 0
     * or this method is not invoked,
     * content-available payload is not delivered.
     * Otherwise, content-available=1 payload is delivered.
     * @return {Object} builder instance.
     */
    apnsContentAvailable(contentAvailable) {
        if (contentAvailable > 0) {
            this.apns.contentAvailable = true;
        }
        else {
            delete this.apns.contentAvailable;
        }
        return this;
    }
    /**
     * Set category for APNS subscribers.
     * If this method is not called, no category is applied.
     * For details please refer to APNS document of category.
     * @param {String} category
     * @return {Object} builder instance.
     */
    apnsCategory(category) {
        this.apns.category = category;
        return this;
    }
    /**
     * Set mutable-content for APNS subscribers.
     * If this method is not called, no mutable-content is applied.
     * @param {Number} mutableContent If equal or less than 0
     * or this method is not invoked,
     * mutable-content payload is not delivered.
     * Otherwise, mutable-content=1 payload is delivered.
     * @return {Object} builder instance.
     */
    apnsMutableContent(mutableContent) {
        if (mutableContent > 0) {
            this.apns.mutableContent = true;
        }
        else {
            delete this.apns.mutableContent;
        }
        return this;
    }
    /**
     * Set specific data for JPush subscribers.
     * If this method is not called, no specific data is not applied
     * and data passed to the constructor would be sent to subscribers.
     * @param {Object} data specific data applied to only JPush subscribers.
     * Contents should be JSON Object with only one-level of nesting,
     * and only strings, integers, booleans or doubles in the values.
     * @return {Object} builder instance.
     */
    jpushData(data) {
        this.jpush.data = data;
        return this;
    }
    /**
     * Set specific data for MQTT subscribers.
     * If this method is not called, no specific data is not applied
     * and data passed to the constructor would be sent to subscribers.
     * @param {Object} data specific data applied to only MQTT subscribers.
     * Contents should be JSON Object with only one-level of nesting,
     * and only strings in the values.
     * @return {Object} builder instance.
     */
    mqttData(data) {
        this.mqtt.data = data;
        return this;
    }
}
