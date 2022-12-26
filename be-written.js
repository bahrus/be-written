import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/DE.js';
export class BeWritten extends EventTarget {
    //provide hooks for extending decorators like BeRewritten
    async getSet(pp, so, target) { }
    async write(pp) {
        const { self, shadowRoot, from, to, reqInit, wrapper, beBased, inProgressCss, inserts, between } = pp;
        let target = self;
        if (to !== '.') {
            target = self.querySelector(to);
        }
        if (shadowRoot !== undefined && target.shadowRoot === null) {
            target.attachShadow({ mode: shadowRoot });
        }
        if (beBased !== undefined) {
            import('be-based/be-based.js');
            await customElements.whenDefined('be-based');
            //const {attach} = await import('be-decorated/upgrade.js');
            const instance = document.createElement('be-based');
            const aTarget = target;
            const beBasedEndUserProps = typeof beBased === 'boolean' ? {} : beBased;
            let bestGuessAtWhatBaseShouldBe = from;
            if (!bestGuessAtWhatBaseShouldBe.endsWith('/')) {
                //this doesn't seem like it will catch all scenarios -- perhaps we should look at the response headers?
                //The assumption here is that if the end of the url has a period in it, like *.html or *.aspx, then the base of the path should not include that part
                const split = bestGuessAtWhatBaseShouldBe.split('/');
                const last = split.at(-1);
                if (last.indexOf('.') >= -1) { //TODO:  check before ? - query string delimiter
                    split.pop();
                }
                bestGuessAtWhatBaseShouldBe = split.join('/');
            }
            beBasedEndUserProps.base = bestGuessAtWhatBaseShouldBe;
            if (aTarget.beDecorated === undefined)
                aTarget.beDecorated = {};
            aTarget.beDecorated.based = beBasedEndUserProps;
            instance.attach(target);
        }
        const { StreamOrator, beginStream } = await import('stream-orator/StreamOrator.js');
        const so = new StreamOrator(target, {
            shadowRoot,
            rootTag: wrapper,
            between,
            inserts,
        });
        this.getSet(pp, so, target);
        if (inProgressCss) {
            self.classList.add('be-written-in-progress');
        }
        await so.fetch(from, reqInit);
        if (inProgressCss) {
            self.classList.remove('be-written-in-progress');
        }
        if (beBased) {
            target.beDecorated.based.controller.disconnect();
        }
        return {
            resolved: true,
        };
    }
}
const tagName = 'be-written';
const ifWantsToBe = 'written';
const upgrade = '*';
export const virtualProps = [
    'from', 'to', 'shadowRoot', 'reqInit', 'wrapper', 'beBased', 'defer', 'beOosoom',
    'inProgressCss', 'inserts', 'between', 'once',
];
export const proxyPropDefaults = {
    to: '.',
    beBased: true,
    beOosoom: '!defer'
};
export const actions = {
    write: {
        ifAllOf: ['from', 'to'],
        ifNoneOf: ['defer']
    }
};
define({
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
