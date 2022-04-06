export declare type KiiHttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";
export interface KiiHttpRequestFactory {
    create(method: KiiHttpMethod, url: string): KiiHttpRequest;
}
export interface KiiHttpRequest {
    getUrl(): string;
    setAccessToken(accessToken: string): void;
    setContentType(contentType: string): void;
    isSendAccessToken(send: boolean): void;
    addHeader(key: string, value: string): void;
    onProgress(event?: any): any;
    send(body?: any): Promise<KiiHttpResponse>;
    sendForDownload(body?: any): Promise<KiiHttpBlobResponse>;
}
export interface KiiHttpResponseHeaders {
    get(key: string): string | null;
}
export interface KiiHttpResponse {
    status: number;
    headers?: KiiHttpResponseHeaders;
    body: any;
}
export interface KiiHttpBlobResponse {
    status: number;
    headers?: KiiHttpResponseHeaders;
    body: Blob | any;
}
