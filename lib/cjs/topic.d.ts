import { KiiApplication } from "./app";
import { KiiACL } from "./acl";
/**
 * Represents a Topic object.
 */
export declare class KiiTopic {
    private parentUri;
    private topicName;
    private app;
    /** @hidden */
    constructor(parentUri: string, topicName: string, app: KiiApplication);
    /**
     * get name of this topic
     * @return {String} name of this topic.
     */
    getName(): string;
    /**
     * @hidden for acl
     */
    getPath(): string;
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
    exists(): Promise<boolean>;
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
    save(): Promise<KiiTopic>;
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
    sendMessage(message: any): Promise<[KiiTopic, any]>;
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
    deleteTopic(): Promise<KiiTopic>;
    /**
     * Get ACL object of this topic.
     * Access to topic can be configured by adding/removing KiiACLEntry
     * to/from obtained acl object.
     * @return {KiiACL} acl object of this topic.
     */
    acl(): KiiACL;
}
/**
 * Builder of push message
 */
export declare class KiiPushMessageBuilder {
    private data;
    private gcm;
    private apns;
    private jpush;
    private mqtt;
    private sendToDevelopment;
    private sendToProduction;
    /**
     * instantiate builder with push message data.
     * By default all push channels (gcm, apns, jpush, mqtt) is enabled.
     * All other properties configured by method of this class won't be set and default
     * value would be applied.
     * Details of properties of message and its default value, please refer to
     * http://documentation.kii.com/rest/#notification_management-leverage__push_to_users__notification-group_scope-send_messages-send_a_push_message_to_the_current_topic
     * @param data sent to all push channels (gcm, apns, jpush, mqtt).
     */
    constructor(data: any);
    /**
     * build push message.
     * @return {Object} push message object. Can be used in {@link KiiTopic.sendMessage}
     */
    build(): any;
    /**
     * Indicate whether send this message to development environment.
     * If this method is not called, true will be applied as default.
     * @param {boolean} flag indicate whether send this message to development env.
     * @return builder instance.
     */
    setSendToDevelopment(flag: boolean): KiiPushMessageBuilder;
    /**
     * Indicate whether send this message to production environment.
     * If this method is not called, true will be applied as default.
     * @param {boolean} flag indicate whether send this message to production env.
     * @return {Object} builder instance.
     */
    setSendToProduction(flag: boolean): KiiPushMessageBuilder;
    /**
     * Enable/ Disable message distribution via GCM.
     * If this method is not called, true will be applied as default.
     * @param {boolean} enable flag indicate whether distribute this message to GCM subscribers.
     * @return {Object} builder instance.
     */
    enableGcm(enable: boolean): KiiPushMessageBuilder;
    /**
     * Enable/ Disable message distribution via APNS.
     * If this method is not called, true will be applied as default.
     * @param {boolean} enable flag indicate whether distribute this message to APNS subscribers.
     * @return {Object} builder instance.
     */
    enableApns(enable: boolean): KiiPushMessageBuilder;
    /**
     * Enable/ Disable message distribution via JPush.
     * If this method is not called, true will be applied as default.
     * @param {boolean} enable flag indicate whether distribute this message to JPush subscribers.
     * @return {Object} builder instance.
     */
    enableJpush(enable: boolean): KiiPushMessageBuilder;
    /**
     * Enable/ Disable message distribution via MQTT.
     * If this method is not called, true will be applied as default.
     * @param {boolean} enable flag indicate whether distribute this message to MQTT subscribers.
     * @return {Object} builder instance.
     */
    enableMqtt(enable: boolean): KiiPushMessageBuilder;
    /**
     * Set specific data for GCM subscribers.
     * If this method is not called, no specific data is not applied
     * and data passed to the constructor would be sent to subscribers.
     * @param {Object} data specific data applied to only GCM subscribers.
     * Contents should be JSON Object with only one-level of nesting,
     * and only strings in values
     * @return {Object} builder instance.
     */
    gcmData(data: any): KiiPushMessageBuilder;
    /**
     * Set collapse_key for GCM subscribers.
     * If this method is not called, no collapse_key is applied.
     * For details please refer to GCM document of collapse_key.
     * @param {String} collapseKey
     * @return {Object} builder instance.
     */
    gcmCollapseKey(collapseKey: string): KiiPushMessageBuilder;
    /**
     * Set delay_while_idle for GCM subscribers.
     * If this method is not called, no delay_while_idle is applied.
     * For details please refer to GCM document of delay_while_idle.
     * @param {boolean} delayWhileIdle
     * @return {Object} builder instance.
     */
    gcmDelayWhileIdle(delayWhileIdle: boolean): KiiPushMessageBuilder;
    /**
     * Set time_to_live for GCM subscribers.
     * If this method is not called, no time_to_live is applied.
     * For details please refer to GCM document of time_to_live.
     * @param {Number} timeToLive
     * @return {Object} builder instance.
     */
    gcmTimeToLive(timeToLive: number): KiiPushMessageBuilder;
    /**
     * Set restricted_package_name for GCM subscribers.
     * If this method is not called, no restricted_package_name is applied.
     * For details please refer to GCM document of restricted_package_name.
     * @param {String} restrictedPackageName.
     * @return {Object} builder instance.
     */
    gcmRestrictedPackageName(restrictedPackageName: string): KiiPushMessageBuilder;
    /**
     * Set specific data for APNS subscribers.
     * If this method is not called, no specific data is not applied
     * and data passed to the constructor would be sent to subscribers.
     * @param {Object} data specific data applied to only APNS subscribers.
     * Contents should be JSON Object with only one-level of nesting,
     * and only strings, integers, booleans or doubles in the values.
     * @return {Object} builder instance.
     */
    apnsData(data: any): KiiPushMessageBuilder;
    /**
     * Set alert for APNS subscribers.
     * If this method is not called, no alert is applied.
     * For details please refer to APNS document of alert.
     * @param {Object} alert alert object
     * @return {Object} builder instance.
     */
    apnsAlert(alert: any): KiiPushMessageBuilder;
    /**
     * Set sound for APNS subscribers.
     * If this method is not called, no sound is applied.
     * For details please refer to APNS document of sound.
     * @param {String} sound
     * @return {Object} builder instance.
     */
    apnsSound(sound: string): KiiPushMessageBuilder;
    /**
     * Set badge for APNS subscribers.
     * If this method is not called, no badge is applied.
     * For details please refer to APNS document of badge.
     * @param {Number} badge
     * @return {Object} builder instance.
     */
    apnsBadge(badge: number): KiiPushMessageBuilder;
    /**
     * Set content-available for APNS subscribers.
     * If this method is not called, no content-available is applied.
     * @param {Number} contentAvailable If eqaul or less than 0
     * or this method is not invoked,
     * content-available payload is not delivered.
     * Otherwise, content-available=1 payload is delivered.
     * @return {Object} builder instance.
     */
    apnsContentAvailable(contentAvailable: number): KiiPushMessageBuilder;
    /**
     * Set category for APNS subscribers.
     * If this method is not called, no category is applied.
     * For details please refer to APNS document of category.
     * @param {String} category
     * @return {Object} builder instance.
     */
    apnsCategory(category: string): KiiPushMessageBuilder;
    /**
     * Set mutable-content for APNS subscribers.
     * If this method is not called, no mutable-content is applied.
     * @param {Number} mutableContent If equal or less than 0
     * or this method is not invoked,
     * mutable-content payload is not delivered.
     * Otherwise, mutable-content=1 payload is delivered.
     * @return {Object} builder instance.
     */
    apnsMutableContent(mutableContent: number): KiiPushMessageBuilder;
    /**
     * Set specific data for JPush subscribers.
     * If this method is not called, no specific data is not applied
     * and data passed to the constructor would be sent to subscribers.
     * @param {Object} data specific data applied to only JPush subscribers.
     * Contents should be JSON Object with only one-level of nesting,
     * and only strings, integers, booleans or doubles in the values.
     * @return {Object} builder instance.
     */
    jpushData(data: any): KiiPushMessageBuilder;
    /**
     * Set specific data for MQTT subscribers.
     * If this method is not called, no specific data is not applied
     * and data passed to the constructor would be sent to subscribers.
     * @param {Object} data specific data applied to only MQTT subscribers.
     * Contents should be JSON Object with only one-level of nesting,
     * and only strings in the values.
     * @return {Object} builder instance.
     */
    mqttData(data: any): KiiPushMessageBuilder;
}
export interface KiiPushMessageGCMData {
    enabled: boolean;
    data?: any;
    collapseKey?: string;
    delayWhileIdle?: boolean;
    timeToLive?: number;
    restrictedPackageName?: string;
}
export interface KiiPushMessageAPNSData {
    enabled: boolean;
    data?: any;
    alert?: any;
    sound?: string;
    badge?: number;
    contentAvailable?: boolean;
    category?: string;
    mutableContent?: boolean;
}
export interface KiiPushMessageJPushData {
    enabled: boolean;
    data?: any;
}
export interface KiiPushMessageMQTTData {
    enabled: boolean;
    data?: any;
}
