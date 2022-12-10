import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/DE.js';
export class BeWritten extends EventTarget {
    async write(pp) {
        const { StreamOrator } = await import('stream-orator/StreamOrator.js');
        const { self, shadowRoot, from, to, reqInit } = pp;
        let target = self;
        if (to !== '.') {
            target = self.querySelector(to);
        }
        import('be-based/be-based.js');
        await customElements.whenDefined('be-based');
        const { attach } = await import('be-decorated/upgrade.js');
        const instance = document.createElement('be-based');
        self.beDecorated.based = {
            base: from
        };
        attach(self, 'based', instance.attach.bind(instance));
        const so = new StreamOrator(target, {
            shadowRoot
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
            virtualProps: ['from', 'to', 'shadowRoot'],
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
