
import * as React from 'react';

export declare interface Props {
    //城市
    city: string;
    //包含了当前地址和 目标地址
    startAddress: string;
    endAddress: string;
}
export interface State {
    [propName: string]: any;
}
export default class RoutePanning extends React.Component<Props, State> {
    render(): JSX.Element;
}
