import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';
import { StreamOrator } from 'stream-orator/StreamOrator.js';
import {Attachable} from './node_modules/trans-render/lib/types';
import {EndUserProps as BeBasedEndUserProps} from 'be-based/types';

export class BeWritten extends BE<AP, Actions> implements Actions{
    static  override get beConfig(){
        return {
            parse: true,
            primaryProp: 'from'
        } as BEConfig
    }

    //provide hooks for extending decorators like BeRewritten, BeImporting
    async getSet(self: this, so: StreamOrator, target: Element){}

    async write(self: this): ProPAP {
        
        const {enhancedElement, shadowRootMode, from, to, reqInit, wrapper, beBased, inProgressCss, inserts, between, once} = self;
        if(once){
            if(alreadyRequested.has(from!)) {
                return {
                    resolved: true,
                };
            }        
            alreadyRequested.add(from!);
        }

        let target = enhancedElement;
        if(to !== '.'){
            target = enhancedElement.querySelector(to!)!;
        }
        if(shadowRootMode !== undefined && target.shadowRoot === null){
            target.attachShadow({mode: shadowRootMode});
        }
        //look for bundling.  If bundled, we can assume all the links have been properly adjusted.
        const linkTest = (<any>globalThis)[from!];
        if(linkTest instanceof HTMLLinkElement && linkTest.hasAttribute('onerror')){
            const importedID = linkTest.dataset.imported;
            if(importedID !== undefined){
                const imported = this.importTempl(importedID, shadowRootMode, target);
                if(imported){
                    return {
                        resolved: true,
                    };
                }

                if(document.readyState === 'loading'){
                    document.addEventListener('readystatechange', e => {
                        const imported = this.importTempl(importedID, shadowRootMode, target);
                        if(imported){
                            self.resolved = true;
                        }else{
                            console.error('bW.404');
                        }
                    }, {once: true})

                }
                return {};
            }
        }
        if(beBased !== undefined){
            import('be-based/be-based.js');
            await customElements.whenDefined('be-based');
            const base = (<any>enhancedElement).beEnhanced.by.beBased;
            //const {attach} = await import('be-decorated/upgrade.js');
            const beBasedEndUserProps = (typeof beBased === 'boolean' ? {} : beBased) as BeBasedEndUserProps;
            let bestGuessAtWhatBaseShouldBe = from!;
            let fileName = '';
            if(!bestGuessAtWhatBaseShouldBe.endsWith('/')){
                //this doesn't seem like it will catch all scenarios -- perhaps we should look at the response headers?
                //The assumption here is that if the end of the url has a period in it, like *.html or *.aspx, then the base of the path should not include that part
                const split = bestGuessAtWhatBaseShouldBe.split('/');
                const last = split.at(-1)!;
                if(last.indexOf('.') >= -1){ //TODO:  check before ? - query string delimiter
                    split.pop();
                    
                    fileName = last;
                    //console.log({fileName});
                }
                bestGuessAtWhatBaseShouldBe = split.join('/');
            }
            beBasedEndUserProps.base = bestGuessAtWhatBaseShouldBe;
            beBasedEndUserProps.fileName = fileName; 
            Object.assign(base, beBasedEndUserProps);
        }
        const {StreamOrator, beginStream} = await import('stream-orator/StreamOrator.js');
        const so = new StreamOrator(target, {
            shadowRoot: shadowRootMode,
            rootTag: wrapper,
            between,
            inserts,
        });
        if(!this.getSet(self, so, target)){
            return {
                resolved: true,
            };
        };
        if(inProgressCss){
            enhancedElement.classList.add('be-written-in-progress');
        }
        const {resolve} = await import('trans-render/lib/resolve.js');
        let finalURL = resolve(from!);
        await so.fetch(finalURL, reqInit!);
        if(inProgressCss){
            enhancedElement.classList.remove('be-written-in-progress');
        }
        if(beBased){
            (<any>target).beDecorated.based.controller.disconnect();
        }
        return {
            resolved: true,
        };
        
    }

    importTempl(importedID: string, shadowRoot: 'open' | 'closed' | undefined, target: Element ){
        const templ = (<any>globalThis)[importedID!] as HTMLTemplateElement;
        if(templ !== undefined){
            const fragment = shadowRoot !== undefined ? target.shadowRoot! : target;
            fragment.innerHTML = '';
            fragment.appendChild(templ.content.cloneNode(true));
            return true;
        }
        return false;
    }
}

export interface BeWritten extends AllProps{}


const lowerCaseRe = /^[a-zA-Z]/;

const alreadyRequested = new Set<string>();

const tagName = 'be-written';
const ifWantsToBe = 'written';
const upgrade = '*';

export const beWrittenPropDefaults: Partial<AP> = {
    to: '.',
    beBased: true,
    beOosoom: '!defer'
};

// export const beWrittenActions: Partial<{[key in keyof Actions]: Action<VirtualProps & BeDecoratedProps<VirtualProps, Actions>, Actions>}> = {
//     write: {
//         ifAllOf: ['from', 'to'],
//         ifNoneOf: ['defer']
//     }
// }

const xe = new XE<AP, Actions>({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults,
            ...beWrittenPropDefaults
        },
        propInfo: {
            ...propInfo
        },
        actions: {
            write:{
                ifAllOf: ['from', 'to'],
                ifNoneOf: ['defer']
            }
        }
    },
    superclass: BeWritten
});

register(ifWantsToBe, upgrade, tagName);