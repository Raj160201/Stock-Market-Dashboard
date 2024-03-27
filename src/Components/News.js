import React, { useEffect, useState } from 'react';
import newsApi from '../Utils/apis/news_api';
import './Style.css';

export default function News() {
    const [newsData, setNewsData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await newsApi(); // Assuming this function fetches news data from the API
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

    return (
        <div className="card-group card-group-scroll smaller-card-group">
            {newsData && newsData.articles.map((article, index) => (
                <div className="card" key={index}>
                    {/* {article.urlToImage && <img src={article.urlToImage} className="card-img-top" alt={article.title} />} */}
                    <div className="card-body">
                        <h5 className="card-title">{article.title}</h5>
                        {/* <p className="card-text">{article.description}</p> */}
                    </div>
                    <div className="card-footer">
                        <small className="text-muted">{new Date(article.publishedAt).toLocaleString()}</small>
                    </div>
                </div>
            ))}
        </div>
    );
}
