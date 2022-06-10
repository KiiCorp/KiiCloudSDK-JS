(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/acl.ts":
/*!********************!*\
  !*** ./src/acl.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiACLAction": () => (/* binding */ KiiACLAction),
/* harmony export */   "KiiACL": () => (/* binding */ KiiACL),
/* harmony export */   "KiiACLEntry": () => (/* binding */ KiiACLEntry)
/* harmony export */ });
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./src/app.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/* harmony import */ var _group__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./group */ "./src/group.ts");
/* harmony import */ var _httpResponse__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./httpResponse */ "./src/httpResponse.ts");
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./user */ "./src/user.ts");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utilities */ "./src/utilities.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






const KiiACLAction = {
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_3__.isSuccess)(response.status)) {
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
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_1__.parseErrorResponse)(request, response, this, null);
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
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("There is no entry to save.", this);
            }
            for (let i = 0; i < keys.length; i++) {
                const entry = this.entriesMap[keys[i]];
                const url = `/apps/${this.app.getAppID()}${this.aclPath()}/${entry.getActionString()}/${entry.getEntityString()}`;
                const request = this.app.newRequest(entry.getGrant() ? "PUT" : "DELETE", url);
                const response = yield request.send();
                if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_3__.isSuccess)(response.status)) {
                    this.removeACLEntry(entry);
                }
                else {
                    // FIXME: this causes remaining process unfinished
                    throw (0,_exception__WEBPACK_IMPORTED_MODULE_1__.parseErrorResponse)(request, response, this, null);
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
    static aclWithParent(parent, app = _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp) {
        return new KiiACL(parent, app);
    }
}
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
const itemToSubject = (item) => {
    if (item["groupID"] != null) {
        const groupId = item["groupID"];
        return _group__WEBPACK_IMPORTED_MODULE_2__.KiiGroup.groupWithID(groupId);
    }
    else if (item["userID"] != null) {
        const userId = item["userID"];
        return _user__WEBPACK_IMPORTED_MODULE_4__.KiiUser.userWithID(userId);
    }
    else if (item["thingID"] != null) {
        // TODO implement later
        return _user__WEBPACK_IMPORTED_MODULE_4__.KiiUser.userWithID("");
    }
    return null;
};


/***/ }),

/***/ "./src/anonymousUser.ts":
/*!******************************!*\
  !*** ./src/anonymousUser.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiAnonymousUser": () => (/* binding */ KiiAnonymousUser)
/* harmony export */ });
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
class KiiAnonymousUser {
    /** @hidden */
    constructor() { }
    /**
     * Returns the ID of Anonymous user.
     */
    getID() {
        return "ANONYMOUS_USER";
    }
    /**
     * @hidden
     * @inheritdoc
     */
    getACLEntityString() {
        return "UserID:ANONYMOUS_USER";
    }
}


/***/ }),

/***/ "./src/anyAuthenticatedUser.ts":
/*!*************************************!*\
  !*** ./src/anyAuthenticatedUser.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiAnyAuthenticatedUser": () => (/* binding */ KiiAnyAuthenticatedUser)
/* harmony export */ });
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
class KiiAnyAuthenticatedUser {
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


/***/ }),

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiApplication": () => (/* binding */ KiiApplication)
/* harmony export */ });
/* harmony import */ var _bucket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bucket */ "./src/bucket.ts");
/* harmony import */ var _group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./group */ "./src/group.ts");
/* harmony import */ var _httpResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./httpResponse */ "./src/httpResponse.ts");
/* harmony import */ var _requestFactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./requestFactory */ "./src/requestFactory.ts");
/* harmony import */ var _topic__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./topic */ "./src/topic.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/* harmony import */ var _kii__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./kii */ "./src/kii.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







/**
 * KiiApplication represents an application info.
 *
 * While initializing `Kii`, it automatically generates an KiiApplication instance, and that will be used by default.
 *
 * Optionally, you may create a separate KiiApplication for switching the context.
 * @example example of copying an object from an app to the other
 * ```
 * // Assume myBucket and object xxxx is already registered.
 * const usApp = Kii.initializeWithSite("my-app-id1", "my-app-key1", KiiSite.US);
 * // If no app is injected, the app in which Kii.initializeWithSite() will be used.
 * // i.e. In this case, usApp will be used.
 * const bucketUS = Kii.bucketWithName("myBucket");
 * KiiObject.objectWithURI("kiicloud://buckets/myBucket/objects/xxxx").refresh().then((obj1) => {
 *   // create a separate app
 *   const jpApp = new KiiApplication("my-app-id2", "my-app-key2", KiiSite.JP);
 *   // Assume a myBucket and object yyyy is already registered.
 *   const bucketJP = jpApp.bucketWithName("myBucket");
 *   // Inject the jpApp while creating a object, so that this object will be created on jpApp.
 *   const obj2 = KiiObject.objectWithURI("kiicloud://buckets/myBucket/objects/yyyy", jpApp);
 *   obj1.getKeys().forEach((key) => {
 *     obj2.set(key, obj1.get(key));
 *   });
 *   // authenticate in jpApp to write the object
 *   return KiiUser.authenticate("myusername", "mypassword", jpApp).then(() => {
 *     return obj2.save();
 *   });
 * });
 * ```
 *
 * @example example of using multiple contexts at a time
 * ```
 * const userApp = Kii.initializeWithSite("my-app-id", "my-app-key", KiiSite.US);
 * // authenticate as a normal user. Now the userApp & the default app works as a user context.
 * KiiUser.authenticate("myusername", "mypassword").then((user) => {
 *   // get a list of topics that the user can subscribe.
 *   return userApp.listTopics().then((userTopics) => {
 *     console.log(userTopics);
 *   });
 * });
 *
 * // login as an app admin. This does not affect the user / userApp above.
 * Kii.authenticateAsAppAdmin("your client id", "your client secret").then((adminContext) => {
 *   // this app has an admin context.
 *   const adminApp = adminContext.getApp();
 *   // get a full list of topics.
 *   return adminApp.listTopics().then((allTopics) => {
 *     console.log(allTopics);
 *   });
 * });
 * ```
 */
class KiiApplication {
    /**
     * Create a new KiiApplication.
     *
     * You don't have to create a KiiApplication by yourself unless you want to handle more than one context at a time.
     *
     * e.g. Either multiple applications or two different context with a same application (like App admin and App user)
     * @param appID The application ID found in your Kii developer console
     * @param appKey The application key found in your Kii developer console
     * @param site Can be one of the constants KiiSite.US, KiiSite.JP, KiiSite.SG depending on your location.
     * @param admin An internal flag to determine if the login user is admin context or not.
     * @returns KiiApplication instance
     * @example
     * ```typescript
     * const app = new KiiApplication("my-app-id", "my-app-key", KiiSite.JP);
     * ```
     */
    constructor(appId, appKey, baseURL, admin = false) {
        this.appId = appId;
        this.appKey = appKey;
        this.baseURL = baseURL;
        this.admin = admin;
        this.expiresIn = 0;
        this.currentUser = null;
        this.accessToken = "";
        this.requestFactory = createDefaultClientFactory();
    }
    /** @hidden */
    isAdmin() {
        return this.admin;
    }
    /**
     * Retrieve the current app ID
     * @returns The current app ID
     */
    getAppID() {
        return this.appId;
    }
    /**
     * Retrieve the current app key
     * @returns The current app key
     */
    getAppKey() {
        return this.appKey;
    }
    /**
     * @hidden
     * Retrieve the current Base URL
     */
    getBaseURL() {
        return this.baseURL;
    }
    /**
     * @hidden
     * Creates new request object
     * @param method HTTP method
     * @param url URL
     */
    newRequest(method, url) {
        const request = this.requestFactory.create(method, `${this.baseURL}${url}`);
        request.addHeader("x-kii-appid", this.appId);
        request.addHeader("x-kii-appkey", this.appKey);
        request.addHeader("x-kii-sdk", _kii__WEBPACK_IMPORTED_MODULE_6__.KiiSDKClientInfo.getSDKClientInfo());
        if (this.accessToken) {
            request.setAccessToken(this.accessToken);
        }
        request.setContentType("application/json");
        return request;
    }
    /** @hidden */
    setAccessTokenExpiration(expiresIn) {
        this.expiresIn = expiresIn;
    }
    /**
     * Get the access token expiration.
     */
    getAccessTokenExpiration() {
        return this.expiresIn;
    }
    /** @hidden */
    setCurrentUser(user, accessToken) {
        this.currentUser = user;
        this.accessToken = accessToken;
    }
    /**
     * Get the current user.
     */
    getCurrentUser() {
        return this.currentUser;
    }
    /**
     * Get the access token for the user - only available if the user is currently logged in
     * @returns Access token
     */
    getAccessToken() {
        return this.accessToken;
    }
    /** @hidden */
    setAccessToken(accessToken) {
        this.accessToken = accessToken;
    }
    /**
     * Creates a reference to a bucket for this app
     *
     * The bucket will be created/accessed within this app's scope
     * @param bucketName The name of the bucket the app should create/access
     * @returns A working KiiBucket object
     * @example
     * ```typescript
     * const bucket = app.bucketWithName("myBucket");
     * ```
     */
    bucketWithName(bucketName) {
        return new _bucket__WEBPACK_IMPORTED_MODULE_0__.KiiBucket(bucketName, null, this);
    }
    /**
     * Creates a reference to a　encrypted bucket for this app
     *
     * The bucket will be created/accessed within this app's scope
     * @param bucketName The name of the bucket the app should create/access
     * @returns A working KiiEncryptedBucket object
     * @example
     * ```typescript
     * const bucket = app.encryptedBucketWithName("myBucket");
     * ```
     */
    encryptedBucketWithName(bucketName) {
        return new _bucket__WEBPACK_IMPORTED_MODULE_0__.KiiEncryptedBucket(bucketName, null, this);
    }
    /**
     * Creates a reference to a group with the given name
     * @param groupName groupName An application-specific group name
     * @returns A new KiiGroup reference
     * @example
     * ```typescript
     * const group = app.groupWithName("myGroup");
     * ```
     */
    groupWithName(groupName) {
        return _group__WEBPACK_IMPORTED_MODULE_1__.KiiGroup.groupWithJSON({ name: groupName }, this);
    }
    /** @hidden */
    setRequestFactory(factory) {
        this.requestFactory = factory;
    }
    /** @hidden */
    logOut() {
        this.currentUser = null;
        this.accessToken = "";
    }
    /** @hidden */
    loggedIn() {
        return this.currentUser != null;
    }
    /**
     * Get a list of topics.
     * @param {String} paginationKey You can specify the pagination key with the nextPaginationKey. If empty string or no string object is provided, this API regards no paginationKey specified.
     * @return {Promise} return promise object.
     *     <ul>
     *       <li>fulfill callback function: function(params).
     *         <ul>
     *           <li>params[0] is array of KiiTopic instances.</li>
     *           <li>params[1] is string of nextPaginationKey.</li>
     *         </ul>
     *       </li>
     *       <li>reject callback function: function(error). error is an Error instance.
     *         <ul>
     *           <li>error.target is a KiiAppAdminContext instance which this method was called on.</li>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     */
    listTopics(paginationKey = "") {
        return __awaiter(this, void 0, void 0, function* () {
            let uri = `/apps/${this.getAppID()}/topics`;
            if (typeof paginationKey === "string" && paginationKey !== "") {
                uri = uri + "?paginationKey=" + encodeURIComponent(paginationKey);
            }
            const request = this.newRequest("GET", uri);
            const response = yield request.send();
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_2__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_5__.parseErrorResponse)(request, response, this, null);
            }
            const nextPaginationKey = response.body["paginationKey"] || null;
            const topics = response.body["topics"];
            const items = topics.map((topic) => {
                return new _topic__WEBPACK_IMPORTED_MODULE_4__.KiiTopic("", topic["topicID"], this);
            });
            return [items, nextPaginationKey];
        });
    }
}
const createDefaultClientFactory = () => {
    if (__webpack_require__.g.jQuery !== undefined) {
        return new _requestFactory__WEBPACK_IMPORTED_MODULE_3__.KiiJQueryRequestFactory();
    }
    else if (__webpack_require__.g.fetch !== undefined) {
        return new _requestFactory__WEBPACK_IMPORTED_MODULE_3__.KiiFetchRequestFactory();
    }
    else {
        // TODO default implementation?
        return new _requestFactory__WEBPACK_IMPORTED_MODULE_3__.KiiFetchRequestFactory();
    }
};


/***/ }),

/***/ "./src/appAdminContext.ts":
/*!********************************!*\
  !*** ./src/appAdminContext.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiAppAdminContext": () => (/* binding */ KiiAppAdminContext)
/* harmony export */ });
/* harmony import */ var _bucket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bucket */ "./src/bucket.ts");
/* harmony import */ var _group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./group */ "./src/group.ts");
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./user */ "./src/user.ts");
/* harmony import */ var _topic__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./topic */ "./src/topic.ts");
/* harmony import */ var _thing__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./thing */ "./src/thing.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






/**
 *  represents the app admin context
 *  <br><br>
 *  <B>This class must not referred from code accessible from browser.
 *  This class is intended to be used by server side code like Node.js.
 *  If you use this class in code accessible by browser, your application client id and client secret could be stolen.
 *  Attacker will be act as application admin and all the data in your application will be suffered.
 *  </B>
 *
 *  Application administrator context. Entities obtained from this class will be manipulated by application admin.
 */
class KiiAppAdminContext {
    /** @hidden */
    constructor(app) {
        this.app = app;
    }
    /** @hidden */
    getApp() {
        return this.app;
    }
    /**
     * Creates a reference to a bucket operated by app admin.
     * <br><br>The bucket will be created/accessed within this app's scope
     * @param String bucketName The name of the bucket the app should create/access
     * @returns {KiiBucket} A working KiiBucket object
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   let bucket = adminContext.bucketWithName("myBucket");
     *   // KiiBucket operation by app admin is available now.
     * }).catch(error => {
     *   // auth failed.
     * });
     * ```
     */
    bucketWithName(bucketName) {
        const adminBucket = new _bucket__WEBPACK_IMPORTED_MODULE_0__.KiiBucket(bucketName, null, this.app);
        return adminBucket;
    }
    /**
     * Creates a reference to a encrypted bucket operated by app admin.
     * <br><br>The bucket will be created/accessed within this app's scope
     * @param String bucketName The name of the bucket the app should create/access
     * @returns {KiiBucket} A working KiiBucket object
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext) {
     *   let bucket = adminContext.encryptedBucketWithName("myBucket");
     *   // KiiBucket operation by app admin is available now.
     * }).catch(error => {
     *   // auth failed.
     * });
     * ```
     */
    encryptedBucketWithName(bucketName) {
        const bucket = new _bucket__WEBPACK_IMPORTED_MODULE_0__.KiiEncryptedBucket(bucketName, null, this.app);
        return bucket;
    }
    /**
     * Creates a reference to a group operated by app admin.
     * <br><br>
     * <b>Note:</b>
     * Returned instance from this API can not operate existing KiiGroup.<br>
     * If you want to operate existing KiiGroup, please use {@link KiiAppAdminContext.groupWithURI} or {@link KiiAppAdminContext.groupWithID}.
     *
     * @param String group name.
     * @returns {KiiGroup} A working KiiGroup object
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   let group = adminContext.groupWithName("newGroup");
     *   // KiiGroup operation by app admin is available now.
     * }).catch(error => {
     *   // auth failed.
     * });
     * ```
     */
    groupWithName(groupName) {
        const group = _group__WEBPACK_IMPORTED_MODULE_1__.KiiGroup.groupWithName(groupName, this.app);
        return group;
    }
    /**
     * Creates a reference to a user operated by app admin.
     * @param String user id.
     * @returns {KiiUser} A working KiiUser object
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   let user = adminContext.userWithID("userid");
     *   // KiiUser operation by app admin is available now.
     * }).catch(error => {
     *   // auth failed.
     * });
     * ```
     */
    userWithID(userid) {
        const user = _user__WEBPACK_IMPORTED_MODULE_2__.KiiUser.userWithID(userid, this.app);
        return user;
    }
    /**
     * Creates a reference to an object operated by app admin using object`s URI.
     * @param String object URI.
     * @returns {KiiObject} A working KiiObject instance
     * @throws {InvalidURIException} If the URI is null, empty or does not have correct format.
     */
    objectWithURI(objectUri) {
        // Workaround of CMO-4855
        // TODO: extract common logic of KiiObject
        const valid = objectUri.indexOf("kiicloud://") == 0;
        const newURI = objectUri.substr("kiicloud://".length);
        const components = newURI.split("/");
        const compLength = components.length;
        if (compLength < 4 || !valid) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_5__.InvalidURIException(undefined, this);
        }
        const bucketIndex = compLength === 4 ? 1 : 3;
        const bucketName = components[bucketIndex];
        let subject = null;
        if (components[0] === "groups" && compLength === 6) {
            subject = _group__WEBPACK_IMPORTED_MODULE_1__.KiiGroup.groupWithID(components[1], this.app);
        }
        else if (components[0] === "users" && compLength === 6) {
            subject = _user__WEBPACK_IMPORTED_MODULE_2__.KiiUser.userWithID(components[1], this.app);
        }
        else if (components[0] === "things" && compLength === 6) {
            subject = _thing__WEBPACK_IMPORTED_MODULE_4__.KiiThing.thingWithID(components[1], this.app);
        }
        else if (compLength !== 4) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_5__.InvalidURIException(undefined, this);
        }
        const bucket = new _bucket__WEBPACK_IMPORTED_MODULE_0__.KiiBucket(bucketName, subject, this.app);
        const obj = bucket.createObject();
        obj.setUUID(components[compLength - 1]);
        return obj;
    }
    // FIXME: unused?
    // Workaround of CMO-4855
    /** @hidden */
    _userWithLoginName(loginName) {
        return __awaiter(this, void 0, void 0, function* () {
            return _user__WEBPACK_IMPORTED_MODULE_2__.KiiUser.findUserByUsernameWithoutLogin(loginName, this.app);
        });
    }
    // FIXME: unused?
    // _getId() {
    //   return this._id;
    // }
    /**
     * Get access token published for app admin.
     * @return {String} access token published for app admin.
     */
    getAccessToken() {
        return this.app.getAccessToken();
    }
    /** @hidden */
    _getToken() {
        return this.app.getAccessToken();
    }
    /**
     * Creates a reference to a group operated by app admin using group's ID.
     * <br><br>
     * <b>Note:</b>
     * Returned instance from this API can operate existing KiiGroup.<br>
     * If you want to create a new KiiGroup, please use {@link KiiAppAdminContext.groupWithName}.
     *
     * @param String group ID.
     * @returns {KiiGroup} A working KiiGroup object
     * @throws {InvalidArgumentException} Thrown if passed groupID is null or empty.
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   let groupID = "0123456789abcdefghijklmno";
     *   let group = adminContext.groupWithID(groupID);
     *   // KiiGroup operation by app admin is available now.
     * }).catch(error => {
     *   // auth failed.
     * });
     * ```
     */
    groupWithID(groupID) {
        if (groupID === null || groupID === "") {
            throw "groupID should not null or empty";
        }
        const group = _group__WEBPACK_IMPORTED_MODULE_1__.KiiGroup.groupWithID(groupID, this.app);
        return group;
    }
    /**
     * Register new group own by specified user on Kii Cloud with specified ID.
     * This method can be used only by app admin.
     *
     * <br><br>If the group that has specified id already exists, registration will be failed.
     *
     * @param {String} groupID ID of the KiiGroup
     * @param {String} groupName Name of the KiiGroup
     * @param {String} user id of owner
     * @param {Array} members An array of KiiUser objects to add to the group
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
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   let owner = KiiUser.userWithID("Owner User Id");
     *   let members = [];
     *   members.push(KiiUser.userWithID("Member User Id"));
     *   return adminContext.registerGroupWithOwnerAndID("Group ID", "Group Name", "Owner User ID", members);
     * }).then(group => {
     *   // do something with the saved group
     * });
     * ```
     */
    registerGroupWithOwnerAndID(groupID, groupName, owner, members) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _group__WEBPACK_IMPORTED_MODULE_1__.KiiGroup.registerGroupWithIDAndOwner(groupID, groupName, owner, members, this.app);
        });
    }
    /**
     * Creates a reference to a group operated by app admin using group's URI.
     * <br><br>
     * <b>Note:</b>
     * Returned instance from this API can operate existing KiiGroup.<br>
     * If you want to create a new KiiGroup, please use {@link KiiAppAdminContext.groupWithName}.
     *
     * @param String group URI.
     * @returns {KiiGroup} A working KiiGroup object
     * @throws {InvalidURIException} Thrown if the URI is null, empty or does not have correct format.
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   let groupUri = ...; // KiiGroup's URI
     *   let group = adminContext.groupWithURI(groupUri);
     *   // KiiGroup operation by app admin is available now.
     * }).catch(error => {
     *   // auth failed.
     * });
     * ```
     */
    groupWithURI(groupUri) {
        const newURI = groupUri.substr("kiicloud://".length);
        const components = newURI.split("/");
        if (components.length !== 2 || components[0] !== "groups") {
            throw new _exception__WEBPACK_IMPORTED_MODULE_5__.InvalidURIException(undefined, this);
        }
        const group = _group__WEBPACK_IMPORTED_MODULE_1__.KiiGroup.groupWithID(components[1], this.app);
        return group;
    }
    /**
     * Find registered KiiUser with the email.<br>
     * If there are no user registers with the specified email or if there are but not verified email yet,
     * callbacks.failure or reject callback of promise will be called.<br>
     * If the email is null or empty, callbacks.failure or reject callback of promise will be callded.
     * <br><br>
     * <b>Note:</b>
     * <ul>
     * <li>If "Expose Full User Data To Others" is enabled in the application console, the response will contain full of the user data.</li>
     * <li>Otherwise, the response will only contain "userID", "loginName" and "displayName" field values if exist.</li>
     * </ul>
     *
     * @param {String} email The email to find KiiUser who owns it.<br>
     * Don't add prefix of "EMAIL:" described in REST API documentation. SDK will take care of it.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(user).
     *       <ul>
     *         <li>user is a found KiiUser instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiAppAdminContext instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   adminContext.findUserByEmail("user_to_find@example.com").then(user => { // fullfill callback function
     *     // Do something with the found user
     *   }).catch(error => { // reject callback function
     *     let adminContext = error.target;
     *     let anErrorString = error.message;
     *     // Do something with the error response
     *   });
     * }).catch(error => {
     *   // Auth failed.
     * });
     * ```
     */
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return _user__WEBPACK_IMPORTED_MODULE_2__.KiiUser.findUserByEmailWithoutLogin(email, this.app);
        });
    }
    /**
     * Find registered KiiUser with the phone.<br>
     * If there are no user registers with the specified phone or if there are but not verified phone yet,
     * callbacks.failure or reject callback of promise will be called.<br>
     * If the phone is null or empty, callbacks.failure or reject callback of promise will be called.
     * <br><br>
     * <b>Note:</b>
     * <ul>
     * <li>If "Expose Full User Data To Others" is enabled in the application console, the response will contain full of the user data.</li>
     * <li>Otherwise, the response will only contain "userID", "loginName" and "displayName" field values if exist.</li>
     * </ul>
     *
     * @param {String} phone The phone number to find KiiUser who owns it.<br>
     * Don't add prefix of "PHONE:" described in REST API documentation. SDK will take care of it.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(user).
     *       <ul>
     *         <li>user is a found KiiUser instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiAppAdminContext instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   adminContext.findUserByPhone("phone_number_to_find").then(user => { // fullfill callback function
     *     // Do something with the found user
     *   }).catch(error => { // reject callback function
     *     let adminContext = error.target;
     *     let anErrorString = error.message;
     *     // Do something with the error response
     *   });
     * }).catch(error => {
     *   // Auth failed.
     * });
     * ```
     */
    findUserByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            return _user__WEBPACK_IMPORTED_MODULE_2__.KiiUser.findUserByPhoneWithoutLogin(phone, this.app);
        });
    }
    /**
     * Find registered KiiUser with the user name.<br>
     * If there are no user registers with the specified user name, callbacks.failure or reject callback of promise will be called.<br>
     * If the user name is null or empty, callbacks.failure or reject callback of promise will be called.
     * <br><br>
     * <b>Note:</b>
     * <ul>
     * <li>If "Expose Full User Data To Others" is enabled in the application console, the response will contain full of the user data.</li>
     * <li>Otherwise, the response will only contain "userID", "loginName" and "displayName" field values if exist.</li>
     * </ul>
     *
     * @param {String} username The user name to find KiiUser who owns it.<br>
     * Don't add prefix of "LOGIN_NAME:" described in REST API documentation. SDK will take care of it.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(user).
     *       <ul>
     *         <li>user is a found KiiUser instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiAppAdminContext instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   adminContext.findUserByUsername("user_name_to_find").then(user => { // fullfill callback function
     *     // Do something with the found user
     *   }.catch(error => { // reject callback function
     *     let adminContext = error.target;
     *     let anErrorString = error.message;
     *     // Do something with the error response
     *   });
     * }.catch(error => {
     *   // Auth failed.
     * });
     * ```
     */
    findUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return _user__WEBPACK_IMPORTED_MODULE_2__.KiiUser.findUserByUsernameWithoutLogin(username, this.app);
        });
    }
    /**
     * Register thing by app admin.
     * Method interface is same as {@link KiiThing.register}.
     * Please refer to KiiThing document for details.
     * @param {Object} fields of the thing to be registered. Please refer to {@link KiiThing.register} for the details of fields.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is KiiThing instance with adminToken.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * adminContext.registerThing(
     *   {
     *     _vendorThingID: "thing-XXXX-YYYY-ZZZZZ",
     *     _password: "thing-password",
     *     _thingType: "thermometer",
     *     yourCustomObj: // Arbitrary key can be used.
     *     { // Object, Array, Number, String can be used. Should be compatible with JSON.
     *       yourCustomKey1: "value",
     *       yourCustomKey2: 100
     *     }
     *   }
     * ).then(thing => {
     *   // Register Thing succeeded.
     *   // Operation using thing instance in the parameter
     *   // is authored by app admin.
     * }).catch(error) {
     *   // Handle error.
     * });
     * ```
     */
    registerThing(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            return _thing__WEBPACK_IMPORTED_MODULE_4__.KiiThing.register(fields, this.app);
        });
    }
    /**
     * Register user/group as owner of specified thing by app admin.
     *
     * @param {String} thingID The ID of thing
     * @param {KiiUser or KiiGroup} owner instnce of KiiUser/KiiGroup to be registered as owner.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * // assume thing/group is already registered.
     * let owner = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * // example to use Promise
     * adminContext.registerOwnerWithThingID("th.xxxx-yyyy-zzzz", owner).then(registeredOwner => {
     *   // Register owner succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    registerOwnerWithThingID(thingID, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return _thing__WEBPACK_IMPORTED_MODULE_4__.KiiThing.registerOwnerWithThingID(thingID, owner, this.app);
        });
    }
    /**
     * Register user/group as owner of specified thing with password by app admin.
     *
     * @param {String} thingID The ID of thing
     * @param {KiiUser or KiiGroup} owner instnce of KiiUser/KiiGroup to be registered as owner.
     * @param {String} password The password of thing
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * // assume thing/group is already registered.
     * let owner = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * // example to use Promise
     * adminContext.registerOwnerWithThingIDAndPassword("th.xxxx-yyyy-zzzz", owner, "password").then(registeredOwner => {
     *   // Register owner succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    registerOwnerWithThingIDAndPassword(thingID, owner, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return _thing__WEBPACK_IMPORTED_MODULE_4__.KiiThing.registerOwnerWithThingIDAndPassword(thingID, owner, password, this.app);
        });
    }
    /**
     * Register user/group as owner of specified thing by app admin.
     *
     * @param {String} vendorThingID The vendor thing ID of thing
     * @param {KiiUser or KiiGroup} owner instance of KiiUser/KiiGroupd to be registered as owner.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * // assume thing/group is already registered.
     * let owner = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * // example to use Promise
     * adminContext.registerOwnerWithVendorThingID("xxxx-yyyy-zzzz", owner).then(registeredOwner => {
     *   // Register owner succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    registerOwnerWithVendorThingID(vendorThingID, owner) {
        return _thing__WEBPACK_IMPORTED_MODULE_4__.KiiThing.registerOwnerWithVendorThingID(vendorThingID, owner, this.app);
    }
    /**
     * Register user/group as owner of specified thing with password by app admin.
     *
     * @param {String} vendorThingID The vendor thing ID of thing
     * @param {KiiUser or KiiGroup} owner instance of KiiUser/KiiGroupd to be registered as owner.
     * @param {String} password The password of thing
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * // assume thing/group is already registered.
     * let owner = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * // example to use Promise
     * adminContext.registerOwnerWithVendorThingIDAndPassword("xxxx-yyyy-zzzz", owner, "password").then(registeredOwner => {
     *   // Register owner succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    registerOwnerWithVendorThingIDAndPassword(vendorThingID, owner, password) {
        return _thing__WEBPACK_IMPORTED_MODULE_4__.KiiThing.registerOwnerWithVendorThingIDAndPassword(vendorThingID, owner, password, this.app);
    }
    /**
     * Creates a reference to a thing operated by app admin.
     * @param String thing id.
     * @returns {KiiThing} A working KiiThing object
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("client-id", "client-secret").then(adminContext => {
     *   let thing = adminContext.thingWithID("th.xxxx-yyyy");
     *   // KiiThing operation by app admin is available now.
     * }).catch(error => {
     *   // auth failed.
     * });
     * ```
     */
    thingWithID(thingID) {
        return _thing__WEBPACK_IMPORTED_MODULE_4__.KiiThing.thingWithID(thingID, this.app);
    }
    /**
     * Load thing with vendor thing ID by app admin.
     * Method interface is same as {@link KiiThing.loadWithVendorThingID}.
     * Please refer to KiiThing document for details.
     * @param {String} vendorThingID registered vendor thing id.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is KiiThing instance with adminToken.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * adminContext.loadThingWithVendorThingID("thing-xxxx-yyyy").then(thing => {
     *   // Load succeeded.
     *   // Operation using thing instance in the parameter
     *   // is authored by app admin.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    loadThingWithVendorThingID(vendorThingID) {
        return __awaiter(this, void 0, void 0, function* () {
            return _thing__WEBPACK_IMPORTED_MODULE_4__.KiiThing.loadWithVendorThingID(vendorThingID, this.app);
        });
    }
    /**
     * Load thing with thing ID by app admin.
     * Method interface is same as {@link KiiThing.loadWithThingID}.
     * Please refer to KiiThing document for details.
     * @param {String} thingID registered thing id.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is KiiThing instance with adminToken.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * adminContext.loadThingWithThingID("thing-xxxx-yyyy").then(thing => {
     *   // Load succeeded.
     *   // Operation using thing instance in the parameter
     *   // is authored by app admin.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    loadThingWithThingID(thingID) {
        const fields = {
            _thingID: thingID,
            _accessToken: this.app.getAccessToken(),
        };
        const ret = new _thing__WEBPACK_IMPORTED_MODULE_4__.KiiThing(fields, this.app);
        return ret.refresh();
    }
    /**
     * Creates a reference to a topic operated by app admin
     * @param {String} topicName name of the topic. Must be a not empty string.
     * @return {KiiTopic} topic instance.
     */
    topicWithName(topicName) {
        return new _topic__WEBPACK_IMPORTED_MODULE_3__.KiiTopic("", topicName, this.app);
    }
    /** Gets a list of topics in app scope
     * @param {String} paginationKey You can specify the pagination key with the nextPaginationKey passed by callbacks.success. If empty string or no string object is provided, this API regards no paginationKey specified.
     * @return {Promise} return promise object.
     *     <ul>
     *       <li>fulfill callback function: function(params).
     *         <ul>
     *           <li>params[0] is array of KiiTopic instances.</li>
     *           <li>params[1] is string of nextPaginationKey.</li>
     *         </ul>
     *       </li>
     *       <li>reject callback function: function(error). error is an Error instance.
     *         <ul>
     *           <li>error.target is a KiiAppAdminContext instance which this method was called on.</li>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```typescript
     * adminContext.listTopics().then(params => {
     *   let topicList = params[0];
     *   let nextPaginationKey = params[1];
     *   // do something with the result
     *   for (let i = 0; i < topicList.length; i++) {
     *     let topic = topicList[i];
     *   }
     *   if (nextPaginationKey != null) {
     *     adminContext.listTopics(nextPaginationKey)
     *     .then(result => {...})
     *     .catch(error => {...});
     *   }
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    listTopics(paginationKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.app.listTopics(paginationKey);
        });
    }
}


/***/ }),

