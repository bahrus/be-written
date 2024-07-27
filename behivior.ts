import {BeHive, EMC, seed, MountObserver} from 'be-hive/be-hive.js';

const base = 'be-written';
export const emc: EMC = {
    base,
    map: {
        '0.0': 'from'
    },
    enhPropKey: 'beWritten',
    importEnh: async () => {
        const {BeWritten} = await import('./be-written.js');
        return BeWritten;
    }
};

const mose = seed(emc);

MountObserver.synthesize(document, BeHive, mose);


