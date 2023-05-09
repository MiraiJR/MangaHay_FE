import React from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import logo from '../../../../public/images/logo_web.png';
import '../Auth.scoped.sass';
import { toast_config } from "../../../../config/toast.config";

const origin_url_be = 'http://localhost:3000';

export class ChangePassword extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            password: '',
            confirm_password: '',
        };
    }

    componentDidMount(): void {
        if(sessionStorage.getItem('access_token')) {
            window.location.href = '/';
            return;
        }

        if (window.location.href.indexOf("token") < 0) {
            window.location.href = "/";
            return;
        }
    }

    handleChangeInputPassword = (event: any) => {
        this.setState({
            password: event.target.value,
        });
    }

    handleChangeInputConfirmPassword = (event: any) => {
        this.setState({
            confirm_password: event.target.value,
        });
    }

    changePassword = async () => {
        if(this.state.password.lenth < 8) {
            toast.warn('Mật khẩu phải có ít nhất là 8 ký tự', toast_config);
            return;
        }
        
        if (this.state.password !== this.state.confirm_password) {
            toast.warn('Mật khẩu xác nhận không chính xác', toast_config);
            return;
        }

        const token = window.location.href.split("token=")[window.location.href.split("token=").length - 1];
        const response = await fetch(`${origin_url_be}/api/auth/change-password?token=${token}`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: this.state.password,
            }),
        }).then((response) => response.json());

        if (!response.success) {
            toast.warn(response.message.toString(), toast_config);
            return;
        }

        window.location.href = "/auth/login"
    }

    render() {
        return (
            <div className="auth">
                <div className="authbox">
                    <Link to={'/'}>
                        <img className="authbox__logo" src={logo} alt="" />
                    </Link>
                    <h1 className="authbox__title">Đặt lại mật khẩu</h1>
                    <div className="authbox__body">
                        <div>
                            <label htmlFor="password">Mật khẩu</label>
                            <input id="password" name="password" type="password" placeholder="Nhập password" value={this.state.password} onChange={this.handleChangeInputPassword} />
                        </div>
                        <div>
                            <label htmlFor="passwordconfirm">Mật khẩu</label>
                            <input id="passwordconfirm" name="passwordconfirm" type="password" placeholder="Nhập lại password" value={this.state.confirm_password} onChange={this.handleChangeInputConfirmPassword} />
                        </div>
                    </div>
                    <div className="authbox__action" onClick={this.changePassword} >
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