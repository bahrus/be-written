import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, PAP, ProPAP} from './types';
import { Positractions, PropInfo } from 'trans-render/froop/types';
import {IEnhancement,  BEAllProps} from 'trans-render/be/types';
import { StreamOrator } from 'stream-orator/StreamOrator.js';
import {EndUserProps as BeBasedEndUserProps} from 'be-based/types';


export class BeWritten extends BE implements Actions{
    static override config: BEConfig<AP & BEAllProps, Actions & IEnhancement, any> = {
        propDefaults:{
            to: '.',
            beBased: true,
            beOosoom: '!defer'
        },
        propInfo:{
            ...beCnfg.propInfo as Partial<{[key in keyof AP]: PropInfo}>,
            from:{},
        },
        actions:{
            write: {
                ifAllOf: ['from', 'to'],
                ifNoneOf: ['defer']
            }
        }
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
        const {resolve} = await import('trans-render/lib/resolve.js');
        let finalURL = resolve(from!);
        import('be-a-beacon/behivior.js');
        if(beBased !== undefined){
            const {emc}  = await import('be-based/behivior.js');
            
            const base = (<any>target).beEnhanced.whenResolved(emc);
            //const {attach} = await import('be-decorated/upgrade.js');
            const beBasedEndUserProps = (typeof beBased === 'boolean' ? {} : beBased) as BeBasedEndUserProps;
            let bestGuessAtWhatBaseShouldBe = finalURL!;
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
        
        await so.fetch(finalURL, reqInit!);
        if(inProgressCss){
            enhancedElement.classList.remove('be-written-in-progress');
        }
        if(beBased){
            (<any>target).beEnhanced.beBased.disconnect(target);
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

export interface BeWritten extends AP{}

const lowerCaseRe = /^[a-zA-Z]/;

const alreadyRequested = new Set<string>();