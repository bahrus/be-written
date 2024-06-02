import {BeHive, EnhancementMountCnfg} from 'be-hive/be-hive.js';
import {MountObserver, MOSE} from 'mount-observer/MountObserver.js';

const base = 'be-written';
export const emc: EnhancementMountCnfg = {
    base,
    map: {
        '0.0': 'from'
    },
    enhPropKey: 'beWritten',
    importEnh: async () => {
        const {BeWritten} = await import('./behance.js');
        return BeWritten;
    }
};

const mose = document.createElement('script') as MOSE<EnhancementMountCnfg>;
mose.id = base;
mose.synConfig = emc;

MountObserver.synthesize(document, BeHive, mose);


