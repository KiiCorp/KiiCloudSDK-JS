import { KiiUser } from ".";
import { KiiApplication } from "./app";
/**
 * Represents a KiiUser object
 */
export declare class KiiUserBuilder {
    private app;
    private username;
    private password;
    private email;
    private phoneNumber;
    private country;
    /** @hidden */
    constructor(app: KiiApplication);
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
    static builderWithIdentifier(userIdentifier: string, password: string, app?: KiiApplication): KiiUserBuilder;
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
    static builderWithEmailAddress(emailAddress: string, password: string, app?: KiiApplication): KiiUserBuilder;
    /**
     * Create KiiUser builder with global phone number
     * <br><br>Create a KiiUser builder with global phone number.
     * @param {String} phoneNumber global phone number.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {KiiUserBuilder} KiiUser object builder.
     * @throws {InvalidPhoneNumberException} If the phone number is not in the proper format
     */
    static builderWithGlobalPhoneNumber(phoneNumber: string, password: string, app?: KiiApplication): KiiUserBuilder;
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
    static builderWithLocalPhoneNumber(phoneNumber: string, country: string, password: string, app?: KiiApplication): KiiUserBuilder;
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
    static builderWithUsername(username: string, password: string, app?: KiiApplication): KiiUserBuilder;
    /**
     * Set user name.
     * <br><br>Set user name. If null or undefined is passed. It is ignored. Previous user name is remained.
     * @param {String} username user name.
     * @returns {KiiUserBuilder} this builder object.
     * @throws {InvalidUsernameException} If the username is not in the proper format
     */
    setUsername(username: string): KiiUserBuilder;
    /** @hidden */
    private setPassword;
    /**
     * Set email address.
     * <br><br>Set email address. If null or undefined is passed. It is ignored. Previous email address is remained.
     * @param {String} emailAddress email address.
     * @returns {KiiUserBuilder} this builder object.
     * @throws {InvalidEmailException} If the email address is not in the proper format
     */
    setEmailAddress(email: string): KiiUserBuilder;
    private setPhoneNumber;
    /**
     * Set global phone number.
     * <br><br>Set global phone number. If null or undefined is passed. It is ignored. Previous phone number is remained.
     * @param {String} phoneNumber global phone number.
     * @returns {KiiUserBuilder} this builder object.
     * @throws {InvalidPhoneNumberException} If the phone number is not in the proper format
     */
    setGlobalPhoneNumber(phone: string): KiiUserBuilder;
    /**
     * Set local phone number.
     * <br><br>Set local phone number. If null or undefined is passed. It is ignored. Previous phone number is remained.
     * @param {String} phoneNumber local phone number.
     * @param {String} country country code
     * @returns {KiiUserBuilder} this builder object.
     * @throws {InvalidPhoneNumberException} If the phone number is not in the proper format
     * @throws {InvalidCountryException} If the country code is not a valid format
     */
    setLocalPhoneNumber(phone: string, country: string): KiiUserBuilder;
    private setCountryCode;
    /**
     * Build KiiUserBuilder object.
     * <br><br> Build KiiUserBuilder object. This method verify set values.
     * @returns {KiiUserBuilder} a working KiiUser object.
     */
    build(): KiiUser;
}
