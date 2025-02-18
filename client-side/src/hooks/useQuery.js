import axios from "axios";
import moment from "moment";
import { useState } from "react";

function useQuery() {
    const [isLoading, setIsLoading] = useState(false);

    const query = async (
        companyName,
        companyNameEncoded,
        startDate,
        endDate,
        complaintCount,
        openPrice,
        closePrice
    ) => {
        setIsLoading(true);

        const apiUrl = `http://127.0.0.1:8000/company?` +
            `company_name=${encodeURIComponent(companyName)}&` +
            `company_name_encoded=${companyNameEncoded}&` +
            `start_date=${startDate.format('YYYY-MM-DD')}&` +
            `end_date=${endDate.format('YYYY-MM-DD')}&` +
            `complaints_count=${complaintCount}&` +
            `open_price=${openPrice}&` +
            `close_price=${closePrice}`;

        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: apiUrl,
            headers: {}
        };

        let result = {
            "plot_data": [],
            "prob_close_price_drop": 0
        };

        try {
            const response = await axios.request(config);
            const responseData = response.data;
            const plotData = responseData.plot_data;
            const priceDropProb = responseData.prob_close_price_drop;

            const updatePlotData = plotData.map((plotElement) => ({
                "date": moment(plotElement.date),
                "company": plotElement.company,
                "complaint_count": Number(plotElement.complaint_count),
                "close_price": Number(plotElement.close_price),
                "close_price_difference": Number(plotElement.close_price_difference),
            }));

            result = {
                "plot_data": updatePlotData,
                "prob_close_price_drop": priceDropProb
            };
        } catch (error) {
            console.error(error);
        }

        setIsLoading(false);
        return result;
    };

    return { query, isLoading };
}

export default useQuery;