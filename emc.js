// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import  {EMC} from './ts-refs/trans-render/be/types' */;
/**
 * @type {EMC}
 */
export const emc = {
    base: 'be-written',
    map: {
        '0.0': 'from'
    },
    enhPropKey: 'beWritten',
    importEnh: async () => {
        const { BeWritten } = 
        /** @type {{new(): IEnhancement<Element>}} */ 
        /** @type {any} */
        (await import('./be-written.js'));
        return BeWritten;
    }
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);
