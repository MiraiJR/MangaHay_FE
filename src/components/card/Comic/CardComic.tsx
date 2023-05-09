import { faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './CardComic.sass';
import { useEffect, useState } from "react";
import moment from 'moment';
import { Link } from "react-router-dom";

export function CardComic(props: any) {
    const [isNew, SetIsNew] = useState(false);

    const checkNewComic = () => {
        const start_date = moment(props.comic.updatedAt);
        const end_date = moment().startOf('day');
        const diff = moment.duration(end_date.diff(start_date)).asDays();

        if (diff > 1) {
            SetIsNew(false);
        } else {
            SetIsNew(true);
        }
    }

    useEffect(() => {
        checkNewComic();
    })

    return (
        <div className="comic">
            <Link to={'/comic/' + props.comic.slug} className="comic__thumb">
                <img src={props.comic.thumb} alt="" />
            </Link>
            <div className="comic__chapter">
                {props.comic.new_chapter && <Link to={'/comic/' + props.comic.slug + '/' + props.comic.new_chapter.slug}>{props.comic.new_chapter.name}</Link>}
                <span>{formateDate(props.comic.updatedAt)}</span>
            </div>
            <Link to={'/comic/' + props.comic.slug} className="comic__name">{props.comic.name}</Link>
            <div className="comic__evaluate">
                <div>
                    <span>{props.comic.star}</span>
                    <FontAwesomeIcon icon={faStar} />
                </div>
                <div>
                    <span>{props.comic.follow}</span>
                    <FontAwesomeIcon icon={faUser} />
                </div>
            </div>
            {isNew && <img className="comic-new" src="https://www.seekpng.com/png/full/825-8254445_new-png.png" alt="" />}
        </div>
    );
}

function formateDate(date: any) {
    return moment(date).format('DD/MM/YYYY');
}