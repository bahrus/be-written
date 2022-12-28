import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {ActionExt} from 'be-decorated/types';
import {Actions, PP, PPE, VirtualProps, Proxy, ProxyProps, PPP} from './types';
import {EndUserProps as BeBasedEndUserProps} from 'be-based/types';
import { StreamOrator } from 'stream-orator/StreamOrator.js';
import {Attachable} from 'trans-render/lib/types';

export class BeWritten extends EventTarget implements Actions{

    //provide hooks for extending decorators like BeRewritten
    async getSet(pp: PP, so: StreamOrator, target: Element){}
    async write(pp: PP){
        
        const {self, shadowRoot, from, to, reqInit, wrapper, beBased, inProgressCss, inserts, between, once} = pp;
        if(once){
            if(alreadyRequested.has(from!)) {
                return {
                    resolved: true,
                } as PPP;
            }        
            alreadyRequested.add(from!);
        }

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
            //const {attach} = await import('be-decorated/upgrade.js');
            const instance = document.createElement('be-based') as any as Attachable;
            const aTarget = target as any;
            const beBasedEndUserProps = typeof beBased === 'boolean' ? {} : beBased;
            let bestGuessAtWhatBaseShouldBe = from!;
            if(!bestGuessAtWhatBaseShouldBe.endsWith('/')){
                //this doesn't seem like it will catch all scenarios -- perhaps we should look at the response headers?
                //The assumption here is that if the end of the url has a period in it, like *.html or *.aspx, then the base of the path should not include that part
                const split = bestGuessAtWhatBaseShouldBe.split('/');
                const last = split.at(-1)!;
                if(last.indexOf('.') >= -1){ //TODO:  check before ? - query string delimiter
                    split.pop();
                }
                bestGuessAtWhatBaseShouldBe = split.join('/');
            }
            beBasedEndUserProps.base = bestGuessAtWhatBaseShouldBe; 
            if(aTarget.beDecorated === undefined) aTarget.beDecorated = {};
            aTarget.beDecorated.based = beBasedEndUserProps;
            instance.attach(target);
        }
        const {StreamOrator, beginStream} = await import('stream-orator/StreamOrator.js');
        const so = new StreamOrator(target, {
            shadowRoot,
            rootTag: wrapper,
            between,
            inserts,
        });
        this.getSet(pp, so, target);
        if(inProgressCss){
            self.classList.add('be-written-in-progress');
        }
        let finalURL = from!;
        const linkTest = (<any>globalThis)[finalURL];
        if(linkTest instanceof HTMLLinkElement){
            finalURL = linkTest.href;
        }else if(lowerCaseRe.test(finalURL)){
            const importMap = document.querySelector('script[type="importmap"]');
            if(importMap !== null){
                try{
                    const imports = JSON.parse(importMap.innerHTML).imports;
                    for(const key in imports){
                        if(finalURL.startsWith(key)){
                            finalURL = finalURL.replace(key, imports[key]);
                            break;
                        }
                    }
                }
                
            }
        }
        await so.fetch(finalURL, reqInit!);
        if(inProgressCss){
            self.classList.remove('be-written-in-progress');
        }
        if(beBased){
            (<any>target).beDecorated.based.controller.disconnect();
        }
        return {
            resolved: true,
        } as PPP;

    }
}

const lowerCaseRe = /a-z/i;

const alreadyRequested = new Set<string>();

const tagName = 'be-written';

const ifWantsToBe = 'written';

const upgrade = '*';

export const virtualProps: (keyof VirtualProps)[] = [
    'from', 'to', 'shadowRoot', 'reqInit', 'wrapper', 'beBased', 'defer', 'beOosoom',
    'inProgressCss', 'inserts', 'between', 'once',
];

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

