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
    //provide hooks for extending decorators like BeRewritten, BeImporting
    async getSet(self, so, target) { }
    async write(self) {
        const { enhancedElement, shadowRootMode, from, to, reqInit, wrapper, beBased, inProgressCss, inserts, between, once } = self;
        if (once) {
            if (alreadyRequested.has(from)) {
                return {
                    resolved: true,
                };
            }
            alreadyRequested.add(from);
        }
        let target = enhancedElement;
        if (to !== '.') {
            target = enhancedElement.querySelector(to);
        }
        if (shadowRootMode !== undefined && target.shadowRoot === null) {
            target.attachShadow({ mode: shadowRootMode });
        }
        //look for bundling.  If bundled, we can assume all the links have been properly adjusted.
        const linkTest = globalThis[from];
        if (linkTest instanceof HTMLLinkElement && linkTest.hasAttribute('onerror')) {
            const importedID = linkTest.dataset.imported;
            if (importedID !== undefined) {
                const imported = this.importTempl(importedID, shadowRootMode, target);
                if (imported) {
                    return {
                        resolved: true,
                    };
                }
                if (document.readyState === 'loading') {
                    document.addEventListener('readystatechange', e => {
                        const imported = this.importTempl(importedID, shadowRootMode, target);
                        if (imported) {
                            self.resolved = true;
                        }
                        else {
                            console.error('bW.404');
                        }
                    }, { once: true });
                }
                return {};
            }
        }
        if (beBased !== undefined) {
            import('be-based/be-based.js');
            await customElements.whenDefined('be-based');
            const base = enhancedElement.beEnhanced.by.beBased;
            //const {attach} = await import('be-decorated/upgrade.js');
            const beBasedEndUserProps = (typeof beBased === 'boolean' ? {} : beBased);
            let bestGuessAtWhatBaseShouldBe = from;
            let fileName = '';
            if (!bestGuessAtWhatBaseShouldBe.endsWith('/')) {
                //this doesn't seem like it will catch all scenarios -- perhaps we should look at the response headers?
                //The assumption here is that if the end of the url has a period in it, like *.html or *.aspx, then the base of the path should not include that part
                const split = bestGuessAtWhatBaseShouldBe.split('/');
                const last = split.at(-1);
                if (last.indexOf('.') >= -1) { //TODO:  check before ? - query string delimiter
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
        const { StreamOrator, beginStream } = await import('stream-orator/StreamOrator.js');
        const so = new StreamOrator(target, {
            shadowRoot: shadowRootMode,
            rootTag: wrapper,
            between,
            inserts,
        });
        if (!this.getSet(self, so, target)) {
            return {
                resolved: true,
            };
        }
        ;
        if (inProgressCss) {
            enhancedElement.classList.add('be-written-in-progress');
        }
        const { resolve } = await import('trans-render/lib/resolve.js');
        let finalURL = resolve(from);
        await so.fetch(finalURL, reqInit);
        if (inProgressCss) {
            enhancedElement.classList.remove('be-written-in-progress');
        }
        if (beBased) {
            target.beDecorated.based.controller.disconnect();
        }
        return {
            resolved: true,
        };
    }
    importTempl(importedID, shadowRoot, target) {
        const templ = globalThis[importedID];
        if (templ !== undefined) {
            const fragment = shadowRoot !== undefined ? target.shadowRoot : target;
            fragment.innerHTML = '';
            fragment.appendChild(templ.content.cloneNode(true));
            return true;
        }
        return false;
    }
}
const lowerCaseRe = /^[a-zA-Z]/;
const alreadyRequested = new Set();
const tagName = 'be-written';
const ifWantsToBe = 'written';
const upgrade = '*';
export const beWrittenPropDefaults = {
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
const xe = new XE({
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
            write: {
                ifAllOf: ['from', 'to'],
                ifNoneOf: ['defer']
            }
        }
    },
    superclass: BeWritten
});
register(ifWantsToBe, upgrade, tagName);
