import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps, DEMethods} from 'be-decorated/DE.js';
import {Actions, PP, PPE, VirtualProps, Proxy, ProxyProps} from './types';
import {EndUserProps as BeBasedEndUserProps} from 'be-based/types';

export class BeWritten extends EventTarget implements Actions{
    async write(pp: PP){
        
        const {self, shadowRoot, from, to, reqInit, wrapper, beBased} = pp;
        let target = self;
        if(to !== '.'){
            target = self.querySelector(to!)!;
        }
        if(shadowRoot !== undefined && target.shadowRoot === null){
            target.attachShadow({mode: shadowRoot});
        }
        if(beBased){
            import('be-based/be-based.js');
            await customElements.whenDefined('be-based');
            const {attach} = await import('be-decorated/upgrade.js');
            const instance = document.createElement('be-based') as any as DEMethods;
            const aTarget = target as any;
            if(aTarget.beDecorated === undefined) aTarget.beDecorated = {};
            aTarget.beDecorated.based = {
                base: from
            } as BeBasedEndUserProps;
            attach(target, 'based', instance.attach.bind(instance));
        }
        
        const {StreamOrator, beginStream} = await import('stream-orator/StreamOrator.js');
        const so = new StreamOrator(target, {
            shadowRoot,
            rootTag: wrapper 
        });
        await so.fetch(from!, reqInit!);

    }
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
            virtualProps: ['from', 'to', 'shadowRoot', 'wrapper', 'beBased'],
            primaryProp: 'from',
            proxyPropDefaults: {
                to: '.',
                beBased: true,
            }
        },
        actions: {
            write: {
                ifAllOf: ['from', 'to']
            }
        }
    },
    complexPropDefaults: {
        controller: BeWritten,
    }
});

register(ifWantsToBe, upgrade, tagName);