/***/ "./src/bucket.ts":
/*!***********************!*\
  !*** ./src/bucket.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiBucket": () => (/* binding */ KiiBucket),
/* harmony export */   "KiiEncryptedBucket": () => (/* binding */ KiiEncryptedBucket)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/index.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/* harmony import */ var _httpResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./httpResponse */ "./src/httpResponse.ts");
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./object */ "./src/object.ts");
/* harmony import */ var _query__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./query */ "./src/query.ts");
/* harmony import */ var _group__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./group */ "./src/group.ts");
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./user */ "./src/user.ts");
/* harmony import */ var _thing__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./thing */ "./src/thing.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};








/**
 * Represents a KiiBucket object
 */
class KiiBucket {
    /**
     * @hidden
     * @throws {InvalidArgumentException} when bucketName is invalid.
     */
    constructor(bucketName, parent, app) {
        this.bucketName = bucketName;
        this.parent = parent;
        this.app = app;
        if (!bucketName) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_1__.InvalidArgumentException("Specified bucket name is null or empty.", undefined);
        }
    }
    parentIs(parent, cls) {
        if (parent instanceof cls) {
            return true;
        }
        return false;
    }
    /** @hidden */
    getUser() {
        if (this.parentIs(this.parent, _user__WEBPACK_IMPORTED_MODULE_6__.KiiUser)) {
            return this.parent;
        }
        return undefined;
    }
    /** @hidden */
    getGroup() {
        if (this.parentIs(this.parent, _group__WEBPACK_IMPORTED_MODULE_5__.KiiGroup)) {
            return this.parent;
        }
        return undefined;
    }
    /** @hidden */
    getThing() {
        if (this.parentIs(this.parent, _thing__WEBPACK_IMPORTED_MODULE_7__.KiiThing)) {
            return this.parent;
        }
        return undefined;
    }
    /** @hidden */
    getParent() {
        return this.getUser() || this.getGroup() || this.getThing();
    }
    /**
     * The name of this bucket
     * @returns name
     */
    getBucketName() {
        return this.bucketName;
    }
    /** @hidden */
    getQualifiedBucketName() {
        return this.bucketName;
    }
    /**
     * Create a KiiObject within the current bucket
     *
     * @returns An empty KiiObject with no specific type
     * @example
     * ```typescript
     * let bucket = . . .; // a KiiBucket
     * let object = bucket.createObject();
     * ```
     */
    createObject() {
        return new _object__WEBPACK_IMPORTED_MODULE_3__.KiiObject(this, undefined, this.app);
    }
    /**
     * Create a KiiObject within the current bucket, with type
     *
     * @param type representing the desired object type
     * @returns An empty KiiObject with specified type
     * @example
     * ```typescript
     * const bucket = . . .; // a KiiBucket
     * const object = bucket.createObjectWithType("scores");
     * ```
     */
    createObjectWithType(type) {
        return _object__WEBPACK_IMPORTED_MODULE_3__.KiiObject.objectWithBucket(this, type, this.app);
    }
    /**
     * Create a KiiObject within the current bucket, specifying its ID.
     *
     * @param objectID ID of the obeject you want to instantiate.
     * @returns KiiObject instance.
     * @throws {InvalidArgumentException} objectID is not acceptable.
     * Refer to {@link KiiObject.isValidObjectID} for details of acceptable string.
     * @example
     * ```typescript
     * let bucket = . . .; // KiiBucket
     * let object = bucket.createObjectWithID('__OBJECT_ID_');
     * ```
     */
    createObjectWithID(objectID) {
        if (!_object__WEBPACK_IMPORTED_MODULE_3__.KiiObject.isValidObjectID(objectID)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_1__.InvalidArgumentException("Specified obejctID is invalid.", this);
        }
        return new _object__WEBPACK_IMPORTED_MODULE_3__.KiiObject(this, objectID, this.app);
    }
    /** @hidden */
    getPath() {
        if (this.parent == null) {
            return `/buckets/${this.getQualifiedBucketName()}`;
        }
        return `${this.parent.getPath()}/buckets/${this.getQualifiedBucketName()}`;
    }
    /**
     * Get the ACL handle for this bucket
     *
     * Any KiiACLEntry objects added or revoked from this ACL object will be appended to/removed from the server on ACL save.
     * @returns A KiiACL object associated with this KiiBucket
     * @example
     * ```typescript
     * const bucket = . . .; // a KiiBucket
     * const acl = bucket.acl();
     * ```
     */
    acl() {
        return ___WEBPACK_IMPORTED_MODULE_0__.KiiACL.aclWithParent(this, this.app);
    }
    /**
     * Perform a query on the given bucket
     *
     * The query will be executed against the server, returning a result set.
     * @param query An object with callback methods defined
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is Array instance.
     *       <ul>
     *         <li>params[0] is a performed KiiQuery instance.</li>
     *         <li>params[1] is resultSet Array instance. Could be KiiObject, KiiGroup, KiiUser, etc.</li>
     *         <li>params[2] is a KiiQuery instance for next query. If there are no more results to be retrieved, it will be null.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiBucket instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let bucket = . . .; // a KiiBucket
     * let queryObject = . . .; // a KiiQuery
     * bucket.executeQuery(queryObject).then(params => {
     *   let queryPerformed = params[0];
     *   let resultSet = params[1];
     *   let nextQuery = params[2];
     *   // do something with the results
     *   for (let i = 0; i < resultSet.length; i++) {
     *     // do something with the object
     *     // resultSet[i]; // could be KiiObject, KiiGroup, KiiUser, etc
     *   }
     *
     *   // if there are more results to be retrieved
     *   if(nextQuery != null) {
     *     // get them and repeat recursively until no results remain
     *     bucket.executeQuery(nextQuery).then(params => {
     *       // next query success
     *     }).catch(error => {
     *       // next query failed, please handle the error
     *     });
     *   }
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    executeQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.getPath()}/query`;
            const body = query.toDict();
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.QueryRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_2__.isSuccess)(response.status)) {
                const resultset = response.body["results"].map((json) => {
                    const newObject = this.createObject();
                    newObject.updateWithJSON(json);
                    return newObject;
                });
                let nextQuery = null;
                if (response.body["nextPaginationKey"] != null) {
                    nextQuery = _query__WEBPACK_IMPORTED_MODULE_4__.KiiQuery.clone(query);
                    nextQuery.setPaginationKey(response.body["nextPaginationKey"]);
                }
                // Fix issue https://github.com/KiiCorp/JavascriptStorageSDK/issues/747
                return [query, resultset, nextQuery];
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_1__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    /**
     * Execute count aggregation of specified query on current bucket.
     * Query that passed as nextQuery in success callback of {@link executeQuery}, is not
     * supported, callbacks.failure will be fired in this case.
     * @param query query to be executed. If null, the operation will be same as {@link count}.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is Array instance.
     *       <ul>
     *         <li>params[0] is a KiiBucket instance which this method was called on.</li>
     *         <li>params[1] is a KiiQuery instance.</li>
     *         <li>params[2] is an integer count result. </li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiBucket instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let bucket = . . .; // a KiiBucket
     * let queryObject = . . .; // a KiiQuery
     *
     * bucket.countWithQuery(queryObject, callbacks).then(params => {
     *   let bucket = params[0];
     *   let query = params[1];
     *   let count = params[2];
     *   // do something with the results
     * }).catch(error => {
     *   let bucket = error.target;
     *   let errorString = error.message;
     *   // error happened.
     * });
     * ```
     */
    countWithQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.getPath()}/query`;
            const body = query == null ? _query__WEBPACK_IMPORTED_MODULE_4__.KiiQuery.queryWithClause(null).toDict() : query.toDict();
            body.bucketQuery.aggregations = [
                { type: "COUNT", putAggregationInto: "count_field" },
            ];
            if (query === null || query === void 0 ? void 0 : query.getPaginationKey()) {
                body.paginationKey = query.getPaginationKey();
            }
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.QueryRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_2__.isSuccess)(response.status)) {
                const resultCount = response.body["aggregations"]["count_field"];
                // Fix issue https://github.com/KiiCorp/JavascriptStorageSDK/issues/747
                return [this, query, resultCount];
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_1__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    /**
     * Execute count aggregation of all clause query on current bucket.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is Array instance.
     *       <ul>
     *         <li>params[0] is a KiiBucket instance which this method was called on.</li>
     *         <li>params[1] is a KiiQuery instance.</li>
     *         <li>params[2] is an integer count result. </li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiBucket instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let bucket = . . .; // a KiiBucket
     * let queryObject = . . .; // a KiiQuery
     *
     * bucket.count().then(params => {
     *   let bucket = params[0];
     *   let query = params[1];
     *   let count = params[2];
     *   // do something with the results
     * }).catch(error => {
     *   let bucket = error.target;
     *   let errorString = error.message;
     *   // error happened.
     * });
     * ```
     */
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.countWithQuery(_query__WEBPACK_IMPORTED_MODULE_4__.KiiQuery.queryWithClause(null));
        });
    }
    /**
     * Delete the given bucket from the server
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function:
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiBucket instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let bucket = . . .; // a KiiBucket
     * bucket.delete().then(() => {
     *   // do something with the result
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.getPath()}`;
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_2__.isSuccess)(response.status)) {
                // OK
                return;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_1__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
}
/**
 * Represents a encrypted KiiBucket object
 */
class KiiEncryptedBucket extends KiiBucket {
    /**
     * @hidden
     * @inheritdoc
     */
    constructor(bucketName, parent, app) {
        super(bucketName, parent, app);
    }
    /** @hidden */
    getQualifiedBucketName() {
        return "CRYPTO:" + this.bucketName;
    }
}


/***/ }),

/***/ "./src/errorParser.ts":
/*!****************************!*\
  !*** ./src/errorParser.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SERVER_ERROR_CODES": () => (/* binding */ SERVER_ERROR_CODES),
/* harmony export */   "REG_SERVER_ERROR_KII_REQUEST": () => (/* binding */ REG_SERVER_ERROR_KII_REQUEST),
/* harmony export */   "REG_SERVER_ERROR_KII_XHR_WRAPPER": () => (/* binding */ REG_SERVER_ERROR_KII_XHR_WRAPPER),
/* harmony export */   "REG_SERVER_ERROR_KII_USER_OR_OBJECT": () => (/* binding */ REG_SERVER_ERROR_KII_USER_OR_OBJECT),
/* harmony export */   "REG_SERVER_ERROR_KII_SERVER_CODE": () => (/* binding */ REG_SERVER_ERROR_KII_SERVER_CODE),
/* harmony export */   "REG_SERVER_ERROR_KII_SERVER_CODE_VERSION_NOT_FOUND": () => (/* binding */ REG_SERVER_ERROR_KII_SERVER_CODE_VERSION_NOT_FOUND),
/* harmony export */   "REG_NETWORK_ERROR": () => (/* binding */ REG_NETWORK_ERROR),
/* harmony export */   "KiiErrorParser": () => (/* binding */ KiiErrorParser)
/* harmony export */ });
const SERVER_ERROR_CODES = {
    APP_NOT_FOUND: 404,
    APP_DISABLED: 403,
    UNAUTHORIZED: 401,
    USER_NOT_FOUND: 404,
    THING_NOT_FOUND: 404,
    THING_DISABLED: 401,
    THING_ALREADY_EXISTS: 409,
    THING_TYPE_NOT_FOUND: 404,
    FIRMWARE_VERSION_NOT_FOUND: 404,
    WRONG_TOKEN: 403,
    WRONG_REFRESH_TOKEN: 403,
    INVALID_BUCKET: 400,
    OPERATION_NOT_ALLOWED: 409,
    OPERATION_NOT_SUPPORTED: 403,
    AUTHENTICATION_FAILED: 401,
    USER_DISABLED: 401,
    INVALID_DATA_TYPE: 400,
    INVALID_INPUT_DATA: 400,
    INVALID_JSON: 400,
    INVALID_JSON_SCHEMA: 400,
    MISSING_DATA: 400,
    RESOURCE_TEMPORARILY_UNAVAILABLE: 503,
    WRONG_PASSWORD: 401,
    OAUTH2_ERROR: 400,
    THING_END_NODE_DOES_NOT_BELONG_TO_GATEWAY: 404,
    THING_END_NODE_ALREADY_BELONGS_TO_GATEWAY: 409,
    UNDEFINED_ERROR: 500,
    OPERATION_NOT_IMPLEMENTED: 501,
    LOCK_FAILED: 503,
    QUERY_NOT_SUPPORTED: 400,
    QUERY_TIMEOUT: 503,
    TEMPORARY_UNAVAILABLE_ERROR: 503,
    APP_ALREADY_EXISTS: 409,
    BUCKET_ALREADY_EXISTS: 409,
    BUCKET_NOT_FOUND: 404,
    FILTER_NOT_FOUND: 404,
    INVALID_ACCOUNT_STATUS: 400,
    INVALID_OBJECT_ID: 400,
    INVALID_VERIFICATION_CODE: 403,
    OBJECT_NOT_FOUND: 404,
    OBJECT_VERSION_IS_STALE: 409,
    OBJECT_ALREADY_EXISTS: 409,
    OBJECT_CONFLICT: 409,
    PUBLICATION_NOT_FOUND: 404,
    PUBLICATION_EXPIRED: 410,
    USER_ALREADY_EXISTS: 409,
    USER_ADDRESS_NOT_FOUND: 404,
    VERIFICATION_CODE_NOT_FOUND: 404,
    ACCOUNT_TYPE_NOT_SUPPORTED: 400,
    OBJECT_BODY_NOT_FOUND: 404,
    OBJECT_BODY_RANGE_NOT_SATISFIABLE: 416,
    OBJECT_BODY_INTEGRITY_NOT_ASSURED: 412,
    OBJECT_BODY_UPLOAD_NOT_FOUND: 404,
    OBJECT_BODY_UPLOAD_ALREADY_EXISTS: 409,
    BUCKET_TYPE_NOT_SUPPORTED: 400,
    GROUP_NOT_FOUND: 404,
    GROUP_ALREADY_EXISTS: 409,
    INSTALLATION_NOT_FOUND: 404,
    INSTALLATION_ALREADY_EXISTS: 409,
    ACL_NOT_FOUND: 404,
    ACL_ALREADY_EXISTS: 409,
    VERSIONED_UPDATES_NOT_SUPPORTED: 400,
    NO_ACCOUNT_PROVIDED: 400,
    FACEBOOK_USER_ALREADY_LINKED: 409,
    QQ_USER_ALREADY_LINKED: 409,
    GOOGLE_USER_ALREADY_LINKED: 409,
    USER_ALREADY_LINKED: 409,
    USER_NOT_LINKED: 409,
    UNIQUE_CONSTRAINT_VIOLATED: 409,
    GCMKEY_ALREADY_EXISTS: 409,
    GCMKEY_NOT_FOUND: 404,
    APNSKEY_NOT_FOUND: 404,
    JSON_WEB_KEY_NOT_FOUND: 404,
    JPUSHKEY_NOT_FOUND: 404,
    PUSH_SUBSCRIPTION_ALREADY_EXISTS: 409,
    PUSH_SUBSCRIPTION_NOT_FOUND: 404,
    TOPIC_ALREADY_EXISTS: 409,
    TOPIC_NOT_FOUND: 404,
    USER_LOCALE_NOT_FOUND: 404,
    TEMPLATE_NOT_FOUND: 404,
    USER_COUNTRY_NOT_FOUND: 404,
    USER_DISPLAY_NAME_NOT_FOUND: 404,
    SERVER_CODE_VERSION_NOT_FOUND: 404,
    SERVER_CODE_HOOK_VERSION_NOT_FOUND: 404,
    SCHEDULE_EXECUTION_NOT_FOUND: 404,
    ENDPOINT_INVOCATION_ERROR: 400,
    SERVER_CODE_VERIFICATION_ERROR: 400,
    PAYLOAD_ID_NOT_FOUND: 404,
    REPLACEMENT_SQL_QUERY_NOT_FOUND: 404,
    APP_CONFIG_PARAMETER_NOT_FOUND: 404,
    TRANSACTION_ID_NOT_FOUND: 404,
    TRANSACTION_ID_ALREADY_EXISTS: 409,
    CLIENT_CREDENTIALS_NOT_FOUND: 404,
    ACCESS_CODE_NOT_FOUND: 404,
    THING_OWNERSHIP_NOT_FOUND: 404,
    THING_OWNERSHIP_ALREADY_EXISTS: 409,
    INVALID_THING_OWNERSHIP_CODE: 409,
    MQTT_ENDPOINT_NOT_FOUND: 404,
    TASK_NOT_FOUND: 404,
    TASK_NOT_RECURRENT: 400,
    INVALID_STATUS: 409,
    PHONE_NUMBER_VERIFICATION_CODE_EXPIRED: 410,
    PIN_CODE_EXPIRED: 410,
    ADDRESS_VERIFICATION_CODE_NOT_FOUND: 404,
    MQTT_ENDPOINT_NOT_READY: 503,
    INDEX_FAILED: 500,
};
const REG_SERVER_ERROR_KII_REQUEST = new RegExp("(^[A-Z_]+): (.*)");
const REG_SERVER_ERROR_KII_XHR_WRAPPER = new RegExp(" statusCode: (\\d{3}) error code: ([A-Z_]+) message: (.*)$");
const REG_SERVER_ERROR_KII_USER_OR_OBJECT = new RegExp(" statusCode: (\\d{3}) error code: ([A-Z_]+) error message: (.*)$");
const REG_SERVER_ERROR_KII_SERVER_CODE = new RegExp(" statusCode: (\\d{3}) executedSteps: \\d+ error code: ([A-Z_]+) message: (.*) detailMessage: (.*)$");
const REG_SERVER_ERROR_KII_SERVER_CODE_VERSION_NOT_FOUND = new RegExp(" statusCode: (\\d{3}) executedSteps: null error code: ([A-Z_]+) message: (.*)$");
const REG_NETWORK_ERROR = new RegExp("statusCode: (\\d{1,3})$");
/**
 * A Parser for error string or error object returned by SDK.
 */
class KiiErrorParser {
    /** @hidden */
    constructor(error) {
        this.error = error;
    }
}
/**
 * Parse an error string or error object returned by SDK.
 * @param {any} error An error string or error object
 * @return {any} return parsed error object.
 * @example
 * ```typescript
 * let err = KiiErrorParser.parse(errorString);
 * let httpStatus = err.status;
 * if (httpStatus == 0) {
 *   // NetworkError
 * } else if (httpStatus == -1) {
 *   // Error is not related the http error. eg. argument error, illegal state error, etc.
 * } else if (httpStatus == -2) {
 *   // Unknown error is detected.
 *   // Please confirm that you are using the latest version of SDK.
 * } else if (httpStatus >= 400 && httpStatus < 600) {
 *   // Http error
 * }
 * let errorCode = err.code;
 * let errorMessage = err.message;
 * ```
 */
KiiErrorParser.parse = (error) => {
    let errorString = "";
    if ((typeof error).toLowerCase() == "string") {
        errorString = error;
    }
    else {
        errorString = error.message;
    }
    if (errorString.indexOf("0 : http") == 0)
        // Network Error by KiiRequest
        return {
            status: 0,
            code: null,
            message: "Network Error",
        };
    else if (errorString.indexOf("429 : http") == 0)
        // Limitation Error by KiiRequest
        return {
            status: 429,
            code: "TOO_MANY_REQUESTS",
            message: "Number of requests exceeds the limit.",
        };
    else if (errorString.indexOf("fail to execute server code. statusCode: 0") == 0)
        // Network Error by ServerCodeEntry
        return {
            status: 0,
            code: null,
            message: "Network Error",
        };
    else if (errorString.indexOf("invalid_grant: ") == 0) {
        // authentication error
        const arr = errorString.split(":", 2);
        return {
            status: 400,
            code: "invalid_grant",
            message: arr[1].substr(1),
        };
    }
    // fix "invalid_grant" only case.
    else if (errorString.indexOf("invalid_grant") == 0) {
        // authentication error
        return {
            status: 400,
            code: "invalid_grant",
            message: errorString,
        };
    }
    else {
        // Check the network error
        let arr = REG_NETWORK_ERROR.exec(errorString);
        if (arr) {
            const status = Number(arr[1]);
            if (status === 429)
                // Limitation Error by KiiXHRWrapper, KiiUser, KiiObject or ServerCodeEntry
                return {
                    status: 429,
                    code: "TOO_MANY_REQUESTS",
                    message: "Number of requests exceeds the limit.",
                };
            // Network Error by KiiXHRWrapper, KiiUser, KiiObject or ServerCodeEntry
            else
                return {
                    status: 0,
                    code: null,
                    message: "Network Error",
                };
        }
        arr = REG_SERVER_ERROR_KII_REQUEST.exec(errorString);
        if (arr) {
            const code = arr[1];
            const message = arr[2];
            let status = SERVER_ERROR_CODES[code];
            if (!status) {
                //Unknown error code is detected!
                status = -2;
            }
            // Server Error by KiiRequest
            return {
                status: status,
                code: code,
                message: message,
            };
        }
        for (let pattern of [
            REG_SERVER_ERROR_KII_XHR_WRAPPER,
            REG_SERVER_ERROR_KII_USER_OR_OBJECT,
            REG_SERVER_ERROR_KII_SERVER_CODE,
            REG_SERVER_ERROR_KII_SERVER_CODE_VERSION_NOT_FOUND,
        ]) {
            const regex = new RegExp(pattern);
            const arr = regex.exec(errorString);
            if (arr) {
                const status = Number(arr[1]);
                const code = arr[2];
                const message = arr[3];
                // Server Error by KiiXHRWrapper
                return {
                    status: status,
                    code: code,
                    message: message,
                };
            }
        }
        // failed to parse an error string
        return {
            status: -1,
            code: null,
            message: errorString,
        };
    }
};


/***/ }),

/***/ "./src/exception.ts":
/*!**************************!*\
  !*** ./src/exception.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InvalidPasswordException": () => (/* binding */ InvalidPasswordException),
/* harmony export */   "InvalidUserIdentifierException": () => (/* binding */ InvalidUserIdentifierException),
/* harmony export */   "InvalidUsernameException": () => (/* binding */ InvalidUsernameException),
/* harmony export */   "InvalidDisplayNameException": () => (/* binding */ InvalidDisplayNameException),
/* harmony export */   "InvalidPhoneNumberException": () => (/* binding */ InvalidPhoneNumberException),
/* harmony export */   "InvalidEmailException": () => (/* binding */ InvalidEmailException),
/* harmony export */   "ArithmeticException": () => (/* binding */ ArithmeticException),
/* harmony export */   "InvalidArgumentException": () => (/* binding */ InvalidArgumentException),
/* harmony export */   "IllegalStateException": () => (/* binding */ IllegalStateException),
/* harmony export */   "InvalidURIException": () => (/* binding */ InvalidURIException),
/* harmony export */   "InvalidCountryException": () => (/* binding */ InvalidCountryException),
/* harmony export */   "UnsupportedOperationException": () => (/* binding */ UnsupportedOperationException),
/* harmony export */   "parseErrorResponse": () => (/* binding */ parseErrorResponse),
/* harmony export */   "KiiRequestError": () => (/* binding */ KiiRequestError)
/* harmony export */ });
class InvalidPasswordException extends Error {
    constructor(message, target) {
        super(message);
        this.target = target;
    }
}
class InvalidUserIdentifierException extends Error {
    constructor(message, target) {
        super(message);
        this.target = target;
    }
}
class InvalidUsernameException extends Error {
    constructor(message = "Unable to set username. Must be between 3 and 64 characters, which can include alphanumeric characters as well as underscores '_' and periods '.'", target) {
        super(message);
        this.target = target;
    }
}
class InvalidDisplayNameException extends Error {
    constructor(message = "Unable to set displayName. Must be between 1-50 characters.", target) {
        super(message);
        this.target = target;
    }
}
class InvalidPhoneNumberException extends Error {
    constructor(message, target) {
        super(message);
        this.target = target;
    }
}
class InvalidEmailException extends Error {
    constructor(message, target) {
        super(message);
        this.target = target;
    }
}
class ArithmeticException extends Error {
    constructor(message, target) {
        super(`ArithmeticException: ${message}`);
        this.target = target;
    }
}
class InvalidArgumentException extends Error {
    constructor(msg, target) {
        super(`InvalidArgument: ${msg}`);
        this.msg = msg;
        this.target = target;
    }
}
class IllegalStateException extends Error {
    constructor(msg, target) {
        super(`IllegalState: ${msg}`);
        this.msg = msg;
        this.target = target;
    }
}
class InvalidURIException extends Error {
    constructor(message = "Unable to set URI. Must be of the form kiicloud://some/path/to/object/or/entity", target) {
        super(message);
        this.target = target;
    }
}
class InvalidCountryException extends Error {
    constructor(message = "Unable to set country code. Must be 2 alphabetic characters. Ex: US, JP, CN", target) {
        super(message);
        this.target = target;
    }
}
// Those were in v2 but not very necessary since:
// 1. Used only one specific place, 2. only valid on JS, 3. it can be InvalidArgumentException
// export class InvalidLocalPhoneNumberException extends Error {}
// export class InvalidACLAction extends Error {}
// export class InvalidACLSubject extends Error {}
// export class InvalidACLGrant extends Error {}
// export class InvalidLimitException extends Error {}
class UnsupportedOperationException extends Error {
    constructor(message = "Unable to set URI. Must be of the form kiicloud://some/path/to/object/or/entity", target) {
        super(`UnsupportedOperationException: ${message}`);
        this.target = target;
    }
}
const parseErrorResponse = (request, response, target, extraFields) => {
    let errString = "";
    if (typeof response.body === "string") {
        if (response.body) {
            errString += `: ${response.body}`;
            return genRequestError(response.status, "", errString, target, extraFields);
        }
        else {
            return genRequestError(response.status, "", errString, target, extraFields);
        }
    }
    if (typeof response.body === "object") {
        const errorCode = response.body["errorCode"];
        if (errorCode != null) {
            errString += `${errorCode}`;
        }
        const message = response.body["message"];
        if (message != null) {
            errString += `: ${message}`;
        }
        return genRequestError(response.status, errorCode !== null && errorCode !== void 0 ? errorCode : "", errString, target, extraFields);
    }
    return genRequestError(response.status, "", errString, target, extraFields);
};
const genRequestError = (status, code, message, target, extraFields) => {
    const e = new KiiRequestError(status, code, message, target);
    if (!extraFields) {
        return e;
    }
    Object.assign(e, extraFields);
    return e;
};
class KiiRequestError extends Error {
    constructor(status, code, message, target) {
        super(message);
        this.status = status;
        this.code = code;
        this.target = target;
    }
}


