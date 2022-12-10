import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/DE.js';
export class BeWritten extends EventTarget {
    async write(pp) {
        const { self, shadowRoot, from, to, reqInit, wrapper } = pp;
        let target = self;
        if (to !== '.') {
            target = self.querySelector(to);
        }
        if (shadowRoot !== undefined && target.shadowRoot === null) {
            target.attachShadow({ mode: shadowRoot });
        }
        import('be-based/be-based.js');
        await customElements.whenDefined('be-based');
        const { attach } = await import('be-decorated/upgrade.js');
        const instance = document.createElement('be-based');
        const aTarget = target;
        if (aTarget.beDecorated === undefined)
            aTarget.beDecorated = {};
        aTarget.beDecorated.based = {
            base: from
        };
        attach(target, 'based', instance.attach.bind(instance));
        const { StreamOrator, beginStream } = await import('stream-orator/StreamOrator.js');
        const so = new StreamOrator(target, {
            shadowRoot,
            rootTag: wrapper
        });
        await so.fetch(from, reqInit);
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
            virtualProps: ['from', 'to', 'shadowRoot', 'wrapper'],
            primaryProp: 'from',
            proxyPropDefaults: {
                to: '.'
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
