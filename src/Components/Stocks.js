import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import companyData from '../Utils/data/company.json';
import stockApi from '../Utils/apis/stock_api';
import intradayStockApi from '../Utils/apis/intraday_stock';
import marketHolidayApi from '../Utils/apis/market_holiday';
import './Style.css';

export default function Stocks() {
    const [stockData, setStockData] = useState([]);
    const navigate = useNavigate();

    const handleTableRowClick = async (stock) => {
        navigate('/', {
            state: {
                stockName: stock.Company_Code,
                companyIsin: stock.ISIN_Code,
                startDate: '2024-03-27',
                endDate: '2000-01-01',
            },
        });
    };

    const isMarketHoliday = async (date) => {
        const marketHoliday = await marketHolidayApi(date);
        if (marketHoliday.status === 'success' && marketHoliday.data.length > 0) {
            return true;
        }
        return false;
    };

    const isWeekend = (completeDate) => {
        const dayOfWeek = completeDate.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // Sunday (0) and Saturday (6) are weekends
    };

    useEffect(() => {
        const findLastTradingDay = async (completeDate) => {
            let date = completeDate.getDate();
            let lastTradingDay = null;

            for (let i = date - 1; i > 0; i--) {
                const currentDate = new Date(completeDate.getFullYear(), completeDate.getMonth(), i, 12);
                if (!isWeekend(currentDate)) {
                    const currentDateStr = currentDate.toISOString().split('T')[0];
                    const isHoliday = await isMarketHoliday(currentDateStr);
                    if (!isHoliday) {
                        lastTradingDay = currentDateStr;
                        break;
                    }
                }
            }
            return lastTradingDay;
        };

        const fetchData = async () => {
            try {
                const today = new Date();

                const marketOpeningTime = new Date(today);
                marketOpeningTime.setHours(9);
                marketOpeningTime.setMinutes(15);

                const marketClosingTime = new Date(today);
                marketClosingTime.setHours(15);
                marketClosingTime.setMinutes(30);

                const updatedStockData = await Promise.all(
                    companyData.map(async (company) => {
                        const { ISIN_Code, Company_Code } = company;
                        let stockInfo, lastDayInfo;
                        const currentTime = today.getTime();
                        const lastTradingDay = await findLastTradingDay(today);

                        if (currentTime < marketOpeningTime.getTime()) {
                            const lastSecondTradingDay = await findLastTradingDay(new Date(lastTradingDay));
                            stockInfo = await intradayStockApi('NSE_EQ', ISIN_Code);
                            if (stockInfo.data.candles.length === 0) {
                                stockInfo = await stockApi('NSE_EQ', ISIN_Code, '30minute', lastTradingDay, lastTradingDay);
                            }
                            lastDayInfo = await stockApi('NSE_EQ', ISIN_Code, '30minute', lastSecondTradingDay, lastSecondTradingDay);
                        } else if (currentTime >= marketOpeningTime.getTime() && currentTime <= marketClosingTime.getTime()) {
                            stockInfo = await intradayStockApi('NSE_EQ', ISIN_Code);
                            lastDayInfo = await stockApi('NSE_EQ', ISIN_Code, '30minute', lastTradingDay, lastTradingDay);
                        } else if (currentTime >= marketClosingTime.getTime()) {
                            stockInfo = await intradayStockApi('NSE_EQ', ISIN_Code);
                            lastDayInfo = await stockApi('NSE_EQ', ISIN_Code, '30minute', lastTradingDay, lastTradingDay);
                        }

                        const lastDayLTP = lastDayInfo.data.candles[0][4];
                        const change = stockInfo.data.candles[0][4] - lastDayLTP;
                        const changePercentage = ((change / lastDayLTP) * 100).toFixed(2);

                        return {
                            Company_Code,
                            ISIN_Code,
                            LTP: stockInfo.data.candles[0][4],
                            Change: change.toFixed(2),
                            ChangePercentage: changePercentage,
                            Color: getColor(change),
                        };
                    })
                );

                setStockData(updatedStockData);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchData();
    }, []);

    const getColor = (change) => {
        if (change < 0) return 'red';
        if (change > 0) return 'green';
        return 'black';
    };

    return (
        <table className="table table-sm custom-table">
            <thead className="thead-custom">
                <tr>
                    <th scope="col">Company</th>
                    <th scope="col">LTP</th>
                    <th scope="col">Chg</th>
                    <th scope="col">Chg%</th>
                </tr>
            </thead>
            <tbody className="table-group-divider table-divider-color">
                {stockData.map((stock, index) => (
                    <tr key={index} onClick={() => handleTableRowClick(stock)}>
                        <td>{stock.Company_Code}</td>
                        <td>{stock.LTP}</td>
                        <td style={{ color: stock.Color }}>{stock.Change}</td>
                        <td style={{ color: stock.Color }}>{stock.ChangePercentage}%</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