/***/ }),

/***/ "./src/geoPoint.ts":
/*!*************************!*\
  !*** ./src/geoPoint.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiGeoPoint": () => (/* binding */ KiiGeoPoint)
/* harmony export */ });
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/**
 * Represents Geo Point.
 */

class KiiGeoPoint {
    constructor(latitude, longitute) {
        this.latitude = latitude;
        this.longitute = longitute;
    }
    /**
     * Return the latitide of this point.
     */
    getLatitude() {
        return this.latitude;
    }
    /**
     * Return the longitude of this point.
     */
    getLongitude() {
        return this.longitute;
    }
    /** @hidden */
    toObject() {
        return {
            _type: "point",
            lat: this.latitude,
            lon: this.longitute,
        };
    }
    /**
     * Create a geo point with the given latitude and longitude.
     * @param latitude Latitude of the point in degrees. Valid if the value is greater than -90 degrees and less than +90 degrees.
     * @param longitude Longitude of the point in degrees. Valid if the value is greater than -180 degrees and less than +180 degrees.
     * @example
     * ```typescript
     * let point = KiiGeoPoint.geoPoint(35.07, 139.02);
     * ```
     */
    static geoPoint(latitude, longitude) {
        const inRange = (min, max, num) => {
            return !isNaN(num) && num > min && num < max;
        };
        if (!inRange(-90, 90, latitude) || !inRange(-180, 180, longitude)) {
            console.log("NOT IN RANGE");
            throw new _exception__WEBPACK_IMPORTED_MODULE_0__.InvalidArgumentException("Specified latitide or longitude is invalid", undefined);
        }
        return new KiiGeoPoint(latitude, longitude);
    }
    /** @hidden */
    static fromObject(point) {
        // if (point["_type"] !== "point") {
        //   return undefined;
        // }
        const lat = point["lat"];
        const lon = point["lon"];
        if (lat === undefined || lon === undefined) {
            return undefined;
        }
        return KiiGeoPoint.geoPoint(lat, lon);
    }
}


/***/ }),

/***/ "./src/group.ts":
/*!**********************!*\
  !*** ./src/group.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiGroup": () => (/* binding */ KiiGroup)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/index.ts");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app */ "./src/app.ts");
/* harmony import */ var _bucket__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bucket */ "./src/bucket.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/* harmony import */ var _httpResponse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./httpResponse */ "./src/httpResponse.ts");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utilities */ "./src/utilities.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






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
    static groupWithJSON(obj, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        const group = new KiiGroup(app);
        if (obj["groupID"] != null) {
            group.setId(obj["groupID"]);
        }
        if (obj["name"] != null) {
            group.setName(obj["name"]);
        }
        if (obj["owner"] != null) {
            const owner = ___WEBPACK_IMPORTED_MODULE_0__.KiiUser.userWithID(obj["owner"]);
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
    static registerGroupWithID(groupID, groupName, members, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = app.getCurrentUser();
            if (currentUser === null) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("owner is null", this);
            }
            if (groupID === null || groupID.length == 0) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("groupID is null or empty", this);
            }
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_5__.validateGroupID)(groupID)) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)(`invalid groupID : ${groupID}`, this);
            }
            if (groupName.length == 0) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("groupName is null or empty", this);
            }
            return KiiGroup.registerGroupWithIDAndOwner(groupID, groupName, currentUser.getID(), members, app);
        });
    }
    // this method is needed for AdminContext
    /** @hidden */
    static registerGroupWithIDAndOwner(groupID, groupName, owner, members, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (groupID === null || groupID.length == 0) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("groupID is null or empty", this);
            }
            if (!isValidGroupId(groupID)) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)(`invalid groupID : ${groupID}`, this);
            }
            if (groupName === null || groupName.length == 0) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("groupName is null or empty", this);
            }
            if (!owner) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("owner is null", this);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
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
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, undefined, null);
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
        return new ___WEBPACK_IMPORTED_MODULE_0__.KiiBucket(bucketName, this, this.app);
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
        return new _bucket__WEBPACK_IMPORTED_MODULE_2__.KiiEncryptedBucket(bucketName, this, this.app);
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
            throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("User ID is null", this);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                const members = response.body["members"];
                return members.map((member) => ___WEBPACK_IMPORTED_MODULE_0__.KiiUser.userWithID(member["userID"], this.app));
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("Invalid group. Save the group on the server before updating the name.", this);
            }
            if (newName.trim().length == 0) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("Invalid group name.", this);
            }
            const url = `/apps/${this.app.getAppID()}/groups/${groupId}/name`;
            const body = newName;
            const request = this.app.newRequest("PUT", url);
            request.setContentType("text/plain");
            const response = yield request.send(newName);
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                this.setName(newName);
                return this;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
                    throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("Owner ID must not be empty.", this);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                const groupId = response.body["groupID"];
                this.setId(groupId);
                if (ownerId) {
                    this.setOwner(___WEBPACK_IMPORTED_MODULE_0__.KiiUser.userWithID(ownerId));
                }
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                // OK
                delete this.addMembers[memberId];
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, {
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                // OK
                delete this.removeMembers[memberId];
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, {
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
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("This group does not have ID.", this);
            }
            const url = `/apps/${this.app.getAppID()}/groups/${groupId}`;
            const request = this.app.newRequest("GET", url);
            request.addHeader("Accept", "application/vnd.kii.GroupRetrievalResponse+json");
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                this.updateWithJSON(response.body);
                return this;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("This group does not have ID.", this);
            }
            const url = `/apps/${this.app.getAppID()}/groups/${groupId}`;
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                // OK
                return this;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
    static groupWithName(groupName, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static groupWithNameAndMembers(groupName, members, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static groupWithID(groupID, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static groupWithURI(uri, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        const newURI = uri.substr("kiicloud://".length);
        const components = newURI.split("/");
        const compLength = components.length;
        if (!components.length) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidURIException(undefined, undefined);
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
        return new ___WEBPACK_IMPORTED_MODULE_0__.KiiTopic(uri, topicName, this.app);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                const nextPaginationKey = response.body["paginationKey"] || null;
                const topics = response.body["topics"];
                const items = topics.map((topic) => this.topicWithName(topic["topicID"]));
                return [
                    items,
                    nextPaginationKey
                ];
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
            this.setOwner(___WEBPACK_IMPORTED_MODULE_0__.KiiUser.userWithID(ownerId));
        }
        else {
            this.setOwner(null);
        }
    }
}
const isValidGroupId = (groupId) => {
    const pattern = /^[a-z0-9-_.]{1,30}$/;
    if (typeof groupId !== "string") {
        return false;
    }
    return groupId.match(pattern) != null;
};


/***/ }),

/***/ "./src/httpResponse.ts":
/*!*****************************!*\
  !*** ./src/httpResponse.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isSuccess": () => (/* binding */ isSuccess)
/* harmony export */ });
const isSuccess = (status) => 200 <= status && status < 300;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Kii": () => (/* reexport safe */ _kii__WEBPACK_IMPORTED_MODULE_0__.Kii),
/* harmony export */   "KiiACL": () => (/* reexport safe */ _acl__WEBPACK_IMPORTED_MODULE_10__.KiiACL),
/* harmony export */   "KiiACLAction": () => (/* reexport safe */ _acl__WEBPACK_IMPORTED_MODULE_10__.KiiACLAction),
/* harmony export */   "KiiACLEntry": () => (/* reexport safe */ _acl__WEBPACK_IMPORTED_MODULE_10__.KiiACLEntry),
/* harmony export */   "KiiBucket": () => (/* reexport safe */ _bucket__WEBPACK_IMPORTED_MODULE_1__.KiiBucket),
/* harmony export */   "KiiClause": () => (/* reexport safe */ _query__WEBPACK_IMPORTED_MODULE_7__.KiiClause),
/* harmony export */   "KiiEncryptedBucket": () => (/* reexport safe */ _bucket__WEBPACK_IMPORTED_MODULE_1__.KiiEncryptedBucket),
/* harmony export */   "KiiGeoPoint": () => (/* reexport safe */ _geoPoint__WEBPACK_IMPORTED_MODULE_6__.KiiGeoPoint),
/* harmony export */   "KiiGroup": () => (/* reexport safe */ _group__WEBPACK_IMPORTED_MODULE_4__.KiiGroup),
/* harmony export */   "KiiObject": () => (/* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_5__.KiiObject),
/* harmony export */   "KiiPushInstallation": () => (/* reexport safe */ _push__WEBPACK_IMPORTED_MODULE_9__.KiiPushInstallation),
/* harmony export */   "KiiPushMessageBuilder": () => (/* reexport safe */ _topic__WEBPACK_IMPORTED_MODULE_8__.KiiPushMessageBuilder),
/* harmony export */   "KiiPushSubscription": () => (/* reexport safe */ _push__WEBPACK_IMPORTED_MODULE_9__.KiiPushSubscription),
/* harmony export */   "KiiTopic": () => (/* reexport safe */ _topic__WEBPACK_IMPORTED_MODULE_8__.KiiTopic),
/* harmony export */   "KiiUser": () => (/* reexport safe */ _user__WEBPACK_IMPORTED_MODULE_2__.KiiUser),
/* harmony export */   "KiiSite": () => (/* reexport safe */ _kii__WEBPACK_IMPORTED_MODULE_0__.KiiSite),
/* harmony export */   "KiiQuery": () => (/* reexport safe */ _query__WEBPACK_IMPORTED_MODULE_7__.KiiQuery),
/* harmony export */   "KiiUserBuilder": () => (/* reexport safe */ _userBuilder__WEBPACK_IMPORTED_MODULE_3__.KiiUserBuilder),
/* harmony export */   "KiiAnonymousUser": () => (/* reexport safe */ _anonymousUser__WEBPACK_IMPORTED_MODULE_11__.KiiAnonymousUser),
/* harmony export */   "KiiAnyAuthenticatedUser": () => (/* reexport safe */ _anyAuthenticatedUser__WEBPACK_IMPORTED_MODULE_12__.KiiAnyAuthenticatedUser),
/* harmony export */   "KiiApplication": () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_13__.KiiApplication),
/* harmony export */   "KiiAppAdminContext": () => (/* reexport safe */ _appAdminContext__WEBPACK_IMPORTED_MODULE_14__.KiiAppAdminContext),
/* harmony export */   "KiiThing": () => (/* reexport safe */ _thing__WEBPACK_IMPORTED_MODULE_15__.KiiThing),
/* harmony export */   "KiiThingQuery": () => (/* reexport safe */ _thingQuery__WEBPACK_IMPORTED_MODULE_16__.KiiThingQuery),
/* harmony export */   "KiiThingQueryResult": () => (/* reexport safe */ _thingQuery__WEBPACK_IMPORTED_MODULE_16__.KiiThingQueryResult),
/* harmony export */   "KiiErrorParser": () => (/* reexport safe */ _errorParser__WEBPACK_IMPORTED_MODULE_17__.KiiErrorParser),
/* harmony export */   "KiiThingContext": () => (/* reexport safe */ _thingContext__WEBPACK_IMPORTED_MODULE_18__.KiiThingContext),
/* harmony export */   "KiiServerCodeEntry": () => (/* reexport safe */ _serverCode__WEBPACK_IMPORTED_MODULE_19__.KiiServerCodeEntry),
/* harmony export */   "KiiServerCodeExecResult": () => (/* reexport safe */ _serverCode__WEBPACK_IMPORTED_MODULE_19__.KiiServerCodeExecResult),
/* harmony export */   "ArithmeticException": () => (/* reexport safe */ _exception__WEBPACK_IMPORTED_MODULE_20__.ArithmeticException),
/* harmony export */   "InvalidPasswordException": () => (/* reexport safe */ _exception__WEBPACK_IMPORTED_MODULE_20__.InvalidPasswordException),
/* harmony export */   "InvalidUserIdentifierException": () => (/* reexport safe */ _exception__WEBPACK_IMPORTED_MODULE_20__.InvalidUserIdentifierException),
/* harmony export */   "InvalidUsernameException": () => (/* reexport safe */ _exception__WEBPACK_IMPORTED_MODULE_20__.InvalidUsernameException),
/* harmony export */   "InvalidDisplayNameException": () => (/* reexport safe */ _exception__WEBPACK_IMPORTED_MODULE_20__.InvalidDisplayNameException),
/* harmony export */   "InvalidEmailException": () => (/* reexport safe */ _exception__WEBPACK_IMPORTED_MODULE_20__.InvalidEmailException),
/* harmony export */   "InvalidPhoneNumberException": () => (/* reexport safe */ _exception__WEBPACK_IMPORTED_MODULE_20__.InvalidPhoneNumberException),
/* harmony export */   "InvalidURIException": () => (/* reexport safe */ _exception__WEBPACK_IMPORTED_MODULE_20__.InvalidURIException),
/* harmony export */   "IllegalStateException": () => (/* reexport safe */ _exception__WEBPACK_IMPORTED_MODULE_20__.IllegalStateException),
/* harmony export */   "KiiRequestError": () => (/* reexport safe */ _exception__WEBPACK_IMPORTED_MODULE_20__.KiiRequestError)
/* harmony export */ });
/* harmony import */ var _kii__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./kii */ "./src/kii.ts");
/* harmony import */ var _bucket__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bucket */ "./src/bucket.ts");
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./user */ "./src/user.ts");
/* harmony import */ var _userBuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./userBuilder */ "./src/userBuilder.ts");
/* harmony import */ var _group__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./group */ "./src/group.ts");
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./object */ "./src/object.ts");
/* harmony import */ var _geoPoint__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./geoPoint */ "./src/geoPoint.ts");
/* harmony import */ var _query__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./query */ "./src/query.ts");
/* harmony import */ var _topic__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./topic */ "./src/topic.ts");
/* harmony import */ var _push__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./push */ "./src/push.ts");
/* harmony import */ var _acl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./acl */ "./src/acl.ts");
/* harmony import */ var _anonymousUser__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./anonymousUser */ "./src/anonymousUser.ts");
/* harmony import */ var _anyAuthenticatedUser__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./anyAuthenticatedUser */ "./src/anyAuthenticatedUser.ts");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./app */ "./src/app.ts");
/* harmony import */ var _appAdminContext__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./appAdminContext */ "./src/appAdminContext.ts");
/* harmony import */ var _thing__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./thing */ "./src/thing.ts");
/* harmony import */ var _thingQuery__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./thingQuery */ "./src/thingQuery.ts");
/* harmony import */ var _errorParser__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./errorParser */ "./src/errorParser.ts");
/* harmony import */ var _thingContext__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./thingContext */ "./src/thingContext.ts");
/* harmony import */ var _serverCode__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./serverCode */ "./src/serverCode.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");




















// error/exception




/***/ }),

/***/ "./src/kii.ts":
/*!********************!*\
  !*** ./src/kii.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiSite": () => (/* binding */ KiiSite),
/* harmony export */   "Kii": () => (/* binding */ Kii),
/* harmony export */   "KiiSDKClientInfo": () => (/* binding */ KiiSDKClientInfo)
/* harmony export */ });
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./src/app.ts");
/* harmony import */ var _httpResponse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./httpResponse */ "./src/httpResponse.ts");
/* harmony import */ var _serverCode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./serverCode */ "./src/serverCode.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/* harmony import */ var _topic__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./topic */ "./src/topic.ts");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utilities */ "./src/utilities.ts");
/* harmony import */ var _appAdminContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./appAdminContext */ "./src/appAdminContext.ts");
/* harmony import */ var _thingContext__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./thingContext */ "./src/thingContext.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};









const KiiSite = {
    US: "https://api.kii.com/api",
    JP: "https://api-jp.kii.com/api",
    SG: "https://api-sg.kii.com/api",
    EU: "https://api-eu.kii.com/api",
};
/**
 * The main SDK class
 *
 * This class must be initialized before any Kii SDK functions are performed. This class also allows the application to make some high-level user calls and access some application-wide data at any time using static methods.
 */
class Kii {
    constructor(appID, appKey, baseURL) {
        this.logging = true;
    }
    /**
     * Kii SDK Build Number
     * @returns current build number of the SDK
     */
    static getBuildNumber() {
        return "1";
    }
    /**
     * Kii SDK Version Number
     * @returns current version number of the SDK
     */
    static getSDKVersion() {
        return "3.0.2";
    }
    /**
     * @hidden internal only, called when a user is authenticated
     */
    static getBaseURL() {
        return _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp.getBaseURL();
    }
    /**
     * Retrieve the current app ID
     * @returns The current app ID
     */
    static getAppID() {
        return _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp.getAppID();
    }
    /** @hidden */
    static getAdditionalHeaders() {
        return this.additionalHeaders;
    }
    /** @hidden */
    static setAdditionalHeaders(additionalHeaders) {
        this.additionalHeaders = additionalHeaders;
    }
    /**
     * Retrieve the current app key
     * @returns The current app key
     */
    static getAppKey() {
        return _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp.getAppKey();
    }
    /** @hidden */
    static isLogging() {
        return this._instance.logging;
    }
    /** @hidden */
    static setLogging(logging) {
        this._instance.logging = logging;
    }
    /**
     *
     * the access token lifetime in seconds.
     * If you don't call this method or call it with 0, token won't be expired.
     * Call this method if you like the access token to be expired
     * after a certain period. Once called, token retrieved
     * by each future authentication will have the specified lifetime.
     * Note that, it will not update the lifetime of token received prior
     * calling this method. Once expired, you have to login again to renew the token.
     * @param expiresIn The life time of access token in seconds.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @example
     * ```typescript
     * Kii.setAccessTokenExpiration(3600);
     * ```
     */
    static setAccessTokenExpiration(expiresIn, app = _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp) {
        if (this._instance == null && !app) {
            throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("Kii is not initialized", undefined);
        }
        if (expiresIn < 0) {
            throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("expiresIn should not negative number", undefined);
        }
        app.setAccessTokenExpiration(expiresIn);
    }
    /**
     * Returns access token lifetime in seconds.
     *
     * If access token lifetime has not set explicitly by {@link Kii.setAccessTokenExpiration}, returns 0.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns access token lifetime in seconds.
     */
    static getAccessTokenExpiration(app = _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp) {
        if (this._instance == null && !app) {
            throw (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.error)("Kii is not initialized", undefined);
        }
        return app.getAccessTokenExpiration();
    }
    /**
     * Initialize the Kii SDK
     *
     * Should be the first Kii SDK action your application makes.
     * @param appID The application ID found in your Kii developer console
     * @param appKey The application key found in your Kii developer console
     * @returns KiiApplication instance
     * @example
     * ```typescript
     * Kii.initialize("my-app-id", "my-app-key");
     * ```
     */
    static initialize(appID, appKey) {
        return this.initializeWithSite(appID, appKey, KiiSite.US);
    }
    /**
     * Initialize the Kii SDK with a specific URL
     *
     * Should be the first Kii SDK action your application makes.
     * @param appID The application ID found in your Kii developer console
     * @param appKey The application key found in your Kii developer console
     * @param site site Can be one of the constants KiiSite.US, KiiSite.JP, KiiSite.SG depending on your location.
     * @returns KiiApplication instance
     * @example
     * ```typescript
     * Kii.initializeWithSite("my-app-id", "my-app-key", KiiSite.JP);
     * ```
     */
    static initializeWithSite(appID, appKey, site) {
        this._instance = new Kii(appID, appKey, site);
        const app = new _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication(appID, appKey, site);
        _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp = app;
        return app;
    }
    /** @hidden */
    static logger(message) {
        if (this._instance.logging) {
            console.log(message);
        }
    }
    /**
     * Creates a reference to a bucket for this app
     *
     * The bucket will be created/accessed within this app's scope
     * @param bucketName The name of the bucket the app should create/access
     * @returns A working KiiBucket object
     * @example
     * ```typescript
     * const bucket = Kii.bucketWithName("myBucket");
     * ```
     */
    static bucketWithName(bucketName) {
        return _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp.bucketWithName(bucketName);
    }
    /**
     * Creates a reference to a　encrypted bucket for this app
     *
     * The bucket will be created/accessed within this app's scope
     * @param bucketName The name of the bucket the app should create/access
     * @returns A working KiiEncryptedBucket object
     * @example
     * ```typescript
     * const bucket = Kii.encryptedBucketWithName("myBucket");
     * ```
     */
    static encryptedBucketWithName(bucketName) {
        return _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp.encryptedBucketWithName(bucketName);
    }
    /**
     * Creates a reference to a group with the given name
     * @param groupName groupName An application-specific group name
     * @returns A new KiiGroup reference
     * @example
     * ```typescript
     * const group = Kii.groupWithName("myGroup");
     * ```
     */
    static groupWithName(groupName) {
        return _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp.groupWithName(groupName);
    }
    /**
     * Creates a reference to a group with the given name and a list of default members
     * @param groupName An application-specific group name
     * @param members An array of KiiUser objects to add to the group
     * @returns A new KiiGroup reference
     * @example
     * ```typescript
     * const group = KiiGroup.groupWithName("myGroup", members);
     * ```
     */
    static groupWithNameAndMembers(groupName, members) {
        return null;
    }
    /** @hidden */
    static logOut() { }
    /** @hidden */
    static loggedIn() {
        return false;
    }
    /** @hidden */
    static getCurrentUser() {
        return _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp.getCurrentUser();
    }
    /** @hidden */
    static setCurrentUser(user) {
        _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp.setCurrentUser(user, user.getAccessToken() || "");
    }
    /**
     * Authenticate as app admin.
     *
     * This api call must not placed on code which can be accessed by browser.
     * This api is intended to be used by server side code like Node.js.
     * If you use this api in code accessible by browser, your application id and application secret could be stolen.
     * Attacker will be act as appadmin and all the data in your application will be suffered.
     * @param clientId assigned to your application.
     * @param clientSecret assigned to your application.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {Promise} return promise object.
     *     <ul>
     *       <li>fulfill callback function: function(adminContext). adminContext is a KiiAppAdminContext instance.</li>
     *       <li>reject callback function: function(error). error is an Error instance.
     *         <ul>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```typescript
     * Kii.authenticateAsAppAdmin("your client id", "your client secret").then(adminContext => {　// fulfill callback function
     *   // adminContext : KiiAppAdminContext instance
     *   // Operate entities with adminContext.
     * }).catch(error => { // reject callback function
     *   // Authentication failed.
     *   let errorString = error.message;
     * });
     * ```
     */
    static authenticateAsAppAdmin(clientId, clientSecret, app = _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp) {
        return __awaiter(this, arguments, void 0, function* () {
            // sustain the compatibility with v2
            if ((0,_utilities__WEBPACK_IMPORTED_MODULE_5__.isCallback)(arguments[0])) {
                clientId = arguments[1];
                clientSecret = arguments[2];
                app = arguments[3] || _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp;
            }
            const url = `/apps/${app.getAppID()}/oauth2/token`;
            const body = {
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret,
            };
            const tokenExpiration = app.getAccessTokenExpiration();
            if (tokenExpiration > 0) {
                const now = new Date();
                const currentTime = now.getTime();
                body["expiresAt"] = (0,_utilities__WEBPACK_IMPORTED_MODULE_5__.safeCalculateExpiresAtAsNumber)(app.getAccessTokenExpiration(), currentTime);
            }
            const request = app.newRequest("POST", url);
            request.isSendAccessToken(false);
            const response = yield request.send(JSON.stringify(body));
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_1__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, undefined, null);
            }
            const userId = response.body["id"];
            const accessToken = response.body["access_token"];
            const adminApp = new _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication(app.getAppID(), app.getAppKey(), app.getBaseURL(), true);
            adminApp.setAccessToken(accessToken);
            if (tokenExpiration > 0) {
                adminApp.setAccessTokenExpiration(tokenExpiration);
            }
            return new _appAdminContext__WEBPACK_IMPORTED_MODULE_6__.KiiAppAdminContext(adminApp);
        });
    }
    /**
     * Instantiate KiiServerCodeEntry.
     * @param entryName Name of the entry.
     * @param version Version of the entry.
     * @param environmentVersion Version of the Node.js. Currently, supported versions are 0 and 6.
     * @returns KiiServerCodeEntry instance.
     * @throws {InvalidArgumentException} Thrown in the following cases:
     * <ul>
     *   <li>entryName or version is not type of string </li>
     *   <li>entryName or version is empty string </li>
     *   <li>entryName is invalid string. Valid entryName pattern is "[a-zA-Z][_a-zA-Z0-9]*$".</li>
     * </ul>
     *
     * @example
     * ```typescript
     * let entry = Kii.serverCodeEntryWithVersion("main", "gulsdf6ful8jvf8uq6fe7vjy6", KiiServerCodeEnvironmentVersion.V0);
     * ```
     */
    static serverCodeEntry(entryName, version, environmentVersion) {
        if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_5__.validateServerCodeEntryName)(entryName)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidArgumentException("entryName is invalid", undefined);
        }
        if (version != undefined && !(0,_utilities__WEBPACK_IMPORTED_MODULE_5__.validateServerCodeEntryVersion)(version)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidArgumentException("version is invalid", undefined);
        }
        return new _serverCode__WEBPACK_IMPORTED_MODULE_2__.KiiServerCodeEntry(entryName, version, environmentVersion, _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp);
    }
    /**
     * Instantiate topic belongs to application.
     * @param topicName name of the topic. Must be a not empty string.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns topic instance.
     */
    static topicWithName(topicName, app = _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp) {
        if (typeof topicName !== "string" || topicName === "") {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidArgumentException("topicName should not null or empty", undefined);
        }
        return new _topic__WEBPACK_IMPORTED_MODULE_4__.KiiTopic("", topicName, app);
    }
    /**
     * Gets a list of topics in app scope
     * @param paginationKey You can specify the pagination key with the nextPaginationKey passed by callbacks.success or fullfill callback of promise. If empty string or no string object is provided, this API regards no paginationKey specified.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *     <ul>
     *       <li>fulfill callback function: function(params).
     *         <ul>
     *           <li>params[0] is array of KiiTopic instances.</li>
     *           <li>params[1] is string of nextPaginationKey.</li>
     *         </ul>
     *       </li>
     *       <li>reject callback function: function(error). error is an Error instance.
     *         <ul>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```typescript
     * Kii.listTopics().then(params => {
     *   let topicList = params[0];
     *   let nextPaginationKey = params[1];
     *   // do something with the result
     *   for (let i = 0; i < topicList.length; i++) {
     *     let topic = topicList[i];
     *   }
     *   if (nextPaginationKey != null) {
     *     Kii.listTopics(nextPaginationKey)
     *     .then(result => {...})
     *     .catch(error => {...});
     *   }
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    static listTopics(paginationKey, app = _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp) {
        return app.listTopics(paginationKey);
    }
    /**
     * Authenticate as Thing.
     *
     * This api is intended to be used in a Thing device, where the user
     * credentials or app admin context is not configured. This Thing must be
     * already registered in Kii Cloud.
     * @param vendorThingID vendorThingID of a registered Thing.
     * @param password password for the registered Thing.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *     <ul>
     *       <li>fulfill callback function: function(thingContext). thingContext is a KiiThingContext instance.</li>
     *       <li>reject callback function: function(error). error is an Error instance.
     *         <ul>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```typescript
     * Kii.authenticateAsThing("vendor thing id", "password of this thing").then(thingContext => {　// fulfill callback function
     *   // thingContext : KiiThingContext instance
     *   // Operate entities with thingContext.
     * }).catch(error => { // reject callback function
     *   // Authentication failed.
     *   let errorString = error.message;
     * });
     * ```
     */
    static authenticateAsThing(vendorThingID, password, app = _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            // NOTE: the 3rd arg might be a callback, and it might be null (= unused)
            if (!(app instanceof _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication)) {
                app = _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp;
            }
            if (!vendorThingID || !password) {
                throw Error("vendorThingID or password is invalid");
            }
            const url = `/oauth2/token`;
            const body = {
                username: `VENDOR_THING_ID:${vendorThingID}`,
                password: password,
            };
            const request = app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.OauthTokenRequest+json");
            request.isSendAccessToken(false);
            const response = yield request.send(JSON.stringify(body));
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_1__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, undefined, null);
            }
            const thingID = response.body.id;
            const accessToken = response.body.access_token;
            if (!thingID || !accessToken) {
                throw Error("invalid format response when authenticate thing ");
            }
            const thingApp = new _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication(app.getAppID(), app.getAppKey(), app.getBaseURL());
            thingApp.setAccessToken(accessToken);
            return new _thingContext__WEBPACK_IMPORTED_MODULE_7__.KiiThingContext({
                thingId: thingID,
                vendorThingID: vendorThingID,
            }, thingApp);
        });
    }
    /**
     * Create a KiiThingContext reference
     *
     * This api is intended to be used in a Thing device, where the user
     * credentials or app admin context is not configured. This Thing must be
     * already registered in Kii Cloud.
     * @param thingID thingID of a registered Thing.
     * @param token token for the registered Thing.
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *     <ul>
     *       <li>fulfill callback function: function(thingContext). thingContext is a KiiThingContext instance.</li>
     *       <li>reject callback function: function(error). error is an Error instance.
     *         <ul>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```typescript
     * Kii.authenticateAsThingWithToken("thing_id", "thing_token").then(thingContext => {　// fulfill callback function
     *   // thingContext : KiiThingContext instance
     *   // Operate entities with thingContext.
     * }).catch(error => { // reject callback function
     *   // Creation failed.
     *   let errorString = error.message;
     * });
     * ```
     */
    static authenticateAsThingWithToken(thingID, token, app = _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            // NOTE: the 3rd arg might be a callback, and it might be null (= unused)
            if (!(app instanceof _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication)) {
                app = _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication.globalApp;
            }
            if (!thingID || !token) {
                throw Error("thingID or token is invalid");
            }
            const thingApp = new _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication(app.getAppID(), app.getAppKey(), app.getBaseURL());
            thingApp.setAccessToken(token);
            return Promise.resolve(new _thingContext__WEBPACK_IMPORTED_MODULE_7__.KiiThingContext({
                thingId: thingID,
            }, thingApp));
        });
    }
}
class KiiSDKClientInfo {
    static getSDKClientInfo() {
        if (KiiSDKClientInfo.clientInfo.length == 0) {
            KiiSDKClientInfo.clientInfo = `sn=jss;sv=${Kii.getSDKVersion()}`;
        }
        return KiiSDKClientInfo.clientInfo;
    }
}
KiiSDKClientInfo.clientInfo = "";


