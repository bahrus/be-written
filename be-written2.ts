import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';

export class BeWritten extends BE<AP, Actions> implements Actions{
    static  override get beConfig(){
        return {
            parse: true,
            primaryProp: 'from'
        } as BEConfig
    }

    write(self: this): ProPAP {
        
    }
}

export interface BeWritten extends AllProps{}

const tagName = 'be-written';
const ifWantsToBe = 'written';
const upgrade = '*';

const xe = new XE<AP, Actions>({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults
        },
        propInfo: {
            ...propInfo
        },
        actions: {
        }
    },
    superclass: BeWritten
});

register(ifWantsToBe, upgrade, tagName);