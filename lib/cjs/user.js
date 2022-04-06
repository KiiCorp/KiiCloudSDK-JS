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
exports.KiiUser = void 0;
const _1 = require(".");
const app_1 = require("./app");
const bucket_1 = require("./bucket");
const exception_1 = require("./exception");
const group_1 = require("./group");
const httpResponse_1 = require("./httpResponse");
const kii_1 = require("./kii");
const push_1 = require("./push");
const topic_1 = require("./topic");
const utilities_1 = require("./utilities");
const utilities_2 = require("./utilities");
const MAX_DATE_IN_MILLIS = 100000000 * 24 * 60 * 60 * 1000;
/**
 * Represents a KiiUser object
 */
class KiiUser {
    /** @hidden */
    constructor(app) {
        this.app = app;
        this.id = null;
        this.username = undefined;
        this.password = null;
        this._disabled = undefined;
        this.displayName = null;
        this.email = undefined;
        this.emailAddressPending = undefined;
        this.phoneNumber = undefined;
        this.phoneNumberPending = undefined;
        this.country = undefined;
        this.locale = null;
        this.created = 0;
        this.modified = 0;
        this.emailVerified = undefined;
        this.phoneVerified = undefined;
        this.hasPassword = false;
        this.thirdPartyAccounts = {};
        this.customInfo = {};
        this.accessToken = null;
        this.expiresAt = null;
        this.scope = undefined;
    }
    /**
     * Get the ID of the current KiiUser instance.
     * @returns Id of the user or null if the user has not saved to cloud.
     */
    getID() {
        return this.id;
    }
    /**
     * @deprecated Use {@link KiiUser.getID} instead.
     * Get the ID of the current KiiUser instance.
     * @returns Id of the user or null if the user has not saved to cloud.
     */
    getUUID() {
        return this.id;
    }
    /**
     * Get the username of the given user
     * @returns username or undefined
     */
    getUsername() {
        return this.username;
    }
    /** @hidden */
    setUsername(username) {
        const trimmedUsername = utilities_1.trim(username);
        if (utilities_1.validateUsername(trimmedUsername)) {
            this.username = trimmedUsername;
        }
        else {
            throw new exception_1.InvalidUsernameException(undefined, this);
        }
    }
    /**
     * Return true if the user is disabled, false when enabled and undefined
     * when user is not refreshed.
     * Call {@link KiiUser.refresh} prior calling this method to get
     * correct status.
     */
    disabled() {
        return this._disabled;
    }
    /**
     * Get the display name associated with this user
     */
    getDisplayName() {
        return this.displayName;
    }
    /**
     * Set the display name associated with this user.
     * Cannot be used for logging a user in; is non-unique
     * @param {String} value Must be between 1-50 alphanumeric characters.
     * @throws {InvalidDisplayNameException} If the displayName is not a valid format
     */
    setDisplayName(value) {
        if (!utilities_1.validateDisplayName(value)) {
            throw new exception_1.InvalidDisplaynameException(undefined, this);
        }
        this.displayName = value;
    }
    /**
     * Get whether or not the user is pseudo user.
     * If this method is not called for current login user, calling
     * {@link KiiUser.refresh} method is necessary to get a correct value.
     * @returns {Boolean} whether this user is pseudo user or not.
     */
    isPseudoUser() {
        if (this.hasPassword != null) {
            return !this.hasPassword;
        }
        return (this.username != null || this.email != null || this.phoneNumber != null);
    }
    /**
     * Get the email address associated with this user
     */
    getEmailAddress() {
        return this.email;
    }
    /**
     * Get the email of this user that has not been verified.
     * When the user's email has been changed and email verification is required in you app configuration,
     * New email is stored as pending email.
     * After the new email has been verified, the address can be obtained by {@link KiiUser.getEmailAddress}
     * @returns User's new email address has not been verified.
     * null if no pending email field is included in refresh
     * response or undefined when no refresh operation has been done before.
     */
    getPendingEmailAddress() {
        return this.emailAddressPending;
    }
    /**
     * Get the phone number associated with this user
     */
    getPhoneNumber() {
        return this.phoneNumber;
    }
    /**
     * Get the phone of this user that has not been verified.
     * When the user's phone has been changed and phone verification is required in you app configuration,
     * New phone is stored as pending phone.
     * After the new phone has been verified, the address can be obtained by {@link KiiUser.getPhoneNumber}
     * @returns User's new phone number has not been verified.
     * null if no pending phone field is included in refresh
     * response or undefined when no refresh operation has been done before.
     */
    getPendingPhoneNumber() {
        return this.phoneNumberPending;
    }
    /**
     * Get the status of the user's email verification. This field is assigned by the server
     * @returns {Boolean} true if the user's email address has been verified by the user, false otherwise.
     * Could be undefined if haven't obtained value from server or not allowed to see the value.
     * Should be used by current login user to check the email verification status.
     */
    getEmailVerified() {
        return this.emailVerified;
    }
    /**
     * Get the status of the user's phone number verification. This field is assigned by the server
     * @returns {Boolean} true if the user's email address has been verified by the user, false otherwise
     * Could be undefined if haven't obtained value from server or not allowed to see the value.
     * Should be used by current login user to check the phone verification status.
     */
    getPhoneVerified() {
        return this.phoneVerified;
    }
    /**
     * Get the country code associated with this user
     */
    getCountry() {
        return this.country;
    }
    /**
     * Set the country code associated with this user
     * @param value The country code to set. Must be 2 alphabetic characters. Ex: US, JP, CN
     */
    setCountry(value) {
        this.country = value;
    }
    /**
     * Get the locale associated with this user
     */
    getLocale() {
        return this.locale;
    }
    /**
     * Set the locale associated with this user
     * The locale argument must be BCP 47 language tag.
     * Examples:
     * "en": English
     * "de-AT": German as used in Austria.
     * "zh-Hans-CN": Chinese written in simplified characters as used in China.
     * @param value The locale to set.
     */
    setLocale(value) {
        this.locale = value;
    }
    /**
     * Get the server's creation date of this user
     */
    getCreated() {
        return this.created;
    }
    /**
     * Get the status of the user's email verification. This field is assigned by the server
     * @returns true if the user's email address has been verified by the user, false otherwise.
     * Could be undefined if haven't obtained value from server or not allowed to see the value.
     * Should be used by current login user to check the email verification status.
     */
    isEmailVerified() {
        return this.emailVerified;
    }
    /**
     * Get the status of the user's phone number verification. This field is assigned by the server
     * @returns true if the user's email address has been verified by the user, false otherwise
     * Could be undefined if haven't obtained value from server or not allowed to see the value.
     * Should be used by current login user to check the phone verification status.
     */
    isPhoneVerified() {
        return this.phoneVerified;
    }
    /**
     * Get the social accounts that is linked to this user.
     * Refresh the user by {@link KiiUser.refresh} prior call the method.
     * Otherwise, it returns empty object.
     * @returns Social network name as key and account info as value.
     */
    getLinkedSocialAccounts() {
        return null;
    }
    /**
     * Get the access token for the user - only available if the user is currently logged in
     * @returns Access token
     */
    getAccessToken() {
        return this.accessToken;
    }
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
    getAccessTokenObject() {
        if (this.accessToken) {
            return {
                access_token: this.accessToken,
                expires_at: this.expiresAt,
            };
        }
        return null;
    }
    /** @hidden */
    getScope() {
        return this.scope;
    }
    /** @hidden */
    setScope(scope) {
        this.scope = scope;
    }
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
    objectURI() {
        let uri = null;
        if (this.id) {
            uri = `kiicloud://users/${this.getID()}`;
        }
        return uri;
    }
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
    set(key, value) {
        if (!utilities_1.isNonEmptyString(key) || key.substr(0, 1) == "_") {
            return;
        }
        this.customInfo[key] = value;
    }
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
    get(key) {
        return this.customInfo[key];
    }
    /** @hidden */
    getPath() {
        return `/users/${this.id}`;
    }
    /**
     * The currently authenticated user
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @example
     * ```
     * let user = KiiUser.getCurrentUser();
     * ```
     */
    static getCurrentUser(app = app_1.KiiApplication.globalApp) {
        return app.getCurrentUser();
    }
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
    static userWithUsername(username, password, app = app_1.KiiApplication.globalApp) {
        const user = new KiiUser(app);
        user.setUsername(username);
        user.setPassword(password);
        return user;
    }
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
    static userWithPhoneNumber(phoneNumber, password, app = app_1.KiiApplication.globalApp) {
        const user = new KiiUser(app);
        user.setPhoneNumber(phoneNumber);
        user.setPassword(password);
        return user;
    }
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
    static userWithPhoneNumberAndUsername(phoneNumber, username, password, app = app_1.KiiApplication.globalApp) {
        const user = new KiiUser(app);
        user.setUsername(username);
        user.setPassword(password);
        user.setPhoneNumber(phoneNumber);
        return user;
    }
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
    static userWithEmailAddress(emailAddress, password, app = app_1.KiiApplication.globalApp) {
        const user = new KiiUser(app);
        user.setPassword(password);
        user.setEmailAddress(emailAddress);
        return user;
    }
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
    static userWithEmailAddressAndUsername(emailAddress, username, password, app = app_1.KiiApplication.globalApp) {
        const user = new KiiUser(app);
        user.setUsername(username);
        user.setPassword(password);
        user.setEmailAddress(emailAddress);
        return user;
    }
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
    static userWithEmailAddressAndPhoneNumber(emailAddress, phoneNumber, password, app = app_1.KiiApplication.globalApp) {
        const user = new KiiUser(app);
        user.setPassword(password);
        user.setEmailAddress(emailAddress);
        user.setPhoneNumber(phoneNumber);
        return user;
    }
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
    static userWithCredentials(emailAddress, phoneNumber, username, password, app = app_1.KiiApplication.globalApp) {
        const user = new KiiUser(app);
        user.setUsername(username);
        user.setPassword(password);
        user.setEmailAddress(emailAddress);
        user.setPhoneNumber(phoneNumber);
        return user;
    }
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
    static userWithID(userID, app = app_1.KiiApplication.globalApp) {
        const user = new KiiUser(app);
        user.setId(userID);
        return user;
    }
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
    static userWithURI(uri, app = app_1.KiiApplication.globalApp) {
        const user = new KiiUser(app);
        const uuid = KiiUser.validateURI(uri);
        if (uuid) {
            user.setId(uuid);
        }
        else {
            throw new exception_1.InvalidURIException(undefined, undefined);
        }
        return user;
    }
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
    bucketWithName(bucketName) {
        return new _1.KiiBucket(bucketName, this, this.app);
    }
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
    encryptedBucketWithName(bucketName) {
        return new bucket_1.KiiEncryptedBucket(bucketName, this, this.app);
    }
    /** @hidden */
    getACLEntityString() {
        return `UserID:${this.getID()}`;
    }
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
    static authenticate(userIdentifier, password, app = app_1.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utilities_1.validatePassword(password)) {
                throw new exception_1.InvalidPasswordException("Invalid Password pattern set", undefined);
            }
            if (!isValidUserIdentifier(userIdentifier)) {
                throw new exception_1.InvalidUserIdentifierException("Invalid User Identifier set", undefined);
            }
            const result = yield authenticate(userIdentifier, password, app);
            const user = new KiiUser(app);
            user.setId(result.userId);
            user.accessToken = result.accessToken;
            app.setCurrentUser(user, result.accessToken);
            if (result.expiresAt) {
                const now = new Date();
                const currentTime = now.getTime();
                const expiresAt = utilities_2.safeCalculateExpiresAtAsDate(result.expiresAt, currentTime);
                user.setExpiresAt(expiresAt);
            }
            if (result.scope) {
                user.setScope(result.scope);
            }
            return user;
        });
    }
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
    static authenticateWithToken(token, expiresAt, app = app_1.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${app.getAppID()}/users/me`;
            const request = app.newRequest("GET", url);
            request.isSendAccessToken(false); // remove Authorization header
            request.addHeader("Authorization", `Bearer ${token}`);
            const response = yield request.send();
            if (response.status != 200) {
                throw exception_1.parseErrorResponse(request, response, undefined, null);
            }
            const user = new KiiUser(app);
            if (expiresAt === undefined) {
                user.setExpiresAt(new Date(MAX_DATE_IN_MILLIS));
            }
            else {
                user.setExpiresAt(expiresAt);
            }
            user.updateWithJSON(response.body);
            user.accessToken = token;
            app.setCurrentUser(user, token);
            return user;
        });
    }
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
    static authenticateWithTotp(totpCode, app = app_1.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                grant_type: "mfa",
                totp_code: totpCode,
            };
            const url = `/apps/${app.getAppID()}/oauth2/token`;
            const request = app.newRequest("POST", url);
            const response = yield request.send(JSON.stringify(data));
            if (response.status != 200) {
                throw exception_1.parseErrorResponse(request, response, new KiiUser(app), null);
            }
            const user = new KiiUser(app);
            user.updateWithJSON(response.body);
            return user;
        });
    }
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
    static authenticateWithRecoveryCode(recoveryCode, app = app_1.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                grant_type: "mfa",
                recovery_code: recoveryCode,
            };
            const url = `/apps/${app.getAppID()}/oauth2/token`;
            const request = app.newRequest("POST", url);
            const response = yield request.send(JSON.stringify(data));
            if (response.status != 200) {
                throw exception_1.parseErrorResponse(request, response, new KiiUser(app), null);
            }
            const user = new KiiUser(app);
            user.updateWithJSON(response.body);
            return user;
        });
    }
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
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            const password = this.password;
            if (password == null) {
                throw utilities_2.error("password is not set", this);
            }
            const url = `/apps/${this.app.getAppID()}/users`;
            const data = {
                password: this.password,
            };
            if (this.username !== null) {
                data["loginName"] = this.username;
            }
            if (this.displayName !== null) {
                data["displayName"] = this.displayName;
            }
            if (this.email !== null) {
                data["emailAddress"] = this.email;
            }
            if (this.phoneNumber !== null) {
                data["phoneNumber"] = this.phoneNumber;
            }
            if (!isValidLocalPhoneNumber(this.phoneNumber, this.country)) {
                throw "needs to provide country for the local phone number";
            }
            if (this.country !== null) {
                data["country"] = this.country;
            }
            if (this.locale !== null) {
                data["locale"] = this.locale;
            }
            for (let key in this.customInfo) {
                data[key] = this.customInfo[key];
            }
            const request = this.app.newRequest("POST", url);
            request.isSendAccessToken(false);
            request.setContentType("application/vnd.kii.RegistrationRequest+json");
            let response;
            try {
                response = yield request.send(JSON.stringify(data));
            }
            catch (e) {
                this.clearPassword();
                throw e;
            }
            if (response.status != 201) {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
            this.updateWithJSON(response.body);
            // authenticate
            const userIdentifer = this.findUserIdentifer();
            const result = yield authenticate(userIdentifer, password, this.app);
            // set results to this user object
            this.accessToken = result.accessToken;
            this.setId(result.userId);
            this.app.setCurrentUser(this, result.accessToken);
            if (result.expiresAt) {
                const now = new Date();
                const currentTime = now.getTime();
                const expiresAt = utilities_2.safeCalculateExpiresAtAsDate(result.expiresAt, currentTime);
                this.setExpiresAt(expiresAt);
            }
            if (result.scope) {
                this.setScope(result.scope);
            }
            this.clearPassword();
            // fetch other fields
            // await this.refresh();
            return this;
        });
    }
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
    static registerAsPseudoUser(userFields = {}, app = app_1.KiiApplication.globalApp) {
        return __awaiter(this, arguments, void 0, function* () {
            // sustain the compatibility with v2
            if (utilities_1.isCallback(arguments[0])) {
                userFields = arguments[1];
                app = arguments[2] || app_1.KiiApplication.globalApp;
            }
            const url = `/apps/${app.getAppID()}/users`;
            const request = app.newRequest("POST", url);
            request.addHeader("x-kii-sdk", kii_1.KiiSDKClientInfo.getSDKClientInfo());
            request.setContentType("application/vnd.kii.RegistrationAndAuthorizationRequest+json");
            request.isSendAccessToken(false);
            if (userFields === null) {
                userFields = {};
            }
            const response = yield request.send(JSON.stringify(userFields));
            if (httpResponse_1.isSuccess(response.status)) {
                const accessToken = response.body["_accessToken"];
                const user = new KiiUser(app);
                user.accessToken = accessToken;
                user.updateWithJSON(response.body);
                user.setExpiresAt(new Date(MAX_DATE_IN_MILLIS));
                app.setCurrentUser(user, accessToken);
                return user;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, undefined, null);
            }
        });
    }
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
    putIdentity(identityData, password, userFields = {}, removeFields = []) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isPseudoUser()) {
                throw new exception_1.IllegalStateException("This user has the identity already", this);
            }
            const currentUser = this.app.getCurrentUser();
            if (currentUser == null || currentUser.getAccessToken() == null) {
                throw new exception_1.IllegalStateException("User is not logged in", this);
            }
            // validate values and throw exception
            validateIdentityData(identityData);
            if (!hasIdentityData(identityData)) {
                throw new exception_1.IllegalStateException("needs to provide at least one of login name, email address or phone number", this);
            }
            if (!utilities_1.validatePassword(password)) {
                throw new exception_1.IllegalStateException("invalid password", this);
            }
            const country = userFields === null || userFields === void 0 ? void 0 : userFields.country;
            if ((identityData === null || identityData === void 0 ? void 0 : identityData.phoneNumber) != null) {
                if (!this.isValidLocalPhoneNumber(identityData.phoneNumber, country)) {
                    throw new exception_1.IllegalStateException("needs to provide country for the local phone number", this);
                }
            }
            // check current user state and current custom fields.
            // we cannot use PATCH update for user fields.
            const user = yield this.refresh();
            if (!user.isPseudoUser()) {
                throw new exception_1.IllegalStateException("This user has the identity already", this);
            }
            const data = deepCopy(user.customInfo);
            if (identityData.emailAddress != null) {
                data.emailAddress = identityData.emailAddress;
            }
            if (identityData.phoneNumber != null) {
                data.phoneNumber = identityData.phoneNumber;
            }
            if (identityData.username != null) {
                data.loginName = identityData.username;
            }
            data.password = password;
            Object.assign(data, userFields);
            removeFields === null || removeFields === void 0 ? void 0 : removeFields.forEach((field) => {
                delete data[field];
            });
            // update user
            const url = `/apps/${this.app.getAppID()}/users/${this.getID()}`;
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.UserUpdateRequest+json");
            const response = yield request.send(JSON.stringify(data));
            if (httpResponse_1.isSuccess(response.status)) {
                user.setModified(response.body["modifiedAt"]);
                user.updateWithIdentifier(identityData);
                user.updateWithUserFields(userFields, removeFields);
                return user;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    update(identityData = {}, userFields = {}, removeFields = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = this.app.getCurrentUser();
            if (currentUser == null || currentUser.getAccessToken() == null) {
                throw new exception_1.IllegalStateException("User is not logged in", this);
            }
            const hasParameter = (identityData, userFields, removeFields, hasIdentity) => {
                validateIdentityData(identityData);
                if (hasIdentity)
                    return true;
                if (userFields && Object.keys(userFields).length > 0)
                    return true;
                if (removeFields.length > 0)
                    return true;
                return false;
            };
            const hasIdentity = hasIdentityData(identityData);
            if (!hasParameter(identityData, userFields, removeFields, hasIdentity)) {
                throw new exception_1.IllegalStateException("all arguments are null or empty", this);
            }
            const country = userFields === null || userFields === void 0 ? void 0 : userFields.country;
            if ((identityData === null || identityData === void 0 ? void 0 : identityData.phoneNumber) != null) {
                if (!this.isValidLocalPhoneNumber(identityData.phoneNumber, country)) {
                    throw new exception_1.IllegalStateException("needs to provide country for the local phone number", this);
                }
            }
            const user = yield this.refresh();
            if (user.isPseudoUser() && hasIdentity) {
                throw new exception_1.IllegalStateException("Pseudo user must use putIdentity()", this);
            }
            const data = deepCopy(user.customInfo);
            if ((identityData === null || identityData === void 0 ? void 0 : identityData.emailAddress) != null) {
                data.emailAddress = identityData.emailAddress;
            }
            if ((identityData === null || identityData === void 0 ? void 0 : identityData.phoneNumber) != null) {
                data.phoneNumber = identityData.phoneNumber;
            }
            if ((identityData === null || identityData === void 0 ? void 0 : identityData.username) != null) {
                data.loginName = identityData.username;
            }
            Object.assign(data, userFields);
            if ((removeFields === null || removeFields === void 0 ? void 0 : removeFields.length) > 0) {
                removeFields.forEach((field) => {
                    delete data[field];
                });
            }
            // update user
            const url = `/apps/${this.app.getAppID()}/users/${this.getID()}`;
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.UserUpdateRequest+json");
            const response = yield request.send(JSON.stringify(data));
            if (httpResponse_1.isSuccess(response.status)) {
                user.setModified(response.body["modifiedAt"]);
                user.updateWithIdentifier(identityData);
                user.updateWithUserFields(userFields, removeFields);
                return user;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    updatePassword(fromPassword, toPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utilities_1.validatePassword(toPassword)) {
                throw new exception_1.InvalidPasswordException("Invalid password", this);
            }
            const url = `/apps/${this.app.getAppID()}/users/${this.getID()}/password`;
            const body = {
                oldPassword: fromPassword,
                newPassword: toPassword,
            };
            const request = this.app.newRequest("PUT", url);
            request.setContentType("application/vnd.kii.ChangePasswordRequest+json");
            const response = yield request.send(JSON.stringify(body));
            this.clearPassword(); // required?
            if (httpResponse_1.isSuccess(response.status)) {
                return this;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    static resetPassword(userIdentifier, app = app_1.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utilities_1.validateEmail(userIdentifier)) {
                throw new exception_1.IllegalStateException("Invalid user identifier. Must be a valid email address", undefined);
            }
            const accountType = "EMAIL";
            const url = `/apps/${app.getAppID()}/users/${accountType}:${userIdentifier}/password/request-reset`;
            const request = app.newRequest("POST", url);
            request.isSendAccessToken(false);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                // OK!
                return;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, undefined, null);
            }
        });
    }
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
    static resetPasswordWithNotificationMethod(userIdentifier, notificationMethod, app = app_1.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userIdentifier !== "string") {
                throw new exception_1.IllegalStateException("given userIdentifier is not string", undefined);
            }
            if (userIdentifier.length == 0) {
                throw new exception_1.IllegalStateException("given userIdentifier is empty", undefined);
            }
            if (notificationMethod !== "EMAIL" &&
                notificationMethod !== "SMS" &&
                notificationMethod !== "SMS_PIN") {
                throw new exception_1.IllegalStateException("notificationMethod should be 'EMAIL' or 'SMS' or 'SMS_PIN'", undefined);
            }
            const toQualifiedId = (userIdentifier) => {
                if (utilities_1.validateEmail(userIdentifier)) {
                    return `EMAIL:${userIdentifier}`;
                }
                if (utilities_1.isGlobalPhoneNumber(userIdentifier)) {
                    return `PHONE:${userIdentifier}`;
                }
                return userIdentifier;
            };
            const qualifiedId = toQualifiedId(userIdentifier);
            const url = `/apps/${app.getAppID()}/users/${qualifiedId}/password/request-reset`;
            const body = {
                notificationMethod: notificationMethod,
            };
            if (notificationMethod == "SMS_PIN") {
                body.notificationMethod = "SMS";
                body.smsResetMethod = "PIN";
            }
            const request = app.newRequest("POST", url);
            request.addHeader("x-kii-sdk", kii_1.KiiSDKClientInfo.getSDKClientInfo());
            request.isSendAccessToken(false);
            request.setContentType("application/vnd.kii.ResetPasswordRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if (httpResponse_1.isSuccess(response.status)) {
                // OK!
                return;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, undefined, null);
            }
        });
    }
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
    static completeResetPassword(userIdentifier, pinCode, newPassword, app = app_1.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userIdentifier.length == 0) {
                throw new exception_1.IllegalStateException("given userIdentifier is null or empty", undefined);
            }
            if (pinCode.length == 0) {
                throw new exception_1.IllegalStateException("given pinCode is null or empty", undefined);
            }
            const qualifiedId = toQualifiedId(userIdentifier);
            const url = `/apps/${app.getAppID()}/users/${qualifiedId}/password/complete-reset`;
            const body = {
                pinCode: pinCode,
            };
            if (newPassword != null && newPassword.length > 0) {
                body["newPassword"] = newPassword;
            }
            const request = app.newRequest("POST", url);
            request.addHeader("x-kii-sdk", kii_1.KiiSDKClientInfo.getSDKClientInfo());
            request.setContentType("application/vnd.kii.CompletePasswordResetRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if (httpResponse_1.isSuccess(response.status)) {
                // OK!
                return;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, undefined, null);
            }
        });
    }
    /** @hidden */
    verifyCredentials(type, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}/users/me/${type}/verify`;
            const body = {
                verificationCode: code,
            };
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.AddressVerificationRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if (httpResponse_1.isSuccess(response.status)) {
                if (type == "email-address") {
                    this.setEmailVerified(true);
                }
                else if (type == "phone-number") {
                    this.setPhoneVerified(true);
                }
                return this;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    verifyPhoneNumber(verificationCode) {
        return this.verifyCredentials("phone-number", verificationCode);
    }
    /** @hidden */
    resendVerification(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}/users/${this.getID()}/${type}/resend-verification`;
            const request = this.app.newRequest("POST", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                // OK!
                return;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    resendEmailVerification() {
        return this.resendVerification("email-address");
    }
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
    resendPhoneNumberVerification() {
        return this.resendVerification("phone-number");
    }
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
    memberOfGroups() {
        const url = `/apps/${this.app.getAppID()}/groups/?is_member=${this.getID()}`;
        return this.fetchGroups(url);
    }
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
    ownerOfGroups() {
        const url = `/apps/${this.app.getAppID()}/groups/?owner=${this.getID()}`;
        return this.fetchGroups(url);
    }
    fetchGroups(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = this.app.newRequest("GET", url);
            request.addHeader("Accept", "application/vnd.kii.GroupsRetrievalResponse+json");
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                const groups = response.body["groups"];
                return groups.map((obj) => {
                    return group_1.KiiGroup.groupWithJSON(obj);
                });
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    changePhone(newPhoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}/users/${this.getID()}/phone-number`;
            const body = {
                phoneNumber: newPhoneNumber,
            };
            const request = this.app.newRequest("PUT", url);
            request.setContentType("application/vnd.kii.PhoneNumberModificationRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if (httpResponse_1.isSuccess(response.status)) {
                // OK!
                return this;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    changeEmail(newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utilities_1.validateEmail(newEmail)) {
                throw new exception_1.IllegalStateException("Invalid email address format", this);
            }
            const url = `/apps/${this.app.getAppID()}/users/${this.getID()}/email-address`;
            const body = {
                emailAddress: newEmail,
            };
            const request = this.app.newRequest("PUT", url);
            request.setContentType("application/vnd.kii.EmailAddressModificationRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if (httpResponse_1.isSuccess(response.status)) {
                // OK!
                return this;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}/users/${this.getID()}`;
            const body = deepCopy(this.customInfo);
            if (this.country != null) {
                body["country"] = this.country;
            }
            if (this.locale != null) {
                body["locale"] = this.locale;
            }
            if (this.displayName != null) {
                body["displayName"] = this.displayName;
            }
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.UserUpdateRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if (httpResponse_1.isSuccess(response.status)) {
                this.setModified(response.body["modifiedAt"]);
                return this;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
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
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            // const currentUser = this.app.getCurrentUser();
            // if (currentUser == null || currentUser.getAccessToken() == null) {
            //   throw new IllegalStateException("User is not logged in");
            // }
            const url = `/apps/${this.app.getAppID()}/users/${this.id}`;
            const request = this.app.newRequest("GET", url);
            const response = yield request.send();
            if (response.status != 200) {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
            if (response.status < 300 && response.status >= 200) {
                // FIXME: All fields should be cleared before refresh.
                this.phoneNumberPending = null;
                this.emailAddressPending = null;
                this.updateWithJSON(response.body);
            }
            return this;
        });
    }
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
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}/users/${this.id}`;
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                // OK!
                return this;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
    /**
     * Logs the currently logged-in user out of the KiiSDK
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @example
     * ```
     * KiiUser.logOut();
     * ```
     */
    static logOut(app = app_1.KiiApplication.globalApp) {
        app.logOut();
    }
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
    static loggedIn(app = app_1.KiiApplication.globalApp) {
        return app.loggedIn();
    }
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
    static findUserByEmail(email, app = app_1.KiiApplication.globalApp) {
        const currentUser = app.getCurrentUser();
        if (currentUser == null || currentUser.getAccessToken() == null) {
            throw new exception_1.IllegalStateException("User is not logged in", undefined);
        }
        if (email.length == 0) {
            throw new exception_1.IllegalStateException("email should not null or empty", undefined);
        }
        const url = `/apps/${app.getAppID()}/users/EMAIL:${email}`;
        return KiiUser.findUser(url, app);
    }
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
    static findUserByPhone(phone, app = app_1.KiiApplication.globalApp) {
        const currentUser = app.getCurrentUser();
        if (currentUser == null || currentUser.getAccessToken() == null) {
            throw new exception_1.IllegalStateException("User is not logged in", undefined);
        }
        if (phone.length == 0) {
            throw new exception_1.IllegalStateException("phone should not null or empty", undefined);
        }
        const url = `/apps/${app.getAppID()}/users/PHONE:${phone}`;
        return KiiUser.findUser(url, app);
    }
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
    static findUserByUsername(username, app = app_1.KiiApplication.globalApp) {
        const currentUser = app.getCurrentUser();
        if (currentUser == null || currentUser.getAccessToken() == null) {
            throw new exception_1.IllegalStateException("User is not logged in", undefined);
        }
        if (username.length == 0) {
            throw new exception_1.IllegalStateException("username should not null or empty", undefined);
        }
        const url = `/apps/${app.getAppID()}/users/LOGIN_NAME:${username}`;
        return KiiUser.findUser(url, app);
    }
    /**
     * @hidden This to be used from admin context
     */
    static findUserByUsernameWithoutLogin(username, app = app_1.KiiApplication.globalApp) {
        const url = `/apps/${app.getAppID()}/users/LOGIN_NAME:${username}`;
        return KiiUser.findUser(url, app);
    }
    /**
     * @hidden This to be used from admin context
     */
    static findUserByEmailWithoutLogin(username, app = app_1.KiiApplication.globalApp) {
        const url = `/apps/${app.getAppID()}/users/EMAIL:${username}`;
        return KiiUser.findUser(url, app);
    }
    /**
     * @hidden This to be used from admin context
     */
    static findUserByPhoneWithoutLogin(username, app = app_1.KiiApplication.globalApp) {
        const url = `/apps/${app.getAppID()}/users/PHONE:${username}`;
        return KiiUser.findUser(url, app);
    }
    static findUser(url, app) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = app.newRequest("GET", url);
            request.addHeader("x-kii-sdk", kii_1.KiiSDKClientInfo.getSDKClientInfo());
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                const user = new KiiUser(app);
                user.updateWithJSON(response.body);
                return user;
            }
            else {
                throw exception_1.parseErrorResponse(request, response, undefined, null);
            }
        });
    }
    /**
     * Instantiate topic belongs to this user.
     * @param topicName name of the topic. Must be a not empty string.
     * @return {KiiTopic} topic instance.
     */
    topicWithName(topicName) {
        if (topicName.length == 0) {
            throw new exception_1.IllegalStateException("topicName should not null or empty", this);
        }
        const userId = this.getID();
        if (userId == null || userId.length == 0) {
            throw new exception_1.IllegalStateException("can not instantiate topic from instance which doesn't have ID", this);
        }
        const uri = `/users/${this.getID()}`;
        return new topic_1.KiiTopic(uri, topicName, this.app);
    }
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
    listTopics(paginationKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `/apps/${this.app.getAppID()}/users/${this.getID()}/topics`;
            if (paginationKey && paginationKey.length > 0) {
                url = url + `?paginationKey=${encodeURIComponent(paginationKey)}`;
            }
            const request = this.app.newRequest("GET", url);
            const response = yield request.send();
            if (httpResponse_1.isSuccess(response.status)) {
                const nextPaginationKey = response.body["paginationKey"] || null;
                const topics = response.body["topics"];
                const items = topics.map((topic) => this.topicWithName(topic["topicID"]));
                return [items, nextPaginationKey];
            }
            else {
                throw exception_1.parseErrorResponse(request, response, this, null);
            }
        });
    }
    /**
     * Instantiate push subscription for this user.
     * @return {KiiPushSubscription} push subscription object.
     */
    pushSubscription() {
        return new push_1.KiiPushSubscription(this, this.app);
    }
    /**
     * Instantiate push installation for this user.
     * @return {KiiPushInstallation} push installation object.
     */
    pushInstallation() {
        if (this.app.isAdmin()) {
            throw utilities_2.error("UnsupportedOperationException: Push installation is not supported by admin context", this);
        }
        return new push_1.KiiPushInstallation(this, this.app);
    }
    setId(id) {
        this.id = id;
    }
    /** @hidden */
    setExpiresAt(expiresAt) {
        this.expiresAt = expiresAt;
    }
    updateWithJSON(body) {
        const isUserId = (key) => key == "userID" || key == "id";
        const isCreated = (key) => key == "created" || key == "createdAt" || key == "_created";
        const isModified = (key) => key == "modified" || key == "modifiedAt" || key == "_modified";
        const isCustomInfo = (key) => key.substr(0, 1) != "_";
        const customInfo = {};
        for (let key in body) {
            const value = body[key];
            if (isUserId(key)) {
                this.id = value;
            }
            else if (isCreated(key)) {
                this.created = value;
            }
            else if (isModified(key)) {
                this.modified = value;
            }
            switch (key) {
                case "loginName":
                    this.username = value;
                    break;
                case "displayName":
                    this.displayName = value;
                    break;
                case "country":
                    this.country = value;
                    break;
                case "locale":
                    this.locale = value;
                    break;
                case "emailAddress":
                    this.email = value;
                    break;
                case "_emailAddressPending":
                    this.emailAddressPending = value;
                    break;
                case "phoneNumber":
                    this.phoneNumber = value;
                    break;
                case "_phoneNumberPending":
                    this.phoneNumberPending = value;
                    break;
                case "emailAddressVerified":
                    this.emailVerified = value;
                    break;
                case "phoneNumberVerified":
                    this.phoneVerified = value;
                    break;
                case "_hasPassword":
                    this.hasPassword = value;
                    break;
                case "_thirdPartyAccounts":
                    if (value["hotmail"] != null) {
                        // change type: hotmail -> live
                        const tmp = value["hotmail"];
                        tmp.type = "live";
                        value["live"] = tmp;
                        delete value.hotmail;
                    }
                    this.thirdPartyAccounts = value;
                    break;
                case "_disabled":
                    this._disabled = value;
                    break;
                case "":
                    // server allows this
                    customInfo[""] = value;
                    break;
                default:
                    // check whether key is custom
                    if (isCustomInfo(key)) {
                        customInfo[key] = value;
                    }
                    break;
            } // end of switch
        } // end of for
        this.customInfo = customInfo;
    }
    // private setUsername(username: string) {
    //   const trimmedUsername = trim(username);
    //   if (validateUsername(trimmedUsername)) {
    //     this.username = trimmedUsername;
    //   } else {
    //     throw new InvalidUsernameException();
    //   }
    // }
    /** @hidden */
    setPassword(password) {
        if (!utilities_1.validatePassword(password)) {
            throw new exception_1.InvalidPasswordException("Invalid password", this);
        }
        this.password = password;
    }
    /** @hidden */
    setEmailAddress(email) {
        const trimmedEmail = utilities_1.trim(email);
        if (utilities_1.validateEmail(trimmedEmail)) {
            this.email = trimmedEmail;
        }
        else {
            throw new exception_1.InvalidEmailException("Invalid Email Address", this);
        }
    }
    /** @hidden */
    setPhoneNumber(phone) {
        if (utilities_1.validatePhoneNumber(phone)) {
            this.phoneNumber = phone;
        }
        else {
            throw new exception_1.InvalidPhoneNumberException("Invalid Phone", this);
        }
    }
    /** @hidden */
    setLocalPhone(phone, country) {
        if (utilities_1.validateLocalPhone(phone)) {
            this.phoneNumber = phone;
        }
        else {
            throw new exception_1.InvalidPhoneNumberException("Invalid Phone", this);
        }
        if (utilities_1.validateCountryCode(country)) {
            this.country = country;
        }
        else {
            throw new exception_1.InvalidPhoneNumberException("Invalid Coruntry", this);
        }
    }
    /** @hidden */
    static validateURI(value) {
        value = utilities_1.trim(value);
        // ensure this is in proper format
        const pattern = /^kiicloud:\/\/users\/(.*$)/i;
        if (typeof value === "string") {
            const match = value.match(pattern);
            if (match)
                return match[1];
        }
        return null;
    }
    validateURI(value) {
        value = utilities_1.trim(value);
        // ensure this is in proper format
        const pattern = /^kiicloud:\/\/users\/(.*$)/i;
        if (typeof value === "string") {
            const match = value.match(pattern);
            if (match)
                return match[1];
        }
        return null;
    }
    clearPassword() {
        this.password = null;
    }
    findUserIdentifer() {
        if (this.username != null) {
            return this.username;
        }
        if (this.email != null && this.emailVerified == true) {
            return this.email;
        }
        if (this.phoneNumber != null && this.phoneVerified == true) {
            return this.phoneNumber;
        }
        if (this.email != null) {
            return this.email;
        }
        if (this.phoneNumber != null) {
            return this.phoneNumber;
        }
        throw new exception_1.IllegalStateException("No identifier", this);
    }
    isValidLocalPhoneNumber(phoneNumber, country) {
        if (utilities_1.isGlobalPhoneNumber(phoneNumber)) {
            return true;
        }
        if (country == null) {
            return false;
        }
        return isValidLocalPhoneNumber(phoneNumber, country);
    }
    setModified(modified) {
        this.modified = modified;
    }
    updateWithIdentifier(identityData) {
        if ((identityData === null || identityData === void 0 ? void 0 : identityData.username) != null) {
            this.username = identityData.username;
        }
        if ((identityData === null || identityData === void 0 ? void 0 : identityData.emailAddress) != null) {
            this.email = identityData.emailAddress;
        }
        if ((identityData === null || identityData === void 0 ? void 0 : identityData.phoneNumber) != null) {
            this.phoneNumberPending = identityData.phoneNumber;
        }
    }
    updateWithUserFields(userFields, removeFields) {
        for (let key in userFields) {
            const value = userFields[key];
            switch (key) {
                case "displayName":
                    this.displayName = value;
                    break;
                case "country":
                    this.country = value;
                    break;
                case "locale":
                    this.locale = value;
                    break;
                case "":
                    this.customInfo[""] = value;
                    break;
                default:
                    if (key.substr(0, 1) != "_") {
                        this.customInfo[key] = value;
                    }
                    break;
            }
        }
        removeFields === null || removeFields === void 0 ? void 0 : removeFields.forEach((field) => {
            delete this.customInfo[field];
        });
    }
    setEmailVerified(emailVerified) {
        this.emailVerified = emailVerified;
    }
    setPhoneVerified(phoneVerified) {
        this.phoneVerified = phoneVerified;
    }
} // end of class
exports.KiiUser = KiiUser;
const isValidLocalPhoneNumber = (phoneNumber, country) => {
    if (phoneNumber !== undefined && !utilities_1.isGlobalPhoneNumber(phoneNumber)) {
        if (country == undefined) {
            return false;
        }
        return utilities_1.validateCountryCode(country);
    }
    return true;
};
const isValidUserIdentifier = (identifier) => {
    if (utilities_1.validateEmail(identifier)) {
        return true;
    }
    if (utilities_1.validatePhoneNumber(identifier)) {
        return true;
    }
    if (utilities_1.validateUsername(identifier)) {
        return true;
    }
    return false;
};
const authenticate = (userIdentifier, password, app) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `/oauth2/token`;
    const body = {
        username: userIdentifier,
        password: password,
    };
    if (app.getAccessTokenExpiration() > 0) {
        const now = new Date();
        const currentTime = now.getTime();
        body["expiresAt"] = utilities_2.safeCalculateExpiresAtAsNumber(app.getAccessTokenExpiration(), currentTime);
    }
    const request = app.newRequest("POST", url);
    request.isSendAccessToken(false);
    // send
    const response = yield request.send(JSON.stringify(body));
    if (response.status != 200) {
        throw exception_1.parseErrorResponse(request, response, undefined, null);
    }
    const userId = response.body["id"];
    const accessToken = response.body["access_token"];
    const expiresAt = response.body["expires_in"];
    const scope = response.body["scope"];
    return {
        userId: userId,
        accessToken: accessToken,
        expiresAt: expiresAt,
        scope: scope,
    };
});
const validateIdentityData = (data) => {
    if (data) {
        if (data.emailAddress && data.emailAddress != null) {
            if (!utilities_1.validateEmail(data.emailAddress)) {
                throw new exception_1.IllegalStateException("invalid email", this);
            }
        }
        if (data.phoneNumber && data.phoneNumber != null) {
            if (!utilities_1.validatePhoneNumber(data.phoneNumber)) {
                throw new exception_1.IllegalStateException("invalid phone number", this);
            }
        }
        if (data.username && data.username != null) {
            if (!utilities_1.validateUsername(data.username)) {
                throw new exception_1.IllegalStateException("invalid username", this);
            }
        }
    }
};
const hasIdentityData = (data) => {
    if (data === null) {
        return false;
    }
    return (data.emailAddress != null ||
        data.phoneNumber != null ||
        data.username != null);
};
const toQualifiedId = (userIdentifier) => {
    if (utilities_1.validateEmail(userIdentifier)) {
        return `EMAIL:${userIdentifier}`;
    }
    if (utilities_1.isGlobalPhoneNumber(userIdentifier)) {
        return `PHONE:${userIdentifier}`;
    }
    return userIdentifier;
};
/**
 * Deep copies. We can call this function only if data is just from JSON string
 * @param data source data
 * @returns copied data
 */
const deepCopy = (data) => JSON.parse(JSON.stringify(data));
