import {IEnhancement, BEAllProps} from './node_modules/trans-render/be/types';
import {EndUserProps as BeBasedEndUserProps} from './node_modules/be-based/types';
import {Inserts} from './node_modules/stream-orator/types';

export interface EndUserProps extends IEnhancement{
    from?: string,
    to?: string,
    shadowRootMode?: 'open' | 'closed'
    reqInit?: RequestInit,
    wrapper?: string,
    beBased?: boolean | BeBasedEndUserProps,
    beOosoom?: string,
    defer?: boolean,
    inProgressCss?: string,
    inserts?:Inserts,
    between?: [lhs: string, rhs: string],
    once?: boolean,
}

export interface AllProps extends EndUserProps{
    to: string,
    from: string,
}

export interface AllProps extends EndUserProps {}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;


export interface Actions{
    write(self: AP & BEAllProps): ProPAP;
}