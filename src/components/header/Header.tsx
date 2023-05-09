/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import '../../styles/constant.css';
import logo from '../../public/images/logo_web.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faBook, faEarthAmericas, faHeart, faMagnifyingGlass, faRankingStar } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { Container, Grid, Skeleton } from "@mui/material";
import './Header.sass';
import { relativeTime } from "../../utils/helpers";
import { toast } from "react-toastify";
import { toast_config } from "../../config/toast.config";
import { io } from "socket.io-client";

const origin_url_be = 'http://localhost:3000';

export class Header extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLoggedIn: false,
            user: {},
            notifies: [],
            unread_notifies: 0,
        }
        this.getNotifies = this.getNotifies.bind(this);
        this.getUnreadNotifies = this.getUnreadNotifies.bind(this);
    }

    async componentDidMount() {
        // kiem tra login
        if (sessionStorage.getItem("access_token")) {
            const socket = io("localhost:3000", {
                extraHeaders: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `${sessionStorage.getItem("access_token")}`,
                },
            });

            socket.on('notification_user', async (response) => {
                toast.success(response.body.toString(), toast_config);
                await this.getNotifies();
                await this.getUnreadNotifies();
            });

            this.setState({
                isLoggedIn: true,
            });

            const response = await fetch(`${origin_url_be}/api/user/credentials`, {
                method: 'GET',
                headers: {
                    'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json',
                },
            }).then((response) => response.json());

            const response_notify = await fetch(`${origin_url_be}/api/user/notifies`, {
                method: 'get',
                headers: {
                    'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json',
                },
            }).then((response) => response.json());

            const response_unread = await fetch(`${origin_url_be}/api/notify/unread-notifies/count`, {
                method: 'get',
                headers: {
                    'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json',
                },
            }).then((response) => response.json());

            this.setState({
                notifies: response_notify.result,
                user: response.result,
                unread_notifies: response_unread.result,
            })
        }
    }

    getNotifies = async () => {
        const response_notify = await fetch(`${origin_url_be}/api/user/notifies`, {
            method: 'get',
            headers: {
                'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json());

        this.setState({
            notifies: response_notify.result,
        })
    }

    getUnreadNotifies = async () => {
        const response_unread = await fetch(`${origin_url_be}/api/notify/unread-notifies/count`, {
            method: 'get',
            headers: {
                'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json());

        this.setState({
            unread_notifies: response_unread.result,
        })
    }

    render() {
        return (
            <div id={this.props.id}>
                <Container id="app__header-modify">
                    <Left />
                    <Right getNotifies={this.getNotifies} getUnreadNotifies={this.getUnreadNotifies} isLoggedIn={this.state.isLoggedIn} user={this.state.user} notifies={this.state.notifies} unread_notifies={this.state.unread_notifies} />
                </Container>
            </div>
        );
    }
}

function Left() {
    const [isShowMenuGenres, SetIsShowMenuGenres] = useState(false);

    const showMenuGenres = () => {
        SetIsShowMenuGenres(!isShowMenuGenres);
    }

    return (
        <div className='left'>
            <a href="/">
                <img src={logo} alt="" />
            </a>
            <ul className="left__list">
                <li className="list__item list__item-active" onClick={showMenuGenres}>
                    <FontAwesomeIcon icon={faBook} className="item__icon" />
                    <span className="item__text">Thể loại</span>
                </li>
                <a href="/history" className="list__item">
                    <FontAwesomeIcon icon={faClock} className="item__icon" />
                    <span className="item__text">Lịch sử</span>
                </a>
                <a href="/ranking" className="list__item">
                    <FontAwesomeIcon icon={faRankingStar} className="item__icon" />
                    <span className="item__text">BXH</span>
                </a>
                {isShowMenuGenres && <MenuGenres />}
            </ul>
        </div>
    );
}

function Right(props: any) {
    return (
        <div className="right">
            <a href="/search" className="right__search">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </a>
            {props.isLoggedIn ? <User getNotifie={props.getNotifies} getUnreadNotifies={props.getUnreadNotifies} isLoggedIn={props.isLoggedIn} user={props.user} notifies={props.notifies} unread_notifies={props.unread_notifies} /> : <Guest isLoggedIn={props.isLoggedIn} />}
        </div>
    );
}

function User(props: any) {
    const logout = async () => {
        await fetch(`${origin_url_be}/api/auth/logout`, {
            method: 'GET',
            headers: {
                'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                'Content-Type': 'application/json'
            }
        })

        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");

        window.location.href = '/';
    }

    const [isShowMenu, SetIsShowMenu] = useState(false);
    const [isShowNotify, SetIsShowNotify] = useState(false);

    const Menu = () => {
        return (
            <ul className="user__menu">
                <a href="/me/profile" className="menu__item">
                    <FontAwesomeIcon icon={faAddressCard} />
                    <span className="item__text">Trang cá nhân</span>
                </a>
                <a href="/me/comic-favorite" className="menu__item">
                    <FontAwesomeIcon icon={faHeart} />
                    <span className="item__text">Sách yêu thích</span>
                </a>
                <li className="menu__item" onClick={logout}>
                    <span className="item__text">Đăng xuất</span>
                </li>
            </ul>
        );
    }


    const showMenu = () => {
        SetIsShowMenu(!isShowMenu);

        if (isShowNotify) {
            SetIsShowNotify(false);
        }
    }

    const showNotify = (e: any) => {
        SetIsShowNotify(!isShowNotify);

        if (isShowMenu) {
            SetIsShowMenu(false);
        }
    }

    return (
        <div className="user">
            <div className="user__notify" onClick={showNotify}>
                <FontAwesomeIcon icon={faEarthAmericas} />
                <div className="user__notify-after">{props.unread_notifies}</div>
                {isShowNotify && <UserNotify getNotifie={props.getNotifie} getUnreadNotifies={props.getUnreadNotifies} notifies={props.notifies} unread_notifies={props.unread_notifies} />}
            </div>
            <div className="user__main" onClick={showMenu}>
                {props.user.fullname ?
                    <span className="user__name">{props.user.fullname}</span>
                    : <Skeleton variant="rectangular" width={100} height={20} animation="wave"  sx={{ bgcolor: '#8f97a4' }}/>
                }
                {props.user.avatar ?
                    <img className="user__avatar" src={props.user.avatar} alt="" />
                    : <Skeleton variant="circular" width={50} height={50} animation="wave"  sx={{ bgcolor: '#8f97a4' }}/>
                }
                {isShowMenu && <Menu />}
            </div>
        </div>
    );
}

function UserNotify(props: any) {
    const changeStateNotify = (id_notify: any) => {
        fetch(`${origin_url_be}/api/notify/change-state/${id_notify}`, {
            method: 'put',
            headers: {
                'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json())
    }

    const changeStateUnread = async () => {
        await fetch(`${origin_url_be}/api/notify/change-state/all/unread`, {
            method: 'put',
            headers: {
                'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                'Content-Type': 'application/json',
            },
        });

        props.getNotifie()
        props.getUnreadNotifies()
    }

    return (
        <ul className="notify__list">
            <div className="notify__header">
                <span>Thông báo</span>
                <span onClick={changeStateUnread}>Đánh dấu đã đọc tất cả</span>
            </div>
            <div className="notify__body">
                {props.notifies.length === 0 && <div style={{ "padding": "10px", "textAlign": "center", }}>Không có bất kỳ thông báo nào!</div>}
                {props.notifies && props.notifies.map((ele: any) => (
                    <a className="notify__list-item" href={ele.redirect_url} key={ele.id} onClick={() => changeStateNotify(ele.id)}>
                        <li className={ele.is_read ? "notify__item notify__item-read" : "notify__item"}>
                            <img className="item__thumb" src={ele.thumb} alt="" />
                            <div className="item__body">
                                <div>{ele.title.toUpperCase()}</div>
                                <div>{ele.body}</div>
                                <div>{relativeTime(ele.createdAt)}</div>
                            </div>
                        </li>
                    </a>
                ))}
            </div>
            <div className="notify__footer">
                <span>Xem tất cả</span>
            </div>
        </ul>
    );
}

function Guest(props: any) {
    return (
        <div>
            <a href="/auth/login" className="button">Đăng nhập</a>
            <a href="/auth/register" className="button button-active">Đăng ký</a>
        </div>
    );
}

class MenuGenres extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            genres: [],
        };
    }

    async componentDidMount() {
        const response = await fetch(`${origin_url_be}/api/comic/genres`, {
            method: 'get',
        }).then((response) => response.json());

        this.setState({
            genres: response.result,
        });
    }

    render() {
        return (
            <div className="menugenres">
                <Grid container spacing={1}>
                    {
                        this.state.genres && this.state.genres.map((ele: any) => (
                            <Grid item md={2} key={ele.genre}>
                                <a className="menugenres__item" href={'/search?filter_genre=' + ele.genre + '&advance=true'}>{ele.genre}</a>
                            </Grid>
                        ))
                    }
                </Grid>
            </div>
        );
    }
}