/***/ }),

/***/ "./src/object.ts":
/*!***********************!*\
  !*** ./src/object.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiObject": () => (/* binding */ KiiObject)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/index.ts");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app */ "./src/app.ts");
/* harmony import */ var _acl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./acl */ "./src/acl.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/* harmony import */ var _uri__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./uri */ "./src/uri.ts");
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./user */ "./src/user.ts");
/* harmony import */ var _httpResponse__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./httpResponse */ "./src/httpResponse.ts");
/* harmony import */ var _kii__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./kii */ "./src/kii.ts");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utilities */ "./src/utilities.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};










/**
 * Represents a KiiObject object
 */
class KiiObject {
    /** @hidden */
    constructor(bucket, id, app) {
        this.bucket = bucket;
        this.id = id;
        this.app = app;
        this.created = 0;
        this.modified = 0;
        this.objectType = null;
        this.bodyContentType = "";
        this.owner = null;
        this.customInfo = {};
        this.patch = {};
        this.etag = "";
    }
    /** @hidden */
    getPath() {
        let path = this.bucket.getPath() + "/objects/";
        if (this.id) {
            path += this.id;
        }
        return path;
    }
    /**
     * Get the UUID of the given object, assigned by the server
     */
    getUUID() {
        return this.id;
    }
    /** @hidden */
    setUUID(uuid) {
        this.id = uuid;
    }
    /**
     * Get Id of the object or null if the object ID hasn't been assigned.
     */
    getID() {
        return this.id;
    }
    /**
     * Get the server's creation date of this object
     */
    getCreated() {
        return this.created;
    }
    /**
     * Get the modified date of the given object, assigned by the server
     */
    getModified() {
        return this.modified;
    }
    /**
     * Get the application-defined type name of the object
     */
    getObjectType() {
        return this.objectType;
    }
    /** @hidden */
    setObjectType(type) {
        this.objectType = type;
    }
    /** @hidden */
    setBucket(bucket) {
        this.bucket = bucket;
    }
    setObjectTypeFromResponse(dataType) {
        if (dataType == "application/json") {
            this.objectType = null;
        }
        const result = dataType.match(new RegExp(`application\/vnd\.${this.app.getAppID()}\.([^\.+]+)\+json`));
        if (result != null) {
            this.objectType = result[1];
        }
    }
    /**
     * Get the bucket.
     */
    getBucket() {
        return this.bucket;
    }
    /**
     * Get the body content-type.
     * It will be updated after the success of {@link KiiObject.uploadBody} and {@link KiiObject.downloadBody}
     * returns null or undefined when this object doesn't have body content-type information.
     */
    getBodyContentType() {
        return this.bodyContentType;
    }
    /**
     * Sets a key/value pair to a KiiObject
     *
     * If the key already exists, its value will be written over.
     *
     * NOTE: Before involving floating point value, please consider using integer instead. For example, use percentage, permil, ppm, etc.</br></b>
     * The reason is:
     *  - Will dramatically improve the performance of bucket query.</li>
     *  - Bucket query does not support the mixed result of integer and floating point.
     *    ex.) If you use same key for integer and floating point and inquire object with the integer value, objects which has floating point value with the key would not be evaluated in the query. (and vice versa)</li>
     * @param key The key to set. if null, empty string or string prefixed with '_' is specified, silently ignored and have no effect.
     * We don't check if actual type is String or not.
     * If non-string type is specified, it will be encoded as key by JSON.stringify()
     * @param value The value to be set. Object must be JSON-encodable type (dictionary, array, string, number, boolean)
     * We don't check actual type of the value.
     * It will be encoded as value by JSON.stringify()
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * obj.set("score", 4298);
     * ```
     */
    set(key, value) {
        if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_8__.isNonEmptyString)(key) || key.indexOf("_") == 0) {
            // logger "[WARN] Reserved key is used for custom field. key=${key}"
            return;
        }
        this.patch[key] = value;
    }
    /**
     * Gets the value associated with the given key
     * @param key The key to retrieve
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * let score = obj.get("score");
     * ```
     */
    get(key) {
        if (this.patch[key] !== undefined) {
            return this.patch[key];
        }
        return this.customInfo[key];
    }
    /**
     * Gets the array object that contains all keys of custom field.
     * The array of keys from local cache will be returned.
     * To get the latest array of keys from cloud, calling refresh() is necessary prior calling this method.
     * The returned array object does not include reserved keys such as _created, _modified, etc.
     * @returns {Array} keys An array of all keys of custom field.
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * for(let key of obj.keys()) {
     * }
     * ```
     */
    getKeys() {
        const keys = Object.keys(this.customInfo);
        const patchKeys = Object.keys(this.customInfo);
        patchKeys.forEach((key) => {
            if (this.customInfo[key] === undefined) {
                keys.push(key);
            }
        });
        return keys;
    }
    /**
     * Removes a pair of key/value from this object.
     * This pair is also removed from server when saveAllFields() is succeeded.
     * @param key The key to be removed
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * obj.remove("score");
     * ```
     */
    remove(key) {
        delete this.customInfo[key];
        delete this.patch[key];
    }
    /**
     * Set Geo point to this object with the specified key.
     * @param key The key to set.
     * @param point KiiGeoPoint to be tied to the specified key.
     */
    setGeoPoint(key, point) {
        if (key === null || key === "") {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidArgumentException("Specified key is invalid", this);
        }
        if (point instanceof ___WEBPACK_IMPORTED_MODULE_0__.KiiGeoPoint) {
            this.patch[key] = point.toObject();
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidArgumentException("Specified latitide or longitude is invalid", this);
        }
    }
    /**
     * Gets the geo point associated with the given key.
     * @param key The key of the geo point to retrieve.
     * @returns {KiiGeoPoint} KiiGeoPoint tied to the key. undefined if no exists.
     */
    getGeoPoint(key) {
        const point = this.customInfo[key];
        // if (point === undefined) {
        //   return null;
        // }
        return ___WEBPACK_IMPORTED_MODULE_0__.KiiGeoPoint.fromObject(point);
    }
    /**
     * Get the ACL handle for this file
     *
     * Any KiiACLEntry objects added or revoked from this ACL object will be appended to/removed from the server on ACL save.
     * @returns {KiiACL} A KiiACL object associated with this KiiObject
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * let acl = obj.objectACL();
     * ```
     */
    objectACL() {
        return _acl__WEBPACK_IMPORTED_MODULE_2__.KiiACL.aclWithParent(this, this.app);
    }
    /**
     * Get a specifically formatted string referencing the object
     *
     * The object must exist in the cloud (have a valid UUID).
     * @returns {String} A URI string based on the current object. null if a URI couldn't be generated.
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * let uri = obj.objectURI();
     * ```
     */
    objectURI() {
        if (this.bucket && this.id) {
            return `kiicloud:/${this.bucket.getPath()}/objects/${this.id}`;
        }
        return null;
    }
    /** @hidden */
    _getToken() {
        const currUser = _user__WEBPACK_IMPORTED_MODULE_5__.KiiUser.getCurrentUser();
        const token = currUser ? currUser.getAccessToken() : null;
        return token ? token : null;
    }
    /**
     * Create or update the KiiObject on KiiCloud.
     *
     * When call this method for the object that has not saved on cloud, will send all fields.
     * Call this method for the object that has saved on cloud, Update all field of this object.
     * @param overwrite <ul>
     * <li><b>If overwrite is true:</b>
     *   <ul>
     *     <li>If a KiiObject with the same ID exists in cloud, the local copy will overwrite the remote copy, even if the remote copy is newer. </li>
     *   </ul>
     * <li><b>Otherwise:</b>
     *   <ul>
     *     <li>If a KiiObject with the same ID exists in cloud and the remote copy is newer, save will fail.</li>
     *   </ul>
     * </ul>
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theSavedObject). theSavedObject is KiiObject instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * obj.saveAllFields().then(theSavedObject => {
     *   // do something with the saved object
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    saveAllFields(overwrite = true) {
        return __awaiter(this, arguments, void 0, function* () {
            // sustain the compatibility with v2
            if (arguments[0] === null) {
                overwrite = arguments[1];
            }
            const body = {};
            Object.assign(body, this.customInfo);
            Object.assign(body, this.patch);
            if (this.getID() == null) {
                yield this.performCreate(body);
            }
            else {
                yield this.performUpdate(body, overwrite);
            }
            this.customInfo = body;
            this.patch = {};
            return this;
        });
    }
    /**
     * Create or update the KiiObject on KiiCloud.
     *
     * When call this method for the object that has not saved on cloud, will send all fields.
     * Call this method for the object that has saved on cloud, Update only updated fields.
     * Do not send fields that has not updated locally. To send all fields regardless of updates, call {@link KiiObject.saveAllFields}.
     * @param overwrite            <ul>
     * <li><b>If overwrite is true:</b>
     *   <ul>
     *     <li>If a KiiObject with the same ID exists in cloud, the local copy will overwrite the remote copy, even if the remote copy is newer. </li>
     *   </ul>
     * <li><b>Otherwise:</b>
     *   <ul>
     *     <li>If a KiiObject with the same ID exists in cloud and the remote copy is newer, save will fail.</li>
     *   </ul>
     * </ul>
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theSavedObject). theSavedObject is KiiObject instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * obj.save().then(theSavedObject => {
     *   // do something with the saved object
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    save(overwrite = true) {
        return __awaiter(this, arguments, void 0, function* () {
            // sustain the compatibility with v2
            if (arguments[0] === null) {
                overwrite = arguments[1];
            }
            const body = {};
            Object.assign(body, this.patch);
            if (this.getID() == null) {
                yield this.performCreate(body);
                Object.assign(this.customInfo, this.patch);
            }
            else {
                yield this.performPatchUpdate(body, overwrite);
                // server returns all fields on patch update.
                // so we don't need to assign patch to customInfo
            }
            this.patch = {};
            return this;
        });
    }
    performCreate(body) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects`;
            const request = this.app.newRequest("POST", url);
            if (this.objectType == null) {
                request.setContentType("application/json");
            }
            else {
                request.setContentType(`application/vnd.${this.app.getAppID()}.${this.objectType}+json`);
            }
            const response = yield request.send(JSON.stringify(body));
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_6__.isSuccess)(response.status)) {
                this.etag = (_b = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("etag")) !== null && _b !== void 0 ? _b : "";
                const objectId = response.body["objectID"];
                if (objectId == null) {
                    throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)("No objectID response", this);
                }
                this.id = objectId;
                if (response.body["createdAt"] != null) {
                    this.created = response.body["createdAt"];
                }
                const dataType = response.body["dataType"];
                this.modified = this.created;
                if (dataType != null) {
                    this.setObjectTypeFromResponse(dataType);
                }
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    performUpdate(body, overwrite) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = this.getID();
            if (objectId == null) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)("empty object ID", this);
            }
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}`;
            const request = this.app.newRequest("PUT", url);
            const isSaved = this.getCreated() > 0;
            if (!overwrite) {
                if (isSaved) {
                    if (this.etag.length == 0) {
                        throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)("IllegalState! Call KiiObject#refresh() prior call this method.", this);
                    }
                    request.addHeader("If-Match", this.etag);
                }
                else {
                    request.addHeader("If-None-Match", "*");
                }
            }
            if (this.objectType == null) {
                request.setContentType("application/json");
            }
            else {
                request.setContentType(`application/vnd.${this.app.getAppID()}.${this.objectType}+json"`);
            }
            const response = yield request.send(JSON.stringify(body));
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_6__.isSuccess)(response.status)) {
                this.etag = (_b = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("etag")) !== null && _b !== void 0 ? _b : "";
                if (response.body["createdAt"] != null) {
                    this.created = response.body["createdAt"];
                }
                if (response.body["modifiedAt"] != null) {
                    this.modified = response.body["modifiedAt"];
                }
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    performPatchUpdate(body, overwrite) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = this.getID();
            if (objectId == null) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)("empty object ID", this);
            }
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}`;
            const request = this.app.newRequest("POST", url);
            request.addHeader("X-HTTP-Method-Override", "PATCH");
            const isSaved = this.getCreated() > 0;
            if (!overwrite) {
                if (isSaved) {
                    if (this.etag.length == 0) {
                        throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)("IllegalState! Call KiiObject#refresh() prior call this method.", this);
                    }
                    request.addHeader("If-Match", this.etag);
                }
                else {
                    if (body && !this.etag) {
                        throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)("IllegalState! Call KiiObject#refresh() prior call this method.", this);
                    }
                    request.addHeader("If-None-Match", "*");
                }
            }
            if (this.objectType == null) {
                request.setContentType("application/json");
            }
            else {
                request.setContentType(`application/vnd.${this.app.getAppID()}.${this.objectType}+json`);
            }
            const response = yield request.send(JSON.stringify(body));
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_6__.isSuccess)(response.status)) {
                this.etag = (_b = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("etag")) !== null && _b !== void 0 ? _b : "";
                this.updateWithJSON(response.body);
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    /** @hidden */
    static objectWithBucket(bucket, type, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        const object = new KiiObject(bucket, undefined, app);
        object.setObjectType(type);
        return object;
    }
    /** @hidden */
    updateWithJSON(body, patch = true) {
        if (!patch) {
            this.customInfo = {};
        }
        for (let key in body) {
            const value = body[key];
            switch (key) {
                case "_id":
                    // only set uuid when uuid is null/undefined
                    if (this.getID() == null) {
                        this.id = value;
                    }
                    break;
                case "_created":
                    this.created = value;
                    break;
                case "_modified":
                    this.modified = value;
                    break;
                case "_owner":
                    this.owner = _user__WEBPACK_IMPORTED_MODULE_5__.KiiUser.userWithID(value);
                    break;
                case "_dataType":
                    this.objectType = value;
                    break;
                case "_calculated":
                    this.customInfo[key] = value;
                    break;
                case "_version":
                    this.etag = value;
                    break;
                default:
                    if (key[0] != "_") {
                        this.customInfo[key] = value;
                    }
                    break;
            }
        }
    }
    /**
     * Updates the local object's data with the user data on the server
     *
     * The object must exist on the server.
     * Local data will be overwritten.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theRefreshedObject). theRefreshedObject is KiiObject instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * obj.refresh().then(theRefreshedObject => {
     *   // do something with the refreshed object
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    refresh() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = this.getID();
            if (objectId == null) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)("empty object ID", this);
            }
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}`;
            const request = this.app.newRequest("GET", url);
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_6__.isSuccess)(response.status)) {
                this.etag = (_b = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("etag")) !== null && _b !== void 0 ? _b : "";
                this.updateWithJSON(response.body, false);
                return this;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    /**
     * Delete the object from the server
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theDeletedObject). theDeletedObject is KiiObject instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * obj.delete().then(theDeletedObject => {
     *   // do something
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = this.getID();
            if (objectId == null) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)("empty object ID", this);
            }
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}`;
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_6__.isSuccess)(response.status)) {
                // OK
                return this;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    /**
     * Generate a new KiiObject based on a given URI
     * @param uri The URI of the object to be represented
     * @param app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @returns {KiiObject} A new KiiObject with its parameters filled in from the URI
     * @example
     * ```typescript
     * let group = KiiObject.objectWithURI("kiicloud://myuri");
     * ```
     */
    static objectWithURI(uri, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        let kiiuri;
        let entity;
        try {
            kiiuri = _uri__WEBPACK_IMPORTED_MODULE_4__.KiiUri.parse(uri, app);
            entity = kiiuri.toEntity();
        }
        catch (e) {
            throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)(e.message, this);
        }
        if (entity instanceof KiiObject) {
            return entity;
        }
        else {
            throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)("uri is not for object.", undefined);
        }
    }
    /**
     * Move KiiObject body from an object to another object.
     * @param targetObjectUri A KiiObject URI which KiiObject body is moved to.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is Array instance.
     *       <ul>
     *         <li>params[0] is the source KiiObject instance which this method was called on.</li>
     *         <li>params[1] is the target targetObjectUri String.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the source KiiObject instance which this method was called on.</li>
     *         <li>error.targetObjectUri is the targetObjectUri String.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let targetObject = ...; // Target KiiObject
     * let targetObjectUri = targetObject.objectURI();
     * sourceObject.moveBody(targetObjectUri).then(params => {
         let theSrcObject = params[0];
         let theTgtObjectUri = params[1];
     *   // Do something with the objects
     * }).catch(error => {
     *   // Do something with the error response
     * });
     * ```
     */
    moveBody(targetObjectUri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!targetObjectUri) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidArgumentException("targetObjectUri is required", this);
            }
            let targetUri;
            let body;
            try {
                targetUri = _uri__WEBPACK_IMPORTED_MODULE_4__.KiiUri.parse(targetObjectUri, this.app);
                body = targetUri.toMoveBodyParam();
            }
            catch (e) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)(e.message, this);
            }
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}/body/move`;
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.ObjectBodyMoveRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_6__.isSuccess)(response.status)) {
                // OK
                return [this, targetObjectUri];
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, {
                    targetObjectUri: targetObjectUri,
                });
            }
        });
    }
    /**
     * Upload body data of this object.
     * If the KiiObject has not saved on the cloud or deleted,
     * request will be failed.
     *
     * NOTE: this requires XMLHttpRequest Level 2, FileReader and Blob supports. Do not use it in server code.
     * @param srcDataBlob data to be uploaded.
     * type is used to determin content-type managed in Kii Cloud.
     * If type was not specified in the Blob,
     * 'application/octet-stream' will be used.
     * @return {Promise} return promise object.
     * <br>NOTE: Promise will not handle progress event. Please pass callbacks with progress function to handle progress.
     *   <ul>
     *     <li>fulfill callback function: function(theObject). theObject is a KiiObject instance which this method was called on.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let myObject = Kii.bucketWithName('myBucket').createObject();
     * myObject.save().then(obj => {
     *   let srcData = new Blob(['Hello Blob'], {type: 'text/plain'});
     *   obj.uploadBody(srcData).then(obj => { // fullfill callback function
     *     // Upload succeeded.
     *   }).catch(error => { // reject callback function
     *     // Handle error.
     *   });
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    uploadBody(srcDataBlob) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}/body`;
            const contentType = srcDataBlob.type.length > 0
                ? srcDataBlob.type
                : "application/octet-stream";
            const request = this.app.newRequest("PUT", url);
            request.addHeader("x-kii-sdk", _kii__WEBPACK_IMPORTED_MODULE_7__.KiiSDKClientInfo.getSDKClientInfo());
            request.setContentType(contentType);
            const response = yield request.send(srcDataBlob);
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_6__.isSuccess)(response.status)) {
                const modifiedAt = response.body["modifiedAt"];
                if (modifiedAt !== undefined) {
                    this.modified = modifiedAt;
                }
                this.bodyContentType = contentType;
                return this;
            }
            else {
                let errString = "failed to upload body. statusCode: " + response.status;
                if (response.body.errorCode) {
                    errString += " error code: " + response.body.errorCode;
                }
                if (response.body.message) {
                    errString += " message: " + response.body.message;
                }
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)(errString, this);
            }
        });
    }
    /**
     * Download body data of this object.
     * If the KiiObject has not saved on the cloud or deleted
     * or exist but does not have body object, request will be failed.
     *
     * NOTE: this requires XMLHttpRequest Level 2, FileReader and Blob supports. Do not use it in server code.<br>
     * @return {Promise} return promise object.
     * <br>NOTE: Promise will not handle progress event. Please pass callbacks with progress function to handle progress.
     *   <ul>
     *     <li>fulfill callback function: function(bodyBlob). bodyBlob is the returned body blob object.</li>
     *     <li>reject callback function: function(error). error is an Error instance.</li>
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let myObject = KiiObject.objectWithURI('put existing object uri here');
     * myObject.downloadBody().then(bodyBlob => {
     *   // Obtaind body contents as bodyBlob.
     *   // content-type managed in Kii Cloud can be obtained from type attr.
     *   let contentType = bodyBlob.type;
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    downloadBody() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}/body`;
            const request = this.app.newRequest("GET", url);
            request.addHeader("x-kii-sdk", _kii__WEBPACK_IMPORTED_MODULE_7__.KiiSDKClientInfo.getSDKClientInfo());
            const response = yield request.sendForDownload();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_6__.isSuccess)(response.status)) {
                const contentType = (_b = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("content-type")) !== null && _b !== void 0 ? _b : "";
                this.bodyContentType = contentType;
                return response.body;
            }
            else {
                let errString = "failed to download body. statusCode: " + response.status;
                if (response.body) {
                    errString += " error code: " + response.body.errorCode;
                }
                if (response.body.message) {
                    errString += " message: " + response.body.message;
                }
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)(errString, this);
            }
        });
    }
    /**
     * ublish object body.
     * Publish object body and obtain public URL links to the body.
     * It doesn't expires.
     * If the KiiObject has not saved on the cloud or deleted
     * or exist but does not have body object, request will be failed.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(publishedUrl). publishedUrl is the published url string.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let myObject = KiiObject.objectWithURI('put existing object uri here');
     * myObject.publishBody().then(publishedUrl => {
     *   // ex.) You can show publishedUrl in the view.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    publishBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.publish({});
        });
    }
    /**
     * Publish object body with expiration date.
     * Publish object body and obtain public URL links to the body.
     * Expires at specified date
     * If the KiiObject has not saved on the cloud or deleted
     * or exist but does not have body object, request will be failed.
     * @param expiresAt expiration date. should specify future date.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(publishedUrl). publishedUrl is the published url string.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let myObject = KiiObject.objectWithURI('put existing object uri here');
     * let expiresAt = new Date(2014, 11, 24);
     * myObject.publishBodyExpiresAt(expiresAt).then(publishedUrl => {
     *   // ex.) You can show publishedUrl in the view.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    publishBodyExpiresAt(expiresAt) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.publish({
                expiresAt: expiresAt,
            });
        });
    }
    /**
     * Publish object body with expiration duration.
     * Publish object body and obtain public URL links to the body.
     * Expires in specified duration
     * If the KiiObject has not saved on the cloud or deleted
     * or exist but does not have body object, request will be failed.
     * @param expiresIn duration in seconds. greater than 0.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(publishedUrl). publishedUrl is the published url string.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let myObject = KiiObject.objectWithURI('put existing object uri here');
     * let expiresIn = 60 * 60; // Expires in 1 hour.
     * myObject.publishBodyExpiresIn(expiresIn).then(publishedUrl => {
     *   // ex.) You can show publishedUrl in the view.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    publishBodyExpiresIn(expiresIn) {
        return this.publish({
            expiresIn: expiresIn,
        });
    }
    publish(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}/body/publish`;
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.ObjectBodyPublicationRequest+json");
            request.addHeader("x-kii-sdk", _kii__WEBPACK_IMPORTED_MODULE_7__.KiiSDKClientInfo.getSDKClientInfo());
            const response = yield request.send(JSON.stringify(body));
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_6__.isSuccess)(response.status)) {
                const publishedUrl = response.body["url"];
                return [this, publishedUrl];
            }
            else {
                let errString = "failed to publish body. statusCode: " + response.status;
                if (response.body.errorCode) {
                    errString += " error code: " + response.body.errorCode;
                }
                if (response.body.message) {
                    errString += " error message: " + response.body.message;
                }
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)(errString, this);
            }
        });
    }
    /**
     * Delete the object body from the server.
     * If the KiiObject has not saved on the cloud or deleted
     * or exist but does not have body object, request will be failed.
     * If succeeded, The object body content type will be nullified.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theDeletedObject). theDeletedObject is the KiiObject instance which this method was called on.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiObject instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let obj = . . .; // a KiiObject
     * obj.deleteBody().then(theDeletedObject => {
     *   // do something
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    deleteBody() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.bucket.getPath()}/objects/${this.getID()}/body`;
            const request = this.app.newRequest("DELETE", url);
            request.addHeader("x-kii-sdk", _kii__WEBPACK_IMPORTED_MODULE_7__.KiiSDKClientInfo.getSDKClientInfo());
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_6__.isSuccess)(response.status)) {
                this.bodyContentType = "";
                return this;
            }
            else {
                let errString = "failed to delete body. statusCode: " + response.status;
                if (response.body) {
                    errString += " error code: " + response.body.errorCode;
                }
                if (response.body.message) {
                    errString += " message: " + response.body.message;
                }
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_8__.error)(errString, this);
            }
        });
    }
    /**
     * Check if given ID is valid for object ID.
     * Valid pattern: ^[a-zA-Z0-9-_\\.]{2,100}$
     * @param objectID objectID to be checked.
     * @returns true if given ID is valid, false otherwise.
     */
    static isValidObjectID(objectID) {
        const pattern = /^[a-zA-Z0-9-_.]{2,100}$/i;
        if (typeof objectID !== "string") {
            return false;
        }
        else if (objectID.match(pattern) !== null) {
            return true;
        }
        else {
            return false;
        }
    }
}


/***/ }),

/***/ "./src/push.ts":
/*!*********************!*\
  !*** ./src/push.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiPushSubscription": () => (/* binding */ KiiPushSubscription),
/* harmony export */   "KiiPushInstallation": () => (/* binding */ KiiPushInstallation)
/* harmony export */ });
/* harmony import */ var _bucket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bucket */ "./src/bucket.ts");
/* harmony import */ var _topic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./topic */ "./src/topic.ts");
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./user */ "./src/user.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/* harmony import */ var _httpResponse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./httpResponse */ "./src/httpResponse.ts");
/* harmony import */ var _thing__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./thing */ "./src/thing.ts");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utilities */ "./src/utilities.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







/**
 * Represents a KiiPushSubscription.
 */
