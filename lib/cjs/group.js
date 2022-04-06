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
exports.KiiGroup = void 0;
const _1 = require(".");
const app_1 = require("./app");
const bucket_1 = require("./bucket");
const exception_1 = require("./exception");
const httpResponse_1 = require("./httpResponse");
const utilities_1 = require("./utilities");
/**
 * Represents a KiiGroup object
 */
class KiiGroup {
    /** @hidden */
    constructor(app) {
        this.app = app;
        this.id = "";
        this.name = "";
        this.owner = undefined;
        this.addMembers = {};
        this.removeMembers = {};
    }
    /** @hidden */
    static groupWithJSON(obj, app = app_1.KiiApplication.globalApp) {
        const group = new KiiGroup(app);
        if (obj["groupID"] != null) {
            group.setId(obj["groupID"]);
        }
        if (obj["name"] != null) {
            group.setName(obj["name"]);
        }
        if (obj["owner"] != null) {
            const owner = _1.KiiUser.userWithID(obj["owner"]);
            group.setOwner(owner);
        }
        return group;
    }
    /**
     * Get the ID of the current KiiGroup instance.
     */
    getID() {
        return this.id;
    }
    setId(groupId) {
        this.id = groupId;
    }
    /**
     * @deprecated Use {@link KiiGroup.getID} instead.
     * Get the UUID of the given group, assigned by the server
     * @returns {String}
     */
    getUUID() {
        return this.id;
    }
    /**
     * The name of this group
     */
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
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
    getCachedOwner() {
        return this.owner;
    }
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
    objectURI() {
        if (this.id.length == 0) {
            return null;
        }
        return `kiicloud://groups/${this.getID()}`;
    }
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
    static registerGroupWithID(groupID, groupName, members, app = app_1.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = app.getCurrentUser();
            if (currentUser === null) {
                throw utilities_1.error("owner is null", this);
            }
            if (groupID === null || groupID.length == 0) {
                throw utilities_1.error("groupID is null or empty", this);
            }
            if (!utilities_1.validateGroupID(groupID)) {
                throw utilities_1.error(`invalid groupID : ${groupID}`, this);
            }
            if (groupName.length == 0) {
                throw utilities_1.error("groupName is null or empty", this);
            }
            return KiiGroup.registerGroupWithIDAndOwner(groupID, groupName, currentUser.getID(), members, app);
        });
    }
    // this method is needed for AdminContext
    /** @hidden */
    static registerGroupWithIDAndOwner(groupID, groupName, owner, members, app = app_1.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (groupID === null || groupID.length == 0) {
                throw utilities_1.error("groupID is null or empty", this);
            }
            if (!isValidGroupId(groupID)) {
                throw utilities_1.error(`invalid groupID : ${groupID}`, this);
            }
            if (groupName === null || groupName.length == 0) {
                throw utilities_1.error("groupName is null or empty", this);
            }
            if (!owner) {
                throw utilities_1.error("owner is null", this);
            }
            const url = `/apps/${app.getAppID()}/groups/${groupID}`;
            let body;
            body = {
                name: groupName,
                owner: owner,
            };
            if ((members === null || members === void 0 ? void 0 : members.length) > 0) {
                body.members = members.map((user) => user.getID());
            }
            const request = app.newRequest("PUT", url);
            request.setContentType("application/vnd.kii.GroupCreationRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if (httpResponse_1.isSuccess(response.status)) {
                const group = new KiiGroup(app);
                group.setId(groupID);
                group.setName(groupName);
                if ((members === null || members === void 0 ? void 0 : members.length) > 0) {
                    members.forEach((member) => {
                        const id = member.getID();
                        if (id != null) {
                            group.addMembers[id] = member;
                        }
                    });
                }
                return group;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, undefined, null);
            }
        });
    }
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
    bucketWithName(bucketName) {
        return new _1.KiiBucket(bucketName, this, this.app);
    }
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
    encryptedBucketWithName(bucketName) {
        return new bucket_1.KiiEncryptedBucket(bucketName, this, this.app);
    }
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
    addUser(member) {
        const userId = member.getID();
        if (userId == null || userId.length == 0) {
            //TODO print log or throw error?
            return;
        }
        this.addMembers[userId] = member;
        delete this.removeMembers[userId];
    }
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
    removeUser(member) {
        const userId = member.getID();
        if (userId == null || userId.length == 0) {
            //TODO print log or throw error?
            throw utilities_1.error("User ID is null", this);
        }
        delete this.addMembers[userId];
        this.removeMembers[userId] = member;
        return this;
    }
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
    getMemberList() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}/groups/${this.getID()}/members`;
            const request = this.app.newRequest("GET", url);
            request.addHeader("Accept", "application/vnd.kii.MembersRetrievalResponse+json");
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                const members = response.body["members"];
                return members.map((member) => _1.KiiUser.userWithID(member["userID"], this.app));
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    changeGroupName(newName) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupId = this.getID();
            if (groupId.length == 0) {
                throw utilities_1.error("Invalid group. Save the group on the server before updating the name.", this);
            }
            if (newName.trim().length == 0) {
                throw utilities_1.error("Invalid group name.", this);
            }
            const url = `/apps/${this.app.getAppID()}/groups/${groupId}/name`;
            const body = newName;
            const request = this.app.newRequest("PUT", url);
            request.setContentType("text/plain");
            const response = yield request.send(newName);
            if (httpResponse_1.isSuccess(response.status)) {
                this.setName(newName);
                return this;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    save() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const groupId = this.getID();
            if (groupId.length == 0) {
                if (this.app && this.app.getCurrentUser) {
                    const ownerId = (_a = this.app.getCurrentUser()) === null || _a === void 0 ? void 0 : _a.getID();
                    // if (ownerId == null) {
                    //   throw error(
                    //     "Login required. This method uses current user as group owner.", this
                    //   );
                    // }
                    yield this.createGroup(ownerId);
                }
            }
            yield this.saveMembers();
            return this;
        });
    }
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
    saveWithOwner(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupId = this.getID();
            if (groupId.length == 0) {
                if (owner.length == 0) {
                    throw utilities_1.error("Owner ID must not be empty.", this);
                }
                yield this.createGroup(owner);
            }
            yield this.saveMembers();
            return this;
        });
    }
    createGroup(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}/groups`;
            let body = {
                name: this.getName(),
            };
            if (ownerId) {
                body.owner = ownerId;
            }
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.GroupCreationRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if (httpResponse_1.isSuccess(response.status)) {
                const groupId = response.body["groupID"];
                this.setId(groupId);
                if (ownerId) {
                    this.setOwner(_1.KiiUser.userWithID(ownerId));
                }
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
    saveMembers() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const memberId of Object.keys(this.addMembers)) {
                yield this.addMember(memberId);
            }
            for (const memberId of Object.keys(this.removeMembers)) {
                yield this.removeMember(memberId);
            }
        });
    }
    addMember(memberId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}/groups/${this.getID()}/members/${memberId}`;
            const request = this.app.newRequest("PUT", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                // OK
                delete this.addMembers[memberId];
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, {
                    addMembersArray: Object.values(this.addMembers),
                    removeMembersArray: Object.values(this.removeMembers),
                });
            }
        });
    }
    removeMember(memberId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}/groups/${this.getID()}/members/${memberId}`;
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                // OK
                delete this.removeMembers[memberId];
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, {
                    addMembersArray: Object.values(this.addMembers),
                    removeMembersArray: Object.values(this.removeMembers),
                });
            }
        });
    }
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
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const groupId = this.getID();
            if (groupId.length == 0) {
                throw utilities_1.error("This group does not have ID.", this);
            }
            const url = `/apps/${this.app.getAppID()}/groups/${groupId}`;
            const request = this.app.newRequest("GET", url);
            request.addHeader("Accept", "application/vnd.kii.GroupRetrievalResponse+json");
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                this.updateWithJSON(response.body);
                return this;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const groupId = this.getID();
            if (groupId.length == 0) {
                throw utilities_1.error("This group does not have ID.", this);
            }
            const url = `/apps/${this.app.getAppID()}/groups/${groupId}`;
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                // OK
                return this;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    getOwner() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refresh();
            return this.getCachedOwner();
        });
    }
    setOwner(owner) {
        this.owner = owner;
    }
    /** @hidden */
    getACLEntityString() {
        return `GroupID:${this.getID()}`;
    }
    /** @hidden */
    getPath() {
        return `/groups/${this.id}`;
    }
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
    static groupWithName(groupName, app = app_1.KiiApplication.globalApp) {
        const group = new KiiGroup(app);
        group.setName(groupName);
        return group;
    }
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
    static groupWithNameAndMembers(groupName, members, app = app_1.KiiApplication.globalApp) {
        const group = new KiiGroup(app);
        group.setName(groupName);
        members.forEach((member) => {
            const userId = member.getID();
            if (userId != null) {
                group.addMembers[userId] = member;
            }
        });
        return group;
    }
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
    static groupWithID(groupID, app = app_1.KiiApplication.globalApp) {
        const group = new KiiGroup(app);
        group.setId(groupID);
        return group;
    }
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
    static groupWithURI(uri, app = app_1.KiiApplication.globalApp) {
        const newURI = uri.substr("kiicloud://".length);
        const components = newURI.split("/");
        const compLength = components.length;
        if (!components.length) {
            throw new exception_1.InvalidURIException(undefined, undefined);
        }
        const group = new KiiGroup(app);
        group.setId(components[compLength - 1]);
        return group;
    }
    /**
     * Instantiate topic belongs to this group.
     * @param topicName name of the topic. Must be a not empty string.
     * @return {KiiTopic} topic instance.
     */
    topicWithName(topicName) {
        const uri = `/groups/${this.getID()}`;
        return new _1.KiiTopic(uri, topicName, this.app);
    }
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
    listTopics(paginationKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `/apps/${this.app.getAppID()}/groups/${this.getID()}/topics`;
            if (paginationKey && paginationKey.length > 0) {
                url = url + `?paginationKey=${encodeURIComponent(paginationKey)}`;
            }
            const request = this.app.newRequest("GET", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                const nextPaginationKey = response.body["paginationKey"] || null;
                const topics = response.body["topics"];
                const items = topics.map((topic) => this.topicWithName(topic["topicID"]));
                return [
                    items,
                    nextPaginationKey
                ];
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
    updateWithJSON(body) {
        var _a;
        const groupId = body["groupID"];
        if (groupId !== undefined) {
            this.setId(groupId);
        }
        const groupName = (_a = body["name"]) !== null && _a !== void 0 ? _a : "";
        this.setName(groupName);
        const ownerId = body["owner"];
        if (ownerId !== undefined) {
            this.setOwner(_1.KiiUser.userWithID(ownerId));
        }
        else {
            this.setOwner(null);
        }
    }
}
exports.KiiGroup = KiiGroup;
const isValidGroupId = (groupId) => {
    const pattern = /^[a-z0-9-_.]{1,30}$/;
    if (typeof groupId !== "string") {
        return false;
    }
    return groupId.match(pattern) != null;
};
