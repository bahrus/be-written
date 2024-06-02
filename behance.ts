import {BeWritten} from './be-written.js';
export {BeWritten} from './be-written.js';
import {def} from 'trans-render/lib/def.js';

await BeWritten.bootUp();

def('be-written', BeWritten);