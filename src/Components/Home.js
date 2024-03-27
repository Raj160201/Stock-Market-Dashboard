import React, { useEffect, useState } from 'react';
import newsApi from '../Utils/apis/news_api';
import intradayStockApi from '../Utils/apis/intraday_stock';
import stockApi from '../Utils/apis/stock_api';
import News from './News';
import Stocks from './Stocks';
import marketHolidayApi from '../Utils/apis/market_holiday';
import StockChart from './Stock_Chart';

export default function Home() {
    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await stockApi('NSE_EQ', 'INE002A01018', 'day', '2024-03-26', '2000-03-25');
                setResponseData(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchData();
    }, []);
    return (
        <>
            <div className="row">
                <div className="col-md-9">
                    <StockChart stockName='Hero Motocorp Ltd' stockCode='NSE_EQ' companyIsin='INE158A01026' timeInterval='day' startDate='2024-03-26' endDate='2000-01-01' />
                </div>
                <div className="col-md-3">
                    <Stocks />
                </div>
            </div>
            <div className="row">
                <div className="col-md-9">
                    <News />
                </div>
                {/* <div className="col-md-3">
                    <Stocks />
                </div> */}
            </div>
        </>
    );
}