import { KiiBucket, KiiObject, KiiUser } from ".";
import { KiiApplication } from "./app";
import { KiiGroup } from "./group";
import { KiiThing } from "./thing";
export class KiiUri {
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
                parent = KiiUser.userWithID(segment.value, this.app);
            }
            else if (segment.type == "groups") {
                if (parent != null) {
                    throw new Error("Invalid uri");
                }
                parent = KiiGroup.groupWithID(segment.value, this.app);
            }
            else if (segment.type == "buckets") {
                if (parent instanceof KiiBucket || parent instanceof KiiObject) {
                    throw new Error("Invalid owner");
                }
                const owner = parent;
                // TODO encrypted bucket
                const bucket = new KiiBucket(segment.value, owner, this.app);
                parent = bucket;
            }
            else if (segment.type == "objects") {
                if (!(parent instanceof KiiBucket)) {
                    throw new Error("parent is not bucket");
                }
                const object = parent.createObjectWithID(segment.value);
                parent = object;
            }
            else if (segment.type == "things") {
                const thing = KiiThing.thingWithID(segment.value);
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
    static parse(s, app = KiiApplication.globalApp) {
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
