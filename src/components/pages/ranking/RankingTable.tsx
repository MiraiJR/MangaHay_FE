import React from "react";
import './RankingTable.scoped.sass';
import { Container, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart, faSquarePollVertical, faUser } from "@fortawesome/free-solid-svg-icons";
import { CardSlide } from "../../card/Slide/CardSlide";
import { Loading, demoAsyncCall } from "../../loading/Loading";

const origin_url_be = 'http://localhost:3000';

export class RankingTable extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            comics: [],
            field: 'view',
            isShowLoading: false,
        };
        this.clickViewRanking = this.clickViewRanking.bind(this);
        this.clickLikeRanking = this.clickLikeRanking.bind(this);
        this.clickFollowRanking = this.clickFollowRanking.bind(this);
        this.getData = this.getData.bind(this);
    }

    async componentDidMount() {
        this.setState({
            isShowLoading: true,
        });

        const comics = await this.getData();
        this.setState({
            isShowLoading: false,
            comics: comics,
        });
    }

    async componentDidUpdate() {
        
    }

    getData = async () => {
        const response = await fetch(`${origin_url_be}/api/comic/ranking?` + new URLSearchParams({
            field: this.state.field,
            limit: '18',
        }), {
            method: 'get'
        }).then((response) => response.json())

        return response.result;
    }

    clickViewRanking = async (event: any) => {
        event.target.classList.add("rankingtable__navigate-active");
        document.getElementsByClassName('rankingtable__navigate-like')[0].classList.remove("rankingtable__navigate-active")
        document.getElementsByClassName('rankingtable__navigate-follow')[0].classList.remove("rankingtable__navigate-active")

        this.setState({
            field: 'view',
            isShowLoading: true,
            comics: [],
        });

        demoAsyncCall().then(async () => {
            const comics = await this.getData();
            this.setState({
                comics: comics,
                isShowLoading: false,
            });
        });
    }

    clickLikeRanking = async (event: any) => {
        event.target.classList.add("rankingtable__navigate-active");
        document.getElementsByClassName('rankingtable__navigate-view')[0].classList.remove("rankingtable__navigate-active")
        document.getElementsByClassName('rankingtable__navigate-follow')[0].classList.remove("rankingtable__navigate-active")

        this.setState({
            field: 'like',
            isShowLoading: true,
            comics: [],
        });

        demoAsyncCall().then(async () => {
            const comics = await this.getData();
            this.setState({
                comics: comics,
                isShowLoading: false,
            });
        });
       
    }

    clickFollowRanking = async (event: any) => {
        event.target.classList.add("rankingtable__navigate-active");
        document.getElementsByClassName('rankingtable__navigate-view')[0].classList.remove("rankingtable__navigate-active")
        document.getElementsByClassName('rankingtable__navigate-like')[0].classList.remove("rankingtable__navigate-active")
        this.setState({
            field: 'follow',
            isShowLoading: true,
            comics: [],
        });

        demoAsyncCall().then(async () => {
            const comics = await this.getData();
            this.setState({
                comics: comics,
                isShowLoading: false,
            });
        });
    }

    render() {
        return (
            <div>
                <div className="rankingtable">
                    <img src="https://static.fanfox.net/v202020210123121/mangafox/images/banner-rank.png" alt="" />
                    <div className="rankingtable__navigate">
                        <div className="rankingtable__navigate-view rankingtable__navigate-active" onClick={this.clickViewRanking}>
                            <FontAwesomeIcon icon={faEye} />
                            <span>Đọc nhiều nhất</span>
                        </div>
                        <div className="rankingtable__navigate-like" onClick={this.clickLikeRanking}>
                            <FontAwesomeIcon icon={faHeart} />
                            <span>Yêu thích nhiều</span>
                        </div>
                        <div className="rankingtable__navigate-follow" onClick={this.clickFollowRanking}>
                            <FontAwesomeIcon icon={faUser} />
                            <span>Theo dõi nhiều nhất</span>
                        </div>
                    </div>
                </div>
                <Container>
                    <ResultRanking comics={this.state.comics} isShowLoading={this.state.isShowLoading} />
                </Container>
            </div>
        );
    }
}

function ResultRanking(props: any) {
    return (
        <div className="boxcard">
            <div className="boxcard__title">
                <FontAwesomeIcon icon={faSquarePollVertical} />
                <span>Kết quả</span>
            </div>
            <div className="boxcard__body">
                {props.isShowLoading && <Loading />}
                <Grid container spacing={1.5}>
                    {
                        props.comics && props.comics.map((ele: any) => (
                            <Grid item md={2} key={ele.id}>
                                <CardSlide comic={ele} />
                            </Grid>
                        ))
                    }
                </Grid>
            </div>
            <div className="boxcard__footer"></div>
        </div>
    );
}