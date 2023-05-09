import React, { useState } from 'react';
import './User.sass';
import logo from '../../../public/images/logo_web.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faBook, faMessage, faRing, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, Route, Routes } from 'react-router-dom';
import { UserProfile } from './profile/Profile';

const origin_url_be = 'http://localhost:3000';

export class UserPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            content_right_body: '',
        };

        this.channgContentRightBody = this.channgContentRightBody.bind(this);
    }

    componentDidMount(): void {
        const split_cur_url = window.location.href.split('/');
        const menuleft_option_active = split_cur_url[split_cur_url.length - 1];

        this.setState({
            content_right_body: menuleft_option_active,
        });

        if (!sessionStorage.getItem('access_token')) {
            window.location.href = '/';
            return;
        }

        this.props.hideLayout();
    }

    channgContentRightBody(value: string) {
        this.setState({
            content_right_body: value,
        });
    }

    render() {
        return (
            <div className='userpage'>
                <MenuLeft />
                <ContentRight content_right_body={this.state.content_right_body} />
            </div>
        );
    }
}

class MenuLeft extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            is_clicked: false,
        };

        this.changeIsClicked = this.changeIsClicked.bind(this);
    }

    componentDidMount() {
        const split_cur_url = window.location.href.split('/');
        const menuleft_option_active = split_cur_url[split_cur_url.length - 1];
        document.getElementById(menuleft_option_active)?.classList.add('menuleft__option-active');
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        document.querySelector('.menuleft__option-active')?.classList.remove('menuleft__option-active');
        const split_cur_url = window.location.href.split('/');
        const menuleft_option_active = split_cur_url[split_cur_url.length - 1];
        document.getElementById(menuleft_option_active)?.classList.add('menuleft__option-active');
    }

    changeIsClicked() {
        this.setState({
            is_clicked: !this.state.is_clicked,
        })
    }

    render() {
        return (
            <div className='menuleft'>
                <a href="/">
                    <img src={logo} alt="" />
                </a>
                <div className='menuleft__title'>
                    <div>Cài đặt tài khoản</div>
                </div>
                <div className='menuleft__option'>
                    <Link className='menuleft__option-item' to={'/me/profile'} id='profile' onClick={this.changeIsClicked}>
                        <FontAwesomeIcon icon={faUser} />
                        <span>Hồ sơ</span>
                    </Link>
                    <Link className='menuleft__option-item' to={'/me/message'} id='message' onClick={this.changeIsClicked}>
                        <FontAwesomeIcon icon={faMessage} />
                        <span>Tin nhắn</span>
                    </Link>
                    <Link className='menuleft__option-item' to={'/me/comic-favorite'} id='comic-favorite' onClick={this.changeIsClicked}>
                        <FontAwesomeIcon icon={faBook} />
                        <span>Sách yêu thích</span>
                    </Link>
                    <Link className='menuleft__option-item' to={'/me/comic-following'} id='comic-following' onClick={this.changeIsClicked}>
                        <FontAwesomeIcon icon={faBook} />
                        <span>Sách theo dõi</span>
                    </Link>
                    <Link className='menuleft__option-item' to={'/me/notify'} id='notify' onClick={this.changeIsClicked}>
                        <FontAwesomeIcon icon={faBell} />
                        <span>Thông báo</span>
                    </Link>
                    <Link className='menuleft__option-item' to={'/me/list-request'} id='list-request' onClick={this.changeIsClicked}>
                        <FontAwesomeIcon icon={faRing} />
                        <span>Danh sách yêu cầu</span>
                    </Link>
                </div>
            </div>
        );
    }
}

class ContentRight extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            user: {},
            avatar: '',
        };
        this.loadDataUser = this.loadDataUser.bind(this);
        this.changeAvatar = this.changeAvatar.bind(this);
    }

    async componentDidMount() {
        await this.loadDataUser();
    }

    loadDataUser = async () => {
        const response = await fetch(`${origin_url_be}/api/user/credentials`, {
            method: 'get',
            headers: {
                'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json());

        this.setState({
            user: response.result,
        });
    }

    changeAvatar = (avatar: string) => {
        this.setState({
            avatar: avatar,
        });
    }

    render() {
        return (
            <div className='contentright'>
                <ContentRightHeader user={this.state.user} changeAvatar={this.changeAvatar} avatar={this.state.avatar} />
                <ContentRightBody user={this.state.user} loadDataUser={this.loadDataUser} changeAvatar={this.changeAvatar} avatar={this.state.avatar} content_right_body={this.props.content_right_body} />
                <ContentRightFooter />
            </div>
        );
    }
}

function ContentRightHeader(props: any) {
    const [isSmallMenu, setIsSmallMenu] = useState(false);

    const changeIsSmallMenu = () => {

    }

    return (
        <div className='contentrightheader'>
            <div>
                <FontAwesomeIcon icon={faBars} onClick={changeIsSmallMenu} />
            </div>
            <div>
                <span>{props.user.fullname}</span>
                <img src={props.avatar !== '' ? props.avatar : props.user.avatar} alt="" />
            </div>
        </div>
    );
}

function ContentRightFooter(props: any) {
    return (
        <div className='contentrightfooter'>
            <div>
                Dev by <strong>MIRAIJR</strong>
            </div>
            <div>Template <strong>AdminLTE3</strong></div>
        </div>
    );
}

function ContentRightBody(props: any) {
    return (
        <div className=''>
            <Routes>
                <Route path='/profile' element={<UserProfile user={props.user} loadDataUser={props.loadDataUser} changeAvatar={props.changeAvatar} avatar={props.avatar} />}></Route>
                <Route path='/message' element={<div>sdhjdsajd</div>}></Route>
            </Routes>
        </div>
    );
}


