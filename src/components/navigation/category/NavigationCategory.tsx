import { Link } from 'react-router-dom';
import './NavigationCategory.sass';

const list_genre = [
    'Action',
    'Isekai',
    'Demons',
    'Manhua',
    'Romance',
    'Drama',
    'School',
    'Shounen',
    'Yaoi',
    'Manhwa',
    'Manga',
];

export function NavigationCategory(props: any) {

    return (
        <div className="menucategory">
            {
                list_genre.map((ele) => (
                    <Link className='menucategory__item' to={'/search?filter_genre=' + ele + '&advance=true'}>{ele.toUpperCase()}</Link>
                ))
            }
        </div>
    );
}