import {BeDecoratedProps, MinimalProxy, EventConfigs} from 'be-decorated/types';

export interface EndUserProps{
    from?: string,
    to?: string,
    shadowRoot?: 'open' | 'closed'
}

export interface VirtualProps extends EndUserProps, MinimalProxy{

}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export type PPP = Partial<ProxyProps>;

export type PPE = [Partial<PP>, EventConfigs<Proxy, Actions>];

export interface Actions{
    write(pp: PP): void;
}