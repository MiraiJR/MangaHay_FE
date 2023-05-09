/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Grid, Pagination } from "@mui/material";
import React from "react";
import { CardComic } from "../../../card/Comic/CardComic";
import { Loading, demoAsyncCall } from "../../../loading/Loading";

const origin_url_be = 'http://localhost:3000';

export class BoxComic extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            comics: [],
            total: 0,
            isShowLoading: false,
        }
        this.getDataPage = this.getDataPage.bind(this);
    }

    async componentDidMount() {
        this.setState({ isShowLoading: true });
        
        demoAsyncCall().then(async () => {
            const response = await fetch(
                `${origin_url_be}/api/comic`
            ).then((response) => response.json());

            this.calTotalPage(response.total);

            this.setState({ isShowLoading: false, comics: response.result})
        });
    }

    getDataPage = async (event: React.ChangeEvent<unknown>, page: number) => {
        this.setState({ isShowLoading: true });

        this.setState({
            comics: [],
        })

        demoAsyncCall().then(async () => {
            const response = await fetch(
                `${origin_url_be}/api/comic?page=${page}`
            ).then((response) => response.json());

            this.setState({ isShowLoading: false, comics: response.result})
        });
    }

    calTotalPage = (totalData: any) => {
        if (totalData % 12 === 0) {
            this.setState({
                total: totalData / 12,
            });
        } else {
            this.setState({
                total: ~~(totalData / 12) + 1,
            });
        }
    }

    render() {
        return (
            <Grid container spacing={1.5}>
                {this.state.isShowLoading && <Loading />}
                {this.state.comics && this.state.comics.map((ele: any) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={ele.slug}>
                        <CardComic comic={ele} />
                    </Grid>
                ))}
                <div className="boxcard__pagination">
                    <Pagination count={this.state.total} onChange={this.getDataPage} color="secondary" />
                </div>
            </Grid>

        );
    }
}