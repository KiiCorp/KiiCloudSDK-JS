import { KiiApplication } from "./app";
import { KiiACLSubject } from "./types";
export declare const KiiACLAction: {
    readonly KiiACLBucketActionCreateObjects: "CREATE_OBJECTS_IN_BUCKET";
    readonly KiiACLBucketActionQueryObjects: "QUERY_OBJECTS_IN_BUCKET";
    readonly KiiACLBucketActionDropBucket: "DROP_BUCKET_WITH_ALL_CONTENT";
    readonly KiiACLBucketActionReadObjects: "READ_OBJECTS_IN_BUCKET";
    readonly KiiACLObjectActionRead: "READ_EXISTING_OBJECT";
    readonly KiiACLObjectActionWrite: "WRITE_EXISTING_OBJECT";
    readonly KiiACLSubscribeToTopic: "SUBSCRIBE_TO_TOPIC";
    readonly KiiACLSendMessageToTopic: "SEND_MESSAGE_TO_TOPIC";
};
export declare type KiiACLAction = typeof KiiACLAction[keyof typeof KiiACLAction];
/**
 * Represents a KiiACL object
 */
export declare class KiiACL {
    private parent;
    private app;
    private entriesMap;
    /** @hidden */
    constructor(parent: KiiACLParent, app: KiiApplication);
    /** @hidden */
    aclPath(): string;
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
    listACLEntries(): Promise<KiiACLEntry[]>;
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
    putACLEntry(entry: KiiACLEntry): void;
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
    removeACLEntry(entry: KiiACLEntry): KiiACL;
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
    save(): Promise<KiiACL>;
    /**
     * @hidden
     * @constructor
     * @param parent parent instance that is implemented KiiACLParent.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     */
    static aclWithParent(parent: KiiACLParent, app?: KiiApplication): KiiACL;
}
/**
 * Represents a KiiACLEntry object
 */
export declare class KiiACLEntry {
    private subject;
    private action;
    private grant;
    /** @hidden */
    constructor(subject: KiiACLSubject, action: KiiACLAction);
    /**
     * The action that is being permitted/restricted. Possible values:
     * @param value The action being permitted/restricted
     */
    setAction(value: KiiACLAction): void;
    /**
     * Get the action that is being permitted/restricted in this entry
     * @returns action
     */
    getAction(): KiiACLAction;
    /**
     * Set the subject to which the action/grant is being applied
     * @param value subject instance.
     */
    setSubject(value: KiiACLSubject): void;
    /**
     * Get the subject that is being permitted/restricted in this entry
     * @returns subject instance.
     */
    getSubject(): KiiACLSubject;
    /**
     * Set whether or not the action is being permitted to the subject
     * @param value true if the action is permitted, false otherwise
     */
    setGrant(value: boolean): KiiACLEntry;
    /**
     * Get whether or not the action is being permitted to the subject
     * @returns true if the action is being permitted
     */
    getGrant(): boolean;
    /** @hidden */
    toKey(): string;
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
    static entryWithSubject(subject: KiiACLSubject, action: KiiACLAction): KiiACLEntry;
    /** @hidden */
    getActionString(): string;
    /** @hidden */
    getEntityString(): string;
}
export interface KiiACLParent {
    getPath(): string;
}
