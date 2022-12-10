import {BeDecoratedProps, MinimalProxy, EventConfigs} from 'be-decorated/types';

export interface EndUserProps{
    from?: string,
    to?: string,
    shadowRoot?: 'open' | 'closed'
    reqInit?: RequestInit,
    wrapper?: string,
    beBased?: boolean,
}

export interface VirtualProps extends EndUserProps, MinimalProxy{

}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export type PPP = Partial<ProxyProps>;

export type PPE = [PPP, EventConfigs<Proxy, Actions>];

export interface Actions{
    write(pp: PP): PPP;
}