class KiiPushSubscription {
    /** @hidden */
    constructor(subscriber, app) {
        this.subscriber = subscriber;
        this.app = app;
    }
    /** @hidden */
    getSubscriber() {
        return this.subscriber;
    }
    /**
     * Subscribe to bucket or topic.
     * @param target to be subscribed. KiiBucket or KiiTopic instance.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiPushSubscription instance.</li>
     *         <li>params[1] is the instance to subscribe.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiPushSubscription instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let topic = Kii.topicWithName("myAppTopic");
     * let user = KiiUser.getCurrentUser();
     * user.pushSubscription().subscribe(topic).then(params => {
     *   let subscription = params[0];
     *   let topic = params[1];
     *   // Succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    subscribe(target) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getRequestHTTPURI(target);
            const request = this.app.newRequest("PUT", url);
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                return [this, target];
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    /**
     * Unsubscribe to bucket or topic.
     * @param target to be unsubscribed. KiiBucket or KiiTopic instance.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiPushSubscription instance.</li>
     *         <li>params[1] is the instance to unsubscribe.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiPushSubscription instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let topic = Kii.topicWithName("myAppTopic");
     * let user = KiiUser.getCurrentUser();
     * user.pushSubscription().unsubscribe(topic).then(params => {
     *   let subscription = params[0];
     *   let topic = params[1];
     *   // Succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    unsubscribe(target) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getRequestHTTPURI(target);
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                return [this, target];
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, target, null);
            }
        });
    }
    /**
     * Check subscription of bucket, topic.
     * @param target to check subscription. KiiBucket or KiiTopic instance.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiPushSubscription instance.</li>
     *         <li>params[1] is the instance to subscribe.</li>
     *         <li>params[2] is Boolean value. true if subscirbed, otherwise false.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiPushSubscription instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```typescript
     * let topic = Kii.topicWithName("myAppTopic");
     * let user = KiiUser.getCurrentUser();
     * user.pushSubscription().isSubscribed(topic).then(params => {
     *   // Succeeded.
     *   let subscription = params[0];
     *   let topic = params[1];
     *   let isSubscribed = params[2];
     *   if (isSubscribed) {
     *     // The topic is subscribed by current user.
     *   } else {
     *     // The topic is not subscribed by current user.
     *   }
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    isSubscribed(target) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getRequestHTTPURI(target);
            const request = this.app.newRequest("GET", url);
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                return [this, target, true];
            }
            else if (["FILTER_NOT_FOUND", "PUSH_SUBSCRIPTION_NOT_FOUND"].includes(response.body.errorCode)) {
                return [this, target, false];
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    /**
     * Get request uri
     */
    getRequestHTTPURI(target) {
        let subscriberPath = "";
        if (this.subscriber instanceof _user__WEBPACK_IMPORTED_MODULE_2__.KiiUser) {
            subscriberPath = `users/${this.subscriber.getID()}`;
        }
        if (this.subscriber instanceof _thing__WEBPACK_IMPORTED_MODULE_5__.KiiThing) {
            subscriberPath = `things/${this.subscriber.getThingID()}`;
        }
        if (target instanceof _bucket__WEBPACK_IMPORTED_MODULE_0__.KiiBucket) {
            return `/apps/${this.app.getAppID()}${target.getPath()}/filters/all/push/subscriptions/${subscriberPath}`;
        }
        else if (target instanceof _topic__WEBPACK_IMPORTED_MODULE_1__.KiiTopic) {
            return `/apps/${this.app.getAppID()}${target.getPath()}/push/subscriptions/${subscriberPath}`;
        }
        return "";
    }
}
/**
 * Represents a KiiPushInstallation object
 */
class KiiPushInstallation {
    /** @hidden */
    constructor(user, app) {
        this.user = user;
        this.app = app;
    }
    /**
     * Register the id issued by GCM to the Kii cloud for current logged in user.
     * @param installationRegistrationID The ID of registration that identifies the installation externally.
     * @param development Indicates if the installation is for development or production environment.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(response).
     *       <ul>
     *         <li>response.installationID is ID of the installation in the platform.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    installGcm(installationRegistrationID, development) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_6__.isNonEmptyString)(installationRegistrationID)) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("installationRegistrationID must not be null or empty.", this);
            }
            return this.install(installationRegistrationID, "ANDROID", development);
        });
    }
    /**
     * Register the id issued by APNS to the Kii cloud for current logged in user.
     * @param deviceToken The ID of registration that identifies the installation externally.
     * @param development Indicates if the installation is for development or production environment.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(response).
     *       <ul>
     *         <li>response.installationID is ID of the installation in the platform.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    installApns(deviceToken, development) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_6__.isNonEmptyString)(deviceToken)) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("deviceToken must not be null or empty.", this);
            }
            return this.install(deviceToken, "IOS", development);
        });
    }
    /**
     * Register a MQTT installation to the Kii cloud for current logged in user.
     * @param development Indicates if the installation is for development or production environment.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(response).
     *       <ul>
     *         <li>response.installationID is ID of the installation in the platform.</li>
     *         <li>response.installationRegistrationID is ID of registration that identifies the installation externally.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    installMqtt(development) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.install("", "MQTT", development);
        });
    }
    /**
     * Get MQTT endpoint.<br/>
     * If the MQTT endpoint is not ready, this method retries request up to three times.
     * <br/><br/>
     * Note that only MQTT over tls is supported currently.<br>
     * Don't use portSSL, portWS or portWSS until we support it.
     * @param installationID The ID of the installation in the platform.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(response).
     *       <ul>
     *         <li>response.installationID is ID of the installation in the platform.</li>
     *         <li>response.username is username to use for connecting to the MQTT broker.</li>
     *         <li>response.password is assword to use for connecting to the MQTT broker.</li>
     *         <li>response.mqttTopic is topic to subscribe in the MQTT broker.</li>
     *         <li>response.host is hostname of the MQTT broker.</li>
     *         <li>response.X-MQTT-TTL is the amount of time in seconds that specifies how long the mqttTopic will be valid, after that the client needs to request new MQTT endpoint info.</li>
     *         <li>response.portTCP is port to connect using plain TCP.</li>
     *         <li>response.portSSL is port to connect using SSL/TLS.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiPushSubscription instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    getMqttEndpoint(installationID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_6__.isNonEmptyString)(installationID)) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("installationID must not be null or empty.", this);
            }
            const url = `/apps/${this.app.getAppID()}/installations/${installationID}/mqtt-endpoint`;
            const request = this.app.newRequest("GET", url);
            const recReq = (retry) => {
                return request.send().then((response) => {
                    if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                        return response.body;
                    }
                    else {
                        if (response.status === 503) {
                            if (--retry > 0) {
                                return new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        return resolve(recReq(retry));
                                    }, 1000);
                                });
                            }
                        }
                        throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
                    }
                });
            };
            return recReq(3);
        });
    }
    /**
     * Unregister the push settings by the id(issued by push provider) that is used for installation.
     * @param installationRegistrationID The ID of registration that identifies the installation externally.
     * @param deviceType The type of the installation.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function().</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiPushSubscription instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    uninstall(installationRegistrationID, deviceType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_6__.isNonEmptyString)(installationRegistrationID)) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("installationRegistrationID must not be null or empty.", this);
            }
            if (!this.validateDeviceType(deviceType)) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)(`Unsupported deviceType ${deviceType}`, this);
            }
            const url = `/apps/${this.app.getAppID()}/installations/${deviceType}:${installationRegistrationID}`;
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                return;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    validateDeviceType(deviceType) {
        return (deviceType === "ANDROID" || deviceType === "MQTT" || deviceType === "IOS");
    }
    /**
     * Unregister the push settings by the id(issued by KiiCloud) that is used for installation.
     * @param installationID The ID of the installation issued by KiiCloud.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function().</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is a KiiPushSubscription instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    uninstallByInstallationID(installationID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_6__.isNonEmptyString)(installationID)) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("installationID must not be null or empty.", this);
            }
            const url = `/apps/${this.app.getAppID()}/installations/${installationID}`;
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                return;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    install(installationRegistrationID, deviceType, development) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof development !== "boolean") {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("type of development must be boolean.", this);
            }
            const url = `/apps/${this.app.getAppID()}/installations`;
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.InstallationCreationRequest+json");
            const body = {
                development: development,
                deviceType: deviceType,
            };
            if (installationRegistrationID) {
                body.installationRegistrationID = installationRegistrationID;
            }
            const response = yield request.send(JSON.stringify(body));
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_4__.isSuccess)(response.status)) {
                return response.body;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
}


/***/ }),

/***/ "./src/query.ts":
/*!**********************!*\
  !*** ./src/query.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiQuery": () => (/* binding */ KiiQuery),
/* harmony export */   "KiiClause": () => (/* binding */ KiiClause)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/index.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");


/**
 * Represents a KiiQuery object
 */
class KiiQuery {
    /** @hidden */
    constructor() {
        this.clause = undefined;
        this.paginationKey = "";
        this.limit = 0;
        this.sortField = undefined;
        this.sortDescending = undefined;
    }
    /** @hidden */
    static clone(query) {
        const newQuery = new KiiQuery();
        newQuery.clause = query.clause;
        newQuery.limit = query.limit;
        newQuery.sortField = query.sortField;
        newQuery.sortDescending = query.sortDescending;
        return newQuery;
    }
    /** @hidden */
    getPaginationKey() {
        return this.paginationKey;
    }
    /** @hidden */
    setPaginationKey(key) {
        this.paginationKey = key;
    }
    setClause(clause) {
        this.clause = clause;
    }
    /**
     * Get the limit of the current query
     */
    getLimit() {
        return this.limit;
    }
    /**
     * setLimit
     * @param limit The desired limit. Must be an integer > 0
     */
    setLimit(limit) {
        this.limit = limit;
    }
    /** @hidden */
    toDict() {
        const data = {};
        const bucketQuery = {};
        if (this.paginationKey) {
            data["paginationKey"] = this.paginationKey;
        }
        if (this.limit > 0) {
            data["bestEffortLimit"] = this.limit;
        }
        if (this.sortDescending !== undefined) {
            bucketQuery["descending"] = this.sortDescending;
        }
        if (this.clause === undefined) {
            bucketQuery["clause"] = { type: "all" };
        }
        else {
            bucketQuery["clause"] = this.clause.toDict();
        }
        if (this.sortField !== undefined) {
            bucketQuery["orderBy"] = this.sortField;
        }
        data["bucketQuery"] = bucketQuery;
        return data;
    }
    /**
     * Create a KiiQuery object based on a KiiClause
     *
     * By passing null as the ‘clause’ parameter, all objects can be retrieved.
     * @param clause The KiiClause to be executed with the query
     */
    static queryWithClause(clause) {
        const query = new KiiQuery();
        if (clause == null) {
            // query.setClause(KiiClause.all());
        }
        else {
            query.setClause(clause);
        }
        return query;
    }
    /**
     * Set the query to sort by a field in descending order
     * If a sort has already been set, it will be overwritten.
     * @param field The key that should be used to sort
     */
    sortByDesc(field) {
        this.sortField = field;
        this.sortDescending = true;
    }
    /**
     * Set the query to sort by a field in ascending order
     * If a sort has already been set, it will be overwritten.
     * @param field The key that should be used to sort
     */
    sortByAsc(field) {
        this.sortField = field;
        this.sortDescending = false;
    }
}
/**
 * Represents a KiiClause expression object
 */
class KiiClause {
    constructor() {
        this.whereClauses = [];
        this.whereType = "";
    }
    /** @hidden */
    toDict() {
        let retDict = null;
        if (this.whereClauses.length > 0) {
            if (this.whereType.length > 0) {
                if (this.whereClauses.length === 1) {
                    const clause = this.whereClauses[0];
                    if (this.whereType === "not") {
                        retDict = { type: "not", clause: clause.toDict() };
                    }
                    else {
                        retDict = clause.toDict();
                    }
                }
                else {
                    const clauses = [];
                    this.whereClauses.forEach((clause) => {
                        clauses.push(clause.toDict());
                    });
                    retDict = { type: this.whereType, clauses: clauses };
                }
            }
            else {
                retDict = this.whereClauses[0].toDict();
            }
        }
        else if (this.dictExpression) {
            retDict = this.dictExpression;
        }
        if (!retDict) {
            retDict = { type: "all" };
        }
        return retDict;
    }
    /** @hidden */
    setWhereType(whereType) {
        this.whereType = whereType;
    }
    /** @hidden */
    setWhereClauses(whereClauses) {
        this.whereClauses = whereClauses;
    }
    /** @hidden */
    setDictValue(dictExpression) {
        this.dictExpression = dictExpression;
    }
    /** @hidden */
    getWhereType() {
        return this.whereType;
    }
    /** @hidden */
    static createWithWhere(whereType, whereClauses) {
        const expression = new KiiClause();
        expression.setWhereType(whereType);
        expression.setWhereClauses(whereClauses);
        return expression;
    }
    /** @hidden */
    static create(operator, key, value) {
        const expression = new KiiClause();
        let dict = {};
        if (operator === "=") {
            dict.type = "eq";
            dict.field = key;
            dict.value = value;
        }
        else if (operator === "<") {
            dict.type = "range";
            dict.field = key;
            dict.upperLimit = value;
            dict.upperIncluded = false;
        }
        else if (operator === "<=") {
            dict.type = "range";
            dict.field = key;
            dict.upperLimit = value;
            dict.upperIncluded = true;
        }
        else if (operator === ">") {
            dict.type = "range";
            dict.field = key;
            dict.lowerLimit = value;
            dict.lowerIncluded = false;
        }
        else if (operator === ">=") {
            dict.type = "range";
            dict.field = key;
            dict.lowerLimit = value;
            dict.lowerIncluded = true;
        }
        else if (operator === "in") {
            dict.type = "in";
            dict.field = key;
            dict.values = value;
        }
        else if (operator === "prefix") {
            dict.type = "prefix";
            dict.field = key;
            dict.prefix = value;
        }
        else if (operator === "hasField") {
            dict.type = "hasField";
            dict.field = key;
            dict.fieldType = value;
        }
        expression.setDictValue(dict);
        return expression;
    }
    /** @hidden (maybe not needed) */
    static all() {
        return new KiiClause();
    }
    /**
     * Create a KiiClause with the AND operator concatenating multiple KiiClause objects
     * @param clauses A variable-length list of KiiClause objects to concatenate
     */
    static and(...clauses) {
        return this.createWithWhere("and", clauses);
    }
    /**
     * Create a KiiClause with the OR operator concatenating multiple KiiClause objects
     *
     * <b>Note:</b>
     * Query performance will be worse as the number of objects in bucket increases, so we recommend you avoid the OR clause if possible.
     * @param clauses A variable-length list of KiiClause objects to concatenate
     */
    static or(...clauses) {
        return this.createWithWhere("or", clauses);
    }
    /**
     * Create a KiiClause with the NOT operator concatenating a KiiClause object
     *
     * <b>Note:</b>
     * Query performance will be worse as the number of objects in bucket increases, so we recommend you avoid the NOT clause if possible.
     * @param clause KiiClause object to negate
     */
    static not(clause) {
        return this.createWithWhere("not", [clause]);
    }
    /**
     * Create an expression of the form (key == value)
     * @param key The key to compare
     * @param value The key to compare
     */
    static equals(key, value) {
        if (value.className) {
            value = value.ObjectURI;
        }
        return KiiClause.create("=", key, value);
    }
    /**
     * Create an expression of the form (key != value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static notEquals(key, value) {
        if (value.className) {
            value = value.ObjectURI;
        }
        return this.createWithWhere("not", [KiiClause.equals(key, value)]);
    }
    /**
     * Create an expression of the form (key > value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static greaterThan(key, value) {
        return KiiClause.create(">", key, value);
    }
    /**
     * Create an expression of the form (key >= value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static greaterThanOrEqual(key, value) {
        return KiiClause.create(">=", key, value);
    }
    /**
     * Create an expression of the form (key < value)
     * @param key The key to compare
     * @param value The key to compare
     */
    static lessThan(key, value) {
        return KiiClause.create("<", key, value);
    }
    /**
     * Create an expression of the form (key <= value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static lessThanOrEqual(key, value) {
        return KiiClause.create("<=", key, value);
    }
    /**
     * Create an expression of the form (key in values)
     * @param key The key to compare
     * @param values to be compared with.
     */
    static in(key, values) {
        return KiiClause.create("in", key, values);
    }
    /**
     * Create an expression of the form (key in values)
     * @param key The key to compare
     * @param values to be compared with.
     */
    static inClause(key, values) {
        return KiiClause.create("in", key, values);
    }
    /**
     * Create an expression of the form (key STARTS WITH value)
     * @param key The key to compare
     * @param value the value to compare
     */
    static startsWith(key, value) {
        return KiiClause.create("prefix", key, value);
    }
    /**
     * Create a clause of geo distance. This clause inquires objects in the specified circle.
     * @param key Name of the key to inquire, which holds geo point.
     * @param center Geo point which specify center of the circle.
     * @param radius Radius of the circle. unit is meter. value should be in range of ]0, 20000000]
     * @param putDistanceInto Used for retrieve distance from the center from the query result.Must match the pattern "^[a-zA-Z_][a-zA-Z0-9_]*$".
     * If the specified value is null, query result will not contain the distance.
     * <b>Note:</b> You can get the results in ascending order of distances from center. To do so, build the orderBy field  by
     * "_calculated.{specified value of putDistanceInto}" and pass it in {@link KiiQuery.sortByAsc}. Note that, descending order
     * of distances is not supported. The unit of distance is meter.
     */
    static geoDistance(key, center, radius, putDistanceInto) {
        const isValidString = (key) => {
            return typeof key === "string" && key.length > 0;
        };
        const isValidGeoPoint = (point) => {
            if (!point) {
                return false;
            }
            return point instanceof ___WEBPACK_IMPORTED_MODULE_0__.KiiGeoPoint;
        };
        if (!isValidString(key)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_1__.InvalidArgumentException("Specified key is not a string or is an empty string.", undefined);
        }
        if (!isValidGeoPoint(center)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_1__.InvalidArgumentException("center is not a reference of KiiGeoPoint.", undefined);
        }
        const pattern = "^[a-zA-Z_][a-zA-Z0-9_]*$";
        if (putDistanceInto && pattern.match(putDistanceInto) !== null) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_1__.InvalidArgumentException("putDistanceInto is invalid.", undefined);
        }
        if (putDistanceInto === "") {
            throw new _exception__WEBPACK_IMPORTED_MODULE_1__.InvalidArgumentException("putDistanceInto is invalid.", undefined);
        }
        if (isNaN(radius) || radius <= 0 || radius > 20000000) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_1__.InvalidArgumentException("radius is invalid.", undefined);
        }
        const expression = new KiiClause();
        let dict = {};
        dict.type = "geodistance";
        dict.field = key;
        center = center.toObject();
        dict.center = center;
        dict.radius = radius;
        dict.putDistanceInto = putDistanceInto;
        expression.setDictValue(dict);
        return expression;
    }
    /**
     * Create a clause of geo box. This clause inquires objects in the specified rectangle.
     * Rectangle would be placed parallel to the equator with specified coordinates of the corner.
     * @param key Key to inquire which holds geo point.
     * @param northEast North-Eest corner of the rectangle.
     * @param southWest South-Wast corner of the rectangle.
     */
    static geoBox(key, northEast, southWest) {
        const isValidKey = (key) => {
            return typeof key === "string" && key.length > 0;
        };
        const isValidGeoPoint = (point) => {
            if (!point) {
                return false;
            }
            return point instanceof ___WEBPACK_IMPORTED_MODULE_0__.KiiGeoPoint;
        };
        if (!isValidKey(key)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_1__.InvalidArgumentException("Specified key is not a string or is an empty string.", undefined);
        }
        if (!isValidGeoPoint(northEast) || !isValidGeoPoint(southWest)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_1__.InvalidArgumentException("northEast or southWest is not a reference of KiiGeoPoint.", undefined);
        }
        const expression = new KiiClause();
        let dict = {};
        dict.type = "geobox";
        dict.field = key;
        const ne = northEast.toObject();
        const sw = southWest.toObject();
        dict.box = {
            ne: ne,
            sw: sw,
        };
        expression.setDictValue(dict);
        return expression;
    }
    /**
     * Create an expression to returns all entities that have a specified field and type.
     * @param key name of the specified field.
     * @param fieldType The type of the content of the field.
     * The type of the content of the field must be provided, possible values are "STRING", "INTEGER", "DECIMAL" and "BOOLEAN".
     */
    static hasField(key, fieldType) {
        if (!["STRING", "INTEGER", "DECIMAL", "BOOLEAN"].includes(fieldType)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_1__.InvalidArgumentException("fieldType is invalid.", undefined);
        }
        return KiiClause.create("hasField", key, fieldType);
    }
}


/***/ }),

/***/ "./src/requestFactory.ts":
/*!*******************************!*\
  !*** ./src/requestFactory.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiJQueryRequestFactory": () => (/* binding */ KiiJQueryRequestFactory),
/* harmony export */   "KiiFetchRequestFactory": () => (/* binding */ KiiFetchRequestFactory)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ResponseHeadersImpl {
    constructor(xhr) {
        this.xhr = xhr;
    }
    get(key) {
        return this.xhr.getResponseHeader(key);
    }
}
class KiiJQueryRequestFactory {
    create(method, url) {
        return new XHRRequest(jQuery.ajaxSettings.xhr(), method, url);
    }
}
class KiiFetchRequestFactory {
    create(method, url) {
        return new FetchRequest(method, url);
    }
}
class XHRRequest {
    constructor(xhr, method, url) {
        this.xhr = xhr;
        this.url = url;
        this.sendAccessToken = true;
        this.accessToken = "";
        this.contentType = "";
        xhr.open(method, url, true);
    }
    onProgress(event) {
        this.progress = event;
        return event;
    }
    getUrl() {
        return this.url;
    }
    setAccessToken(accessToken) {
        this.accessToken = accessToken;
    }
    addHeader(key, value) {
        this.xhr.setRequestHeader(key, value);
    }
    isSendAccessToken(send) {
        this.sendAccessToken = send;
    }
    setContentType(contentType) {
        // We do not call xhr.setRequestHeader() because it "appends" value.
        this.contentType = contentType;
    }
    send(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.xhr.onerror = () => {
                    reject();
                };
                this.xhr.onreadystatechange = () => {
                    if (this.xhr.readyState == XMLHttpRequest.DONE) {
                        const headers = new ResponseHeadersImpl(this.xhr);
                        if (this.xhr.status == 204) {
                            resolve({
                                status: 204,
                                headers: headers,
                                body: {},
                            });
                            return;
                        }
                        let body = null;
                        try {
                            body = JSON.parse(this.xhr.responseText);
                        }
                        catch (e) {
                            // incase of 429, backend may return HTML text
                            body = this.xhr.responseText;
                        }
                        resolve({
                            status: this.xhr.status,
                            headers: headers,
                            body: body,
                        });
                    }
                };
                this.xhr.onprogress = (event) => {
                    return event;
                };
                this.xhr.responseType = "text";
                if (this.contentType.length > 0) {
                    this.xhr.setRequestHeader("Content-Type", this.contentType);
                }
                if (this.sendAccessToken && this.accessToken) {
                    this.xhr.setRequestHeader("authorization", `bearer ${this.accessToken}`);
                }
                this.xhr.send(body);
            });
        });
    }
    sendForDownload(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.xhr.onerror = () => {
                    reject();
                };
                this.xhr.onreadystatechange = () => {
                    if (this.xhr.readyState == XMLHttpRequest.HEADERS_RECEIVED) {
                        if (this.xhr.status == 200) {
                            this.xhr.responseType = "blob";
                        }
                        else {
                            this.xhr.responseType = "text";
                        }
                    }
                    if (this.xhr.readyState == XMLHttpRequest.DONE) {
                        const headers = new ResponseHeadersImpl(this.xhr);
                        let body = null;
                        if (this.xhr.status == 204 || this.xhr.status === 200) {
                            const bodyContentType = this.xhr.getResponseHeader("content-type");
                            // body = new Blob();
                            body = this.xhr.response;
                            resolve({
                                status: 204,
                                headers: headers,
                                body: body,
                            });
                            return;
                        }
                        // this.xhr.responseType = "text";
                        try {
                            body = JSON.parse(this.xhr.responseText);
                        }
                        catch (e) {
                            // incase of 429, backend may return HTML text
                            body = this.xhr.responseText;
                        }
                        resolve({
                            status: this.xhr.status,
                            headers: headers,
                            body: body,
                        });
                    }
                };
                // this.xhr.responseType = "blob";
                if (this.contentType.length > 0) {
                    this.xhr.setRequestHeader("Content-Type", this.contentType);
                }
                if (this.sendAccessToken && this.accessToken) {
                    this.xhr.setRequestHeader("authorization", `bearer ${this.accessToken}`);
                }
                this.xhr.send(body);
            });
        });
    }
}
class FetchRequest {
    constructor(method, url) {
        this.method = method;
        this.url = url;
        this.sendAccessToken = true;
        this.accessToken = "";
        this.contentType = "";
        this.headers = new Headers();
    }
    getUrl() {
        return this.url;
    }
    setAccessToken(accessToken) {
        this.accessToken = accessToken;
    }
    addHeader(key, value) {
        this.headers.append(key, value);
    }
    isSendAccessToken(send) {
        this.sendAccessToken = send;
    }
    setContentType(contentType) {
        // We do not call xhr.setRequestHeader() because it "appends" value.
        this.contentType = contentType;
    }
    onProgress(event) {
        this.progress = event;
    }
    send(body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.contentType.length > 0) {
                this.headers.append("Content-Type", this.contentType);
            }
            if (this.sendAccessToken && this.accessToken) {
                this.headers.append("authorization", `bearer ${this.accessToken}`);
            }
            const response = yield fetch(this.url, {
                method: this.method,
                headers: this.headers,
                body: body,
            });
            const status = response.status;
            if (status == 204) {
                return {
                    status: status,
                    body: {},
                };
            }
            const respBody = yield response.json();
            return {
                status: status,
                body: respBody,
            };
        });
    }
    sendForDownload(body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sendAccessToken && this.accessToken) {
                this.headers.append("authorization", `bearer ${this.accessToken}`);
            }
            const response = yield fetch(this.url, {
                method: this.method,
                headers: this.headers,
                body: body,
            });
            const status = response.status;
            if (status == 204) {
                return {
                    status: status,
                    body: new Blob(),
                };
            }
            const respBody = yield response.blob();
            return {
                status: status,
                body: respBody,
            };
        });
    }
}


/***/ }),

/***/ "./src/serverCode.ts":
/*!***************************!*\
  !*** ./src/serverCode.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiServerCodeEntry": () => (/* binding */ KiiServerCodeEntry),
/* harmony export */   "KiiServerCodeExecResult": () => (/* binding */ KiiServerCodeExecResult)
/* harmony export */ });
/* harmony import */ var _kii__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./kii */ "./src/kii.ts");
/* harmony import */ var _httpResponse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./httpResponse */ "./src/httpResponse.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utilities */ "./src/utilities.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





/**
 * @class Represents a server side code entry in KiiCloud.
 */
class KiiServerCodeEntry {
    /** @hidden */
    constructor(entryName, version, environmentVersion, app) {
        this.entryName = entryName;
        this.version = version;
        this.environmentVersion = environmentVersion;
        this.app = app;
    }
    /**
     * Execute this server code entry.<br>
     * If argument is an empty object or not type of Object, callbacks.failure or reject callback of promise will be called.<br>
     * @param {Object} argument pass to the entry of script in the cloud.
     *    If null is specified, no argument pass to the script.
     * @return {Promise} return promise object.
     *  <ul>
     *    <li>fulfill callback function: function(params). params is Array instance.
     *      <ul>
     *        <li>params[0] is the KiiServerCodeEntry instance which this method was called on.</li>
     *        <li>params[1] is the passed argument object.</li>
     *        <li>params[2] is a KiiServerCodeExecResult instance.</li>
     *      </ul>
     *    </li>
     *    <li>reject callback function: function(error). error is an Error instance.
     *      <ul>
     *        <li>error.target is the KiiServerCodeEntry instance which this method was called on.</li>
     *        <li>error.message</li>
     *        <li>error.argument is passed argument object. </li>
     *      </ul>
     *    </li>
     *  </ul>
     * @example
     * ```
     * // Instantiate with the endpoint.
     * let entry = Kii.serverCodeEntry("main");
     *
     * // Set the custom parameters.
     * let arg = {"username":"name_of_my_friend", "password":"password_for_my_friend"};
     *
     * // Example of executing the Server Code
     * entry.execute(arg).then(params => {
     *   let entry = params[0];
     *   let argument = params[1];
     *   let execResult = params[2];
     *   // do something
     * }).catch(error => {
     *   // do something with the error response
     * });
     * ```
     */
    execute(argument) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validateServerCodeEntryArgument)(argument)) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidArgumentException("arugment is invalid", this);
            }
            const requestData = argument || {};
            const versionName = this.version || "current";
            let url = `/apps/${this.app.getAppID()}/server-code/versions/${versionName}/${this.entryName}`;
            if (this.environmentVersion) {
                url += `?environment-version=${this.environmentVersion}`;
            }
            const request = this.app.newRequest("POST", url);
            if (!this.app.getCurrentUser()) {
                request.isSendAccessToken(false);
            }
            request.addHeader("x-kii-sdk", _kii__WEBPACK_IMPORTED_MODULE_0__.KiiSDKClientInfo.getSDKClientInfo());
            const response = yield request.send(JSON.stringify(requestData));
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_1__.isSuccess)(response.status)) {
                const headers = response.headers;
                if (headers == null) {
                    throw (0,_utilities__WEBPACK_IMPORTED_MODULE_3__.error)("Invalid response header", this);
                }
                const stepCount = Number((_a = headers.get("x-step-count")) !== null && _a !== void 0 ? _a : "0");
                const environmentVersion = (_b = headers.get("x-environment-version")) !== null && _b !== void 0 ? _b : "";
                return [
                    this,
                    argument,
                    new KiiServerCodeExecResult(response.body, stepCount, environmentVersion),
                ];
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, this, {
                    argument: argument,
                });
            }
        });
    }
    /**
     * Get the entryName of this server code entry.
     * @returns entryName.
     */
    getEntryName() {
        return this.entryName;
    }
}
/**
 * @class Represents a server side code execution result in KiiCloud.
 */
