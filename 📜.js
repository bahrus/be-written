// @ts-check
import { MountObserver, seed, BeHive } from 'be-hive/be-hive.js';
import { emc as baseEMC } from './behivior.js';
/** @import {EMC} from './node_modules/trans-render/be/types.d.ts' */
/**
 * @type {EMC}
 */
export const emc = {
    ...baseEMC,
    base: '📜',
    enhPropKey: '📜',
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);
