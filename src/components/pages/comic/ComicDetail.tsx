import React from "react";
import './ComicDetail.scoped.sass';
import { Container, Grid, Skeleton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { BoxComment } from "../../comment/BoxComment";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { toast_config } from "../../../config/toast.config";
import { checkExistedComicInHistory, relativeTime } from "../../../utils/helpers";
import { Loading, demoAsyncCall } from "../../loading/Loading";

const list_star = Array.from(Array(5).keys());
const origin_url_be = 'http://localhost:3000';

export class ComicDetail extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            comic: {},
            chapters: [],
            first_chapter: {},
            slug_comic: '',
            comics_author: [],
            isShowLoading: false,
        };

        this.updateComic = this.updateComic.bind(this);
    }

    async componentDidMount() {
        const slug_comic = window.location.href.split('/')[window.location.href.split('/').length - 1];

        this.setState({
            slug_comic: slug_comic,
            isShowLoading: true,
        });

        await fetch(
            `${origin_url_be}/api/comic/${slug_comic}/increment?` + new URLSearchParams({
                field: 'view',
                jump: '1',
            })
        );

        demoAsyncCall().then(async () => {
            const response = await fetch(
                `${origin_url_be}/api/comic/${slug_comic}`
            ).then((response) => response.json());

            if (response.result.comic.authors.length !== 0 && response.result.comic.authors[0] !== 'Đang cập nhật') {
                const response_comics_author = await fetch(`${origin_url_be}/api/comic/search?` + new URLSearchParams({
                    comic_name: '',
                    filter_author: response.result.comic.authors[0],
                    filter_genre: '',
                    filter_state: '',
                    filter_sort: 'az',
                }), {
                    method: 'get'
                }).then((response) => response.json())

                this.setState({
                    comics_author: response_comics_author.result,
                });
            }

            this.setState({
                comic: response.result.comic,
                chapters: response.result.chapters,
                first_chapter: response.result.chapters[response.result.chapters.length - 1],
                isShowLoading: false,
            });

            // lưu vào history 
            const temp_history = JSON.parse(localStorage.getItem('history') || "[]");
            if (!checkExistedComicInHistory(response.result.comic, temp_history)) {
                temp_history.push(response.result.comic);
                localStorage.setItem('history', JSON.stringify(temp_history));
            }
        });
    }

    updateComic = (update_comic: any) => {
        this.setState({
            comic: update_comic,
        });
    }

    render() {
        return (
            <div>
                <HeaderComic comic={this.state.comic} first_chapter={this.state.first_chapter} updateComic={this.updateComic} />
                <Container>
                    <Grid container spacing={1} rowSpacing={1} columnSpacing={{ md: 1 }}>
                        <Grid item md={8}>
                            <BodyComicLeft isShowLoading={this.state.isShowLoading} chapters={this.state.chapters} slug_comic={this.state.slug_comic} />
                            <BoxComment id_comic={this.state.comic.id} />
                        </Grid>
                        <Grid item md={4}>
                            <BodyComicRight isShowLoading={this.state.isShowLoading} authors={this.state.comic.authors} comics_author={this.state.comics_author} />
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}

class HeaderComic extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLike: false,
            isFollow: false,
            isEvalute: false,
            percent_rating: { "width": "0%" },
        };

        this.percentRatingStar = this.percentRatingStar.bind(this);
    }

    async componentDidMount() {
        const slug_comic = window.location.href.split('/')[window.location.href.split('/').length - 1];

        const response_comic = await fetch(
            `${origin_url_be}/api/comic/${slug_comic}`
        ).then((response) => response.json());

        if (sessionStorage.getItem("access_token")) {
            const response = await fetch(`${origin_url_be}/api/user/comic/check?id_comic=${response_comic.result.comic.id}`, {
                method: 'get',
                headers: {
                    'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json',
                },
            }).then((response) => response.json());

            this.setState({
                isLike: response.result.isLike,
                isFollow: response.result.isFollow,
                isEvalute: response.result.isEvaluate,
            })
        }

        this.percentRatingStar(response_comic.result.comic.star);
    }

    evaluteStarComic = async (rate_star: any) => {
        if (!sessionStorage.getItem("access_token")) {
            toast.warn('Bạn cần đăng nhập để thực hiện hành động này!', toast_config);
            return;
        }
        if (this.state.isEvalute) {
            toast.warn("Bạn đã đánh giá rồi!", toast_config);
            return;
        } else {
            const response = await fetch(`${origin_url_be}/api/user/comic?action=evaluate`, {
                method: 'post',
                headers: {
                    'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_comic: this.props.comic.id,
                    rating_star: rate_star + 1,
                }),
            }).then((response) => response.json());

            this.setState({
                isEvalute: true,
            });

            this.props.updateComic({
                ...this.props.comic,
                star: response.result.star,
            });

            this.percentRatingStar(response.result.star);
            if (response.success) {
                toast.success(response.message.toString(), toast_config);
            }
        }

    }

    likeComic = async () => {
        if (!sessionStorage.getItem("access_token")) {
            toast.warn('Bạn cần đăng nhập để thực hiện hành động này!', toast_config);
            return;
        }

        this.setState({
            isLike: !this.state.isLike,
        });

        if (!this.state.isLike) {
            this.props.updateComic({
                ...this.props.comic,
                like: this.props.comic.like + 1,
            });

            // gửi sự kiện yêu thích
            const response = await fetch(`${origin_url_be}/api/user/comic?action=like`, {
                method: 'post',
                headers: {
                    'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_comic: this.props.comic.id,
                }),
            }).then((response) => response.json());

            // tăng lượt yêu thích cho truyện
            fetch(
                `${origin_url_be}/api/comic/${this.props.comic.slug}/increment?` + new URLSearchParams({
                    field: 'like',
                    jump: '1',
                })
            ).then((response) => response.json());

            if (response.success) {
                toast.success(response.message.toString(), toast_config);
            } else {
                toast.warn(response.message.toString(), toast_config);
            }
        } else {
            this.props.updateComic({
                ...this.props.comic,
                like: this.props.comic.like - 1,
            });

            // gửi sự kiện hủy yêu thích
            const response = await fetch(`${origin_url_be}/api/user/comic?action=like`, {
                method: 'delete',
                headers: {
                    'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_comic: this.props.comic.id,
                }),
            }).then((response) => response.json());

            // giảm lượt yêu thích cho truyện
            fetch(
                `${origin_url_be}/api/comic/${this.props.comic.slug}/increment?` + new URLSearchParams({
                    field: 'like',
                    jump: '-1',
                })
            ).then((response) => response.json());

            if (response.success) {
                toast.success(response.message.toString(), toast_config);
            } else {
                toast.warn(response.message.toString(), toast_config);
            }
        }
    }

    followComic = async () => {
        if (!sessionStorage.getItem("access_token")) {
            toast.warn('Bạn cần đăng nhập để thực hiện hành động này!', toast_config);
            return;
        }

        this.setState({
            isFollow: !this.state.isFollow,
        });

        if (!this.state.isFollow) {
            this.props.updateComic({
                ...this.props.comic,
                follow: this.props.comic.follow + 1,
            });

            // gửi sự kiện theo dõi
            const response = await fetch(`${origin_url_be}/api/user/comic?action=follow`, {
                method: 'post',
                headers: {
                    'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_comic: this.props.comic.id,
                }),
            }).then((response) => response.json());

            // tăng lượt follow cho truyện
            fetch(
                `${origin_url_be}/api/comic/${this.props.comic.slug}/increment?` + new URLSearchParams({
                    field: 'follow',
                    jump: '1',
                })
            ).then((response) => response.json());

            if (response.success) {
                toast.success(response.message.toString(), toast_config);
            } else {
                toast.warn(response.message.toString(), toast_config);
            }
        } else {
            this.props.updateComic({
                ...this.props.comic,
                follow: this.props.comic.follow + 1,
            });
            
            // gửi sự kiện hủy theo dõi
            const response = await fetch(`${origin_url_be}/api/user/comic?action=follow`, {
                method: 'delete',
                headers: {
                    'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_comic: this.props.comic.id,
                }),
            }).then((response) => response.json());

            // tăng lượt follow cho truyện
            fetch(
                `${origin_url_be}/api/comic/${this.props.comic.slug}/increment?` + new URLSearchParams({
                    field: 'follow',
                    jump: '-1',
                })
            ).then((response) => response.json());

            if (response.success) {
                toast.success(response.message.toString(), toast_config);
            } else {
                toast.warn(response.message.toString(), toast_config);
            }
        }
    }

    percentRatingStar = (star: number) => {
        const percent_star = star / 5 * 100;
        this.setState({
            percent_rating: { "width": `${percent_star}%` },
        });
    }

    render() {
        return (
            <div className="comicdetail__header">
                {this.props.comic.thumb ?
                    <img className="header__imageblur" src={this.props.comic.thumb} alt="" /> :
                    <Skeleton variant="rectangular" height={350} animation="wave" />}


                <Container>
                    <div className="header__detailinfo">
                        <div className="detailinfo__thumb">
                            {this.props.comic.thumb ?
                                <img src={this.props.comic.thumb} alt="" />
                                : <Skeleton variant="rectangular" height={300} width={200} animation="wave" />
                            }
                        </div>
                        <div className="detailinfo__right">
                            {this.props.comic.name ?
                                <div className="detailinfo__name">
                                    {this.props.comic.name}
                                </div>
                                : <Skeleton variant="rectangular" height={25} animation="wave" />
                            }
                            {this.props.comic.authors ?
                                <div className="detailinfo__author">
                                    <span>Author: </span>
                                    {this.props.comic.authors && this.props.comic.authors.map((ele: any) => (
                                        <Link to={'/search?filter_author=' + ele + '&advance=true'} key={ele}>
                                            {ele}
                                        </Link>
                                    ))}
                                </div>
                                : <Skeleton variant="rectangular" height={20} width={100} animation="wave" />
                            }
                            {this.props.comic.genres ?
                                <div className="detailinfo__genre">
                                    {this.props.comic.genres && this.props.comic.genres.map((ele: any) => (
                                        <Link to={'/search?filter_genre=' + ele + '&advance=true'}>
                                            {ele}
                                        </Link>
                                    ))}
                                </div>
                                : <Skeleton variant="rectangular" height={20} width={100} animation="wave" />
                            }

                            {
                                this.props.comic.brief_desc ?
                                    <div className="detailinfo__brief" dangerouslySetInnerHTML={{ __html: this.props.comic.brief_desc }}>
                                    </div>
                                    : <Skeleton variant="rectangular" height={20} animation="wave" />
                            }
                            <div className="detailinfo__evaluate">
                                <div className="detailinfo__evaluate-star">
                                    <span className="evaluate__star-default">
                                        <span>
                                            <span style={this.state.percent_rating}>
                                                {list_star.map((ele) => (
                                                    <FontAwesomeIcon className={'evaluate__star'} icon={faStar} onClick={() => this.evaluteStarComic(ele)} style={{ 'cursor': 'pointer' }} />
                                                ))}
                                            </span>
                                        </span>

                                        <span className="evaluate__star-copy2">
                                            {list_star.map((ele) => (
                                                <FontAwesomeIcon className={'evaluate__star'} icon={faStar} onClick={() => this.evaluteStarComic(ele)} style={{ 'cursor': 'pointer' }} />
                                            ))}
                                        </span>
                                    </span>
                                    <span>{this.props.comic.star}</span>
                                </div>
                                <div>
                                    <span>Lượt xem: </span>
                                    <span>{this.props.comic.view}</span>
                                </div>
                                <div>
                                    <span>Lượt thích: </span>
                                    <span>{this.props.comic.like}</span>
                                </div>
                                <div>
                                    <span>Lượt theo dõi: </span>
                                    <span>{this.props.comic.follow}</span>
                                </div>
                            </div>
                            <div className="detailinfo__action">
                                <Link to={'/comic/' + this.props.comic.slug + '/' + this.props.first_chapter.slug} className="button-yellow button-flex button">
                                    <span>Đọc ngay</span>
                                </Link>
                                <button className={this.state.isLike ? "button-modify button-red button-flex button" : "button-red button-flex button"} onClick={this.likeComic}>
                                    <FontAwesomeIcon icon={faHeart} />
                                    <span>{this.state.isLike ? 'Đã yêu thích' : 'Thêm vào danh sách yêu thích'}</span>
                                </button>
                                <button id="button-follow" className={this.state.isFollow ? "button-modify button-blue button-flex button" : "button-blue button-flex button"} onClick={this.followComic}>
                                    <span>{this.state.isFollow ? 'Đang theo dõi' : 'Theo dõi'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

function BodyComicLeft(props: any) {
    return (
        <div className="boxcard">
            <div className="boxcard__title">
                <FontAwesomeIcon icon={faFire} />
                <span>{props.chapters.length} Chapter</span>
            </div>
            <div className="boxcard__body boxcard__body-left">
                {props.isShowLoading && <Loading />}
                <Grid container spacing={1}>
                    {
                        props.chapters.map((ele: any) => (
                            <Grid item md={6} key={ele.id}>
                                <BodyComicChapter chapter={ele} slug_comic={props.slug_comic} />
                            </Grid>
                        ))
                    }

                </Grid>
            </div>
            <div className="boxcard__footer"> </div>
        </div>
    );
}

function BodyComicRight(props: any) {
    return (
        <div className="boxcard">
            <div className="boxcard__title">
                <FontAwesomeIcon icon={faFire} />
                {props.authors ?
                    <span>Tác phẩm cùng tác giả
                        {
                            props.authors && props.authors.map((ele: any) => (
                                <span>{ele}</span>
                            ))
                        }
                    </span>
                    : <Skeleton variant="rectangular" height={25} width={200} animation="wave" sx={{ bgcolor: '#ccc' }} />
                }
            </div>
            <div className="boxcard__body">
                {props.isShowLoading && <Loading />}
                <Grid container spacing={1}>
                    <Grid item md={12}>
                        {
                            props.comics_author && props.comics_author.map((ele: any) => (
                                <BodyComicAuthor key={ele.id} comic={ele} />
                            ))
                        }
                    </Grid>
                </Grid>
            </div>
            {props.comics_author.length !== 0 && <a href="/" className="boxcard__footer">Xem thêm</a>}
        </div>
    );
}

function BodyComicChapter(props: any) {
    return (
        <Link to={'/comic/' + props.slug_comic + '/' + props.chapter.slug} className="bodycomicchapter">
            <span>{props.chapter.name}</span>
            <span>{relativeTime(props.chapter.updatedAt)}</span>
        </Link>
    );
}

function BodyComicAuthor(props: any) {
    return (
        <a href={'/comic/' + props.comic.slug} className='bodycomicauthor'>
            <img src={props.comic.thumb} alt="" />
            <div>
                {props.comic.name}
            </div>
        </a>
    );
}