class KiiServerCodeExecResult {
    /** @hidden */
    constructor(returnObject, exeSteps, environmentVersion) {
        this.returnObject = returnObject;
        this.exeSteps = exeSteps;
        this.environmentVersion = environmentVersion;
    }
    /**
     * Get calculated number of executed steps.
     * @returns calculated number of executed steps
     */
    getExecutedSteps() {
        return this.exeSteps;
    }
    /**
     * Get the version of Node.js which the server code was executed.
     * @returns version of Node.js
     */
    getEnvironmentVersion() {
        return this.environmentVersion;
    }
    /**
     * Get Object returned by server code entry.
     * @returns returned by server code entry.
     */
    getReturnedValue() {
        return this.returnObject;
    }
}


/***/ }),

/***/ "./src/thing.ts":
/*!**********************!*\
  !*** ./src/thing.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiThing": () => (/* binding */ KiiThing)
/* harmony export */ });
/* harmony import */ var _kii__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./kii */ "./src/kii.ts");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app */ "./src/app.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./user */ "./src/user.ts");
/* harmony import */ var _group__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./group */ "./src/group.ts");
/* harmony import */ var _httpResponse__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./httpResponse */ "./src/httpResponse.ts");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utilities */ "./src/utilities.ts");
/* harmony import */ var _thingQuery__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./thingQuery */ "./src/thingQuery.ts");
/* harmony import */ var _push__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./push */ "./src/push.ts");
/* harmony import */ var _topic__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./topic */ "./src/topic.ts");
/* harmony import */ var _bucket__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./bucket */ "./src/bucket.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};











/**
 * @class Represents a Thing object
 * @note KiiThing does not support removal of fields from Server.
 * @property {Object} fields of this thing.
 * For details refer to {@link KiiThing.register}
 */
class KiiThing {
    /** @hidden */
    constructor(fields = null, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        this.fields = fields;
        this.app = app;
        this.online = null;
        this.onlineStatusModifiedAt = null;
        this.thingID = null;
        this.vendorThingID = undefined;
        this.accessToken = "";
        this.created = null;
        this.disabled = undefined;
        if (this.fields) {
            this.renewThingFields(this.fields);
        }
    }
    renewThingFields(respJson) {
        this.online = null;
        this.onlineStatusModifiedAt = null;
        this.fields = respJson;
        this.thingID = respJson._thingID || null;
        this.vendorThingID = respJson._vendorThingID || undefined;
        this.accessToken = respJson._accessToken || "";
        this.created = respJson._created ? new Date(respJson._created) : null;
        this.disabled = respJson._disabled;
        if (respJson._online !== undefined) {
            this.online = respJson._online;
        }
        if (respJson._onlineStatusModifiedAt) {
            this.onlineStatusModifiedAt = new Date(respJson._onlineStatusModifiedAt);
        }
        delete this.fields._thingID;
        delete this.fields._vendorThingID;
        delete this.fields._accessToken;
        delete this.fields._created;
        delete this.fields._disabled;
    }
    /**
     * Get thing ID.
     * @return {String} thing id
     */
    getThingID() {
        return this.thingID;
    }
    /** @hidden */
    setThingID(thingID) {
        this.thingID = thingID;
    }
    /**
     * Get vendor thing ID.
     * @return {String} vendor thing id
     */
    getVendorThingID() {
        return this.vendorThingID;
    }
    /** @hidden */
    setVendorThingID(vendorThingID) {
        this.vendorThingID = vendorThingID;
    }
    /**
     * Get access token of this thing.
     * @return {String} access token of this thing.
     */
    getAccessToken() {
        return this.accessToken || "";
    }
    /** @hidden */
    setAccessToken(token) {
        this.accessToken = token;
    }
    /**
     * Get created time of this thing.
     * @return {Date} created time of this thing.
     */
    getCreated() {
        return this.created;
    }
    /**
     *  Get disabled status of this thing.
     * @return {Boolean} true if thing is disabled, false otherwise.
     */
    getDisabled() {
        return this.disabled === undefined ? false : this.disabled;
    }
    /**
     *  Get online status of the thing.
     * @return {Boolean} true if the thing is online, false otherwise.
     * The return value will be null initially until the thing is connected for the first time.
     */
    isOnline() {
        return this.online;
    }
    /**
     *  Get online status modified date of the thing.
     * @return {Date} online status modified time of this thing. The date will be null initially until the thing is connected for the first time.
     */
    getOnlineStatusModifiedAt() {
        return this.onlineStatusModifiedAt;
    }
    /** @hidden */
    getPath() {
        return `/things/${this.thingID}`;
    }
    /**
     * Register thing in KiiCloud.<br>
     * This API doesnt require users login Anonymous user can register thing.
     * <br>
     * Propertis started with '_' in the fields is reserved by Kii Cloud.<br>
     * Those properties are indexed in Kii Cloud storage.<br>
     * Properties not started with '_' is custom properties defined by developer.<br>
     * Custom properties are not indexed in KiiCloud storage.<br>
     * Following properties are readonly and ignored on creation/{@link update} of thing.<br>
     * '_thingID', '_created', '_accessToken' <br>
     * Following properties are readonly after creation and will be ignored on {@link update} of thing.<br>
     * '_vendorThingID', '_password'<br>
     * As Property prefixed with '_' is reserved by Kii Cloud,
     * properties other than ones described in the parameter secion
     * and '_layoutPosition' are ignored on creation/{@link update} of thing.<br>
     * Those ignored properties won't be removed from fields object passed as argument.
     * However it won't be reflected to fields object property of created/updated Thing.
     * @param {Object} fields of the thing to be registered.
     * @param {String} fields._vendorThingID thing identifier given by thing vendor.
     * @param {String} fields._password thing password given by thing vendor.
     * @param {String} [fields._thingType] thing type given by thing vendor.
     * @param {String} [fields._vendor] vendor identifier given by thing vendor.
     * @param {String} [fields._firmwareVersion] firmware version given by thing vendor.
     * @param {String} [fields._lot] lot identifier given by thing vendor.
     * @param {String} [fields._productName] product name given by thing vendor.
     * @param {String} [fields._stringField1] arbitrary string field.
     * @param {String} [fields._stringField2] arbitrary string field.
     * @param {String} [fields._stringField3] arbitrary string field.
     * @param {String} [fields._stringField4] arbitrary string field.
     * @param {String} [fields._stringField5] arbitrary string field.
     * @param {Number} [fields._numberField1] arbitrary number field.
     * @param {Number} [fields._numberField2] arbitrary number field.
     * @param {Number} [fields._numberField3] arbitrary number field.
     * @param {Number} [fields._numberField4] arbitrary number field.
     * @param {Number} [fields._numberField5] arbitrary number field.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * KiiThing.register(
     *     {
     *         _vendorThingID: "thing-XXXX-YYYY-ZZZZZ",
     *         _password: "thing-password",
     *         _thingType: "thermometer",
     *         yourCustomObj: // Arbitrary key can be used.
     *         { // Object, Array, Number, String can be used. Should be compatible with JSON.
     *             yourCustomKey1: "value",
     *             yourCustomKey2: 100
     *         }
     *     }
     * ).then(thing => {
     *     // Register Thing succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    static register(fields, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${app.getAppID()}/things`;
            const request = app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.ThingRegistrationAndAuthorizationRequest+json");
            request.isSendAccessToken(false);
            const response = yield request.send(JSON.stringify(fields));
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, undefined, null);
            }
            return new KiiThing(response.body, app);
        });
    }
    /**
     *  Perform a query to get the owned things.
     * <br><br>The query will be executed against the server, returning a result set.
     * @param KiiThingQuery thingQuery thingQuery.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(result). result is KiiThingQueryResult instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    static executeQuery(thingQuery, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!thingQuery) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("thingQuery is null", this);
            }
            const url = `/apps/${app.getAppID()}/things/query`;
            const request = app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.ThingQueryRequest+json");
            const response = yield request.send(JSON.stringify(thingQuery.dictValue()));
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, undefined, null);
            }
            const respJson = response.body;
            const things = [];
            for (const result of respJson.results) {
                things.push(new KiiThing(result, app));
            }
            const queryResult = new _thingQuery__WEBPACK_IMPORTED_MODULE_7__.KiiThingQueryResult(thingQuery, things, respJson.nextPaginationKey);
            return queryResult;
        });
    }
    /**
     * Retrieve the latest thing information from KiiCloud.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>To let users to own thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing is already registered.
     * thing.refresh().then(thing => {
     *     // Refresh succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const respJson = yield this.refreshRequest();
            this.renewThingFields(respJson);
            return this;
        });
    }
    refreshRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            let qualifiedID = "";
            if (this.thingID) {
                qualifiedID = this.thingID;
            }
            else {
                qualifiedID = `VENDOR_THING_ID:${this.vendorThingID}`;
            }
            const url = `/apps/${this.app.getAppID()}/things/${qualifiedID}`;
            const request = this.app.newRequest("GET", url);
            const response = yield request.send();
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, this, null);
            }
            return response.body;
        });
    }
    /**
     * Update registered thing information in Kii Cloud
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>To let users to own thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @see KiiThing.register
     * @example
     * ```
     * // assume thing is already registered.
     * thing.fields._stringField1 = "new string value";
     * thing.fields.customObject = {
     *     "customField1" : "abcd",
     *     "customField2" : 123
     * };
     * thing.update().then(thing => {
     *     // Update succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const respJson = yield this.refreshRequest();
            if (!this.fields) {
                this.fields = respJson;
            }
            else {
                Object.assign(respJson, this.fields);
                this.fields = respJson;
            }
            const url = `/apps/${this.app.getAppID()}/things/${this.thingID}`;
            const request = this.app.newRequest("PATCH", url);
            request.setContentType("application/vnd.kii.ThingUpdateRequest+json");
            const response = yield request.send(JSON.stringify(this.fields));
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, this, null);
            }
            return this;
        });
    }
    /**
     * Delete registered thing in Kii Cloud.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>To let users to own thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * It will delete bucket, topic which belongs to this thing,
     * entity belongs to the bucket/topic and all ownership information of thing.
     * This operation can not be reverted. Please carefully use this.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing is already registered.
     * thing.deleteThing().then(thing => {
     *     // Delete succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    deleteThing() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}/things/${this.thingID}`;
            const request = this.app.newRequest("DELETE", url);
            request.setContentType("application/vnd.kii.ThingUpdateRequest+json");
            const response = yield request.send();
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, this, null);
            }
            return this;
        });
    }
    /**
     * Check if user/ group is owner of the thing.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login before execute this API.
     * <br>To let users to own Thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {KiiUser or KiiGroup} owner whether the instance is owner of thing or not.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is the KiiThing instance which this method was called on.</li>
     *         <li>params[1] is a KiiUser/KiiGroup instance.</li>
     *         <li>params[2] is Boolean value, true is the user/group is owner of the thing, otherwise false.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing/user is already registered.
     * let user = KiiUser.userWithURI("kiicloud://users/xxxyyyy");
     * thing.isOwner(user).then(params => {
     *     let thing = params[0];
     *     let user = params[1];
     *     let isOwner = params[2];
     *     if (isOwner) {
     *         // user is owner of the thing.
     *     } else {
     *         // user is not owner of the thing.
     *     }
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    isOwner(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getOwnerURL(this.thingID, owner);
            const request = this.app.newRequest("HEAD", url);
            const response = yield request.send(JSON.stringify(this.fields));
            if (response.status === 404) {
                return [this, owner, false];
            }
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, this, null);
            }
            return [this, owner, true];
        });
    }
    /**
     * Register user/group as owner of this thing.
     * <br>Need user login before execute this API.
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {KiiUser or KiiGroup} owner to be registered as owner.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is the KiiThing instance which this method was called on.</li>
     *         <li>params[1] is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @deprecated Use {@link KiiThing.registerOwnerWithPassword} instead.
     * @example
     * ```
     * // assume thing/group is already registered.
     * let group = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * thing.registerOwner(group).then(params => {
     *     // Register owner succeeded.
     *     let thing = params[0];
     *     let group = params[1];
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    registerOwner(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getOwnerURL(this.thingID, owner);
            const request = this.app.newRequest("PUT", url);
            const response = yield request.send(JSON.stringify(this.fields));
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, this, null);
            }
            return [this, owner];
        });
    }
    /**
     * Register user/group as owner of this thing.
     * <br>Need user login before execute this API.
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {KiiUser or KiiGroup} owner to be registered as owner.
     * @param {String} [password] the thing password
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is the KiiThing instance which this method was called on.</li>
     *         <li>params[1] is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing/group is already registered.
     * let group = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * thing.registerOwnerWithPassword(group, "Thing password").then(params => {
     *     // Register owner succeeded.
     *     let thing = params[0];
     *     let group = params[1];
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    registerOwnerWithPassword(owner, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return KiiThing.registerOwnerWithIdentifierAndPassword(this.thingID, owner, password, this.app).then(() => {
                return [this, owner];
            });
        });
    }
    /**
     * Register user/group as owner of specified thing.
     * <br>Need user login before execute this API.
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {String} thingID The ID of thing
     * @param {KiiUser or KiiGroup} owner instance of KiiUser/KiiGroup to be registered as owner.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @deprecated Use {@link KiiThing.registerOwnerWithThingIDAndPassword} instead.
     * @example
     * ```
     * // assume thing/group is already registered.
     * let group = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * KiiThing.registerOwnerWithThingID("th.xxxx-yyyy-zzzz", group).then(params => {
     *     // Register owner succeeded.
     *     let group = params[0];
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    static registerOwnerWithThingID(thingID, owner, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            return KiiThing.registerOwnerWithIdentifier(thingID, owner, app);
        });
    }
    /**
     * Register user/group as owner of specified thing.
     * <br>Need user login before execute this API.
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {String} thingID The ID of thing
     * @param {KiiUser or KiiGroup} owner instance of KiiUser/KiiGroup to be registered as owner.
     * @param {String} [password] the thing password
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(owner).
     *       <ul>
     *         <li>owner is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing/group is already registered.
     * let group = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * KiiThing.registerOwnerWithThingIDAndPassword("th.xxxx-yyyy-zzzz", group, "Thing password").then(owner => {
     *     // Register owner succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    static registerOwnerWithThingIDAndPassword(thingID, owner, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            return KiiThing.registerOwnerWithIdentifierAndPassword(thingID, owner, password, app);
        });
    }
    /**
     * Register user/group as owner of specified thing.
     * <br>Need user login before execute this API.
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {String} vendorThingID The vendor thing ID of thing
     * @param {KiiUser or KiiGroup} owner instance of KiiUser/KiiGroup to be registered as owner.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @deprecated Use {@link KiiThing.registerOwnerWithVendorThingIDAndPassword} instead.
     * @example
     * ```
     * // assume thing/group is already registered.
     * let group = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * KiiThing.registerOwnerWithVendorThingID("xxxx-yyyy-zzzz", group).then(group => {
     *     // Register owner succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    static registerOwnerWithVendorThingID(vendorThingID, owner, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_6__.isNonEmptyString)(vendorThingID)) {
                return KiiThing.registerOwnerWithIdentifier(null, owner, app);
            }
            return KiiThing.registerOwnerWithIdentifier("VENDOR_THING_ID:" + vendorThingID, owner, app);
        });
    }
    /**
     * Register user/group as owner of specified thing.
     * <br>Need user login before execute this API.
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {String} vendorThingID The vendor thing ID of thing
     * @param {KiiUser or KiiGroup} owner instance of KiiUser/KiiGroup to be registered as owner.
     * @param {String} [password] the thing password
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(owner).
     *       <ul>
     *         <li>owner is a KiiUser/KiiGroup instance.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing/group is already registered.
     * let group = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * KiiThing.registerOwnerWithVendorThingIDAndPassword("xxxx-yyyy-zzzz", group, "Thing password").then(owner => {
     *     // Register owner succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    static registerOwnerWithVendorThingIDAndPassword(vendorThingID, owner, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_6__.isNonEmptyString)(vendorThingID)) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("identifier is null or empty", undefined);
            }
            return KiiThing.registerOwnerWithIdentifierAndPassword("VENDOR_THING_ID:" + vendorThingID, owner, password, app);
        });
    }
    static registerOwnerWithIdentifier(identifier, owner, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!identifier) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("identifier is null or empty", undefined);
            }
            if (!owner) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("owner is null", undefined);
            }
            const url = KiiThing.prototype.getOwnerURL(identifier, owner, app);
            const request = app.newRequest("PUT", url);
            const response = yield request.send();
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, undefined, null);
            }
            return owner;
        });
    }
    static registerOwnerWithIdentifierAndPassword(identifier, owner, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!identifier) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("identifier is null or empty", undefined);
            }
            if (!password) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("password is null or empty", undefined);
            }
            if (!owner) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("owner is null", undefined);
            }
            const url = `/apps/${app.getAppID()}/things/${identifier}/ownership`;
            const request = app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.ThingOwnershipRequest+json");
            const requestBody = { thingPassword: password };
            if (owner instanceof _user__WEBPACK_IMPORTED_MODULE_3__.KiiUser) {
                requestBody.userID = owner.getID();
            }
            else if (owner instanceof _group__WEBPACK_IMPORTED_MODULE_4__.KiiGroup) {
                requestBody.groupID = owner.getID();
            }
            const response = yield request.send(JSON.stringify(requestBody));
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, undefined, null);
            }
            return owner;
        });
    }
    getOwnerURL(identifier, owner, injectedApp = null) {
        let type = null;
        let oid = null;
        const app = injectedApp || this.app;
        if (owner instanceof _user__WEBPACK_IMPORTED_MODULE_3__.KiiUser) {
            oid = owner.getID();
            type = "user";
        }
        else if (owner instanceof _group__WEBPACK_IMPORTED_MODULE_4__.KiiGroup) {
            oid = owner.getID();
            type = "group";
        }
        else {
            throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("owner should be instance of user or group", this);
        }
        if (!oid) {
            throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("owner instance does not have id", this);
        }
        return `/apps/${app.getAppID()}/things/${identifier}/ownership/${type}:${oid}`;
    }
    /**
     * Remove ownership of thing from specified user/group.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {KiiUser or KiiGroup} owner to be unregistered.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is the KiiThing instance which this method was called on.</li>
     *         <li>params[1] is a KiiUser/KiiGroup instance which had ownership of the thing removed.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing/group is already registered.
     * let group = KiiGroup.groupWithURI("kiicloud://groups/xxxyyyy");
     * thing.unregisterOwner(group).then(params => {
     *     // Unregister owner succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    unregisterOwner(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getOwnerURL(this.thingID, owner);
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, this, null);
            }
            return [this, owner];
        });
    }
    /**
     * Disable the thing.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>To let users to own Thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * After succeeded, access token published for thing is disabled.
     * In a result, only the app administrator and owners of thing can access the thing.
     * Used when user lost the thing and avoid using by unknown users.
     * It doesn't throw error when the thing is already disabled.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing is already registered.
     * thing.disable().then(thing => {
     *     // Disable succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    disable() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.changeStatus(true);
        });
    }
    /**
     * Enable the thing.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>To let users to own Thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * After succeeded, If thing is registered with "persistentToken" option,
     * token should be recovered (Access token which is used before disabling can be available).
     * Otherwise, it does not recovered.
     * It doesn't throw error when the thing is already enabled.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing is already registered.
     * thing.enable().then(thing => {
     *     // Disable succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    enable() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.changeStatus(false);
        });
    }
    changeStatus(disable) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}/things/${this.thingID}/status`;
            const request = this.app.newRequest("PUT", url);
            request.setContentType("application/vnd.kii.ThingStatusUpdateRequest+json");
            const response = yield request.send(JSON.stringify({
                disabled: disable,
            }));
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, this, null);
            }
            this.disabled = disable;
            return this;
        });
    }
    /**
     *  Updates thing password. This method can be used only by app admin.
     * <br>
     * @param {String} newPassword new password
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume thing is already registered and you had an adminContext.
     * adminContext.thingWithID(thing.getThingID()).updatePassword("new password").then(thing => {
     *     // Update succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    updatePassword(newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.app.isAdmin()) {
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("updatePassword can be used only by app admin.", this);
            }
            if (!newPassword) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidArgumentException("newPassword is null or empty", this);
            }
            const requestBody = JSON.stringify({ newPassword: newPassword });
            let qualifiedID = "";
            if (this.thingID) {
                qualifiedID = this.thingID;
            }
            else {
                qualifiedID = `VENDOR_THING_ID:${this.vendorThingID}`;
            }
            const url = `/apps/${this.app.getAppID()}/things/${qualifiedID}/password`;
            const request = this.app.newRequest("PUT", url);
            request.setContentType("application/vnd.kii.ChangeThingPasswordRequest+json");
            const response = yield request.send(requestBody);
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, this, null);
            }
            return this;
        });
    }
    /**
     * Load thing with given vendor thing id.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>To let users to own Thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * @param {String} vendorThingID registered vendor thing id.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * KiiThing.loadWithVendorThingID("thing-xxxx-yyyy").then(thing => {
     *     // Load succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    static loadWithVendorThingID(vendorThingID, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const qualifiedID = `VENDOR_THING_ID:${vendorThingID}`;
            return KiiThing.load(qualifiedID, app);
        });
    }
    /**
     * Load thing with thing id given by Kii Cloud.
     * <br>This API is authorized by owner of thing.
     * <br>Need user login who owns this thing before execute this API.
     * <br>To let users to own Thing, please call {@link KiiThing.registerOwner}
     * <br>Note: if you obtain thing instance from {@link KiiAppAdminContext},
     * API is authorized by app admin.<br>
     *
     * thing id can be obtained by {@link getThingID}
     * @param {String} thingID registered thing id.
     * @param {KiiApplication} app KiiApplication instance. When omitted, {@link KiiApplication.globalApp} is used.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(thing). thing is a KiiThing instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * KiiThing.loadWithVendorThingID("thing-xxxx-yyyy").then(thing => {
     *     // Load succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    static loadWithThingID(thingID, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            return KiiThing.load(thingID, app);
        });
    }
    static load(qualifiedID, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${app.getAppID()}/things/${qualifiedID}`;
            const request = app.newRequest("GET", url);
            const response = yield request.send();
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, undefined, null);
            }
            const respJson = response.body;
            return new KiiThing(respJson, app);
        });
    }
    /**
     * Instantiate bucket belongs to this thing.
     * @param {String} bucketName name of the bucket.
     * @return {KiiBucket} bucket instance.
     */
    bucketWithName(bucketName) {
        return new _bucket__WEBPACK_IMPORTED_MODULE_10__.KiiBucket(bucketName, this, this.app);
    }
    /**
     *  Creates a reference to a encrypted bucket for this thing
     * <br><br>The bucket will be created/accessed within this thing's scope
     * @param {String} bucketName The name of the bucket the user should create/access
     * @returns {KiiEncryptedBucket} A working KiiEncryptedBucket object
     * @example
     * ```
     * let thing = . . .; // a KiiThing
     * let bucket = thing.encryptedBucketWithName("myBucket");
     * ```
     */
    encryptedBucketWithName(bucketName) {
        return new _bucket__WEBPACK_IMPORTED_MODULE_10__.KiiEncryptedBucket(bucketName, this, this.app);
    }
    /**
     * Instantiate topic belongs to this thing.
     * @param {String} topicName name of the topic. Must be a not empty string.
     * @return {KiiTopic} topic instance.
     */
    topicWithName(topicName) {
        if (typeof topicName !== "string" || topicName === "") {
            throw (0,_utilities__WEBPACK_IMPORTED_MODULE_6__.error)("topicName should not null or empty", this);
        }
        return new _topic__WEBPACK_IMPORTED_MODULE_9__.KiiTopic(this.getPath(), topicName, this.app);
    }
    /**
     * Gets a list of topics in this thing scope
     * @param {String} [paginationKey] You can specify the pagination key with the nextPaginationKey passed by callbacks.success. If empty string or no string object is provided, this API regards no paginationKey specified.
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
     *           <li>error.target is the KiiThing instance which this method was called on. </li>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```
     * let thing = . . .; // a KiiThing
     * thing.listTopics().then(params => {
     *     let topicList = params[0];
     *     let nextPaginationKey = params[1];
     *     // do something with the result
     *     for (let i = 0; i < topicList.length; i++) {
     *         let topic = topicList[i];
     *     }
     *     if (nextPaginationKey != null) {
     *         thing.listTopics(null, nextPaginationKey)
     *         .then(params => {...})
     *         .catch(error => {...});
     *     }
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    listTopics(paginationKey = "") {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `/apps/${this.app.getAppID()}/things/${this.getThingID()}/topics`;
            if (paginationKey && paginationKey.length > 0) {
                url = url + `?paginationKey=${encodeURIComponent(paginationKey)}`;
            }
            const request = this.app.newRequest("GET", url);
            const response = yield request.send();
            if (!(0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_2__.parseErrorResponse)(request, response, this, null);
            }
            const nextPaginationKey = response.body["paginationKey"];
            const topics = response.body["topics"];
            const items = topics.map((topic) => this.topicWithName(topic["topicID"]));
            return [items, nextPaginationKey || null];
        });
    }
    /**
     * Instantiate push subscription for this thing.
     * @return {KiiPushSubscription} push subscription object.
     */
    pushSubscription() {
        return new _push__WEBPACK_IMPORTED_MODULE_8__.KiiPushSubscription(this, this.app);
    }
    /** @hidden */
    getHttpURI() {
        return `${_kii__WEBPACK_IMPORTED_MODULE_0__.Kii.getBaseURL()}/apps/${this.app.getAppID()}/things/${this.getThingID()}`;
    }
    /**
     * @hidden used from appAdminContext
     */
    static thingWithID(thingID, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        if (!thingID) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidArgumentException("thingID should not null or empty", undefined);
        }
        const thing = new KiiThing(null, app);
        thing.setThingID(thingID);
        return thing;
    }
    /** @hidden */
    getSubscriberPath() {
        return `things/${this.getThingID()}`;
    }
}


/***/ }),

/***/ "./src/thingContext.ts":
/*!*****************************!*\
  !*** ./src/thingContext.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiThingContext": () => (/* binding */ KiiThingContext)
/* harmony export */ });
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/* harmony import */ var _kii__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./kii */ "./src/kii.ts");
/* harmony import */ var _bucket__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bucket */ "./src/bucket.ts");
/* harmony import */ var _group__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./group */ "./src/group.ts");
/* harmony import */ var _push__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./push */ "./src/push.ts");
/* harmony import */ var _thing__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./thing */ "./src/thing.ts");
/* harmony import */ var _topic__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./topic */ "./src/topic.ts");
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./user */ "./src/user.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};








