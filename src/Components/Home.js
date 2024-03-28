import React from 'react';
import { useLocation } from 'react-router-dom';
import News from './News';
import Stocks from './Stocks';
import StockChart from './Stock_Chart';
import StockIndex from './Stock_index';
import IPONews from './IPO_News';

export default function Home() {
    const location = useLocation();
    let { stockName, companyIsin } = location.state || {};
    if (!companyIsin) {
        companyIsin = "INE002A01018";
        stockName = "RIL";
    }
    const apiHeader = "https://api.upstox.com/v2/historical-candle/NSE_EQ%7C";
    const apiFooter = "/day/2024-03-27/2000-01-01";
    const apiUrl = apiHeader + companyIsin + apiFooter;

    return (
        <>
            <div className="row">
                <div className="col-md-9">
                    <StockChart stockCode={stockName} apiUrl={apiUrl} />
                    <IPONews />
                </div>
                <div className="col-md-3">
                    <StockIndex />
                    <Stocks />
                    <News />
                </div>
            </div>
        </>
    );
}