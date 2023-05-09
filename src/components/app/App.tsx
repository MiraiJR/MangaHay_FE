import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Header } from '../header/Header'
import React from 'react'
import { Footer } from '../footer/Footer';
import './App.sass';
import { Home } from '../pages/home/Home';
import { ComicDetail } from '../pages/comic/ComicDetail';
import { ChapterDetail } from '../pages/chapter/ChapterDetail';
import { History } from '../pages/history/History';
import { AuthRegister } from '../pages/auth/register/Register';
import { AuthLogin } from '../pages/auth/login/Login';
import { Search } from '../pages/search/Search';
import { RankingTable } from '../pages/ranking/RankingTable';
import { UserPage } from '../pages/user/User';
import { ToastContainer } from 'react-toastify';
import movetotop_icon from '../../public/images/movetotop_icon.png';
import { ForgetPassword } from '../pages/auth/forget-password/ForgetPassword';
import { ChangePassword } from '../pages/auth/change-password/ChangePwd';

export class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isShowLayout: true,
        };
    }

    componentDidMount() {
    }

    hideLayout = (value: boolean) => {
        this.setState({
            isShowLayout: false,
        });
    }

    render() {
        return (
            <div id='app'>
                {this.state.isShowLayout && <Header id="app__header" />}
                <div id='app__body'>
                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<Home />}></Route>
                            <Route path='/comic/:comic' element={<ComicDetail />}></Route>
                            <Route path='/comic/:comic/:chapter' element={<ChapterDetail />}></Route>
                            <Route path='/history' element={<History />}></Route>
                            <Route path='/auth/register' element={<AuthRegister />}></Route>
                            <Route path='/auth/login' element={<AuthLogin />}></Route>
                            <Route path='/search' element={<Search />}></Route>
                            <Route path='/ranking' element={<RankingTable />}></Route>
                            <Route path='/me/*' element={<UserPage hideLayout={this.hideLayout} />}></Route>
                            <Route path='/auth/forget-password' element={<ForgetPassword />}></Route>
                            <Route path='/auth/change-password' element={<ChangePassword />}></Route>
                        </Routes>
                    </BrowserRouter>
                </div>
                {this.state.isShowLayout && <Footer id='app__footer' />}
                <MoveToTop />
                <ToastContainer autoClose={1500} />
            </div>
        );
    }
}

function MoveToTop(props: any) {
    const moveToTop = () => {
        document.getElementById("app__header")?.scrollIntoView({
            behavior: 'smooth'
        });
    }

    return (
        <div className='movetotop' onClick={moveToTop}>
            <img src={movetotop_icon} alt="" />
        </div>
    );
}