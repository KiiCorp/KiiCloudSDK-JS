"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KiiUserBuilder = void 0;
const _1 = require(".");
const app_1 = require("./app");
const exception_1 = require("./exception");
const utilities_1 = require("./utilities");
const MAX_DATE_IN_MILLIS = 100000000 * 24 * 60 * 60 * 1000;
/**
 * Represents a KiiUser object
 */
class KiiUserBuilder {
    /** @hidden */
    constructor(app) {
        this.app = app;
        this.username = undefined;
        this.password = "";
        this.email = undefined;
        this.phoneNumber = undefined;
        this.country = undefined;
    }
    /**
     * Create a KiiUser builder with identifier.
     *
     * <br><br>Create a KiiUser builder. This constructor is received
     * identifier. The identifier is one of user name, email address or
     * phone number. This constructor automatically identity What is
     * identifier and build proper KiiUser object on build method.
     *
     * <br><br> Some strings can be accepted as both user name and phone
     * number. If such string is passed to this constructor as
     * identifier, then phone number is prior to user name. String of
     * email address is in different class against user name and phone
     * number. So Email address is always identified correctly.
     *
     * @param {String} identifier The user's user name, email address or phone
     * number. Must be string. Must not be null or undefined.
     * @param {String} password for the user. Must be string. Must not be null or
     * undefined.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {KiiUserBuilder} KiiUser object builder.
     * @throws {InvalidArgumentException} If Identifier is not user name,
     * email address or phone number.
     * @throws {InvalidPasswordException} If the password is not in the
     * proper format
     */
    static builderWithIdentifier(userIdentifier, password, app = app_1.KiiApplication.globalApp) {
        if (userIdentifier === null ||
            userIdentifier === undefined ||
            userIdentifier === "") {
            throw new exception_1.InvalidUserIdentifierException("Invalid User Identifier set", undefined);
        }
        const builder = new KiiUserBuilder(app);
        if (!utilities_1.validatePassword(password)) {
            throw new exception_1.InvalidPasswordException("Invalid Password pattern set", undefined);
        }
        builder.password = password;
        if (utilities_1.validatePhoneNumber(userIdentifier)) {
            builder.phoneNumber = userIdentifier;
        }
        else {
            userIdentifier = utilities_1.trim(userIdentifier);
            if (utilities_1.validateEmail(userIdentifier)) {
                builder.email = userIdentifier;
            }
            else if (utilities_1.validateUsername(userIdentifier)) {
                builder.username = userIdentifier;
            }
            else {
                throw new exception_1.InvalidUserIdentifierException("Invalid User Identifier set", undefined);
            }
        }
        return builder;
    }
    /**
     * Create KiiUser builder with email address
     *
     * <br><br>Create a KiiUser builder with email address.
     *
     * @param {String} emailAddress email address.
     * @param {String} password for the user. Must be string. Must not be null or undefined.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {KiiUserBuilder} KiiUser object builder.
     * @throws {InvalidEmailException} If the email address is not in the proper format
     * @throws {InvalidPasswordException} If the password is not in the proper format
     */
    static builderWithEmailAddress(emailAddress, password, app = app_1.KiiApplication.globalApp) {
        const userBuilder = new KiiUserBuilder(app);
        if (utilities_1.validateEmail(emailAddress)) {
            userBuilder.setEmailAddress(emailAddress);
        }
        else {
            throw new exception_1.InvalidEmailException("Invalid username", undefined);
        }
        if (utilities_1.validatePassword(password)) {
            userBuilder.setPassword(password);
        }
        else {
            throw new exception_1.InvalidPasswordException("Invalid username", undefined);
        }
        return userBuilder;
    }
    /**
     * Create KiiUser builder with global phone number
     * <br><br>Create a KiiUser builder with global phone number.
     * @param {String} phoneNumber global phone number.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {KiiUserBuilder} KiiUser object builder.
     * @throws {InvalidPhoneNumberException} If the phone number is not in the proper format
     */
    static builderWithGlobalPhoneNumber(phoneNumber, password, app = app_1.KiiApplication.globalApp) {
        const userBuilder = new KiiUserBuilder(app);
        userBuilder.setPhoneNumber(phoneNumber);
        userBuilder.setPassword(password);
        return userBuilder;
    }
    /**
     * Create KiiUser builder with local phone number
     * <br><br>Create a KiiUser builder with local phone number.
     * @param {String} phoneNumber local phone number.
     * @param {String} country country code
     * @param {String} password for the user. Must be string. Must not be null or undefined.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {KiiUserBuilder} KiiUser object builder.
     * @throws {InvalidPhoneNumberException} If the phone number is not in the proper format
     * @throws {InvalidCountryException} If the country code is not a valid format
     * @throws {InvalidPasswordException} If the password is not in the proper format
     */
    static builderWithLocalPhoneNumber(phoneNumber, country, password, app = app_1.KiiApplication.globalApp) {
        const userBuilder = new KiiUserBuilder(app);
        if (!utilities_1.validateLocalPhone(phoneNumber)) {
            throw new exception_1.InvalidPhoneNumberException("Invalid local Phone Number", undefined);
        }
        if (!utilities_1.validateCountryCode(country)) {
            throw new exception_1.InvalidPhoneNumberException("Invalid Country code", undefined);
        }
        if (!utilities_1.validatePassword(password)) {
            throw new exception_1.InvalidPasswordException("Invalid Password", undefined);
        }
        userBuilder.phoneNumber = phoneNumber;
        userBuilder.country = country;
        userBuilder.password = password;
        return userBuilder;
    }
    /**
     * Create KiiUser builder with user name
     * <br><br>Create a KiiUser builder with user name.
     * @param {String} username user name.
     * @param {String} password for the user. Must be string. Must not be null or undefined.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {KiiUserBuilder} KiiUser object builder.
     * @throws {InvalidUsernameException} If the username is not in the proper format
     * @throws {InvalidPasswordException} If the password is not in the proper format
     */
    static builderWithUsername(username, password, app = app_1.KiiApplication.globalApp) {
        const userBuilder = new KiiUserBuilder(app);
        if (!utilities_1.validateUsername(username)) {
            throw new exception_1.InvalidPasswordException("Invalid username", undefined);
        }
        if (!utilities_1.validatePassword(password)) {
            throw new exception_1.InvalidPasswordException("Invalid Password", undefined);
        }
        userBuilder.username = username;
        userBuilder.password = password;
        return userBuilder;
    }
    /**
     * Set user name.
     * <br><br>Set user name. If null or undefined is passed. It is ignored. Previous user name is remained.
     * @param {String} username user name.
     * @returns {KiiUserBuilder} this builder object.
     * @throws {InvalidUsernameException} If the username is not in the proper format
     */
    setUsername(username) {
        if (username === null || username === undefined) {
            return this;
        }
        const trimmedUsername = utilities_1.trim(username);
        if (utilities_1.validateUsername(trimmedUsername)) {
            this.username = trimmedUsername;
        }
        else {
            throw new exception_1.InvalidUsernameException(undefined, this);
        }
        return this;
    }
    /** @hidden */
    setPassword(password) {
        if (!utilities_1.validatePassword(password)) {
            throw new exception_1.InvalidPasswordException("Invalid password", this);
        }
        this.password = password;
    }
    /**
     * Set email address.
     * <br><br>Set email address. If null or undefined is passed. It is ignored. Previous email address is remained.
     * @param {String} emailAddress email address.
     * @returns {KiiUserBuilder} this builder object.
     * @throws {InvalidEmailException} If the email address is not in the proper format
     */
    setEmailAddress(email) {
        if (email === null || email === undefined) {
            return this;
        }
        const trimmedEmail = utilities_1.trim(email);
        if (utilities_1.validateEmail(trimmedEmail)) {
            this.email = trimmedEmail;
        }
        else {
            throw new exception_1.InvalidEmailException("Invalid Email Address", this);
        }
        return this;
    }
    setPhoneNumber(phone) {
        if (utilities_1.validatePhoneNumber(phone)) {
            this.phoneNumber = phone;
        }
        else {
            throw new exception_1.InvalidPhoneNumberException("Invalid Phone Number", this);
        }
    }
    /**
     * Set global phone number.
     * <br><br>Set global phone number. If null or undefined is passed. It is ignored. Previous phone number is remained.
     * @param {String} phoneNumber global phone number.
     * @returns {KiiUserBuilder} this builder object.
     * @throws {InvalidPhoneNumberException} If the phone number is not in the proper format
     */
    setGlobalPhoneNumber(phone) {
        if (phone === null || phone === undefined) {
            return this;
        }
        if (utilities_1.validatePhoneNumber(phone)) {
            this.phoneNumber = phone;
            this.country = undefined;
        }
        else {
            throw new exception_1.InvalidPhoneNumberException("Invalid Global Phone Number", this);
        }
        return this;
    }
    /**
     * Set local phone number.
     * <br><br>Set local phone number. If null or undefined is passed. It is ignored. Previous phone number is remained.
     * @param {String} phoneNumber local phone number.
     * @param {String} country country code
     * @returns {KiiUserBuilder} this builder object.
     * @throws {InvalidPhoneNumberException} If the phone number is not in the proper format
     * @throws {InvalidCountryException} If the country code is not a valid format
     */
    setLocalPhoneNumber(phone, country) {
        if (phone === null || phone === undefined) {
            return this;
        }
        if (utilities_1.validateLocalPhone(phone)) {
            this.phoneNumber = phone;
        }
        else {
            throw new exception_1.InvalidPhoneNumberException("Invalid Phone Number", this);
        }
        if (utilities_1.validateCountryCode(country)) {
            this.country = country;
        }
        else {
            throw new exception_1.InvalidPhoneNumberException("Invalid Country code", this);
        }
        return this;
    }
    setCountryCode(country) {
        if (utilities_1.validateCountryCode(country)) {
            this.country = country;
        }
        else {
            throw new exception_1.InvalidPhoneNumberException("Invalid Country code", this);
        }
    }
    /**
     * Build KiiUserBuilder object.
     * <br><br> Build KiiUserBuilder object. This method verify set values.
     * @returns {KiiUserBuilder} a working KiiUser object.
     */
    build() {
        const user = new _1.KiiUser(this.app);
        if (this.username && this.username.length > 0) {
            user.setUsername(this.username);
        }
        if (this.email) {
            user.setEmailAddress(this.email);
        }
        if (this.country && this.phoneNumber && this.country.length > 0) {
            user.setLocalPhone(this.phoneNumber, this.country);
        }
        else if (this.phoneNumber) {
            user.setPhoneNumber(this.phoneNumber);
        }
        user.setPassword(this.password);
        return user;
    }
} // end of class
exports.KiiUserBuilder = KiiUserBuilder;