class KiiThingContext {
    /** @hidden */
    constructor(spec, app) {
        this.app = app;
        this.thingId = spec.thingId; // id of thing
        if (spec.vendorThingID) {
            this.vendorThingID = spec.vendorThingID; // vendor thing id of thing
        }
    }
    /**
     * Creates a reference to a bucket in App scope operated by thing.
     * @param String bucketName The name of the bucket the app should create/access
     * @returns {KiiBucket} A working KiiBucket object
     * @example
     * ```
     * Kii.authenticateAsThing("vendorThingID", "password").then(thingAuthContext => {
     *     let bucket = thingAuthContext.bucketWithName("myAppBucket");
     * }).catch(error => {
     *     // auth failed.
     * });
     * ```
     */
    bucketWithName(bucketName) {
        return new _bucket__WEBPACK_IMPORTED_MODULE_2__.KiiBucket(bucketName, null, this.app);
    }
    /**
     * Creates a reference to a encrypted bucket in App scope operated by thing.
     * <br><br>The bucket will be created/accessed within this app's scope
     * @param String bucketName The name of the bucket the app should create/access
     * @returns {KiiBucket} A working KiiBucket object
     * @example
     * ```
     * Kii.authenticateAsThing("vendorThingID", "password").then(thingAuthContext => {
     *     let bucket = thingAuthContext.encryptedBucketWithName("myAppBucket");
     * }).catch(error => {
     *     // auth failed.
     * });
     * ```
     */
    encryptedBucketWithName(bucketName) {
        return new _bucket__WEBPACK_IMPORTED_MODULE_2__.KiiEncryptedBucket(bucketName, null, this.app);
    }
    /**
     * Creates a reference to an object operated by thing using object`s URI.
     * @param String object URI.
     * @returns {KiiObject} A working KiiObject instance
     * @throws {InvalidURIException} If the URI is null, empty or does not have correct format.
     */
    objectWithURI(objectURI) {
        return this._objectWithURI(objectURI);
    }
    /**
     * Creates a reference to a topic in App scope operated by thing.
     * <br><br>The Topic will be created/accessed within this app's scope
     * @param {String} topicName name of the topic. Must be a not empty string.
     * @return {KiiTopic} topic instance.
     */
    topicWithName(topicName) {
        if (typeof topicName !== "string" || topicName === "") {
            throw new _exception__WEBPACK_IMPORTED_MODULE_0__.InvalidArgumentException("topicName should not null or empty", this);
        }
        return new _topic__WEBPACK_IMPORTED_MODULE_6__.KiiTopic("", topicName, this.app);
    }
    /**
     * Gets a list of topics in app scope
     * @param {String} paginationKey You can specify the pagination key with the nextPaginationKey passed by callbacks.success. If empty string or no string object is provided, this API regards no paginationKey specified.
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
     *           <li>error.target is a KiiAppAdminContext instance which this method was called on.</li>
     *           <li>error.message</li>
     *         </ul>
     *       </li>
     *     </ul>
     * @example
     * ```
     * // Assume you already have thingAuthContext instance.
     * thingAuthContext.listTopics().then(params => {
     *     let topicList = params[0];
     *     let nextPaginationKey = params[1];
     *     // do something with the result
     *     for (let i = 0; i < topicList.length; i++) {
     *         let topic = topicList[i];
     *     }
     *     if (nextPaginationKey != null) {
     *         thingAuthContext.listTopics(null, nextPaginationKey)
     *         .then(params => {...})
     *         .catch(error => {...});
     *     }
     * }).catch(error => {
     *     // do something with the error response
     * });
     * ```
     */
    listTopics(paginationKey) {
        return __awaiter(this, arguments, void 0, function* () {
            // NOTE: the 1rd arg might be a callback, and it might be null (= unused)
            if (!paginationKey &&
                arguments.length === 2 &&
                typeof arguments[1] === "string") {
                paginationKey = arguments[1];
            }
            return _kii__WEBPACK_IMPORTED_MODULE_1__.Kii.listTopics(paginationKey, this.app);
        });
    }
    /**
     * Gets authenticated KiiThing instance.
     * <br>Returned thing instance only have thingID, vendorThingID and accessToken.
     * (vendorThingID is not included when you used
     * {@link Kii.authenticateAsThing} to obtain KiiThingContext.)
     * <br>Please execute {@link KiiThing.refresh} to obtain other properties.
     * @return {KiiThing} return authenticated KiiThing instance.
     */
    getAuthenticatedThing() {
        const thingContext = _thing__WEBPACK_IMPORTED_MODULE_5__.KiiThing.thingWithID(this.thingId, this.app);
        if (this.vendorThingID) {
            thingContext.setVendorThingID(this.vendorThingID);
        }
        thingContext.setAccessToken(this.app.getAccessToken());
        return thingContext;
    }
    /**
     * Instantiate push installation for this thing.
     * @return {KiiPushInstallation} push installation object.
     */
    pushInstallation() {
        return new _push__WEBPACK_IMPORTED_MODULE_4__.KiiPushInstallation(null, this.app);
    }
    /** @hidden */
    _getToken() {
        return this.app.getAccessToken();
    }
    // Workaround of CMO-4855
    // TODO: extract common logic of KiiObject
    _objectWithURI(objectUri) {
        if (!objectUri) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_0__.InvalidURIException(undefined, this);
        }
        const valid = objectUri.indexOf("kiicloud://") === 0;
        const newURI = objectUri.substr("kiicloud://".length);
        const components = newURI.split("/");
        const compLength = components.length;
        if (compLength < 4 || !valid) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_0__.InvalidURIException(undefined, this);
        }
        const bucketIndex = compLength === 4 ? 1 : 3;
        const bucketName = components[bucketIndex];
        let subject = null;
        if (components[0] === "groups" && compLength === 6) {
            subject = _group__WEBPACK_IMPORTED_MODULE_3__.KiiGroup.groupWithID(components[1], this.app);
        }
        else if (components[0] === "users" && compLength === 6) {
            subject = _user__WEBPACK_IMPORTED_MODULE_7__.KiiUser.userWithID(components[1], this.app);
        }
        else if (components[0] === "things" && compLength === 6) {
            subject = _thing__WEBPACK_IMPORTED_MODULE_5__.KiiThing.thingWithID(components[1], this.app);
        }
        else if (compLength !== 4) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_0__.InvalidURIException(undefined, this);
        }
        const bucket = new _bucket__WEBPACK_IMPORTED_MODULE_2__.KiiBucket(bucketName, subject, this.app);
        const obj = bucket.createObject();
        obj.setUUID(components[compLength - 1]);
        return obj;
    }
}


/***/ }),

/***/ "./src/thingQuery.ts":
/*!***************************!*\
  !*** ./src/thingQuery.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiThingQuery": () => (/* binding */ KiiThingQuery),
/* harmony export */   "KiiThingQueryResult": () => (/* binding */ KiiThingQueryResult)
/* harmony export */ });
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./src/app.ts");
/* harmony import */ var _thing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./thing */ "./src/thing.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utilities */ "./src/utilities.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class KiiThingQuery {
    /** @hidden */
    constructor(owner, groups = null) {
        this.owner = null;
        this.groups = null;
        this.limit = 0;
        this.thingType = undefined;
        this.paginationKey = "";
        if (!owner && (!groups || groups.length == 0)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidArgumentException("Both the owner and groups parameter are optional, but at least one of them must be supplied.", undefined);
        }
        this.owner = owner;
        this.groups = groups;
        this.limit = 0;
    }
    /**
     * Construct KiiThingQuery.<br>
     * Both an owner and groups parameters are optional,
     * but at least one of them must be supplied.
     * @param {KiiUser} [owner] of the thing. The user must be same as
     * Login user or causes unauthorized error.
     * @param {KiiGroup[]} [groups] owns the thing. Login user must belongs
     * to all groups or causes unauthorized error.
     * @throws {InvalidArgumentException}
     * neither an owner nor groups parameters are supplied.
     */
    static thingQuery(owner, groups = null) {
        return new KiiThingQuery(owner, groups);
    }
    /**
     * Set the limit of the given query
     * @param limit The maximum number of items obtained in one request.<br>
     * If specified limit is <= 0, 0 will be applied.
     * This limit behaves in a best effort way. Actual number of returned result
     * can be smaller than the requested number.<br>
     * If the specified limit is greater than the limit of the server or limit is
     * set to 0, limit defined in server will be applied.
     */
    setLimit(limit) {
        if (limit > 0) {
            this.limit = limit;
        }
        else {
            this.limit = 0;
        }
    }
    /**
     * Get the limit of the current query
     * @returns {Number}
     */
    getLimit() {
        return this.limit;
    }
    /**
     * Set the thing type to filter the results.
     * @param thingType Thing type
     */
    setThingType(thingType) {
        this.thingType = thingType;
    }
    /**
     * Get the thing type
     * @returns {String}
     */
    getThingType() {
        return this.thingType;
    }
    /**
     * Set the pagination key.
     * @param paginationKey Pagination key
     */
    setPaginationKey(paginationKey) {
        this.paginationKey = paginationKey;
    }
    /**
     * Get the pagination key.
     * @returns {String}
     */
    getPaginationKey() {
        return this.paginationKey;
    }
    /** @hidden */
    clone() {
        const clone = new KiiThingQuery(KiiThingQuery.clone(this.owner), KiiThingQuery.clone(this.groups));
        clone.limit = this.limit;
        clone.thingType = this.thingType;
        clone.paginationKey = this.paginationKey;
        return clone;
    }
    /** @hidden */
    static clone(obj) {
        if (!obj || typeof obj !== "object" || obj instanceof _app__WEBPACK_IMPORTED_MODULE_0__.KiiApplication) {
            return obj;
        }
        const newInstance = new obj.constructor();
        for (const key in obj) {
            newInstance[key] = this.clone(obj[key]);
        }
        return newInstance;
    }
    /** @hidden */
    dictValue() {
        const query = {};
        if (this.limit && this.limit > 0) {
            query.bestEffortLimit = this.limit;
        }
        if (this.paginationKey) {
            query.paginationKey = this.paginationKey;
        }
        const ownerClauses = [];
        if (this.owner) {
            const userOwnerClause = {
                type: "contains",
                field: "userOwners",
                value: this.owner.getID(),
            };
            ownerClauses.push(userOwnerClause);
        }
        if (this.groups && this.groups.length > 0) {
            for (const groupOwner of this.groups) {
                const groupOwnerClause = {
                    type: "contains",
                    field: "groupOwners",
                    value: groupOwner.getID(),
                };
                ownerClauses.push(groupOwnerClause);
            }
        }
        let ownerClause;
        if (ownerClauses.length == 0) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidArgumentException("Query clause must include the 'contains' clause.", this);
        }
        else if (ownerClauses.length == 1) {
            ownerClause = ownerClauses[0];
        }
        else {
            ownerClause = {
                type: "or",
                clauses: ownerClauses,
            };
        }
        let thingQuery;
        if (this.thingType !== null && this.thingType !== undefined) {
            thingQuery = {
                clause: {
                    type: "and",
                    clauses: [
                        {
                            type: "eq",
                            field: "_thingType",
                            value: this.thingType,
                        },
                        ownerClause,
                    ],
                },
            };
        }
        else {
            thingQuery = { clause: ownerClause };
        }
        query.thingQuery = thingQuery;
        return query;
    }
}
/**
 * @class Represents a KiiThingQueryResult object
 */
class KiiThingQueryResult {
    /** @hidden */
    constructor(query, results, paginationKey) {
        this.query = query;
        this.results = results;
        this.paginationKey = paginationKey;
    }
    /**
     * Get the list of KiiThing that matches the query
     * @returns {Array} An array of KiiThing objects
     */
    getResult() {
        return this.results;
    }
    /**
     * When there are many result of query or data in result is large, Query result would be divided into several pages.
     * @returns {Boolean} true if there are pending result of the Query to be retrieved.
     */
    hasNext() {
        return !!this.paginationKey;
    }
    /**
     * Get the KiiThingQuery to get next page of the result.
     * @returns {KiiThingQuery} KiiThingQuery to get next page of the query. null when this result is the last part of the query.
     */
    getNextKiiThingQuery() {
        if (!this.hasNext()) {
            return null;
        }
        const nextQuery = this.query.clone();
        nextQuery.setPaginationKey(this.paginationKey);
        return nextQuery;
    }
    /**
     * Fetch the query result of next page.
     * <br><br>The query will be executed against the server, returning a result set.
     * When the state that #hasNext() is false,
     * method execution is failed and Promise returned by the method is rejected
     * and failure callback is called if the callback is given.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(result). result is KiiThingQueryResult instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiThing instance.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     */
    getNextResult() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasNext()) {
                const message = "No more pages to fetch";
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_3__.error)(message, this);
            }
            const nextQuery = this.getNextKiiThingQuery();
            if (!nextQuery) {
                const message = "No more pages to fetch";
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_3__.error)(message, this);
            }
            return _thing__WEBPACK_IMPORTED_MODULE_1__.KiiThing.executeQuery(nextQuery);
        });
    }
}


/***/ }),

/***/ "./src/topic.ts":
/*!**********************!*\
  !*** ./src/topic.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiTopic": () => (/* binding */ KiiTopic),
/* harmony export */   "KiiPushMessageBuilder": () => (/* binding */ KiiPushMessageBuilder)
/* harmony export */ });
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/* harmony import */ var _acl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./acl */ "./src/acl.ts");
/* harmony import */ var _httpResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./httpResponse */ "./src/httpResponse.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



/**
 * Represents a Topic object.
 */
class KiiTopic {
    /** @hidden */
    constructor(parentUri, topicName, app) {
        this.parentUri = parentUri;
        this.topicName = topicName;
        this.app = app;
    }
    /**
     * get name of this topic
     * @return {String} name of this topic.
     */
    getName() {
        return this.topicName;
    }
    /**
     * @hidden for acl
     */
    getPath() {
        return `${this.parentUri}/topics/${this.topicName}`;
    }
    /**
     * Checks whether the topic already exists or not.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(existed). true if the topic exists.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiTopic instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume topic is already instantiated.
     * topic.exists().then(existed => {
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    exists() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.parentUri}/topics/${this.topicName}`;
            const request = this.app.newRequest("HEAD", url);
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_2__.isSuccess)(response.status)) {
                return true;
            }
            else if (response.status == 404) {
                return false;
            }
            else {
                const e = (0,_exception__WEBPACK_IMPORTED_MODULE_0__.parseErrorResponse)(request, response, this, null);
                e.message = `check topic failed. statusCode: ${response.status}`;
                throw e;
            }
        });
    }
    /**
     * Save this topic on Kii Cloud.
     * Note that only app admin can save application scope topic.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theSavedTopic). theSavedTopic is a KiiTopic instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiTopic instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume topic is already instantiated.
     * topic.save().then(topic => {
     *   // Save topic succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.parentUri}/topics/${this.topicName}`;
            const request = this.app.newRequest("PUT", url);
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_2__.isSuccess)(response.status)) {
                return this;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_0__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    /**
     * sendMessage
     * @param message message to be sent.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(params). params is an Array instance.
     *       <ul>
     *         <li>params[0] is the KiiTopic instance which this method was called on.</li>
     *         <li>params[1] is the message object to send.</li>
     *       </ul>
     *     </li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiTopic instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume topic is already instantiated.
     * let contents = {
     *     message : "hello push!"
     * };
     * let message = new KiiPushMessageBuilder(contents).build();
     * topic.sendMessage(message).then(params => {
     *     // Send message succeeded.
     * }).catch(error => {
     *     // Handle error.
     * });
     * ```
     */
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.parentUri}/topics/${this.topicName}/push/messages`;
            const request = this.app.newRequest("POST", url);
            request.setContentType("application/vnd.kii.SendPushMessageRequest+json");
            const response = yield request.send(JSON.stringify(message));
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_2__.isSuccess)(response.status)) {
                return [this, message];
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_0__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    /**
     * Delete the topic.
     * @return {Promise} return promise object.
     *   <ul>
     *     <li>fulfill callback function: function(theDeletedTopic). theDeletedTopic is a KiiTopic instance.</li>
     *     <li>reject callback function: function(error). error is an Error instance.
     *       <ul>
     *         <li>error.target is the KiiTopic instance which this method was called on.</li>
     *         <li>error.message</li>
     *       </ul>
     *     </li>
     *   </ul>
     * @example
     * ```
     * // assume topic is already instantiated.
     * topic.deleteTopic().then(topic => {
     *   // Delete topic succeeded.
     * }).catch(error => {
     *   // Handle error.
     * });
     * ```
     */
    deleteTopic() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${this.app.getAppID()}${this.parentUri}/topics/${this.topicName}`;
            const request = this.app.newRequest("DELETE", url);
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_2__.isSuccess)(response.status)) {
                return this;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_0__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    /**
     * Get ACL object of this topic.
     * Access to topic can be configured by adding/removing KiiACLEntry
     * to/from obtained acl object.
     * @return {KiiACL} acl object of this topic.
     */
    acl() {
        return _acl__WEBPACK_IMPORTED_MODULE_1__.KiiACL.aclWithParent(this, this.app);
    }
}
/**
 * Builder of push message
 */
class KiiPushMessageBuilder {
    /**
     * instantiate builder with push message data.
     * By default all push channels (gcm, apns, jpush, mqtt) is enabled.
     * All other properties configured by method of this class won't be set and default
     * value would be applied.
     * Details of properties of message and its default value, please refer to
     * http://documentation.kii.com/rest/#notification_management-leverage__push_to_users__notification-group_scope-send_messages-send_a_push_message_to_the_current_topic
     * @param data sent to all push channels (gcm, apns, jpush, mqtt).
     */
    constructor(data) {
        this.gcm = {
            enabled: true,
        };
        this.apns = {
            enabled: true,
        };
        this.jpush = {
            enabled: true,
        };
        this.mqtt = {
            enabled: true,
        };
        this.sendToDevelopment = false;
        this.sendToProduction = false;
        this.data = data;
    }
    /**
     * build push message.
     * @return {Object} push message object. Can be used in {@link KiiTopic.sendMessage}
     */
    build() {
        const ret = {
            data: this.data,
            gcm: this.gcm,
            apns: this.apns,
            jpush: this.jpush,
            mqtt: this.mqtt,
        };
        if (this.sendToDevelopment) {
            ret.sendToDevelopment = this.sendToDevelopment;
        }
        if (this.sendToProduction) {
            ret.sendToProduction = this.sendToProduction;
        }
        return ret;
    }
    /**
     * Indicate whether send this message to development environment.
     * If this method is not called, true will be applied as default.
     * @param {boolean} flag indicate whether send this message to development env.
     * @return builder instance.
     */
    setSendToDevelopment(flag) {
        this.sendToDevelopment = flag;
        return this;
    }
    /**
     * Indicate whether send this message to production environment.
     * If this method is not called, true will be applied as default.
     * @param {boolean} flag indicate whether send this message to production env.
     * @return {Object} builder instance.
     */
    setSendToProduction(flag) {
        this.sendToProduction = flag;
        return this;
    }
    /**
     * Enable/ Disable message distribution via GCM.
     * If this method is not called, true will be applied as default.
     * @param {boolean} enable flag indicate whether distribute this message to GCM subscribers.
     * @return {Object} builder instance.
     */
    enableGcm(enable) {
        this.gcm.enabled = enable;
        return this;
    }
    /**
     * Enable/ Disable message distribution via APNS.
     * If this method is not called, true will be applied as default.
     * @param {boolean} enable flag indicate whether distribute this message to APNS subscribers.
     * @return {Object} builder instance.
     */
    enableApns(enable) {
        this.apns.enabled = enable;
        return this;
    }
    /**
     * Enable/ Disable message distribution via JPush.
     * If this method is not called, true will be applied as default.
     * @param {boolean} enable flag indicate whether distribute this message to JPush subscribers.
     * @return {Object} builder instance.
     */
    enableJpush(enable) {
        this.jpush.enabled = enable;
        return this;
    }
    /**
     * Enable/ Disable message distribution via MQTT.
     * If this method is not called, true will be applied as default.
     * @param {boolean} enable flag indicate whether distribute this message to MQTT subscribers.
     * @return {Object} builder instance.
     */
    enableMqtt(enable) {
        this.mqtt.enabled = enable;
        return this;
    }
    /**
     * Set specific data for GCM subscribers.
     * If this method is not called, no specific data is not applied
     * and data passed to the constructor would be sent to subscribers.
     * @param {Object} data specific data applied to only GCM subscribers.
     * Contents should be JSON Object with only one-level of nesting,
     * and only strings in values
     * @return {Object} builder instance.
     */
    gcmData(data) {
        this.gcm.data = data;
        return this;
    }
    /**
     * Set collapse_key for GCM subscribers.
     * If this method is not called, no collapse_key is applied.
     * For details please refer to GCM document of collapse_key.
     * @param {String} collapseKey
     * @return {Object} builder instance.
     */
    gcmCollapseKey(collapseKey) {
        this.gcm.collapseKey = collapseKey;
        return this;
    }
    /**
     * Set delay_while_idle for GCM subscribers.
     * If this method is not called, no delay_while_idle is applied.
     * For details please refer to GCM document of delay_while_idle.
     * @param {boolean} delayWhileIdle
     * @return {Object} builder instance.
     */
    gcmDelayWhileIdle(delayWhileIdle) {
        this.gcm.delayWhileIdle = delayWhileIdle;
        return this;
    }
    /**
     * Set time_to_live for GCM subscribers.
     * If this method is not called, no time_to_live is applied.
     * For details please refer to GCM document of time_to_live.
     * @param {Number} timeToLive
     * @return {Object} builder instance.
     */
    gcmTimeToLive(timeToLive) {
        this.gcm.timeToLive = timeToLive;
        return this;
    }
    /**
     * Set restricted_package_name for GCM subscribers.
     * If this method is not called, no restricted_package_name is applied.
     * For details please refer to GCM document of restricted_package_name.
     * @param {String} restrictedPackageName.
     * @return {Object} builder instance.
     */
    gcmRestrictedPackageName(restrictedPackageName) {
        this.gcm.restrictedPackageName = restrictedPackageName;
        return this;
    }
    /**
     * Set specific data for APNS subscribers.
     * If this method is not called, no specific data is not applied
     * and data passed to the constructor would be sent to subscribers.
     * @param {Object} data specific data applied to only APNS subscribers.
     * Contents should be JSON Object with only one-level of nesting,
     * and only strings, integers, booleans or doubles in the values.
     * @return {Object} builder instance.
     */
    apnsData(data) {
        this.apns.data = data;
        return this;
    }
    /**
     * Set alert for APNS subscribers.
     * If this method is not called, no alert is applied.
     * For details please refer to APNS document of alert.
     * @param {Object} alert alert object
     * @return {Object} builder instance.
     */
    apnsAlert(alert) {
        this.apns.alert = alert;
        return this;
    }
    /**
     * Set sound for APNS subscribers.
     * If this method is not called, no sound is applied.
     * For details please refer to APNS document of sound.
     * @param {String} sound
     * @return {Object} builder instance.
     */
    apnsSound(sound) {
        this.apns.sound = sound;
        return this;
    }
    /**
     * Set badge for APNS subscribers.
     * If this method is not called, no badge is applied.
     * For details please refer to APNS document of badge.
     * @param {Number} badge
     * @return {Object} builder instance.
     */
    apnsBadge(badge) {
        this.apns.badge = badge;
        return this;
    }
    /**
     * Set content-available for APNS subscribers.
     * If this method is not called, no content-available is applied.
     * @param {Number} contentAvailable If eqaul or less than 0
     * or this method is not invoked,
     * content-available payload is not delivered.
     * Otherwise, content-available=1 payload is delivered.
     * @return {Object} builder instance.
     */
    apnsContentAvailable(contentAvailable) {
        if (contentAvailable > 0) {
            this.apns.contentAvailable = true;
        }
        else {
            delete this.apns.contentAvailable;
        }
        return this;
    }
    /**
     * Set category for APNS subscribers.
     * If this method is not called, no category is applied.
     * For details please refer to APNS document of category.
     * @param {String} category
     * @return {Object} builder instance.
     */
    apnsCategory(category) {
        this.apns.category = category;
        return this;
    }
    /**
     * Set mutable-content for APNS subscribers.
     * If this method is not called, no mutable-content is applied.
     * @param {Number} mutableContent If equal or less than 0
     * or this method is not invoked,
     * mutable-content payload is not delivered.
     * Otherwise, mutable-content=1 payload is delivered.
     * @return {Object} builder instance.
     */
    apnsMutableContent(mutableContent) {
        if (mutableContent > 0) {
            this.apns.mutableContent = true;
        }
        else {
            delete this.apns.mutableContent;
        }
        return this;
    }
    /**
     * Set specific data for JPush subscribers.
     * If this method is not called, no specific data is not applied
     * and data passed to the constructor would be sent to subscribers.
     * @param {Object} data specific data applied to only JPush subscribers.
     * Contents should be JSON Object with only one-level of nesting,
     * and only strings, integers, booleans or doubles in the values.
     * @return {Object} builder instance.
     */
    jpushData(data) {
        this.jpush.data = data;
        return this;
    }
    /**
     * Set specific data for MQTT subscribers.
     * If this method is not called, no specific data is not applied
     * and data passed to the constructor would be sent to subscribers.
     * @param {Object} data specific data applied to only MQTT subscribers.
     * Contents should be JSON Object with only one-level of nesting,
     * and only strings in the values.
     * @return {Object} builder instance.
     */
    mqttData(data) {
        this.mqtt.data = data;
        return this;
    }
}


/***/ }),

/***/ "./src/uri.ts":
/*!********************!*\
  !*** ./src/uri.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiUri": () => (/* binding */ KiiUri)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/index.ts");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app */ "./src/app.ts");
/* harmony import */ var _group__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./group */ "./src/group.ts");
/* harmony import */ var _thing__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./thing */ "./src/thing.ts");




class KiiUri {
    constructor(segments, app) {
        this.segments = segments;
        this.app = app;
    }
    isUser() {
        return this.segments.length == 1 && this.segments[0].type == "users";
    }
    isObject() {
        return this.segments[this.segments.length - 1].type == "objects";
    }
    toEntity() {
        let parent = null;
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            if (segment.type == "users") {
                if (parent != null) {
                    throw new Error("Invalid uri");
                }
                parent = ___WEBPACK_IMPORTED_MODULE_0__.KiiUser.userWithID(segment.value, this.app);
            }
            else if (segment.type == "groups") {
                if (parent != null) {
                    throw new Error("Invalid uri");
                }
                parent = _group__WEBPACK_IMPORTED_MODULE_2__.KiiGroup.groupWithID(segment.value, this.app);
            }
            else if (segment.type == "buckets") {
                if (parent instanceof ___WEBPACK_IMPORTED_MODULE_0__.KiiBucket || parent instanceof ___WEBPACK_IMPORTED_MODULE_0__.KiiObject) {
                    throw new Error("Invalid owner");
                }
                const owner = parent;
                // TODO encrypted bucket
                const bucket = new ___WEBPACK_IMPORTED_MODULE_0__.KiiBucket(segment.value, owner, this.app);
                parent = bucket;
            }
            else if (segment.type == "objects") {
                if (!(parent instanceof ___WEBPACK_IMPORTED_MODULE_0__.KiiBucket)) {
                    throw new Error("parent is not bucket");
                }
                const object = parent.createObjectWithID(segment.value);
                parent = object;
            }
            else if (segment.type == "things") {
                const thing = _thing__WEBPACK_IMPORTED_MODULE_3__.KiiThing.thingWithID(segment.value);
                parent = thing;
            }
            else {
                throw new Error(`unsupported entity type: ${segment.type}`);
            }
        }
        // leaf object is set as parent
        if (parent == null) {
            throw new Error("empty uri");
        }
        return parent;
    }
    toMoveBodyParam() {
        if (!this.isObject()) {
            throw new Error("uri is not object.");
        }
        const bucketSegment = this.segments.find((s) => s.type == "buckets");
        if (bucketSegment === undefined) {
            throw new Error("bucket not found in uri.");
        }
        const bucketName = bucketSegment.value;
        const objectSegment = this.segments.find((s) => s.type == "objects");
        if (objectSegment === undefined) {
            throw new Error("bucket not found in uri.");
        }
        const objectId = objectSegment.value;
        const targetData = this.toTargetData(this.segments[0]);
        if (bucketName.indexOf("CRYPTO:") == 0) {
            // this bucket is encrypted
            return {
                targetObjectScope: targetData,
                targetBucketType: "crypto",
                targetBucketID: bucketName.replace("CRYPTO:", ""),
                targetObjectID: objectId,
            };
        }
        return {
            targetObjectScope: targetData,
            targetBucketID: bucketName,
            targetObjectID: objectId,
        };
    }
    toTargetData(segment) {
        if (segment.type == "users") {
            return {
                appID: this.app.getAppID(),
                userID: segment.value,
                type: "APP_AND_USER",
            };
        }
        else if (segment.type == "groups") {
            return {
                appID: this.app.getAppID(),
                groupID: segment.value,
                type: "APP_AND_GROUP",
            };
        }
        else if (segment.type == "things") {
            throw new Error("unsupported move target.");
        }
        else {
            return {
                appID: this.app.getAppID(),
                type: "APP",
            };
        }
    }
    static parse(s, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        if (s.indexOf("kiicloud://") != 0) {
            throw new Error("scheme is not kiicloud");
        }
        const path = s.substr("kiicloud://".length);
        const pathSegments = path.split("/");
        // avoid index out of exception
        if (pathSegments.length % 2 == 1) {
            pathSegments.push("");
        }
        let segments = [];
        for (let i = 0; i < pathSegments.length; i += 2) {
            const type = pathSegments[i];
            const value = pathSegments[i + 1];
            const segment = {
                type,
                value,
            };
            segments.push(segment);
        }
        return new KiiUri(segments, app);
    }
}


/***/ }),

/***/ "./src/user.ts":
/*!*********************!*\
  !*** ./src/user.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiUser": () => (/* binding */ KiiUser)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/index.ts");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app */ "./src/app.ts");
