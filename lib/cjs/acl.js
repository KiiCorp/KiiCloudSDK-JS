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
exports.KiiACLEntry = exports.KiiACL = exports.KiiACLAction = void 0;
const app_1 = require("./app");
const exception_1 = require("./exception");
const group_1 = require("./group");
const httpResponse_1 = require("./httpResponse");
const user_1 = require("./user");
const utilities_1 = require("./utilities");
exports.KiiACLAction = {
    KiiACLBucketActionCreateObjects: "CREATE_OBJECTS_IN_BUCKET",
    KiiACLBucketActionQueryObjects: "QUERY_OBJECTS_IN_BUCKET",
    KiiACLBucketActionDropBucket: "DROP_BUCKET_WITH_ALL_CONTENT",
    KiiACLBucketActionReadObjects: "READ_OBJECTS_IN_BUCKET",
    KiiACLObjectActionRead: "READ_EXISTING_OBJECT",
    KiiACLObjectActionWrite: "WRITE_EXISTING_OBJECT",
    KiiACLSubscribeToTopic: "SUBSCRIBE_TO_TOPIC",
    KiiACLSendMessageToTopic: "SEND_MESSAGE_TO_TOPIC",
};
/**
 * Represents a KiiACL object
 */
class KiiACL {
    /** @hidden */
    constructor(parent, app) {
        this.parent = parent;
        this.app = app;
        this.entriesMap = {};
    }
    /** @hidden */
    aclPath() {
        return `${this.parent.getPath()}/acl`;
    }
    /**
     * Get the list of active ACLs associated with this object from the server
     * @return {Promise} return promise object.
     *     <ul>
     *       <li>fulfill callback function: function(result). result is an array of KiiACLEntry instances.</li>
     *       <li>reject callback function: function(error). error is an Error instance.
     *         <ul>
     *           <li>error.target is the KiiACL instance which this method was called on.</li>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```typescript
     * let acl = . . .; // a KiiACL object
     * acl.listACLEntries().then(theEntries => {
     *   // do something
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    listACLEntries() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.aclPath()}`;
            const request = this.app.newRequest("GET", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                // response body is like this.
                // {
                //   "DROP_BUCKET_WITH_ALL_CONTENT" : [ {
                //     "userID" : "user0011"
                //   } ],
                //   "QUERY_OBJECTS_IN_BUCKET" : [ {
                //     "userID" : "user22"
                //   } ],
                // }
                const entries = [];
                const actions = Object.keys(response.body);
                actions.forEach((action) => {
                    const items = response.body[action];
                    items.forEach((item) => {
                        const subject = itemToSubject(item);
                        if (subject != null) {
                            entries.push(KiiACLEntry.entryWithSubject(subject, action));
                        }
                    });
                });
                return entries;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
    /**
     * Add a KiiACLEntry to the local object, if not already present.
     * This does not explicitly grant any permissions, which should be done through the KiiACLEntry itself. This method simply adds the entry to the local ACL object so it can be saved to the server.
     * @param entry The KiiACLEntry to add
     * @example
     * ```typescript
     * let aclEntry = . . .; // a KiiACLEntry object
     * let acl = . . .; // a KiiACL object
     * acl.putACLEntry(aclEntry);
     * ```
     */
    putACLEntry(entry) {
        this.entriesMap[entry.toKey()] = entry;
    }
    /**
     * Remove a KiiACLEntry to the local object.
     * This does not explicitly revoke any permissions, which should be done through the KiiACLEntry itself.
     * This method simply removes the entry from the local ACL object and will not be saved to the server.
     * @param entry The KiiACLEntry to remove
     * @example
     * ```typescript
     * let aclEntry = . . .; // a KiiACLEntry object
     * let acl = . . .; // a KiiACL object
     * acl.removeACLEntry(aclEntry);
     * ```
     */
    removeACLEntry(entry) {
        delete this.entriesMap[entry.toKey()];
        return this;
    }
    /**
     * Save the list of ACLEntry objects associated with this ACL object to the server
     * @return {Promise} return promise object.
     *     <ul>
     *       <li>fulfill callback function: function(theSavedACL). theSavedACL is KiiACL instance.</li>
     *       <li>reject callback function: function(error). error is an Error instance.
     *         <ul>
     *           <li>error.target is the KiiACL instance which this method was called on.</li>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```typescript
     * let acl = . . .; // a KiiACL object
     * acl.save().then(() => {
     *   // do something with the saved acl
     * }).catch(error => {
     *   let theACL = error.target;
     *   let anErrorString = error.message;
     *   // do something with the error response
     * });
     * ```
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(this.entriesMap);
            if (keys.length == 0) {
                throw utilities_1.error("There is no entry to save.", this);
            }
            for (let i = 0; i < keys.length; i++) {
                const entry = this.entriesMap[keys[i]];
                const url = `/apps/${this.app.getAppID()}${this.aclPath()}/${entry.getActionString()}/${entry.getEntityString()}`;
                const request = this.app.newRequest(entry.getGrant() ? "PUT" : "DELETE", url);
                const response = yield request.send();
                if (httpResponse_1.isSuccess(response.status)) {
                    this.removeACLEntry(entry);
                }
                else {
                    // FIXME: this causes remaining process unfinished
                    throw exception_1.parseErrorResponse(request, response, this, null);
                }
            }
            return this;
        });
    }
    /**
     * @hidden
     * @constructor
     * @param parent parent instance that is implemented KiiACLParent.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     */
    static aclWithParent(parent, app = app_1.KiiApplication.globalApp) {
        return new KiiACL(parent, app);
    }
}
exports.KiiACL = KiiACL;
/**
 * Represents a KiiACLEntry object
 */
