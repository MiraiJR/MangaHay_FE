import React from "react";
import { Link } from "react-router-dom";
import logo from '../../../../public/images/logo_web.png';
import { ToastContainer, toast } from "react-toastify";
import '../Auth.scoped.sass';
import { toast_config } from "../../../../config/toast.config";

const origin_url_be = 'http://localhost:3000';

export class ForgetPassword extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
        };
    }

    componentDidMount(): void {
        if (sessionStorage.getItem('access_token')) {
            window.location.href = '/';
            return;
        }
    }

    handleChangeInputEmail = (event: any) => {
        this.setState({
            email: event.target.value,
        });
    }

    sendRequestChangePwd = async () => {
        const response = await fetch(`${origin_url_be}/api/auth/forget-password`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
            }),
        }).then((response) => response.json());

        if (!response.success) {
            toast.warn(response.message.toString(), toast_config);
            return;
        }

        toast.success(response.message.toString(), toast_config);
    }

    render() {
        return (
            <div className="auth">
                <div className="authbox">
                    <Link to={'/'}>
                        <img className="authbox__logo" src={logo} alt="" />
                    </Link>
                    <h1 className="authbox__title">Quên mật khẩu</h1>
                    <div className="authbox__body">
                        <div>
                            <label htmlFor="email">Email đăng nhập</label>
                            <input id="email" name="email" type="email" placeholder="Nhập email của tài khoản cần đặt lại mật khẩu" value={this.state.email} onChange={this.handleChangeInputEmail} />
                        </div>
                    </div>
                    <div className="authbox__action" onClick={this.sendRequestChangePwd}>
                        <button className="button" >
                            Kiểm tra
                        </button>
                    </div>
                    <div className="authbox__footer">
                        <div>
                            <span>Chưa có tài khoản </span>
                            <Link to={'/auth/register'}>Đăng ký</Link>
                        </div>
                        <div>
                            <span>Có tài khoản </span>
                            <Link to={'/auth/login'}>Đăng nhập</Link>
                        </div>
                    </div>
                </div>
                <ToastContainer autoClose={1500} />
            </div>
        );
    }
}