/* harmony import */ var _bucket__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bucket */ "./src/bucket.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/* harmony import */ var _group__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./group */ "./src/group.ts");
/* harmony import */ var _httpResponse__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./httpResponse */ "./src/httpResponse.ts");
/* harmony import */ var _kii__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./kii */ "./src/kii.ts");
/* harmony import */ var _push__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./push */ "./src/push.ts");
/* harmony import */ var _topic__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./topic */ "./src/topic.ts");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utilities */ "./src/utilities.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};











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
        const trimmedUsername = (0,_utilities__WEBPACK_IMPORTED_MODULE_9__.trim)(username);
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateUsername)(trimmedUsername)) {
            this.username = trimmedUsername;
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidUsernameException(undefined, this);
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
        if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateDisplayName)(value)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidDisplayNameException(undefined, this);
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
        if (!this.country || !(0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateCountryCode)(this.country)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidCountryException(undefined, undefined);
        }
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
        if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_9__.isNonEmptyString)(key) || key.substr(0, 1) == "_") {
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
    static getCurrentUser(app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static userWithUsername(username, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static userWithPhoneNumber(phoneNumber, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static userWithPhoneNumberAndUsername(phoneNumber, username, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static userWithEmailAddress(emailAddress, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static userWithEmailAddressAndUsername(emailAddress, username, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static userWithEmailAddressAndPhoneNumber(emailAddress, phoneNumber, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static userWithCredentials(emailAddress, phoneNumber, username, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static userWithID(userID, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static userWithURI(uri, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        const user = new KiiUser(app);
        const uuid = KiiUser.validateURI(uri);
        if (uuid) {
            user.setId(uuid);
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidURIException(undefined, undefined);
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
        return new ___WEBPACK_IMPORTED_MODULE_0__.KiiBucket(bucketName, this, this.app);
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
        return new _bucket__WEBPACK_IMPORTED_MODULE_2__.KiiEncryptedBucket(bucketName, this, this.app);
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
    static authenticate(userIdentifier, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validatePassword)(password)) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidPasswordException("Invalid Password pattern set", undefined);
            }
            if (!isValidUserIdentifier(userIdentifier)) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidUserIdentifierException("Invalid User Identifier set", undefined);
            }
            const result = yield authenticate(userIdentifier, password, app);
            const user = new KiiUser(app);
            user.setId(result.userId);
            user.accessToken = result.accessToken;
            app.setCurrentUser(user, result.accessToken);
            if (result.expiresAt) {
                const now = new Date();
                const currentTime = now.getTime();
                const expiresAt = (0,_utilities__WEBPACK_IMPORTED_MODULE_9__.safeCalculateExpiresAtAsDate)(result.expiresAt, currentTime);
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
    static authenticateWithToken(token, expiresAt, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/apps/${app.getAppID()}/users/me`;
            const request = app.newRequest("GET", url);
            request.isSendAccessToken(false); // remove Authorization header
            request.addHeader("Authorization", `Bearer ${token}`);
            const response = yield request.send();
            if (response.status != 200) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, undefined, null);
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
    static authenticateWithTotp(totpCode, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                grant_type: "mfa",
                totp_code: totpCode,
            };
            const url = `/apps/${app.getAppID()}/oauth2/token`;
            const request = app.newRequest("POST", url);
            const response = yield request.send(JSON.stringify(data));
            if (response.status != 200) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, new KiiUser(app), null);
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
    static authenticateWithRecoveryCode(recoveryCode, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                grant_type: "mfa",
                recovery_code: recoveryCode,
            };
            const url = `/apps/${app.getAppID()}/oauth2/token`;
            const request = app.newRequest("POST", url);
            const response = yield request.send(JSON.stringify(data));
            if (response.status != 200) {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, new KiiUser(app), null);
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
                throw (0,_utilities__WEBPACK_IMPORTED_MODULE_9__.error)("password is not set", this);
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
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
                const expiresAt = (0,_utilities__WEBPACK_IMPORTED_MODULE_9__.safeCalculateExpiresAtAsDate)(result.expiresAt, currentTime);
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
    static registerAsPseudoUser(userFields = {}, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, arguments, void 0, function* () {
            // sustain the compatibility with v2
            if ((0,_utilities__WEBPACK_IMPORTED_MODULE_9__.isCallback)(arguments[0])) {
                userFields = arguments[1];
                app = arguments[2] || _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp;
            }
            const url = `/apps/${app.getAppID()}/users`;
            const request = app.newRequest("POST", url);
            request.addHeader("x-kii-sdk", _kii__WEBPACK_IMPORTED_MODULE_6__.KiiSDKClientInfo.getSDKClientInfo());
            request.setContentType("application/vnd.kii.RegistrationAndAuthorizationRequest+json");
            request.isSendAccessToken(false);
            if (userFields === null) {
                userFields = {};
            }
            const response = yield request.send(JSON.stringify(userFields));
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                const accessToken = response.body["_accessToken"];
                const user = new KiiUser(app);
                user.accessToken = accessToken;
                user.updateWithJSON(response.body);
                user.setExpiresAt(new Date(MAX_DATE_IN_MILLIS));
                app.setCurrentUser(user, accessToken);
                return user;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, undefined, null);
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
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("This user has the identity already", this);
            }
            const currentUser = this.app.getCurrentUser();
            if (currentUser == null || currentUser.getAccessToken() == null) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("User is not logged in", this);
            }
            // validate values and throw exception
            validateIdentityData(identityData);
            if (!hasIdentityData(identityData)) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("needs to provide at least one of login name, email address or phone number", this);
            }
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validatePassword)(password)) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("invalid password", this);
            }
            const country = userFields === null || userFields === void 0 ? void 0 : userFields.country;
            if ((identityData === null || identityData === void 0 ? void 0 : identityData.phoneNumber) != null) {
                if (!this.isValidLocalPhoneNumber(identityData.phoneNumber, country)) {
                    throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("needs to provide country for the local phone number", this);
                }
            }
            // check current user state and current custom fields.
            // we cannot use PATCH update for user fields.
            const user = yield this.refresh();
            if (!user.isPseudoUser()) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("This user has the identity already", this);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                user.setModified(response.body["modifiedAt"]);
                user.updateWithIdentifier(identityData);
                user.updateWithUserFields(userFields, removeFields);
                return user;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("User is not logged in", this);
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
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("all arguments are null or empty", this);
            }
            const country = userFields === null || userFields === void 0 ? void 0 : userFields.country;
            if ((identityData === null || identityData === void 0 ? void 0 : identityData.phoneNumber) != null) {
                if (!this.isValidLocalPhoneNumber(identityData.phoneNumber, country)) {
                    throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("needs to provide country for the local phone number", this);
                }
            }
            const user = yield this.refresh();
            if (user.isPseudoUser() && hasIdentity) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("Pseudo user must use putIdentity()", this);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                user.setModified(response.body["modifiedAt"]);
                user.updateWithIdentifier(identityData);
                user.updateWithUserFields(userFields, removeFields);
                return user;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validatePassword)(toPassword)) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidPasswordException("Invalid password", this);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                return this;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
    static resetPassword(userIdentifier, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateEmail)(userIdentifier)) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("Invalid user identifier. Must be a valid email address", undefined);
            }
            const accountType = "EMAIL";
            const url = `/apps/${app.getAppID()}/users/${accountType}:${userIdentifier}/password/request-reset`;
            const request = app.newRequest("POST", url);
            request.isSendAccessToken(false);
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                // OK!
                return;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, undefined, null);
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
    static resetPasswordWithNotificationMethod(userIdentifier, notificationMethod, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userIdentifier !== "string") {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("given userIdentifier is not string", undefined);
            }
            if (userIdentifier.length == 0) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("given userIdentifier is empty", undefined);
            }
            if (notificationMethod !== "EMAIL" &&
                notificationMethod !== "SMS" &&
                notificationMethod !== "SMS_PIN") {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("notificationMethod should be 'EMAIL' or 'SMS' or 'SMS_PIN'", undefined);
            }
            const toQualifiedId = (userIdentifier) => {
                if ((0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateEmail)(userIdentifier)) {
                    return `EMAIL:${userIdentifier}`;
                }
                if ((0,_utilities__WEBPACK_IMPORTED_MODULE_9__.isGlobalPhoneNumber)(userIdentifier)) {
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
            request.addHeader("x-kii-sdk", _kii__WEBPACK_IMPORTED_MODULE_6__.KiiSDKClientInfo.getSDKClientInfo());
            request.isSendAccessToken(false);
            request.setContentType("application/vnd.kii.ResetPasswordRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                // OK!
                return;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, undefined, null);
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
    static completeResetPassword(userIdentifier, pinCode, newPassword, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userIdentifier.length == 0) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("given userIdentifier is null or empty", undefined);
            }
            if (pinCode.length == 0) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("given pinCode is null or empty", undefined);
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
            request.addHeader("x-kii-sdk", _kii__WEBPACK_IMPORTED_MODULE_6__.KiiSDKClientInfo.getSDKClientInfo());
            request.setContentType("application/vnd.kii.CompletePasswordResetRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                // OK!
                return;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, undefined, null);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                if (type == "email-address") {
                    this.setEmailVerified(true);
                }
                else if (type == "phone-number") {
                    this.setPhoneVerified(true);
                }
                return this;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                // OK!
                return;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                const groups = response.body["groups"];
                return groups.map((obj) => {
                    return _group__WEBPACK_IMPORTED_MODULE_4__.KiiGroup.groupWithJSON(obj);
                });
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                // OK!
                return this;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateEmail)(newEmail)) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("Invalid email address format", this);
            }
            const url = `/apps/${this.app.getAppID()}/users/${this.getID()}/email-address`;
            const body = {
                emailAddress: newEmail,
            };
            const request = this.app.newRequest("PUT", url);
            request.setContentType("application/vnd.kii.EmailAddressModificationRequest+json");
            const response = yield request.send(JSON.stringify(body));
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                // OK!
                return this;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                this.setModified(response.body["modifiedAt"]);
                return this;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                // OK!
                return this;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
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
    static logOut(app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static loggedIn(app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static findUserByEmail(email, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        const currentUser = app.getCurrentUser();
        if (currentUser == null || currentUser.getAccessToken() == null) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("User is not logged in", undefined);
        }
        if (email.length == 0) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("email should not null or empty", undefined);
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
    static findUserByPhone(phone, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        const currentUser = app.getCurrentUser();
        if (currentUser == null || currentUser.getAccessToken() == null) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("User is not logged in", undefined);
        }
        if (phone.length == 0) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("phone should not null or empty", undefined);
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
    static findUserByUsername(username, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        const currentUser = app.getCurrentUser();
        if (currentUser == null || currentUser.getAccessToken() == null) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("User is not logged in", undefined);
        }
        if (username.length == 0) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("username should not null or empty", undefined);
        }
        const url = `/apps/${app.getAppID()}/users/LOGIN_NAME:${username}`;
        return KiiUser.findUser(url, app);
    }
    /**
     * @hidden This to be used from admin context
     */
    static findUserByUsernameWithoutLogin(username, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        const url = `/apps/${app.getAppID()}/users/LOGIN_NAME:${username}`;
        return KiiUser.findUser(url, app);
    }
    /**
     * @hidden This to be used from admin context
     */
    static findUserByEmailWithoutLogin(username, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        const url = `/apps/${app.getAppID()}/users/EMAIL:${username}`;
        return KiiUser.findUser(url, app);
    }
    /**
     * @hidden This to be used from admin context
     */
    static findUserByPhoneWithoutLogin(username, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        const url = `/apps/${app.getAppID()}/users/PHONE:${username}`;
        return KiiUser.findUser(url, app);
    }
    static findUser(url, app) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = app.newRequest("GET", url);
            request.addHeader("x-kii-sdk", _kii__WEBPACK_IMPORTED_MODULE_6__.KiiSDKClientInfo.getSDKClientInfo());
            const response = yield request.send();
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                const user = new KiiUser(app);
                user.updateWithJSON(response.body);
                return user;
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, undefined, null);
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
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("topicName should not null or empty", this);
        }
        const userId = this.getID();
        if (userId == null || userId.length == 0) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("can not instantiate topic from instance which doesn't have ID", this);
        }
        const uri = `/users/${this.getID()}`;
        return new _topic__WEBPACK_IMPORTED_MODULE_8__.KiiTopic(uri, topicName, this.app);
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
            if ((0,_httpResponse__WEBPACK_IMPORTED_MODULE_5__.isSuccess)(response.status)) {
                const nextPaginationKey = response.body["paginationKey"] || null;
                const topics = response.body["topics"];
                const items = topics.map((topic) => this.topicWithName(topic["topicID"]));
                return [items, nextPaginationKey];
            }
            else {
                throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, this, null);
            }
        });
    }
    /**
     * Instantiate push subscription for this user.
     * @return {KiiPushSubscription} push subscription object.
     */
    pushSubscription() {
        return new _push__WEBPACK_IMPORTED_MODULE_7__.KiiPushSubscription(this, this.app);
    }
    /**
     * Instantiate push installation for this user.
     * @return {KiiPushInstallation} push installation object.
     */
    pushInstallation() {
        if (this.app.isAdmin()) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.UnsupportedOperationException("UnsupportedOperationException: Push installation is not supported by admin context", this);
        }
        return new _push__WEBPACK_IMPORTED_MODULE_7__.KiiPushInstallation(this, this.app);
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
        if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validatePassword)(password)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidPasswordException("Invalid password", this);
        }
        this.password = password;
    }
    /** @hidden */
    setEmailAddress(email) {
        const trimmedEmail = (0,_utilities__WEBPACK_IMPORTED_MODULE_9__.trim)(email);
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateEmail)(trimmedEmail)) {
            this.email = trimmedEmail;
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidEmailException("Invalid Email Address", this);
        }
    }
    /** @hidden */
    setPhoneNumber(phone) {
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validatePhoneNumber)(phone)) {
            this.phoneNumber = phone;
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidPhoneNumberException("Invalid Phone", this);
        }
    }
    /** @hidden */
    setLocalPhone(phone, country) {
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateLocalPhone)(phone)) {
            this.phoneNumber = phone;
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidPhoneNumberException("Invalid Phone", this);
        }
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateCountryCode)(country)) {
            this.country = country;
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_3__.InvalidCountryException("Invalid Coruntry", this);
        }
    }
    /** @hidden */
    static validateURI(value) {
        value = (0,_utilities__WEBPACK_IMPORTED_MODULE_9__.trim)(value);
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
        value = (0,_utilities__WEBPACK_IMPORTED_MODULE_9__.trim)(value);
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
        throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("No identifier", this);
    }
    isValidLocalPhoneNumber(phoneNumber, country) {
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_9__.isGlobalPhoneNumber)(phoneNumber)) {
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
const isValidLocalPhoneNumber = (phoneNumber, country) => {
    if (phoneNumber !== undefined && !(0,_utilities__WEBPACK_IMPORTED_MODULE_9__.isGlobalPhoneNumber)(phoneNumber)) {
        if (country == undefined) {
            return false;
        }
        return (0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateCountryCode)(country);
    }
    return true;
};
const isValidUserIdentifier = (identifier) => {
    if ((0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateEmail)(identifier)) {
        return true;
    }
    if ((0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validatePhoneNumber)(identifier)) {
        return true;
    }
    if ((0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateUsername)(identifier)) {
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
        body["expiresAt"] = (0,_utilities__WEBPACK_IMPORTED_MODULE_9__.safeCalculateExpiresAtAsNumber)(app.getAccessTokenExpiration(), currentTime);
    }
    const request = app.newRequest("POST", url);
    request.isSendAccessToken(false);
    // send
    const response = yield request.send(JSON.stringify(body));
    if (response.status != 200) {
        throw (0,_exception__WEBPACK_IMPORTED_MODULE_3__.parseErrorResponse)(request, response, undefined, null);
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
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateEmail)(data.emailAddress)) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("invalid email", undefined);
            }
        }
        if (data.phoneNumber && data.phoneNumber != null) {
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validatePhoneNumber)(data.phoneNumber)) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("invalid phone number", undefined);
            }
        }
        if (data.username && data.username != null) {
            if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateUsername)(data.username)) {
                throw new _exception__WEBPACK_IMPORTED_MODULE_3__.IllegalStateException("invalid username", undefined);
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
    if ((0,_utilities__WEBPACK_IMPORTED_MODULE_9__.validateEmail)(userIdentifier)) {
        return `EMAIL:${userIdentifier}`;
    }
    if ((0,_utilities__WEBPACK_IMPORTED_MODULE_9__.isGlobalPhoneNumber)(userIdentifier)) {
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


/***/ }),

/***/ "./src/userBuilder.ts":
/*!****************************!*\
  !*** ./src/userBuilder.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KiiUserBuilder": () => (/* binding */ KiiUserBuilder)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./src/index.ts");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app */ "./src/app.ts");
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utilities */ "./src/utilities.ts");




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
    static builderWithIdentifier(userIdentifier, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        if (userIdentifier === null ||
            userIdentifier === undefined ||
            userIdentifier === "") {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidUserIdentifierException("Invalid User Identifier set", undefined);
        }
        const builder = new KiiUserBuilder(app);
        if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validatePassword)(password)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidPasswordException("Invalid Password pattern set", undefined);
        }
        builder.password = password;
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validatePhoneNumber)(userIdentifier)) {
            builder.phoneNumber = userIdentifier;
        }
        else {
            userIdentifier = (0,_utilities__WEBPACK_IMPORTED_MODULE_3__.trim)(userIdentifier);
            if ((0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validateEmail)(userIdentifier)) {
                builder.email = userIdentifier;
            }
            else if ((0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validateUsername)(userIdentifier)) {
                builder.username = userIdentifier;
            }
            else {
                throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidUserIdentifierException("Invalid User Identifier set", undefined);
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
    static builderWithEmailAddress(emailAddress, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        const userBuilder = new KiiUserBuilder(app);
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validateEmail)(emailAddress)) {
            userBuilder.setEmailAddress(emailAddress);
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidEmailException("Invalid username", undefined);
        }
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validatePassword)(password)) {
            userBuilder.setPassword(password);
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidPasswordException("Invalid username", undefined);
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
    static builderWithGlobalPhoneNumber(phoneNumber, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
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
    static builderWithLocalPhoneNumber(phoneNumber, country, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        const userBuilder = new KiiUserBuilder(app);
        if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validateLocalPhone)(phoneNumber)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidPhoneNumberException("Invalid local Phone Number", undefined);
        }
        if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validateCountryCode)(country)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidCountryException(undefined, undefined);
        }
        if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validatePassword)(password)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidPasswordException("Invalid Password", undefined);
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
    static builderWithUsername(username, password, app = _app__WEBPACK_IMPORTED_MODULE_1__.KiiApplication.globalApp) {
        const userBuilder = new KiiUserBuilder(app);
        if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validateUsername)(username)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidPasswordException("Invalid username", undefined);
        }
        if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validatePassword)(password)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidPasswordException("Invalid Password", undefined);
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
        const trimmedUsername = (0,_utilities__WEBPACK_IMPORTED_MODULE_3__.trim)(username);
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validateUsername)(trimmedUsername)) {
            this.username = trimmedUsername;
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidUsernameException(undefined, this);
        }
        return this;
    }
    /** @hidden */
    setPassword(password) {
        if (!(0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validatePassword)(password)) {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidPasswordException("Invalid password", this);
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
        const trimmedEmail = (0,_utilities__WEBPACK_IMPORTED_MODULE_3__.trim)(email);
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validateEmail)(trimmedEmail)) {
            this.email = trimmedEmail;
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidEmailException("Invalid Email Address", this);
        }
        return this;
    }
    setPhoneNumber(phone) {
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validatePhoneNumber)(phone)) {
            this.phoneNumber = phone;
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidPhoneNumberException("Invalid Phone Number", this);
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
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validatePhoneNumber)(phone)) {
            this.phoneNumber = phone;
            this.country = undefined;
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidPhoneNumberException("Invalid Global Phone Number", this);
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
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validateLocalPhone)(phone)) {
            this.phoneNumber = phone;
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidPhoneNumberException("Invalid Phone Number", this);
        }
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validateCountryCode)(country)) {
            this.country = country;
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidCountryException(undefined, this);
        }
        return this;
    }
    setCountryCode(country) {
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_3__.validateCountryCode)(country)) {
            this.country = country;
        }
        else {
            throw new _exception__WEBPACK_IMPORTED_MODULE_2__.InvalidPhoneNumberException("Invalid Country code", this);
        }
    }
    /**
     * Build KiiUserBuilder object.
     * <br><br> Build KiiUserBuilder object. This method verify set values.
     * @returns {KiiUserBuilder} a working KiiUser object.
     */
    build() {
        const user = new ___WEBPACK_IMPORTED_MODULE_0__.KiiUser(this.app);
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


/***/ }),

/***/ "./src/utilities.ts":
/*!**************************!*\
  !*** ./src/utilities.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "validateEmail": () => (/* binding */ validateEmail),
/* harmony export */   "trim": () => (/* binding */ trim),
/* harmony export */   "validatePattern": () => (/* binding */ validatePattern),
/* harmony export */   "validatePhoneNumber": () => (/* binding */ validatePhoneNumber),
/* harmony export */   "isGlobalPhoneNumber": () => (/* binding */ isGlobalPhoneNumber),
/* harmony export */   "validateLocalPhone": () => (/* binding */ validateLocalPhone),
/* harmony export */   "assertLocalPhoneIsValid": () => (/* binding */ assertLocalPhoneIsValid),
/* harmony export */   "validateCountryCode": () => (/* binding */ validateCountryCode),
/* harmony export */   "assertCountryCodeIsValid": () => (/* binding */ assertCountryCodeIsValid),
/* harmony export */   "validatePassword": () => (/* binding */ validatePassword),
/* harmony export */   "assertPasswordIsValid": () => (/* binding */ assertPasswordIsValid),
/* harmony export */   "validateUsername": () => (/* binding */ validateUsername),
/* harmony export */   "validateGroupID": () => (/* binding */ validateGroupID),
/* harmony export */   "validateDisplayName": () => (/* binding */ validateDisplayName),
/* harmony export */   "safeAddTicks": () => (/* binding */ safeAddTicks),
/* harmony export */   "safeMultiplyTicks": () => (/* binding */ safeMultiplyTicks),
/* harmony export */   "safeCalculateExpiresAtAsNumber": () => (/* binding */ safeCalculateExpiresAtAsNumber),
/* harmony export */   "safeCalculateExpiresAtAsDate": () => (/* binding */ safeCalculateExpiresAtAsDate),
/* harmony export */   "isJSONType": () => (/* binding */ isJSONType),
/* harmony export */   "type": () => (/* binding */ type),
/* harmony export */   "disableCacheURL": () => (/* binding */ disableCacheURL),
/* harmony export */   "validateServerCodeEntryName": () => (/* binding */ validateServerCodeEntryName),
/* harmony export */   "validateServerCodeEntryArgument": () => (/* binding */ validateServerCodeEntryArgument),
/* harmony export */   "validateServerCodeEntryVersion": () => (/* binding */ validateServerCodeEntryVersion),
/* harmony export */   "isNonEmptyString": () => (/* binding */ isNonEmptyString),
/* harmony export */   "error": () => (/* binding */ error),
/* harmony export */   "clone": () => (/* binding */ clone),
/* harmony export */   "isCallback": () => (/* binding */ isCallback)
/* harmony export */ });
/* harmony import */ var _exception__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./exception */ "./src/exception.ts");

const MAX_DATE_IN_MILLIS = 100000000 * 24 * 60 * 60 * 1000;
const MIN_DATE_IN_MILLIS = -100000000 * 24 * 60 * 60 * 1000;
const validateEmail = (value) => {
    value = trim(value);
    // ensure this is in proper format
    const pattern = /^[^@]+@[^@]+$/;
    return pattern.test(value);
};
const trim = (value) => {
    const pattern = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
    return value.replace(pattern, "");
};
const validatePattern = (pattern, value) => {
    if (typeof value !== "string") {
        return false;
    }
    value = trim(value);
    if (value.match(pattern)) {
        return true;
    }
    else {
        return false;
    }
};
const validatePhoneNumber = (value) => {
    // ensure this is in proper format
    const pattern = /^[\\+]?[0-9]{10,}$/i;
    return validatePattern(pattern, value);
};
const isGlobalPhoneNumber = (value) => {
    const pattern = /^[\\+]{1}[0-9]{2}/;
    return validatePattern(pattern, value);
};
const validateLocalPhone = (value) => {
    value = trim(value);
    const pattern = /^\d+$/;
    return validatePattern(pattern, value);
};
const assertLocalPhoneIsValid = (value) => {
    return "not Implemented";
};
const validateCountryCode = (value) => {
    const pattern = /^[a-z]{2}$/i;
    return validatePattern(pattern, value);
};
const assertCountryCodeIsValid = (value) => {
    return "not Implemented";
};
const validatePassword = (value) => {
    const pattern = /^[\x20-\x7E]{4,50}$/;
    return validatePattern(pattern, value);
};
const assertPasswordIsValid = (value) => {
    return "Not implemented";
};
const validateUsername = (value) => {
    const pattern = /^[a-zA-Z0-9-_\\.]{3,64}$/i;
    return validatePattern(pattern, value);
};
const validateGroupID = (value) => {
    const pattern = /^[a-z0-9-_.]{1,30}$/;
    return validatePattern(pattern, value);
};
const validateDisplayName = (value) => {
    return typeof value === "string" && value.length >= 1 && value.length <= 50;
};
const safeAddTicks = (left, right) => {
    if (isNaN(left) || isNaN(right)) {
        throw new Error("Parameters should be a number");
    }
    if (Math.abs(left + right) > MAX_DATE_IN_MILLIS) {
        throw new _exception__WEBPACK_IMPORTED_MODULE_0__.ArithmeticException("Addition of " + left + " and " + right + " result in long overflow", undefined);
    }
    return left + right;
};
const safeMultiplyTicks = (left, right) => {
    if (isNaN(left) || isNaN(right)) {
        throw new Error("Parameters should be a number");
    }
    if (Math.abs(left * right) > MAX_DATE_IN_MILLIS) {
        throw new _exception__WEBPACK_IMPORTED_MODULE_0__.ArithmeticException("Multiplication of " +
            left +
            " and " +
            right +
            " result in long overflow", undefined);
    }
    return left * right;
};
const safeCalculateExpiresAtAsNumber = (expirationInSeconds, baseUnixTimeInMills) => {
    let expiresAt = 0;
    try {
        const expirationInMillis = safeMultiplyTicks(expirationInSeconds, 1000);
        expiresAt = safeAddTicks(baseUnixTimeInMills, expirationInMillis);
    }
    catch (e) {
        if (e instanceof _exception__WEBPACK_IMPORTED_MODULE_0__.ArithmeticException) {
            expiresAt = MAX_DATE_IN_MILLIS;
        }
        else {
            throw e;
        }
    }
    return expiresAt;
};
const safeCalculateExpiresAtAsDate = (expirationInSeconds, baseUnixTimeInMills) => {
    let expiresAt = 0;
    try {
        const expirationInMillis = safeMultiplyTicks(expirationInSeconds, 1000);
        expiresAt = safeAddTicks(baseUnixTimeInMills, expirationInMillis);
    }
    catch (e) {
        if (e instanceof _exception__WEBPACK_IMPORTED_MODULE_0__.ArithmeticException) {
            expiresAt = MAX_DATE_IN_MILLIS;
        }
        else {
            throw e;
        }
    }
    return new Date(expiresAt);
};
const isJSONType = (contentType) => {
    const pattern = /\+?json(;.*)?$/i;
    if (contentType.match(pattern)) {
        return true;
    }
    else {
        return false;
    }
};
const type = (obj) => {
    if (obj === undefined || obj === null) {
        return obj;
    }
    return typeof obj;
};
const disableCacheURL = (url) => {
    if (url.indexOf("?") !== -1) {
        url += "&disable_cache=";
    }
    else {
        url += "?disable_cache=";
    }
    url += new Date().getTime();
    return url;
};
const validateServerCodeEntryName = (value) => {
    const pattern = /^[a-zA-Z][_a-zA-Z0-9]*$/i;
    return validatePattern(pattern, value);
};
const validateServerCodeEntryArgument = (value) => {
    // null argument is also valid; key in object should has at least 1
    return (value === null ||
        (typeof value === "object" && Object.keys(value).length > 0));
};
const validateServerCodeEntryVersion = (value) => {
    return typeof value === "string" && value !== "";
};
const isNonEmptyString = (s) => {
    if (typeof s !== "string")
        return false;
    return s.length > 0;
};
const error = (message, target) => {
    const e = Error(message);
    e.name = target;
    return e;
};
const clone = (obj) => {
    if (!obj || typeof obj !== "object") {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
        let flags = "";
        if (obj.global)
            flags += "g";
        if (obj.ignoreCase)
            flags += "i";
        if (obj.multiline)
            flags += "m";
        if (obj.sticky)
            flags += "y";
        return new RegExp(obj.source, flags);
    }
    return obj;
    // TO DO implement the next part from coffeescript
    // newInstance = new obj.constructor()
    // for key of obj
    //           newInstance[key] = KiiUtilities._clone obj[key]
    // return newInstance
};
function isCallback(arg) {
    if (arg === null || typeof arg !== "object") {
        return false;
    }
    const keys = Object.keys(arg);
    if (keys.length > 2) {
        return false;
    }
    if (keys.length === 2 &&
        keys.includes("success") &&
        keys.includes("failure")) {
        return true;
    }
    if (keys.length === 1 &&
        (keys.includes("success") || keys.includes("failure"))) {
        return true;
    }
    return false;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});