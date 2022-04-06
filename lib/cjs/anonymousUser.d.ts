import { KiiACLSubject } from "./types";
/**
 * Represent an anonymous user for setting the ACL of an object. This will include anyone using the application but have not signed up or authenticated as registered user.
 *
 * When retrieving ACL from an object, test for this class to determine the subject type.
 * @example
 * ```typescript
 * let entry = ... // Retrieved ACL entry
 * if(entry.getSubject() instanceof KiiAnonymousUser) {
 *   // the ACL is set for anonymous users
 * }
 * ```
 */
export declare class KiiAnonymousUser implements KiiACLSubject {
    /** @hidden */
    constructor();
    /**
     * Returns the ID of Anonymous user.
     */
    getID(): string;
    /**
     * @hidden
     * @inheritdoc
     */
    getACLEntityString(): string;
}
