import React, { useEffect } from "react";
import './ChapterDetail.sass';
import { Container } from "@mui/material";
import { faBackward, faBars, faForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BoxComment } from "../../comment/BoxComment";
import { Link } from "react-router-dom";

const origin_url_be = 'http://localhost:3000';

export class ChapterDetail extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isShowMenuChapter: false,
            comic: {},
            chapters: [],
            chapter: {},
            next_chapter: {},
            pre_chapter: {},
        }
        this.changeIsShowMenuChapter = this.changeIsShowMenuChapter.bind(this);

    }

    async componentDidMount() {
        const slug_comic = window.location.href.split('/')[window.location.href.split('/').length - 2];
        const slug_chapter = window.location.href.split('/')[window.location.href.split('/').length - 1];

        this.setState({
            slug_comic: slug_comic,
            slug_chapter: slug_chapter,
        });

        await fetch(
            `${origin_url_be}/api/comic/${slug_comic}/increment?` + new URLSearchParams({
                field: 'view',
                jump: '1',
            })
        );

        const response = await fetch(
            `${origin_url_be}/api/comic/${slug_comic}`
        ).then((response) => response.json());

        this.setState({
            comic: response.result.comic,
            chapters: response.result.chapters,
        });

        for (let i = 0; i < response.result.chapters.length; i++) {
            if (response.result.chapters[i].slug === slug_chapter) {
                this.setState({
                    chapter: response.result.chapters[i],
                    next_chapter: response.result.chapters[i - 1] || response.result.chapters[response.result.chapters.length - 1],
                    pre_chapter: response.result.chapters[i + 1] || response.result.chapters[0],
                });
                break;
            }
        }
    }

    changeIsShowMenuChapter = () => {
        this.setState({
            isShowMenuChapter: !this.state.isShowMenuChapter
        })
    }

    render() {
        return (
            <Container>
                <ComicInformation comic={this.state.comic} cur_chapter={this.state.chapter} />
                <MenuNavigateChapter changeIsShowMenuChapter={this.changeIsShowMenuChapter} slug_comic={this.state.slug_comic} pre_chapter={this.state.pre_chapter} next_chapter={this.state.next_chapter} />
                <div className="chapterdetail">
                    <div>
                        {this.state.chapter.images && this.state.chapter.images.map((ele: any) => (
                            <img src={ele} alt="" />
                        ))}
                    </div>
                </div>
                <MenuNavigateChapter changeIsShowMenuChapter={this.changeIsShowMenuChapter} slug_comic={this.state.slug_comic} pre_chapter={this.state.pre_chapter} next_chapter={this.state.next_chapter} />
                <BoxComment />
                {this.state.isShowMenuChapter && <MenuChapter chapters={this.state.chapters} slug_comic={this.state.slug_comic} slug_chapter={this.state.slug_chapter} />}
            </Container>
        );
    }
}

function ComicInformation(props: any) {
    return (
        <div className="comicinformationparent">
            <div className="comicinformation">
                <Link className="comicinformation__thumb" to={'/comic/' + props.comic.slug}>
                    <img src={props.comic.thumb} alt="" />
                </Link>
                <Link className="comicinformation__name" to={'/comic/' + props.comic.slug}>{props.comic.name}</Link>
                <div className="comicinformation__chapter">{props.cur_chapter.name}</div>
            </div>
        </div>
    );
}

function MenuNavigateChapter(props: any) {
    var changeIsShowMenuChapter = props.changeIsShowMenuChapter;

    return (
        <div className="menunavigatechapter">
            <a href={props.pre_chapter && '/comic/' + props.slug_comic + '/' + props.pre_chapter.slug}>
                <FontAwesomeIcon icon={faBackward} />
            </a>
            <div onClick={() => changeIsShowMenuChapter('haha')}>
                <FontAwesomeIcon icon={faBars} />
            </div>
            <a href={props.next_chapter && '/comic/' + props.slug_comic + '/' + props.next_chapter.slug}>
                <FontAwesomeIcon icon={faForward} />
            </a>
        </div>
    );
}

function MenuChapter(props: any) {
    useEffect(() => {
        document.getElementById(`${props.slug_chapter}`)?.classList.add("menuchapter__item-active");
    })

    return (
        <div className="menuchapter">
            {
                props.chapters.map((ele: any) => (
                    <a href={'/comic/' + props.slug_comic + '/' + ele.slug} className="menuchapter__item" id={ele.slug} key={ele.slug}>{ele.name}</a>
                ))
            }
        </div>
    );
}