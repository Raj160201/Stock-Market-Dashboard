import React, { useEffect, useState } from 'react';
import newsApi from '../Utils/apis/news_api';
import intradayStockApi from '../Utils/apis/intraday_stock';
import stockApi from '../Utils/apis/stock_api';
import News from './News';
import Stocks from './Stocks';
import marketHolidayApi from '../Utils/apis/market_holiday';

export default function Home() {
    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const data = await intradayStockApi('NSE_EQ', 'INE002A01018');
                const data = await marketHolidayApi('2024-03-25');
                // const data = await stockApi('NSE_EQ', 'INE002A01018', '30minute', '2024-03-27', '2024-03-27');
                // const data = await newsApi();
                setResponseData(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchData();
    }, []);
    return (
        <>
            {/* <div>
                {responseData ? (
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                ) : (
                    <p>Loading...</p>
                )}
            </div> */}
            <Stocks />
            <News />
        </>
    )
}