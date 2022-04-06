var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
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
export class KiiJQueryRequestFactory {
    create(method, url) {
        return new XHRRequest(jQuery.ajaxSettings.xhr(), method, url);
    }
}
export class KiiFetchRequestFactory {
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
