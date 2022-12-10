import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/DE.js';
export class BeWritten extends EventTarget {
    async write(pp) {
        const { self, shadowRoot, from, to, reqInit, wrapper, beBased } = pp;
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
            const { attach } = await import('be-decorated/upgrade.js');
            const instance = document.createElement('be-based');
            const aTarget = target;
            const beBasedEndUserProps = typeof beBased === 'boolean' ? {} : beBased;
            beBasedEndUserProps.base = from;
            if (aTarget.beDecorated === undefined)
                aTarget.beDecorated = {};
            aTarget.beDecorated.based = beBasedEndUserProps;
            attach(target, 'based', instance.attach.bind(instance));
        }
        const { StreamOrator, beginStream } = await import('stream-orator/StreamOrator.js');
        const so = new StreamOrator(target, {
            shadowRoot,
            rootTag: wrapper
        });
        await so.fetch(from, reqInit);
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
define({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            virtualProps: ['from', 'to', 'shadowRoot', 'wrapper', 'beBased', 'defer'],
            primaryProp: 'from',
            proxyPropDefaults: {
                to: '.',
                beBased: true,
                beOosoom: '!defer'
            }
        },
        actions: {
            write: {
                ifAllOf: ['from', 'to'],
                ifNoneOf: ['defer']
            }
        }
    },
    complexPropDefaults: {
        controller: BeWritten,
    }
});
register(ifWantsToBe, upgrade, tagName);
