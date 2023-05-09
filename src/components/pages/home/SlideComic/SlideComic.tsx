/* eslint-disable @typescript-eslint/no-useless-constructor */
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './SlideComic.sass';
import { CardSlideHome } from "../../../card/Slide/CardSlide";

const images = [
    'https://adsmg.fanfox.net/4/2018/12/28/63903f3765294921.jpg',
    'https://adsmg.fanfox.net/4/2019/4/16/0f42fca631e04acd.jpg',
    'https://adsmg.fanfox.net/4/2019/4/16/9406be4ce25d4879.jpg',
    'https://adsmg.fanfox.net/3/2018/11/22/ff6f97db68c5485e.jpg',
    'https://adsmg.fanfox.net/3/2018/11/26/6fca8776b1f847c6.jpg',
]

export class SlideComic extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation
                    autoplay={{ delay: 2000 }}
                >
                    {images.map((ele) => (
                        <SwiperSlide key={ele}>
                            <CardSlideHome image={ele} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    }
}