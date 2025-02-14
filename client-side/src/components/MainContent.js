import { Backdrop, Box, Button, CircularProgress, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';
import { useState } from "react";
import { companyNameSelectFieldValues, companyEncodedValues } from "../constants";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import useQuery from "../hooks/useQuery";
import { ChartsReferenceLine, ScatterChart } from "@mui/x-charts";

const MainContent = () => {
    const [company, setCompany] = useState(companyNameSelectFieldValues[0].value);
    const [companyEncodedValue, setCompanyEncodedValue] = useState(0);
    const [endDate, setEndDate] = useState(moment('2012-12-01'));
    const [startDate, setStartDate] = useState(moment('2011-12-01'));

    const [complaintCount, setComplaintCount] = useState("0");
    const [openPrice, setOpenPrice] = useState("0");
    const [closePrice, setClosePrice] = useState("0");

    const [priceDropProb, setPriceDropProb] = useState(0);
    const [plotDates, setPlotDates] = useState([]);
    const [plotClosePrices, setPlotClosePrices] = useState([]);
    const [plotComplaintCounts, setPlotComplaintCounts] = useState([]);
    const [scatterPlotData, setScatterPlotData] = useState([]);

    const { query, isLoading } = useQuery();

    const runQuery = () => {
        query(company, companyEncodedValue, startDate, endDate, complaintCount, openPrice, closePrice)
            .then((result) => {
                const { plot_data, prob_close_price_drop } = result;
                setPriceDropProb(prob_close_price_drop);
                setPlotDates(plot_data.map((row) => row.date));
                setPlotClosePrices(plot_data.map((row) => row.close_price));
                setPlotComplaintCounts(plot_data.map((row) => row.complaint_count));

                setScatterPlotData(
                    plot_data.map((row, index) => ({
                        id: index,
                        x: row.complaint_count,
                        y: row.close_price_difference
                    }))
                );
            });
    };

    return (
        <Box px={10} pt={5}>
            <Typography variant="h6">
                Enter Company Details and Timeframe for Analysis
            </Typography>

            <FormControl fullWidth>
                <InputLabel>Company Name</InputLabel>
                <Select
                    value={company}
                    label="Company Name"
                    onChange={(event) => {
                        const newValue = event.target.value;
                        setCompany(newValue);
                        setCompanyEncodedValue(companyEncodedValues.get(newValue));
                    }}
                >
                    {companyNameSelectFieldValues.map((fieldValue) => (
                        <MenuItem key={fieldValue.value} value={fieldValue.value}>
                            {fieldValue.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                minDate={moment('2011-12-01')}
                maxDate={moment('2024-10-29')}
            />

            <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                minDate={moment('2011-12-01')}
                maxDate={moment('2024-10-29')}
            />

            <TextField
                fullWidth
                label="Yesterday's Complaint Count"
                value={complaintCount}
                onChange={(event) => setComplaintCount(event.target.value)}
            />

            <TextField
                fullWidth
                label="Yesterday's Open Price (USD)"
                value={openPrice}
                onChange={(event) => setOpenPrice(event.target.value)}
            />

            <TextField
                fullWidth
                label="Yesterday's Close Price (USD)"
                value={closePrice}
                onChange={(event) => setClosePrice(event.target.value)}
            />

            <Button variant="contained" onClick={runQuery}>
                Submit
            </Button>

            {plotDates.length > 1 && (
                <>
                    <Divider />
                    <Typography fontWeight={600}>
                        Probability of stock price dropping = { (priceDropProb * 100).toFixed(2) }%
                    </Typography>

                    <LineChart
                        xAxis={[{ label: "Date", data: plotDates, scaleType: "time", valueFormatter: (date) => date.format("YYYY-MM-DD") }]}
                        yAxis={[{ label: "Stock Price (USD)" }]}
                        series={[{ data: plotClosePrices, showMark: false, curve: "linear" }]}
                        height={400}
                    />

                    <LineChart
                        xAxis={[{ label: "Date", data: plotDates, scaleType: "time", valueFormatter: (date) => date.format("YYYY-MM-DD") }]}
                        yAxis={[{ label: "Complaints" }]}
                        series={[{ data: plotComplaintCounts, showMark: false, curve: "linear" }]}
                        height={400}
                    />

                    <ScatterChart
                        height={400}
                        xAxis={[{ min: 0, label: "Complaints" }]}
                        yAxis={[{ label: "Stock Price Difference (USD)" }]}
                        series={[{ data: scatterPlotData }]}
                    >
                        <ChartsReferenceLine y={0} lineStyle={{ opacity: 0.5 }} />
                    </ScatterChart>
                </>
            )}

            <Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default MainContent;