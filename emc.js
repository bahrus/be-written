// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import  {EMC} from './ts-refs/trans-render/be/types' */;
/** @import {Actions, PAP,  AP} from './ts-refs/be-written/types' */;
/**
 * @type {EMC<any, AP>}
 */
export const emc = {
    base: 'be-written',
    branches: ['', 'encoding'],
    map: {
        '0.0': 'from',
        '1.0': 'encoding'
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
