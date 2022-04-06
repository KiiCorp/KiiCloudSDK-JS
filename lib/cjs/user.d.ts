import { KiiBucket } from ".";
import { KiiApplication } from "./app";
import { IBucketOwner, KiiEncryptedBucket } from "./bucket";
import { KiiGroup } from "./group";
import { KiiPushInstallation, KiiPushSubscription } from "./push";
import { KiiTopic } from "./topic";
/**
 * Represents a KiiUser object
 */
export declare class KiiUser implements IBucketOwner {
    private app;
    private id;
    private username;
    private password;
    private _disabled;
    private displayName;
    private email;
    private emailAddressPending;
    private phoneNumber;
    private phoneNumberPending;
    private country;
    private locale;
    private created;
    private modified;
    private emailVerified;
    private phoneVerified;
    private hasPassword;
    private thirdPartyAccounts;
    private customInfo;
    private accessToken;
    private expiresAt;
    private scope;
    /** @hidden */
    constructor(app: KiiApplication);
    /**
     * Get the ID of the current KiiUser instance.
     * @returns Id of the user or null if the user has not saved to cloud.
     */
    getID(): string | null;
    /**
     * @deprecated Use {@link KiiUser.getID} instead.
     * Get the ID of the current KiiUser instance.
     * @returns Id of the user or null if the user has not saved to cloud.
     */
    getUUID(): string | null;
    /**
     * Get the username of the given user
     * @returns username or undefined
     */
    getUsername(): string | undefined;
    /** @hidden */
    setUsername(username: string): void;
    /**
     * Return true if the user is disabled, false when enabled and undefined
     * when user is not refreshed.
     * Call {@link KiiUser.refresh} prior calling this method to get
     * correct status.
     */
    disabled(): boolean | undefined;
    /**
     * Get the display name associated with this user
     */
    getDisplayName(): string | null;
    /**
     * Set the display name associated with this user.
     * Cannot be used for logging a user in; is non-unique
     * @param {String} value Must be between 1-50 alphanumeric characters.
     * @throws {InvalidDisplayNameException} If the displayName is not a valid format
     */
    setDisplayName(value: string): void;
    /**
     * Get whether or not the user is pseudo user.
     * If this method is not called for current login user, calling
     * {@link KiiUser.refresh} method is necessary to get a correct value.
     * @returns {Boolean} whether this user is pseudo user or not.
     */
    isPseudoUser(): boolean;
    /**
     * Get the email address associated with this user
     */
    getEmailAddress(): string | undefined;
    /**
     * Get the email of this user that has not been verified.
     * When the user's email has been changed and email verification is required in you app configuration,
     * New email is stored as pending email.
     * After the new email has been verified, the address can be obtained by {@link KiiUser.getEmailAddress}
     * @returns User's new email address has not been verified.
     * null if no pending email field is included in refresh
     * response or undefined when no refresh operation has been done before.
     */
    getPendingEmailAddress(): string | undefined | null;
    /**
     * Get the phone number associated with this user
     */
    getPhoneNumber(): string | undefined;
    /**
     * Get the phone of this user that has not been verified.
     * When the user's phone has been changed and phone verification is required in you app configuration,
     * New phone is stored as pending phone.
     * After the new phone has been verified, the address can be obtained by {@link KiiUser.getPhoneNumber}
     * @returns User's new phone number has not been verified.
     * null if no pending phone field is included in refresh
     * response or undefined when no refresh operation has been done before.
     */
    getPendingPhoneNumber(): string | undefined | null;
    /**
     * Get the status of the user's email verification. This field is assigned by the server
     * @returns {Boolean} true if the user's email address has been verified by the user, false otherwise.
     * Could be undefined if haven't obtained value from server or not allowed to see the value.
     * Should be used by current login user to check the email verification status.
     */
    getEmailVerified(): boolean | undefined;
    /**
     * Get the status of the user's phone number verification. This field is assigned by the server
     * @returns {Boolean} true if the user's email address has been verified by the user, false otherwise
     * Could be undefined if haven't obtained value from server or not allowed to see the value.
     * Should be used by current login user to check the phone verification status.
     */
    getPhoneVerified(): boolean | undefined;
    /**
     * Get the country code associated with this user
     */
    getCountry(): string | undefined;
    /**
     * Set the country code associated with this user
     * @param value The country code to set. Must be 2 alphabetic characters. Ex: US, JP, CN
     */
    setCountry(value: string): void;
    /**
     * Get the locale associated with this user
     */
    getLocale(): string | null;
    /**
     * Set the locale associated with this user
     * The locale argument must be BCP 47 language tag.
     * Examples:
     * "en": English
     * "de-AT": German as used in Austria.
     * "zh-Hans-CN": Chinese written in simplified characters as used in China.
     * @param value The locale to set.
     */
    setLocale(value: string): void;
    /**
     * Get the server's creation date of this user
     */
    getCreated(): number;
    /**
     * Get the status of the user's email verification. This field is assigned by the server
     * @returns true if the user's email address has been verified by the user, false otherwise.
     * Could be undefined if haven't obtained value from server or not allowed to see the value.
     * Should be used by current login user to check the email verification status.
     */
    isEmailVerified(): boolean | undefined;
    /**
     * Get the status of the user's phone number verification. This field is assigned by the server
     * @returns true if the user's email address has been verified by the user, false otherwise
     * Could be undefined if haven't obtained value from server or not allowed to see the value.
     * Should be used by current login user to check the phone verification status.
     */
    isPhoneVerified(): boolean | undefined;
    /**
     * Get the social accounts that is linked to this user.
     * Refresh the user by {@link KiiUser.refresh} prior call the method.
     * Otherwise, it returns empty object.
     * @returns Social network name as key and account info as value.
     */
    getLinkedSocialAccounts(): any;
    /**
     * Get the access token for the user - only available if the user is currently logged in
     * @returns Access token
     */
    getAccessToken(): string | null;
    /**
     * Return the access token and token expire time in a object.
     * <table border=4 width=250>
     *   <tr>
     *     <th>Key</th>
     *     <th>Type</th>
     *     <th>Value</th>
     *   </tr>
     *   <tr>
     *     <td>"access_token"</td>
     *     <td>String</td>
     *     <td>required for accessing KiiCloud</td>
     *   </tr>
     *   <tr>
     *     <td>"expires_at"</td>
     *     <td>Date</td>
     *     <td>Access token expiration time, null if the user is not login user.</td>
     *   </tr>
     * </table>
     * @returns Access token and token expires in a object.
     */
    getAccessTokenObject(): any;
    /** @hidden */
    getScope(): string | undefined;
    /** @hidden */
    setScope(scope: string): void;
    /**
     * Get a specifically formatted string referencing the user
     * <br><br>The user must exist in the cloud (have a valid UUID).
     * @returns A URI string based on the given user. null if a URI couldn't be generated.
     * @example
     * ```
     * let user = . . .; // a KiiUser
     * let uri = user.objectURI();
     * ```
     */
    objectURI(): string | null;
    /**
     * Sets a key/value pair to a KiiUser
     *
     * If the key already exists, its value will be written over.
     * If key is empty or starting with '_', it will do nothing.
     * Accepted types are any JSON-encodable objects.
     * @param key The key to set.
     * The key must not be a system key (created, metadata, modified, type, uuid) or begin with an underscore (_)
     * @param value The value to be set.
     * Object must be of a JSON-encodable type (Ex: dictionary, array, string, number, etc)
     * @example
     * ```
     * let user = . . .; // a KiiUser
     * user.set("score", 4298);
     * ```
     */
    set(key: string, value: any): void;
    /**
     * Gets the value associated with the given key
     * @param key The key to retrieve
     * @returns The object associated with the key. null or undefined if none exists
     * @example
     * ```
     * let user = . . .; // a KiiUser
     * let score = user.get("score");
     * ```
     */
    get(key: string): any;
    /** @hidden */
    getPath(): string;
    /**
     * The currently authenticated user
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @example
     * ```
     * let user = KiiUser.getCurrentUser();
     * ```
     */
    static getCurrentUser(app?: KiiApplication): KiiUser | null;
    /**
     * Create a user object to prepare for registration with credentials pre-filled
     *
     * Creates a pre-filled user object for manipulation.
     * This user will not be authenticated until one of the authentication methods are called on it.
     * It can be treated as any other KiiObject before it is authenticated.
     * @param username The user's desired username. Must be between 3 and 64 characters, which can include alphanumeric characters as well as underscores '_', dashes '-' and periods '.'
     * @param password The user's password. Must be between 4-50 characters, made up of ascii characters excludes control characters.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns a working KiiUser object
     * @throws {InvalidUsernameException} If the username is not in the proper format
     * @throws {InvalidPasswordException} If the password is not in the proper format
     * @example
     * ```
     * let user = KiiUser.userWithUsername("myusername", "mypassword");
     * ```
     */
    static userWithUsername(username: string, password: string, app?: KiiApplication): KiiUser;
    /**
     * Create a user object to prepare for registration with credentials pre-filled
     *
     * Creates a pre-filled user object for registration.
     * This user will not be authenticated until the registration method is called on it.
     * It can be treated as any other KiiUser before it is registered.
     * @param phoneNumber The user's phone number
     * @param password The user's password. Must be at least 4 characters, made up of alphanumeric and/or: @,#,$,%,^,&
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @throws {InvalidPasswordException} If the password is not in the proper format
     * @throws {InvalidPhoneNumberException} If the phone number is not in the proper format
     * @returns a working KiiUser object
     * @example
     * ```
     * let user = KiiUser.userWithPhoneNumber("+874012345678", "mypassword");
     * ```
     */
    static userWithPhoneNumber(phoneNumber: string, password: string, app?: KiiApplication): KiiUser;
    /**
     * Create a user object to prepare for registration with credentials pre-filled
     *
     * Creates a pre-filled user object for registration.
     * This user will not be authenticated until the registration method is called on it.
     * It can be treated as any other KiiUser before it is registered.
     * @param phoneNumber The user's phone number
     * @param username The user's desired username. Must be between 3 and 64 characters, which can include alphanumeric characters as well as underscores '_', dashes '-' and periods '.'
     * @param password The user's password. Must be at least 4 characters, made up of alphanumeric and/or: @,#,$,%,^,&
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @throws {InvalidUsernameException} If the username is not in the proper format
     * @throws {InvalidPasswordException} If the password is not in the proper format
     * @throws {InvalidPhoneNumberException} If the phone number is not in the proper format
     * @returns a working KiiUser object
     * @example
     * ```
     * let user = KiiUser.userWithPhoneNumberAndUsername("+874012345678", "johndoe", "mypassword");
     * ```
     */
    static userWithPhoneNumberAndUsername(phoneNumber: string, username: string, password: string, app?: KiiApplication): KiiUser;
    /**
     * Create a user object to prepare for registration with credentials pre-filled
     * <br><br>Creates a pre-filled user object for registration. This user will not be authenticated until the registration method is called on it. It can be treated as any other KiiUser before it is registered.
     * @param emailAddress The user's email address
     * @param password The user's password. Must be at least 4 characters, made up of alphanumeric and/or: @,#,$,%,^,&
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @throws {InvalidPasswordException} If the password is not in the proper format
     * @throws {InvalidEmailException} If the email address is not in the proper format
     * @returns a working KiiUser object
     * @example
     * ```
     * let user = KiiUser.userWithEmailAddress("johndoe@example.com", "mypassword");
     * ```
     */
    static userWithEmailAddress(emailAddress: string, password: string, app?: KiiApplication): KiiUser;
    /**
     * Create a user object to prepare for registration with credentials pre-filled
     *
     * Creates a pre-filled user object for registration.
     * This user will not be authenticated until the registration method is called on it.
     * It can be treated as any other KiiUser before it is registered.
     * @param emailAddress The user's email address
     * @param username The user's desired username. Must be between 3 and 64 characters, which can include alphanumeric characters as well as underscores '_', dashes '-' and periods '.'
     * @param password The user's password. Must be at least 4 characters, made up of alphanumeric and/or: @,#,$,%,^,&
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @throws {InvalidUsernameException} If the username is not in the proper format
     * @throws {InvalidPasswordException} If the password is not in the proper format
     * @throws {InvalidEmailException} If the phone number is not in the proper format
     * @returns a working KiiUser object
     * @example
     * ```
     * let user = KiiUser.userWithEmailAddressAndUsername("johndoe@example.com", "johndoe", "mypassword");
     * ```
     */
    static userWithEmailAddressAndUsername(emailAddress: string, username: string, password: string, app?: KiiApplication): KiiUser;
    /**
     * Create a user object to prepare for registration with credentials pre-filled
     *
     * Creates a pre-filled user object for registration.
     * This user will not be authenticated until the registration method is called on it.
     * It can be treated as any other KiiUser before it is registered.
     * @param emailAddress The user's email address
     * @param phoneNumber The user's phone number
     * @param password The user's password. Must be at least 4 characters, made up of alphanumeric and/or: @,#,$,%,^,&
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @throws {InvalidPhoneNumberException} If the phone number is not in the proper format
     * @throws {InvalidPasswordException} If the password is not in the proper format
     * @throws {InvalidEmailException} If the phone number is not in the proper format
     * @returns a working KiiUser object
     * @example
     * ```
     * let user = KiiUser.userWithEmailAddressAndPhoneNumber("johndoe@example.com", "+874012345678", "mypassword");
     * ```
     */
    static userWithEmailAddressAndPhoneNumber(emailAddress: string, phoneNumber: string, password: string, app?: KiiApplication): KiiUser;
    /**
     * Create a user object to prepare for registration with credentials pre-filled
     *
     * Creates a pre-filled user object for registration.
     * This user will not be authenticated until the registration method is called on it.
     * It can be treated as any other KiiUser before it is registered.
     * @param emailAddress The user's email address
     * @param phoneNumber The user's phone number
     * @param username The user's desired username. Must be between 3 and 64 characters, which can include alphanumeric characters as well as underscores '_', dashes '-' and periods '.'
     * @param password The user's password. Must be at least 4 characters, made up of alphanumeric and/or: @,#,$,%,^,&
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @throws {InvalidPhoneNumberException} If the phone number is not in the proper format
     * @throws {InvalidEmailException} If the phone number is not in the proper format
     * @throws {InvalidUsernameException} If the username is not in the proper format
     * @throws {InvalidPasswordException} If the password is not in the proper format
     * @returns a working KiiUser object
     * @example
     * ```
     * let user = KiiUser.userWithCredentials("johndoe@example.com", "+874012345678", "johndoe", "mypassword");
     * ```
     */
    static userWithCredentials(emailAddress: string, phoneNumber: string, username: string, password: string, app?: KiiApplication): KiiUser;
    /**
     * Instantiate KiiUser that refers to existing user which has specified ID.
     * You have to specify the ID of existing KiiUser. Unlike KiiObject,
     * you can not assign ID in the client side.<br>
     * <b>NOTE</b>: This API does not access to the server.
     * After instantiation, call {@link KiiUser.refresh} to fetch the properties.
     * @param userID ID of the KiiUser to instantiate.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return instance of KiiUser.
     * @throws {InvalidArgumentException} when passed userID is empty or null.
     * @example
     * ```
     * let user = KiiUser.userWithID("__USER_ID__");
     * ```
     */
    static userWithID(userID: string, app?: KiiApplication): KiiUser;
    /**
     * Generate a new KiiUser based on a given URI
     * @param uri The URI of the object to be represented
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {KiiUser} A new KiiUser with its parameters filled in from the URI
     * @throws {InvalidURIException} If the URI is not in the proper format
     * @example
     * ```
     * let user = KiiUser.userWithURI("kiicloud://myuri");
     * ```
     */
    static userWithURI(uri: string, app?: KiiApplication): KiiUser;
    /**
     * Creates a reference to a bucket for this user
     *
     * The bucket will be created/accessed within this user's scope
     * @param bucketName The name of the bucket the user should create/access
     * @returns {KiiBucket} A working KiiBucket object
     * @example
     * ```
     * let user = . . .; // a KiiUser
     * let bucket = user.bucketWithName("myBucket");
     * ```
     */
    bucketWithName(bucketName: string): KiiBucket;
    /**
     * Creates a reference to a encrypted bucket for this user
     *
     * The bucket will be created/accessed within this user's scope
     * @param bucketName The name of the bucket the user should create/access
     * @example
     * ```
     * let user = . . .; // a KiiUser
     * let bucket = user.encryptedBucketWithName("myBucket");
     * ```
     */
    encryptedBucketWithName(bucketName: string): KiiEncryptedBucket;
    /** @hidden */
    getACLEntityString(): string;
    /**
     * Authenticates a user with the server.
     *
     * If authentication successful, the user is cached inside SDK as current user,and accessible via
     * {@link KiiUser.getCurrentUser}.
     * User token and token expiration is also cached and can be get by {@link KiiUser.getAccessTokenObject}.
     * Access token won't be expired unless you set it explicitly by {@link Kii.setAccessTokenExpiration}.<br>
     * If password or userIdentifier is invalid, reject callback of promise will be called. <br>
     * @param userIdentifier The username, validated email address, or validated phone number of the user to authenticate
     * @param password The password of the user to authenticate
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theAuthenticatedUser). theAuthenticatedUser is KiiUser instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiUser instance.If given password or userIdentifier is invalid, it will be null.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * KiiUser.authenticate("myusername", "mypassword").then(theAuthenticatedUser => {
     *     // do something with the authenticated user
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    static authenticate(userIdentifier: string, password: string, app?: KiiApplication): Promise<KiiUser>;
    /**
     * Asynchronously authenticates a user with the server using specified access token.
     *
     * This method is non-blocking.<br><br>
     * Specified expiresAt won't be used by SDK. IF login successful,
     * we set this property so that you can get it later along with token
     * by {@link KiiUser.getAccessTokenObject}.<br>
     * Also, if successful, the user is cached inside SDK as current user
     * and accessible via {@link KiiUser.getCurrentUser}.<br>
     * Note that, if not specified, token expiration time is not cached
     * and set to value equivalant to 275760 years.<br>
     * If the specified token is expired, authenticataiton will be failed.
     * Authenticate the user again to renew the token.<br>
     * If expiresAt is invalid, reject callback of promise will be called. <br>
     * @param token A valid access token associated with the desired user
     * @param expiresAt Access token expire time that has received by {@link KiiUser.getAccessTokenObject}. This param is optional and can be omitted.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theAuthenticatedUser). theAuthenticatedUser is KiiUser instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiUser instance.If expiresAt is invalid, it will be null.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // Assume you stored the object get from KiiUser#getAccessTokenObject()
     * // and now accessing by 'tokenObject' var.
     * let token = tokenObject["access_token"];
     * let expiresAt = tokenObject["expires_at"];
     * expireDate.setHours(expireDate.getHours() + 24);
     * KiiUser.authenticateWithToken(token, null, expiresAt).then(theAuthenticatedUser => {
     *     // do something with the authenticated user
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    static authenticateWithToken(token: string, expiresAt?: Date, app?: KiiApplication): Promise<KiiUser>;
    /**
     * Asynchronously authenticates a user with the server using specified totp code.
     * This method is non-blocking.<br><br>
     *
     * @param {String} totpCode A valid totp code
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theAuthenticatedUser). theAuthenticatedUser is KiiUser instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiUser instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * KiiUser.authenticateWithTotp(totpCode).then(theAuthenticatedUser => {
     *   // do something with the authenticated user
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    static authenticateWithTotp(totpCode: string, app?: KiiApplication): Promise<KiiUser>;
    /**
     * Asynchronously authenticates a user with the server using specified recovery code.
     * This method is non-blocking.<br><br>
     *
     * @param {String} recoveryCode A valid recovery code
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theAuthenticatedUser). theAuthenticatedUser is KiiUser instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiUser instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * KiiUser.authenticateWithRecoveryCode(recoveryCode).then(theAuthenticatedUser => {
     *   // do something with the authenticated user
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    static authenticateWithRecoveryCode(recoveryCode: string, app?: KiiApplication): Promise<KiiUser>;
    /**
     * Registers a user with the server
     *
     * The user object must have an associated email/password combination.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theAuthenticatedUser). theAuthenticatedUser is KiiUser instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiUser instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let user = KiiUser.userWithUsername("myusername", "mypassword");
     * user.register().then(params => {
     *     // do something with the authenticated user
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    register(): Promise<KiiUser>;
    /**
     * Registers a user as pseudo user with the server
     * @param {Object} userFields Custom Fields to add to the user. This is optional and can be omitted.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theAuthenticatedUser). theAuthenticatedUser is KiiUser instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let userFields = {"displayName":"yourName", "country":"JP", "age":30};
     * KiiUser.registerAsPseudoUser(null, userFields).then(theAuthenticatedUser => {
     *     // do something with the authenticated user
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    static registerAsPseudoUser(userFields?: any, app?: KiiApplication): Promise<KiiUser>;
    /**
     * Sets credentials data and custom fields to pseudo user.
     *
     * This method is exclusive to pseudo user.
     * password is mandatory and needs to provide at least one of login name, email address or phone number.
     * @param identityData identityData
     * @param identityData.emailAddress The user's email address. Valid pattern is ^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$
     * @param identityData.phoneNumber The user's phone number. Global phone valid pattern is ^[\\+]{1}[0-9]{2}. Note that you must provide country code in userFields if you speficy local phone number.
     * @param identityData.username The user's desired username. Valid pattern is ^[a-zA-Z0-9-_\\.]{3,64}$
     * @param password The user's password. Valid pattern is ^[\x20-\x7E]{4,50}$.
     * @param userFields Custom Fields to add to the user. This is optional and can be omitted.
     * @param removeFields An array of field names to remove from the user custom fields. Default fields are not removed from server.
     * This is optional and can be omitted.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(user). user is KiiUser instance which this method was called on.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiUser instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let identityData = { "username": "__USER_NAME_" };
     * let userFields = { "displayName":"__DISPLAY_NAME","score":12344300 };
     * let removeFields = ["age"];
     * user.putIdentity(
     *     identityData,
     *     "__PASSWORD__",
     *     null,
     *     userFields,
     *     removeFields
     * ).then(user => {
     *     // do something with the updated user.
     * }).catch(error => {
     *     // check error response.
     * });
     * ```
     */
    putIdentity(identityData: IIdentityData, password: string, userFields?: any, removeFields?: string[]): Promise<KiiUser>;
    /**
     * Update user attributes.
     *
     * If you want to update identity data of pseudo user,
     * you must use KiiUser.putIdentity instead.
     * @param identityData identityData
     * @param identityData.emailAddress The user's email address. Valid pattern is ^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$
     * @param identityData.phoneNumber The user's phone number. Global phone valid pattern is ^[\\+]{1}[0-9]{2}. Note that you must provide country code in userFields if you specify local phone number.
     * @param identityData.username The user's desired username. Valid pattern is ^[a-zA-Z0-9-_\\.]{3,64}$
     * @param userFields Custom Fields to add to the user.
     * @param removeFields An array of field names to remove from the user custom fields. Default fields are not removed from server.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(user). user is KiiUser instance which this method was called on.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiUser instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let identityData = { "username": "__USER_NAME_" };
     * let userFields = { "displayName":"__DISPLAY_NAME","score":12344300 };
     * let removeFields = ["age"];
     * user.update(
     *     identityData,
     *     null,
     *     userFields,
     *     removeFields
     * ).then(user => {
     *     // do something with the updated user.
     * }).catch(error => {
     *     // check error response.
     * });
     * ```
     */
    update(identityData?: IIdentityData, userFields?: any, removeFields?: string[]): Promise<KiiUser>;
    /**
     * Update a user's password on the server
     *
     * Update a user's password with the server.
     * The fromPassword must be equal to the current password associated with the account in order to succeed.
     * @param fromPassword The user's current password
     * @param toPassword The user's desired password. Must be at least 4 characters, made up of alphanumeric and/or: @,#,$,%,^,&
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theUser). theUser is KiiUser instance which this method was called on.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiUser instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let user = Kii.currentUser();
     * user.updatePassword("oldpassword", "newpassword").then(theUser => {
     *     // do something
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    updatePassword(fromPassword: string, toPassword: string): Promise<KiiUser>;
    /**
     * Reset a user's password on the server
     *
     * Reset a user's password on the server.
     * The user is determined by the specified userIdentifier - which is an email address that has already been associated with an account. Reset instructions will be sent to that identifier.
     * <b>Please Note:</b> This will reset the user's access token, so if they are currently logged in - their session will no longer be valid.
     * @param userIdentifier The user's email address
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(). No parameter used.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *     <ul>
     *       <li>error.message</li>
     *     </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * KiiUser.resetPassword("johndoe@example.com").then(() => {
     *   // do something
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    static resetPassword(userIdentifier: string, app?: KiiApplication): Promise<void>;
    /**
     * Reset the password of user.
     * Reset the password of user specified by given identifier.
     * This api does not execute login after reset password.
     * @param userIdentifier should be valid email address, global phone number or user identifier obtained by {@link KiiUser.getID}.
     * @param notificationMethod specify the destination of message include link
     *  of resetting password. must one of "EMAIL", "SMS" or "SMS_PIN".
     *  - "EMAIL": Send email include link URL to reset password or password.
     *  (Contents are depends on 'Password Reset Flow' setting in app's
     *  Security settings.)
     *  - "SMS" : Send SMS include link URL to reset password.
     *  - "SMS_PIN" : Send SMS include PIN Code for reset password.
     *  different type of identifier and destination can be used
     *  as long as user have verified email, phone.
     *  (ex. User registers both email and phone. Identifier is email and
     *  notificationMethod is SMS.)
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(). No parameter used.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * KiiUser.resetPasswordWithNotificationMethod("+819001234567", "SMS").then(() => {
     *   // Operation succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    static resetPasswordWithNotificationMethod(userIdentifier: string, notificationMethod: NotificationMethod, app?: KiiApplication): Promise<void>;
    /**
     * Reset password with the PIN code in receipt SMS
     * After {@link KiiUser.resetPasswordWithNotificationMethod} is called with
     * "SMS_PIN", SMS includes the PIN code will be sent to the user's phone.
     * User can request the new password for login with the PIN code.
     * Need to call method for authentication after the new password is determined.
     * @param userIdentifier should be valid email address, global phone number or user identifier obtained by {@link KiiUser.getID}.
     * @param pinCode Received PIN code.
     * @param newPassword New password for login.
     * If the 'Password Reset Flow' in app's security setting is set to
     * 'Generate password', it would be ignored and null can be passed.
     * In this case, new password is generated on Kii Cloud and sent to user's
     * phone. Otherwise valid password is required.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *   <li>fulfill callback function: function(). No parameter used.</li>
     *   <li>reject callback function: function(error). error is an Error instance.
     *   <ul>
     *   <li>error.message</li>
     *   </ul>
     *   </li>
     *   </ul>
     * @example
     * ```
     * KiiUser.completeResetPassword("john.doe@kii.com", "new-password", "223789").then(() => {
     *   // Succeeded.
     * }).catch(error => {
     *   // Handle error here.
     * });
     * ```
     */
    static completeResetPassword(userIdentifier: string, pinCode: string, newPassword: string | null, app?: KiiApplication): Promise<void>;
    /** @hidden */
    verifyCredentials(type: "email-address" | "phone-number", code: string): Promise<KiiUser>;
    /**
     * Verify the current user's phone number
     *
     * This method is used to verify the phone number of user currently
     * logged in.
     * Verification code is sent from Kii Cloud when new user is registered with
     * phone number or user requested to change their phone number in the
     * application which requires phone verification.<br>
     * (You can enable/disable phone verification through the console in
     * developer.kii.com)<br>
     * After the verification succeeded, new phone number becomes users phone
     * number and user is able to login with the phone number.<br>
     * To get the new phone number, please call {@link KiiUser.refresh} and call
     * {@link KiiUser.getPhoneNumber}<br>
     * Before completion of {@link KiiUser.refresh}, {@link KiiUser.getPhoneNumber} returns
     * cached phone number. It could be old phone number or undefined.
     * @param verificationCode The code which verifies the currently logged in user
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theUser). theUser is KiiUser instance which this method was called on.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiUser instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let user = Kii.currentUser();
     * user.verifyPhoneNumber("012345").then(theUser => {
     *     // do something
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    verifyPhoneNumber(verificationCode: string): Promise<KiiUser>;
    /** @hidden */
    resendVerification(type: "email-address" | "phone-number"): Promise<void>;
    /**
     * Resend the email verification code to the user
     *
     * This method will re-send the email verification to the currently logged in user
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theUser). theUser is KiiUser instance which this method was called on.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiUser instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let user = Kii.currentUser();
     * user.resendEmailVerification().then(theUser => {
     *     // do something
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    resendEmailVerification(): Promise<void>;
    /**
     * Resend the SMS verification code to the user
     *
     * This method will re-send the SMS verification to the currently logged in user
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theUser). theUser is KiiUser instance which this method was called on.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiUser instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let user = Kii.currentUser();
     * user.resendPhoneNumberVerification().then(theUser => {
     *     // do something
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    resendPhoneNumberVerification(): Promise<void>;
    /**
     * Retrieve a list of groups which the user is a member of
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is Array instance.
     *       <ul>
     *         <li>params[0] is the KiiUser instance which this method was called on.</li>
     *         <li>params[1] is array of KiiGroup instances.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiUser instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let user = Kii.currentUser();
     * user.memberOfGroups().then(params => {
     *     // do something with the results
     *     let theUser = params[0];
     *     let groupList = params[1];
     *     for (let i = 0; i < groupList.length; i++) {
     *         let g = groupList[i]; // a KiiGroup object
     *     }
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    memberOfGroups(): Promise<KiiGroup[]>;
    /**
     * Retrieve the groups owned by this user. Group in the groupList
     * does not contain all the property of group. To get all the
     * property from cloud, a {@link KiiGroup.refresh} is necessary.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is Array instance.
     *       <ul>
     *         <li>params[0] is the KiiUser instance which this method was called on.</li>
     *         <li>params[1] is array of KiiGroup instances.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiUser instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let user = Kii.currentUser();
     * user.ownerOfGroups().then(params => {
     *     // do something with the results
     *     let theUser = params[0];
     *     let groupList = params[1];
     *     for (let i = 0; i < groupList.length; i++) {
     *         let g = groupList[i]; // a KiiGroup object
     *     }
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    ownerOfGroups(): Promise<KiiGroup[]>;
    private fetchGroups;
    /**
     * Change phone number of logged in user.
     * If the phone number verification is required by your app configuration,
     * User's phone number would not changed to new one until the new phone number verification has been done.
     * In this case, new phone can be obtained by {@link KiiUser.getPendingPhoneNumber}.
     * This API does not refresh the KiiUser automatically.
     * Please execute {@link KiiUser.refresh} before checking the value of {@link KiiUser.getPhoneNumber} or {@link KiiUser.getPendingPhoneNumber}.
     * @param newPhoneNumber The new phone number to change to
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theUser). theUser is KiiUser instance which this method was called on.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiUser instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let user = Kii.currentUser();
     * user.changePhone('+19415551234').then(theUser => {
     *     // do something on success
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    changePhone(newPhoneNumber: string): Promise<KiiUser>;
    /**
     * Change email of logged in user.
     * If the email address verification is required by your app configuration,
     * User's email would not changed to new one until the new email verification has been done.
     * In this case, new mail address can be obtained by {@link KiiUser.getPendingEmailAddress}.
     * This API does not refresh the KiiUser automatically.
     * Please execute {@link KiiUser.refresh} before checking the value of {@link KiiUser.getEmailAddress} or {@link KiiUser.getPendingEmailAddress}
     * @param newEmail The new email address to change to
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theUser). theUser is KiiUser instance which this method was called on.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiUser instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let user = Kii.currentUser();
     * user.changeEmail('mynewemail@kii.com').then(theUser => {
     *     // do something on success
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    changeEmail(newEmail: string): Promise<KiiUser>;
    /**
     * Saves the latest user values to the server
     *
     * If the user does not yet exist, it will NOT be created.
     * Otherwise, the fields that have changed will be updated accordingly.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theSavedUser). theSavedUser is KiiUser instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiUser instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let user = Kii.getCurrentUser(); // a KiiUser
     * user.save().then(theSavedUser => {
     *     // do something with the saved user
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    save(): Promise<KiiUser>;
    /**
     * Updates the local user's data with the user data on the server
     *
     * The user must exist on the server. Local data will be overwritten.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theRefreshedUser). theRefreshedUser is KiiUser instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiUser instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let user = Kii.getCurrentUser(); // a KiiUser
     * user.refresh().then(theRefreshedUser => {
     *     // do something with the refreshed user
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    refresh(): Promise<KiiUser>;
    /**
     * Delete the user from the server
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theDeletedUser). theDeletedUser is KiiUser instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiUser instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * let user = Kii.getCurrentUser(); // a KiiUser
     * user.delete().then(theDeletedUser => {
     *     // do something
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    delete(): Promise<KiiUser>;
    /**
     * Logs the currently logged-in user out of the KiiSDK
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @example
     * ```
     * KiiUser.logOut();
     * ```
     */
    static logOut(app?: KiiApplication): void;
    /**
     * Checks to see if there is a user authenticated with the SDK
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @example
     * ```
     * if(KiiUser.loggedIn()) {
     *   // do something
     * }
     * ```
     */
    static loggedIn(app?: KiiApplication): boolean;
    /**
     * Find registered KiiUser with the email.
     * If there are no user registers with the specified email or if there are but not verified email yet,
     * callbacks.failure or reject callback of promise will be called.<br>
     *
     * <b>Note:</b>
     * <ul>
     *   <li>If "Expose Full User Data To Others" is enabled in the application console, the response will contain full of the user data.</li>
     *   <li>Otherwise, the response will only contain "userID", "loginName" and "displayName" field values if exist.</li>
     * </ul>
     * @param email The email to find KiiUser who owns it.<br>
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * Don't add prefix of "EMAIL:" described in REST API documentation. SDK will take care of it.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theMatchedUser). theMatchedUser is KiiUser instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * KiiUser.findUserByEmail("user_to_find@example.com").then(theMatchedUser => {
     *   // Do something with the matched user
     * }).catch(error => {
     *   // Do something with the error response
     * });
     * ```
     */
    static findUserByEmail(email: string, app?: KiiApplication): Promise<KiiUser>;
    /**
     * Find registered KiiUser with the phone.
     * If there are no user registers with the specified phone or if there are but not verified phone yet,
     * callbacks.failure or reject callback of promise will be called.
     *
     * <b>Note:</b>
     * <ul>
     *   <li>If "Expose Full User Data To Others" is enabled in the application console, the response will contain full of the user data.</li>
     *   <li>Otherwise, the response will only contain "userID", "loginName" and "displayName" field values if exist.</li>
     * </ul>
     * @param phone The phone number to find KiiUser who owns it.
     * Don't add prefix of "PHONE:" described in REST API documentation. SDK will take care of it.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theMatchedUser). theMatchedUser is KiiUser instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * KiiUser.findUserByPhone("phone_number_to_find").then(theMatchedUser => {
     *   // Do something with the matched user
     * }).catch(error => {
     *   // Do something with the error response
     * });
     * ```
     */
    static findUserByPhone(phone: string, app?: KiiApplication): Promise<KiiUser>;
    /**
     * Find registered KiiUser with the user name.
     * If there are no user registers with the specified user name, callbacks.failure or reject callback of promise will be called.
     *
     * <b>Note:</b>
     * <ul>
     *   <li>If "Expose Full User Data To Others" is enabled in the application console, the response will contain full of the user data.</li>
     *   <li>Otherwise, the response will only contain "userID", "loginName" and "displayName" field values if exist.</li>
     * </ul>
     * @param username The user name to find KiiUser who owns it.
     * Don't add prefix of "LOGIN_NAME:" described in REST API documentation. SDK will take care of it.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theMatchedUser). theMatchedUser is KiiUser instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * KiiUser.findUserByUsername("user_name_to_find").then(theMatchedUser => {
     *   // Do something with the matched user
     * }).catch(error => {
     *   // Do something with the error response
     * });
     * ```
     */
    static findUserByUsername(username: string, app?: KiiApplication): Promise<KiiUser>;
    /**
     * @hidden This to be used from admin context
     */
    static findUserByUsernameWithoutLogin(username: string, app?: KiiApplication): Promise<KiiUser>;
    /**
     * @hidden This to be used from admin context
     */
    static findUserByEmailWithoutLogin(username: string, app?: KiiApplication): Promise<KiiUser>;
    /**
     * @hidden This to be used from admin context
     */
    static findUserByPhoneWithoutLogin(username: string, app?: KiiApplication): Promise<KiiUser>;
    private static findUser;
    /**
     * Instantiate topic belongs to this user.
     * @param topicName name of the topic. Must be a not empty string.
     * @return {KiiTopic} topic instance.
     */
    topicWithName(topicName: string): KiiTopic;
    /**
     * Gets a list of topics in this user scope
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
     *           <li>error.target is the KiiUser instance which this method was called on. </li>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```
     * let user = . . .; // a KiiUser
     * user.listTopics().then(params => {
     *     let topicList = params[0];
     *     let nextPaginationKey = params[1];
     *     // do something with the result
     *     for (let i = 0; i < topicList.length; i++) {
     *         let topic = topicList[i];
     *     }
     *     if (nextPaginationKey != null) {
     *         user.listTopics(null, nextPaginationKey)
     *         .then(params => {...})
     *         .catch(error => {...});
     *     }
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    listTopics(paginationKey: string): Promise<[KiiTopic[], string | null]>;
    /**
     * Instantiate push subscription for this user.
     * @return {KiiPushSubscription} push subscription object.
     */
    pushSubscription(): KiiPushSubscription;
    /**
     * Instantiate push installation for this user.
     * @return {KiiPushInstallation} push installation object.
     */
    pushInstallation(): KiiPushInstallation;
    private setId;
    /** @hidden */
    setExpiresAt(expiresAt: Date): void;
    private updateWithJSON;
    /** @hidden */
    setPassword(password: string): void;
    /** @hidden */
    setEmailAddress(email: string): void;
    /** @hidden */
    setPhoneNumber(phone: string): void;
    /** @hidden */
    setLocalPhone(phone: string, country: string): void;
    /** @hidden */
    static validateURI(value: string): string | null;
    private validateURI;
    private clearPassword;
    private findUserIdentifer;
    private isValidLocalPhoneNumber;
    private setModified;
    private updateWithIdentifier;
    private updateWithUserFields;
    private setEmailVerified;
    private setPhoneVerified;
}
export interface IIdentityData {
    emailAddress?: string;
    phoneNumber?: string;
    username?: string;
}
export declare type NotificationMethod = "EMAIL" | "SMS" | "SMS_PIN";
