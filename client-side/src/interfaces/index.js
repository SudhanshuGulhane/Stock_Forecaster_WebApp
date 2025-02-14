import moment from "moment";

const CompanyNameValue = [
    "AMERICAN EXPRESS COMPANY",
    "BANK OF AMERICA, NATIONAL ASSOCIATION",
    "CAPITAL ONE FINANCIAL CORPORATION",
    "CITIBANK, N.A.",
    "DISCOVER BANK",
    "JPMORGAN CHASE & CO.",
    "Navient Solutions, LLC.",
    "SYNCHRONY FINANCIAL",
    "U.S. BANCORP",
    "WELLS FARGO & COMPANY"
];

const SelectFeildItem = {
    label: "",
    value: ""
};

const EncodedCompanyValueMap = new Map();

const ResponsePlotDataElement = {
    date: "",
    company: "",
    complaint_count: "",
    close_price: "",
    close_price_difference: ""
};

const ResultPlotElement = {
    date: moment(),
    company: "",
    complaint_count: 0,
    close_price: 0,
    close_price_difference: 0
};

const Response = {
    prob_close_price_drop: 0,
    plot_data: []
};

const Result = {
    prob_close_price_drop: 0,
    plot_data: []
};