class KiiACLEntry {
    /** @hidden */
    constructor(subject, action) {
        this.subject = subject;
        this.action = action;
        this.grant = true;
    }
    /**
     * The action that is being permitted/restricted. Possible values:
     * @param value The action being permitted/restricted
     */
    setAction(value) {
        this.action = value;
    }
    /**
     * Get the action that is being permitted/restricted in this entry
     * @returns action
     */
    getAction() {
        return this.action;
    }
    /**
     * Set the subject to which the action/grant is being applied
     * @param value subject instance.
     */
    setSubject(value) {
        this.subject = value;
    }
    /**
     * Get the subject that is being permitted/restricted in this entry
     * @returns subject instance.
     */
    getSubject() {
        return this.subject;
    }
    /**
     * Set whether or not the action is being permitted to the subject
     * @param value true if the action is permitted, false otherwise
     */
    setGrant(value) {
        this.grant = value;
        return this;
    }
    /**
     * Get whether or not the action is being permitted to the subject
     * @returns true if the action is being permitted
     */
    getGrant() {
        return this.grant;
    }
    /** @hidden */
    toKey() {
        return `${this.getActionString()}/${this.getEntityString()}/${this.grant}`;
    }
    /**
     * Create a KiiACLEntry object with a subject and action
     *
     * The entry will not be applied on the server until the KiiACL object is
     * explicitly saved. This method simply returns a working KiiACLEntry with
     * a specified subject and action.
     * @param subject Subject to which the action/grant is being applied
     * @param action One of the specified KiiACLAction values the
     * permissions is being applied to
     * @returns A KiiACLEntry object with the specified attributes
     */
    static entryWithSubject(subject, action) {
        return new KiiACLEntry(subject, action);
    }
    /** @hidden */
    getActionString() {
        return this.action;
    }
    /** @hidden */
    getEntityString() {
        return this.subject.getACLEntityString();
    }
}
exports.KiiACLEntry = KiiACLEntry;
const itemToSubject = (item) => {
    if (item["groupID"] != null) {
        const groupId = item["groupID"];
        return group_1.KiiGroup.groupWithID(groupId);
    }
    else if (item["userID"] != null) {
        const userId = item["userID"];
        return user_1.KiiUser.userWithID(userId);
    }
    else if (item["thingID"] != null) {
        // TODO implement later
        return user_1.KiiUser.userWithID("");
    }
    return null;
};
