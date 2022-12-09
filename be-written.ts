import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {Actions, PP, PPE, VirtualProps, Proxy, ProxyProps} from './types';

export class BeWritten extends EventTarget implements Actions{

}

const tagName = 'be-written';

const ifWantsToBe = 'written';

const upgrade = '*';

define<VirtualProps & BeDecoratedProps<VirtualProps, Actions>, Actions>({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            virtualProps: [],
            proxyPropDefaults: {

            }
        }
    },
    complexPropDefaults: {
        controller: BeWritten,
    }
});

register(ifWantsToBe, upgrade, tagName);

