/**
 * Represent any authenticated user for setting the ACL of an object. This will include anyone using the application who has registered and authenticated in the current session.
 *
 * When retrieving ACL from an object, test for this class to determine the subject type. Example:
 *
 * @example
 * ```typescript
 * let entry = ... // Retrieved ACL entry
 * if(entry.getSubject() instanceof KiiAnyAuthenticatedUser) {
 *   // the ACL is set for authenticated users
 * }
 * ```
 */
export class KiiAnyAuthenticatedUser {
    /** @hidden */
    constructor() { }
    /**
     * Returns the ID of AuthenticatedUser user.
     */
    getID() {
        return "ANY_AUTHENTICATED_USER";
    }
    /**
     * @hidden
     * @inheritdoc
     */
    getACLEntityString() {
        return "UserID:ANY_AUTHENTICATED_USER";
    }
}
