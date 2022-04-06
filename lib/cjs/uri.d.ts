import { KiiBucket, KiiObject, KiiUser } from ".";
import { KiiApplication } from "./app";
import { KiiGroup } from "./group";
import { KiiThing } from "./thing";
export declare class KiiUri {
    private segments;
    private app;
    constructor(segments: IKiiUriSegment[], app: KiiApplication);
    isUser(): boolean;
    isObject(): boolean;
    toEntity(): KiiUser | KiiBucket | KiiGroup | KiiObject | KiiThing;
    toMoveBodyParam(): {
        targetObjectScope: {
            appID: string;
            userID: string;
            type: string;
            groupID?: undefined;
        } | {
            appID: string;
            groupID: string;
            type: string;
            userID?: undefined;
        } | {
            appID: string;
            type: string;
            userID?: undefined;
            groupID?: undefined;
        };
        targetBucketType: string;
        targetBucketID: string;
        targetObjectID: string;
    } | {
        targetObjectScope: {
            appID: string;
            userID: string;
            type: string;
            groupID?: undefined;
        } | {
            appID: string;
            groupID: string;
            type: string;
            userID?: undefined;
        } | {
            appID: string;
            type: string;
            userID?: undefined;
            groupID?: undefined;
        };
        targetBucketID: string;
        targetObjectID: string;
        targetBucketType?: undefined;
    };
    private toTargetData;
    static parse(s: string, app?: KiiApplication): KiiUri;
}
interface IKiiUriSegment {
    type: string;
    value: string;
}
export {};
