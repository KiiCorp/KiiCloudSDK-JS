import { KiiBucket, KiiTopic, KiiUser } from ".";
import { KiiApplication } from "./app";
import { IBucketOwner, KiiEncryptedBucket } from "./bucket";
/**
 * Represents a KiiGroup object
 */
export declare class KiiGroup implements IBucketOwner {
    private app;
    private id;
    private name;
    private owner;
    private addMembers;
    private removeMembers;
    /** @hidden */
    constructor(app: KiiApplication);
    /** @hidden */
    static groupWithJSON(obj: any, app?: KiiApplication): KiiGroup;
    /**
     * Get the ID of the current KiiGroup instance.
     */
    getID(): string;
    private setId;
    /**
     * @deprecated Use {@link KiiGroup.getID} instead.
     * Get the UUID of the given group, assigned by the server
     * @returns {String}
     */
    getUUID(): string;
    /**
     * The name of this group
     */
    getName(): string;
    private setName;
    /**
     * Returns the owner of this group if this group holds the information of owner.
     *
     * Group will holds the information of owner when "saving group on cloud" or "retrieving group info/owner from cloud".
     * The cache will not be shared among the different instances of KiiGroup.
     * <UL>
     *   <LI>This API will not access to server.
     *     To update the group owner information on cloud, please call {@link KiiGroup.refresh} or {@link KiiGroup.getOwner}.
     *   </LI>
     *   <LI>This API does not return all the properties of the owner.
     *     To get all owner properties, {@link KiiUser.refresh} is necessary.
     *   </LI>
     * </UL>
     * @returns {KiiUser} KiiUser who owns this group, undefined if this group doesn't hold the information of owner yet.
     * {@link KiiGroup.getOwner}
     */
    getCachedOwner(): KiiUser | undefined | null;
    /**
     * Get a specifically formatted string referencing the group
     *
     * The group must exist in the cloud (have a valid UUID).
     * @returns A URI string based on the current group. null if a URI couldn't be generated.
     * @example
     * ```typescript
     * let group = . . .; // a KiiGroup
     * let uri = group.objectURI();
     * ```
     */
    objectURI(): string | null;
    /**
     * Register new group owned by current user on Kii Cloud with specified ID.
     *
     * If the group that has specified id already exists, registration will be failed.
     * @param groupID ID of the KiiGroup
     * @param groupName Name of the KiiGroup
     * @param members An array of KiiUser objects to add to the group
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {Promise} return promise object.
     *       <ul>
     *         <li>fulfill callback function: function(theSavedGroup). theSavedGroup is KiiGroup instance.</li>
     *         <li>reject callback function: function(error). error is an Error instance.
     *           <ul>
     *             <li>error.target is the KiiGroup instance which this method was called on.</li>
     *             <li>error.message</li>
     *             <li>error.addMembersArray is array of KiiUser to be added as memebers of this group.</li>
     *             <li>error.removeMembersArray is array of KiiUser to be removed from the memebers list of this group.</li>
     *           </ul>
     *         </li>
     *       </ul>
     * @example
     * ```typescript
     * let members = [];
     * members.push(KiiUser.userWithID("Member User Id"));
     * KiiGroup.registerGroupWithID("Group ID", "Group Name", members).then(theSavedGroup => {
     *   // do something with the saved group
     * }).catch(error => {
     *   let theGroup = error.target;
     *   let anErrorString = error.message;
     *   let addMembersArray = error.addMembersArray;
     *   // do something with the error response
     * });
     * ```
     */
    static registerGroupWithID(groupID: string, groupName: string, members: KiiUser[], app?: KiiApplication): Promise<KiiGroup>;
    /** @hidden */
    static registerGroupWithIDAndOwner(groupID: string, groupName: string, owner: string | null, members: KiiUser[], app?: KiiApplication): Promise<KiiGroup>;
    /**
     * Creates a reference to a bucket for this group
     *
     * The bucket will be created/accessed within this group's scope
     * @param bucketName The name of the bucket the user should create/access
     * @returns {KiiBucket} A working KiiBucket object
     * @example
     * ```typescript
     * let group = . . .; // a KiiGroup
     * let bucket = group.bucketWithName("myBucket");
     * ```
     */
    bucketWithName(bucketName: string): KiiBucket;
    /**
     * Creates a reference to a encrypted bucket for this group
     *
     * The bucket will be created/accessed within this group's scope
     * @param bucketName The name of the bucket the user should create/access
     * @returns {KiiEncryptedBucket} A working KiiEncryptedBucket object
     * @example
     * ```typescript
     * let group = . . .; // a KiiGroup
     * let bucket = group.encryptedBucketWithName("myBucket");
     * ```
     */
    encryptedBucketWithName(bucketName: string): KiiEncryptedBucket;
    /**
     * Adds a user to the given group
     *
     * This method will NOT access the server immediately.
     * You must call save to add the user on the server.
     * This allows multiple users to be added/removed before calling save.
     * @param member The user to be added to the group
     * @example
     * ```typescript
     * let user = . . .; // a KiiUser
     * let group = . . .; // a KiiGroup
     * group.addUser(user);
     * group.save();
     * ```
     */
    addUser(member: KiiUser): void;
    /**
     * Removes a user from the given group
     *
     * This method will NOT access the server immediately.
     * You must call save to remove the user on the server.
     * This allows multiple users to be added/removed before calling save.
     * @param member The user to be added to the group
     * @example
     * ```typescript
     * let user = . . .; // a KiiUser
     * let group = . . .; // a KiiGroup
     * group.removeUser(user);
     * group.save();
     * ```
     */
    removeUser(member: KiiUser): KiiGroup;
    /**
     * Gets a list of all current members of a group
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theMemberList). theMemberList is array of memeber KiiUser instances.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiGroup instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let group = . . .; // a KiiGroup
     * group.getMemberList().then(memberList => {
     *   // do something with the result
     *   for (let i = 0; i < memberList.length; i++) {
     *     let u = memberList[i]; // a KiiUser within the group
     *   }
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    getMemberList(): Promise<KiiUser[]>;
    /**
     * Updates the group name on the server
     * @param newName A String of the desired group name
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theRenamedGroup). theRenamedGroup is KiiGroup instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiGroup instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let group = . . .; // a KiiGroup
     * group.changeGroupName("myNewName").then(theRenamedGroup => {
     *   // do something with the group
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    changeGroupName(newName: string): Promise<KiiGroup>;
    /**
     * Saves the latest group values to the server
     *
     * If the group does not yet exist, it will be created.
     * If the group already exists, the members that have changed will be updated accordingly.
     * If the group already exists and there is no updates of members, it will allways succeed but does not execute update.
     * To change the name of group, use {@link KiiGroup.changeGroupName}.
     * @return {Promise} return promise object.
     *       <ul>
     *         <li>fulfill callback function: function(theSavedGroup). theSavedGroup is KiiGroup instance.</li>
     *         <li>reject callback function: function(error). error is an Error instance.
     *           <ul>
     *             <li>error.target is the KiiGroup instance which this method was called on.</li>
     *             <li>error.message</li>
     *             <li>error.addMembersArray is array of KiiUser to be added as memebers of this group.</li>
     *             <li>error.removeMembersArray is array of KiiUser to be removed from the memebers list of this group.</li>
     *           </ul>
     *         </li>
     *       </ul>
     * @example
     * ```typescript
     * let group = . . .; // a KiiGroup
     * group.save().then(theSavedGroup => {
     *   // do something with the saved group
     * }).catch(error => {
     *   let theGroup = error.target;
     *   let anErrorString = error.message;
     *   let addMembersArray = error.addMembersArray;
     *   let removeMembersArray = error.removeMembersArray;
     *   // do something with the error response
     * });
     * ```
     */
    save(): Promise<KiiGroup>;
    /**
     * Saves the latest group values to the server with specified owner.
     * This method can be used only by the group owner or app admin.
     *
     * If the group does not yet exist, it will be created.
     * If the group already exists, the members and owner that have changed will be updated accordingly.
     * If the group already exists and there is no updates of members and owner, it will allways succeed but does not execute update.
     * To change the name of group, use {@link KiiGroup.changeGroupName}.
     * @param owner id of owner
     * @return {Promise} return promise object.
     *       <ul>
     *         <li>fulfill callback function: function(theSavedGroup). theSavedGroup is KiiGroup instance.</li>
     *         <li>reject callback function: function(error). error is an Error instance.
     *           <ul>
     *             <li>error.target is the KiiGroup instance which this method was called on.</li>
     *             <li>error.message</li>
     *             <li>error.addMembersArray is array of KiiUser to be added as memebers of this group.</li>
     *             <li>error.removeMembersArray is array of KiiUser to be removed from the memebers list of this group.</li>
     *           </ul>
     *         </li>
     *       </ul>
     * @example
     * ```typescript
     * let group = . . .; // a KiiGroup
     * group.saveWithOwner("UserID of owner").then(theSavedGroup => {
     *   // do something with the saved group
     * }).catch(error => {
     *   let theGroup = error.target;
     *   let anErrorString = error.message;
     *   let addMembersArray = error.addMembersArray;
     *   let removeMembersArray = error.removeMembersArray;
     *   // do something with the error response
     * });
     * ```
     */
    saveWithOwner(owner: string): Promise<KiiGroup>;
    private createGroup;
    private saveMembers;
    private addMember;
    private removeMember;
    /**
     * Updates the local group's data with the group data on the server
     *
     * The group must exist on the server. Local data will be overwritten.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theRefreshedGroup). theRefreshedGroup is KiiGroup instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiGroup instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let group = . . .; // a KiiGroup
     * group.refresh().then(theRefreshedGroup => {
     *   // do something with the refreshed group
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    refresh(): Promise<KiiGroup>;
    /**
     * Delete the group from the server
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theDeletedGroup). theDeletedGroup is KiiGroup instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiGroup instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let group = . . .; // a KiiGroup
     * group.delete().then(theDeletedGroup => {
     *   // do something
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    delete(): Promise<KiiGroup>;
    /**
     * Gets the owner of the associated group
     *
     * This API does not return all the properties of the owner.
     * To get all owner properties, {@link KiiUser.refresh} is necessary.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theOwner). theOwner is an group owner KiiUser instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiGroup instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let group = . . .; // a KiiGroup
     * group.getOwner().then(theOwner => {
     *   // do something
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    getOwner(): Promise<KiiUser | undefined | null>;
    private setOwner;
    /** @hidden */
    getACLEntityString(): string;
    /** @hidden */
    getPath(): string;
    /**
     * Creates a reference to a group with the given name
     *
     * <b>Note:</b>
     * Returned instance from this API can not operate existing KiiGroup.<br>
     * If you want to operate existing KiiGroup, please use {@link KiiGroup.groupWithURI}.
     * @param groupName An application-specific group name
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {KiiGroup} A new KiiGroup reference
     * @example
     * ```typescript
     * let group = KiiGroup.groupWithName("myGroup");
     * ```
     */
    static groupWithName(groupName: string, app?: KiiApplication): KiiGroup;
    /**
     * Creates a reference to a group with the given name and a list of default members
     *
     * <b>Note:</b>
     * Returned instance from this API can not operate existing KiiGroup.<br>
     * If you want to operate existing KiiGroup, please use {@link KiiGroup.groupWithURI}.
     * @param groupName
     * @param members
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {KiiGroup} A new KiiGroup reference
     * @example
     * ```typescript
     * let group = KiiGroup.groupWithName("myGroup", members);
     * ```
     */
    static groupWithNameAndMembers(groupName: string, members: KiiUser[], app?: KiiApplication): KiiGroup;
    /**
     * Instantiate KiiGroup that refers to existing group which has specified ID.
     * You have to specify the ID of existing KiiGroup. Unlike KiiObject,
     * you can not assign ID in the client side.<br>
     * <b>NOTE</b>: This API does not access to the server.
     * After instantiation, call {@link KiiGroup.refresh} to fetch the properties.
     * @param groupID ID of the KiiGroup to instantiate.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return instance of KiiGroup.
     * @example
     * ```typescript
     * let group = KiiGroup.groupWithID("__GROUP_ID__");
     * ```
     */
    static groupWithID(groupID: string, app?: KiiApplication): KiiGroup;
    /**
     * Generate a new KiiGroup based on a given URI
     *
     * <b>Note:</b>
     * Returned instance from this API can operate existing KiiGroup.<br>
     * If you want to create a new KiiGroup, please use {@link KiiGroup.groupWithName}.
     * @param uri The URI of the group to be represented
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {KiiGroup} A new KiiGroup with its parameters filled in from the URI
     * @example
     * ```typescript
     * let group = KiiGroup.groupWithURI("kiicloud://myuri");
     * ```
     */
    static groupWithURI(uri: string, app?: KiiApplication): KiiGroup;
    /**
     * Instantiate topic belongs to this group.
     * @param topicName name of the topic. Must be a not empty string.
     * @return {KiiTopic} topic instance.
     */
    topicWithName(topicName: string): KiiTopic;
    /**
     * Gets a list of topics in this group scope
     * @param paginationKey You can specify the pagination key with the nextPaginationKey passed by callbacks.success.
     * If empty string or no string object is provided, this API regards no paginationKey specified.
     * @return {Promise} return promise object.
     *     <ul>
     *       <li>fulfill callback function: function(params). params is Array instance.
     *         <ul>
     *           <li>params[0] is array of KiiTopic instances.</li>
     *           <li>params[1] is string of nextPaginationKey.</li>
     *         </ul>
     *       </li>
     *       <li>reject callback function: function(error). error is an Error instance.
     *         <ul>
     *           <li>error.target is the KiiGroup instance which this method was called on. </li>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```typescript
     * let group = . . .; // a KiiGroup
     * group.listTopics().then(params => {
     *   let topicList = params[0];
     *   let nextPaginationKey = params[1];
     *   // do something with the result
     *   for (let i = 0; i < topicList.length; i++) {
     *     let topic = topicList[i];
     *   }
     *   if (nextPaginationKey != null) {
     *     group.listTopics(null, nextPaginationKey)
     *     .then(params => {...})
     *     .catch(error => {...});
     *   }
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    listTopics(paginationKey: string): Promise<[KiiTopic[], string | null]>;
    private updateWithJSON;
}
