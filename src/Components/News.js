import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import newsApi from '../Utils/apis/news_api';
import './Style.css';

export default function News() {
    const [newsData, setNewsData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await newsApi();
                const filteredArticles = data.articles.filter(article => {
                    return (
                        article.source.name !== '[Removed]' &&
                        article.title !== '[Removed]' &&
                        article.description !== '[Removed]' &&
                        article.url !== 'https://removed.com' &&
                        article.urlToImage !== null
                    );
                });
                setNewsData({ ...data, articles: filteredArticles });
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchData();
    }, []);

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        swipeToSlide: true,
        lazyLoad: true,
        autoplaySpeed: 3000,
        vertical: true,
        verticalSwiping: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    vertical: false,
                    verticalSwiping: false,
                },
            },
        ],
    };

    return (
        <Slider {...sliderSettings} className='news-slider'>
            {newsData &&
                newsData.articles.map((article, index) => (
                    <div className="card" key={index}>
                        <div className="card-body">
                            <h5 className="card-title">{article.title}</h5>
                        </div>
                        <div className="card-footer">
                            <small className="text-muted">{new Date(article.publishedAt).toLocaleString()}</small>
                        </div>
                    </div>
                ))}
        </Slider>
    );
}
