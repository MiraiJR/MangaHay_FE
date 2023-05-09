import { faFire, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Grid } from "@mui/material";
import React from "react";
import './History.sass';
import { CardSlide } from "../../card/Slide/CardSlide";

export class History extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            comics: [],
        };

        this.changeHistory = this.changeHistory.bind(this);
    }

    componentDidMount() {
        this.setState({
            comics: JSON.parse(localStorage.getItem('history') || "[]"),
        });
    }

    changeHistory = (comic: any) => {
        const temp_history = this.state.comics.filter((ele: any) => ele.id !== comic.id);
        
        // cập nhật lại history trong local
        localStorage.setItem('history', JSON.stringify(temp_history));

        this.setState({
            comics: temp_history,
        });
    }

    render() {
        return (
            <div className="history">
                <Container>
                    <div className="boxcard">
                        <div className="boxcard__title">
                            <FontAwesomeIcon icon={faFire} />
                            <span>Lịch sử</span>
                        </div>
                        <div className="boxcard__body">
                            <Grid container spacing={1}>
                                {
                                    this.state.comics.map((ele: any) => (
                                        <Grid item md={2} key={ele.id}>
                                            <CardComicHistory comic={ele} changeHistory={this.changeHistory}/>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </div>
                        {/* <a href="/" className="boxcard__footer">Xem thêm</a> */}
                    </div>
                </Container>
            </div>
        );
    }
}

function CardComicHistory(props: any) {
    const removeComicHistory = () => {
        props.changeHistory(props.comic);
    }

    return (
        <div className="cardcomichistory">
            <CardSlide comic={props.comic} />
            <button className="button button-delete" onClick={removeComicHistory}>
                <FontAwesomeIcon icon={faXmark} />
                <span>Xóa</span>
            </button>
        </div>
    );
}