/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link } from 'react-router-dom';
import './CardSlide.sass';

export function CardSlide(props: any) {
    return (
        <div className="slide">
            <Link to={'/comic/' + props.comic.slug} className="slide__thumb">
                <img src={props.comic.thumb} alt="" />
            </Link>
            <Link to={'/comic/' + props.comic.slug} className="slide__name">{props.comic.name}</Link>
        </div>
    );
}

export function CardSlideHome(props: any) {
    return (
        <div className="slide">
            <a href='/' className="slide__thumb">
                <img src={props.image} alt="" />
            </a>
        </div>
    );
}