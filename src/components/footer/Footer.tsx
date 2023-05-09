/* eslint-disable @typescript-eslint/no-useless-constructor */
import React from "react";
import logo from '../../public/images/logo_web.png';
import './Footer.sass';

export class Footer extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div id={this.props.id}>
                <img src={logo} alt="" />
            </div>
        );
    }
}