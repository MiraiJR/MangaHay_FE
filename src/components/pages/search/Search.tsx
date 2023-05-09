import { faFilter, faMagnifyingGlass, faSquarePollVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Grid, Pagination } from "@mui/material";
import React from "react";
import './Search.scoped.sass';
import { CardSlide } from "../../card/Slide/CardSlide";
import slugify from "slugify";
import { Loading, demoAsyncCall } from "../../loading/Loading";

const origin_url_be = 'http://localhost:3000';

export class Search extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isShowSearchAdvanced: false,
            search_name: '',
            filter_author: '',
            filter_genre: [],
            filter_state: '',
            filter_sort: 'az',
            comics: [],
            total_page: '',
        };
        this.changeSearchName = this.changeSearchName.bind(this);
        this.changeFilterAuthor = this.changeFilterAuthor.bind(this);
        this.changeFilterGenre = this.changeFilterGenre.bind(this);
        this.changeFilterState = this.changeFilterState.bind(this);
        this.changeFilterSort = this.changeFilterSort.bind(this);
        this.searchData = this.searchData.bind(this);
        this.calTotalPage = this.calTotalPage.bind(this);
    }

    async componentDidMount() {
        const params = (new URL(window.location.href)).searchParams;

        this.setState({
            search_name: params.get('search_name') ? params.get('search_name') : '',
            filter_author: params.get('filter_author') ? params.get('filter_author') : '',
            filter_genre: params.get('filter_genre') ? params.get('filter_genre')?.split(',') : [],
            filter_state: params.get('filter_state') ? params.get('filter_state') : '',
            filter_sort: params.get('filter_sort') ? params.get('filter_sort') : 'az',
        }, async () => {
            await this.searchData();
        })
    }

    changeIsShowSearchAdvanced = () => {
        this.setState({
            isShowSearchAdvanced: !this.state.isShowSearchAdvanced,
        });
    }

    changeSearchName = (value: any) => {
        this.setState({
            search_name: value,
        });
    }

    changeFilterAuthor = (value: any) => {
        this.setState({
            filter_author: value,
        });
    }

    changeFilterGenre = (value: any, isAdd: boolean) => {
        let temp = this.state.filter_genre;
        if (isAdd) {
            if (!temp.includes(value)) {
                temp.push(value);
            }
        } else {
            temp = temp.filter((ele: any) => ele !== value);
        }
        console.log(temp);
        this.setState({
            filter_genre: temp,
        });
    }
    changeFilterState = (value: any) => {
        this.setState({
            filter_state: value,
        });
    }
    changeFilterSort = (value: any) => {
        this.setState({
            filter_sort: value,
        });
    }

    calTotalPage = (total: any) => {
        if (total % 18 === 0) {
            this.setState({
                total_page: total / 18,
            });
        } else {
            this.setState({
                total_page: ~~(total / 18) + 1,
            });
        }
    }

    searchData = async () => {
        window.history.pushState({}, '', `?comic_name=${this.state.search_name}&filter_author=${this.state.filter_author}&filter_genre=${this.state.filter_genre}&filter_state=${this.state.filter_state}&filter_sort=${this.state.filter_sort}`);

        const response = await fetch(`${origin_url_be}/api/comic/search?` + new URLSearchParams({
            comic_name: this.state.search_name,
            filter_author: this.state.filter_author,
            filter_genre: this.state.filter_genre,
            filter_state: this.state.filter_state,
            filter_sort: this.state.filter_sort,
        }), {
            method: 'get'
        }).then((response) => response.json())

        const response_total = await fetch(`${origin_url_be}/api/comic/search?` + new URLSearchParams({
            comic_name: this.state.search_name,
            filter_author: this.state.filter_author,
            filter_genre: this.state.filter_genre,
            filter_state: this.state.filter_state,
            filter_sort: this.state.filter_sort,
            get_total: 'true',
        }), {
            method: 'get'
        }).then((response) => response.json())

        this.setState({
            comics: response.result,
        });

        this.calTotalPage(response_total.result.length);
    }

    searchDataPage = async (page: any) => {
        this.setState({ isShowLoading: true });

        this.setState({
            comics: [],
        })

        demoAsyncCall().then(async () => {
            const response = await fetch(`${origin_url_be}/api/comic/search?` + new URLSearchParams({
                comic_name: this.state.search_name,
                filter_author: this.state.filter_author,
                filter_genre: this.state.filter_genre,
                filter_state: this.state.filter_state,
                filter_sort: this.state.filter_sort,
                page: page,
            }), {
                method: 'get'
            }).then((response) => response.json())
    
            this.setState({
                isShowLoading: false,
                comics: response.result,
            });
        });
    }

    render() {
        return (
            <div className="searchpage">
                <Container>
                    <div className="boxcard">
                        <div className="boxcard__title">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                            <span>Tìm kiếm</span>
                        </div>
                        <div className="boxcard__body">
                            <FormSearch search_name={this.state.search_name}
                                changeSearchName={this.changeSearchName}
                                searchData={this.searchData}
                            />
                            <div className="searchoptional" onClick={this.changeIsShowSearchAdvanced}>
                                <FontAwesomeIcon icon={faFilter} />
                                <span>Tìm kiếm nâng cao</span>
                            </div>
                            {this.state.isShowSearchAdvanced && <SearchAdvanced filter_author={this.state.filter_author}
                                filter_genre={this.state.filter_genre}
                                filter_state={this.state.filter_state}
                                filter_sort={this.state.filter_sort}
                                changeFilterAuthor={this.changeFilterAuthor}
                                changeFilterGenre={this.changeFilterGenre}
                                changeFilterState={this.changeFilterState}
                                changeFilterSort={this.changeFilterSort} />}
                        </div>
                        <div className="boxcard__footer"></div>
                    </div>
                    <ResultSearch comics={this.state.comics} isShowLoading={this.state.isShowLoading} total_page={this.state.total_page} searchDataPage={this.searchDataPage} />
                </Container>
            </div>
        );
    }
}

