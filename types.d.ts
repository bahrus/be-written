import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';
import {EndUserProps as BeBasedEndUserProps} from 'be-based/types';
import {Inserts} from 'stream-orator/types';

export interface EndUserProps extends IBE{
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

}

export interface AllProps extends EndUserProps {}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>]

export interface Actions{
    write(self: this): ProPAP;
}