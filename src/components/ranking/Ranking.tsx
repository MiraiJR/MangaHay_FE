import { faFireFlameCurved } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Ranking.sass';
import { useState } from "react";
import { Link } from "react-router-dom";

const origin_url_be = 'http://localhost:3000';
const list_top = Array.from(Array(9).keys());

export function Ranking(props: any) {
    const [comics, SetComics] = useState([]);

    useState(async () => {
        const response = await fetch(`${origin_url_be}/api/comic/ranking?` + new URLSearchParams({
            field: 'view',
            limit: '9',
        }), {
            method: 'get'
        }).then((response) => response.json())

        SetComics(response.result);
    })

    return (
        <div className="boxcard ranking">
            <div className="boxcard__title ranking__title">
                <FontAwesomeIcon icon={faFireFlameCurved} />
                <span>Truyện tranh phổ biến</span>
            </div>
            <div className="boxcard__body ranking__body">
                {list_top.map((ele) => (
                    <Comic top={ele + 1} comic={comics[ele]} />
                ))}
            </div>
        </div>
    );
}

function Comic(props: any) {
    return (
        <div>
            {props.comic &&
                <Link to={'/comic/' + props.comic.slug} className="comicranking">
                    <div className={"comicranking__top comicranking__top-" + props.top}>{props.top}</div>
                    <img className="comicranking__thumb" src={props.comic.thumb} alt="" />
                    <div className="comicranking__name">{props.comic.name}</div>
                </Link>}
        </div>

    );
}