function FormSearch(props: any) {
    const changeSearchName = (event: any) => {
        props.changeSearchName(
            event.target.value,
        )
    }

    return (
        <div className="formsearch">
            <input className="formsearch__input" type="text" name="inputsearch" id="inputsearch" placeholder="Tìm kiếm (tối thiểu 2 ký tự)" onChange={changeSearchName} value={props.search_name} />
            <div onClick={props.searchData}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <span>Tìm kiếm</span>
            </div>
        </div>
    );
}

const list_optionstate = {
    'Tất cả': 0,
    'Đang tiến hành': 1,
    'Tạm ngưng': 2,
    'Hoàn thành': 3,
}

const list_optionsort = [
    {
        key: 'A->Z',
        value: 'az',
    },
    {
        key: 'Z->A',
        value: 'za'
    },
    {
        key: 'Mới cập nhật',
        value: 'updatedAt',
    },
    {
        key: 'Được thích nhiều',
        value: 'like',
    },
    {
        key: 'Được xem nhiều',
        value: 'view',
    },
]

class SearchAdvanced extends React.Component<any, any> {
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

    componentDidUpdate() {
        if (this.props.filter_genre) {
            for (const genre of this.props.filter_genre) {
                const genre_slug = slugify(genre, {
                    replacement: '-',
                    remove: undefined,
                    lower: true,
                    strict: false,
                    locale: 'vi',
                    trim: true
                });

                if (document.getElementById(`${genre_slug}`)) {
                    const element_cb = document.getElementById(`${genre_slug}`) as HTMLInputElement;
                    element_cb.checked = true;
                }
            }
        }
    }

    changeFilterAuthor = (event: any) => {
        this.props.changeFilterAuthor(event.target.value);
    }

    changeFilterGenre = (event: any) => {
        this.props.changeFilterGenre(event.target.value, event.target.checked)
    }
    changeFilterState = (event: any) => {
        this.props.changeFilterState(event.target.value)
    }
    changeFilterSort = (event: any) => {
        this.props.changeFilterSort(event.target.value)
    }

    render() {
        return (
            <div className="searchadvanced">
                <Grid container spacing={1} >
                    <Grid item md={4}>
                        <div className="searchadvanced__left">
                            <div>
                                <label htmlFor="inputauthor">Tác giả</label>
                                <input className="formsearch__input" type="text" id="inputauthor" name="inputauthor" value={this.props.filter_author} placeholder="Nhập tên tác giả (có thể bỏ trống)" onChange={this.changeFilterAuthor} />
                            </div>
                            <div>
                                <label htmlFor="inputstate">Tình trạng</label>
                                <select className="formsearch__input" name="inputstate" id="inputstate" onChange={this.changeFilterState}>
                                    {Object.keys(list_optionstate).map((key, value) => (
                                        <option value={key} key={value}>{key}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="">Sắp xếp</label>
                                <select className="formsearch__input" name="inputstate" id="inputstate" onChange={this.changeFilterSort}>
                                    {list_optionsort.map((ele: any) => (
                                        <option value={ele.value} key={ele.value}>{ele.key}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </Grid>
                    <Grid item md={8}>
                        <div className="searchadvanced__right">
                            <div>Thể loại</div>
                            <div>
                                <Grid container spacing={1}>
                                    {
                                        this.state.genres && this.state.genres.map((ele: any) => (
                                            <Grid item md={3} key={ele.slug}>
                                                <div>
                                                    <input className="inputgenre__item" id={ele.slug} type="checkbox" name="inputgenre" value={ele.genre} onChange={this.changeFilterGenre}></input>
                                                    <label htmlFor="inputgenre">{ele.genre}</label><br></br>
                                                </div>
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

function ResultSearch(props: any) {
    const searchDataPage = async (event: React.ChangeEvent<unknown>, page: number) => {
        props.searchDataPage(page);
    }

    return (
        <div className="boxcard">
            <div className="boxcard__title">
                <FontAwesomeIcon icon={faSquarePollVertical} />
                <span>Kết quả tìm kiếm</span>
            </div>
            <div className="boxcard__body">
                {props.isShowLoading && <Loading />}
                <Grid container spacing={1.5}>
                    {
                        props.comics.length !== 0 ? props.comics.map((comic: any) => (
                            <Grid item md={2} key={comic.id}>
                                <CardSlide comic={comic} />
                            </Grid>
                        )) : <div className="resultsearch-no">{!props.isShowLoading && <span>Không tìm thấy kết quả hợp lệ</span>}</div>
                    }
                </Grid>
            </div>
            {
                props.total_page &&
                <div className="boxcard__pagination">
                    <Pagination count={props.total_page} onChange={searchDataPage} color="secondary" />
                </div>
            }

            <div className="boxcard__footer"></div>
        </div>
    );
}