import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
export class BeWritten extends BE {
    static get beConfig() {
        return {
            parse: true,
            primaryProp: 'from'
        };
    }
    write(self) {
    }
}
const tagName = 'be-written';
const ifWantsToBe = 'written';
const upgrade = '*';
const xe = new XE({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults
        },
        propInfo: {
            ...propInfo
        },
        actions: {}
    },
    superclass: BeWritten
});
register(ifWantsToBe, upgrade, tagName);
