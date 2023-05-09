/* eslint-disable @typescript-eslint/no-useless-constructor */
import React from "react";
import { BoxComic } from "./BoxComic/BoxComic";
import { SlideComic } from "./SlideComic/SlideComic";
import { Container, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import { NavigationCategory } from "../../navigation/category/NavigationCategory";
import { Ranking } from "../../ranking/Ranking";
import './Home.sass';

export class Home extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                <div style={{'position': 'relative',}}>
                    <SlideComic />
                    <NavigationCategory />
                </div>
                <Container style={{'marginTop': '50px'}}>
                    <Grid container spacing={0} columnSpacing={{ xs: 0.5, sm: 1, md: 2 }}>
                        <Grid className="boxcard" item xs={6} md={8} style={{'height': 'max-content', 'padding': '0px 20px 10px'}}>
                            <div className="boxcard__title">
                                <FontAwesomeIcon icon={faFire} />
                                <span>Truyện hot trong ngày</span>
                            </div>
                            <div className="boxcard__body">
                                <BoxComic />
                            </div>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <Ranking />
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}