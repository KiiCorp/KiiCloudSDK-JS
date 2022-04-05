import { KiiHttpMethod, KiiHttpRequest, KiiHttpRequestFactory } from "./httpRequest";
export declare class KiiJQueryRequestFactory implements KiiHttpRequestFactory {
    create(method: KiiHttpMethod, url: string): KiiHttpRequest;
}
export declare class KiiFetchRequestFactory implements KiiHttpRequestFactory {
    create(method: KiiHttpMethod, url: string): KiiHttpRequest;
}
