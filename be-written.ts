import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps, DEMethods} from 'be-decorated/DE.js';
import {ActionExt} from 'be-decorated/types';
import {Actions, PP, PPE, VirtualProps, Proxy, ProxyProps, PPP} from './types';
import {EndUserProps as BeBasedEndUserProps} from 'be-based/types';
import { StreamOrator } from 'stream-orator/StreamOrator.js';
import {Action} from 'trans-render/lib/types';

export class BeWritten extends EventTarget implements Actions{

    //provide hooks for extending decorators like BeRewritten
    async getSet(pp: PP, so: StreamOrator, target: Element){}
    async write(pp: PP){
        
        const {self, shadowRoot, from, to, reqInit, wrapper, beBased} = pp;
        let target = self;
        if(to !== '.'){
            target = self.querySelector(to!)!;
        }
        if(shadowRoot !== undefined && target.shadowRoot === null){
            target.attachShadow({mode: shadowRoot});
        }
        if(beBased !== undefined){
            import('be-based/be-based.js');
            await customElements.whenDefined('be-based');
            const {attach} = await import('be-decorated/upgrade.js');
            const instance = document.createElement('be-based') as any as DEMethods;
            const aTarget = target as any;
            const beBasedEndUserProps = typeof beBased === 'boolean' ? {} : beBased;
            beBasedEndUserProps.base = from; 
            if(aTarget.beDecorated === undefined) aTarget.beDecorated = {};
            aTarget.beDecorated.based = beBasedEndUserProps;
            attach(target, 'based', instance.attach.bind(instance));
        }
        
        const {StreamOrator, beginStream} = await import('stream-orator/StreamOrator.js');
        const so = new StreamOrator(target, {
            shadowRoot,
            rootTag: wrapper 
        });
        this.getSet(pp, so, target);
        self.classList.add('be-written-in-progress');
        await so.fetch(from!, reqInit!);
        self.classList.remove('be-written-in-progress');
        if(beBased){
            (<any>target).beDecorated.based.controller.disconnect();
        }
        return {
            resolved: true,
        } as PPP;

    }
}

const tagName = 'be-written';

const ifWantsToBe = 'written';

const upgrade = '*';

export const virtualProps: (keyof VirtualProps)[] = ['from', 'to', 'shadowRoot', 'wrapper', 'beBased', 'defer'];

export const proxyPropDefaults: Partial<VirtualProps> = {
    to: '.',
    beBased: true,
    beOosoom: '!defer'
};

export const actions:  Partial<{[key in keyof Actions]: ActionExt<VirtualProps & BeDecoratedProps<VirtualProps, Actions>, Actions>}> = {
    write: {
        ifAllOf: ['from', 'to'],
        ifNoneOf: ['defer']
    }
}

define<VirtualProps & BeDecoratedProps<VirtualProps, Actions>, Actions>({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            virtualProps,
            primaryProp: 'from',
            proxyPropDefaults 
        },
        actions,
    },
    complexPropDefaults: {
        controller: BeWritten,
    }
});

register(ifWantsToBe, upgrade, tagName);

