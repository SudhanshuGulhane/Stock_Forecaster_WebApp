from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from cachetools import TTLCache, cached
from datetime import date
from pyhive import hive
import joblib

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

conn = hive.Connection(host='localhost', port=10000, username='Sudhanshu_Gulhane', database='default')
cursor = conn.cursor()

cache = TTLCache(maxsize=1000, ttl=300)

company_database_name = {
    "AMERICAN EXPRESS COMPANY": "amex_findata",
    "BANK OF AMERICA, NATIONAL ASSOCIATION": "boa_findata",
    "CAPITAL ONE FINANCIAL CORPORATION": "capone_findata",
    "CITIBANK, N.A.": "citibank_findata",
    "DISCOVER BANK": "discover_findata",
    "JPMORGAN CHASE & CO.": "jpmorgan_findata",
    "Navient Solutions, LLC.": "navient_findata",
    "SYNCHRONY FINANCIAL": "synchrony_findata",
    "U.S. BANCORP": "usbancorp_findata",
    "WELLS FARGO & COMPANY": "wellsfargo_findata"
}

model = joblib.load('gradient_boosting_model.pkl')

@app.get("/company", response_model = dict)
async def get_company_data(
    company_name: str,
    company_name_encoded: int,
    start_date: date,
    end_date: date,
    complaints_count: int,
    open_price: float,
    close_price: float
):  
    if company_name not in company_database_name:
        raise HTTPException(status_code=404, detail="Company not found")
    
    probs = model.predict_proba([[company_name_encoded, complaints_count, open_price, close_price]])[0]
    prob_close_price_drop = probs[2]
    plot_data = []
    
    cache_key = f"{company_name}_{start_date}_{end_date}"
    if cache_key in cache:
        plot_data = cache[cache_key]
    
    else:
        # query = f"""
        # WITH complaints_summary AS (
        #     SELECT
        #         c.`date received` AS `date`,
        #         c.company,
        #         COUNT(c.`complaint id`) AS complaint_count
        #     FROM complaints_table c
        #     WHERE c.company = '{company_name}'
        #     AND c.`date received` BETWEEN '{start_date}' AND '{end_date}'
        #     GROUP BY c.`date received`, c.company
        # ),
        # financial_data AS (
        #     SELECT
        #         f.record_date,
        #         f.close_price,
        #         f.close_price - LAG(f.close_price) OVER (
        #             PARTITION BY f.record_date 
        #             ORDER BY f.record_date
        #         ) AS close_price_difference
        #     FROM {company_database_name[company_name]} f
        # )
        # SELECT
        #     cs.`date`,
        #     cs.company,
        #     cs.complaint_count,
        #     fd.close_price,
        #     fd.close_price_difference
        # FROM complaints_summary cs
        # JOIN financial_data fd
        # ON fd.record_date = DATE_SUB(cs.`date`, 1)
        # ORDER BY cs.`date`
        # """

        query = f"""
        SELECT
            c.`Date_received` AS `date`,
            c.company,
            COUNT(c.`Complaint_ID`) AS complaint_count,
            f.close_price AS close_price,
            f.close_price - LAG(f.close_price) OVER (
                PARTITION BY c.company 
                ORDER BY c.`Date_received`
            ) AS close_price_difference
        FROM
            complaints_parquet c
        JOIN
            {company_database_name[company_name]} f
        ON
            f.record_date = DATE_SUB(c.`Date_received`, 1)
        WHERE
            c.company = '{company_name}'
            AND c.`Date_received` BETWEEN '{start_date}' AND '{end_date}'
        GROUP BY
            c.`Date_received`, c.company, f.close_price
        ORDER BY
            c.`Date_received`
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        print(rows)

        for row in rows:
            formatted_row = {
                "date": str(row[0]),
                "company": str(row[1]),
                "complaint_count": str(row[2]),
                "close_price": str(row[3]),
                "close_price_difference": str(row[4]) if row[4] is not None else "0"
            }

            plot_data.append(formatted_row)

        cache[cache_key] = plot_data

    response = {
        "prob_close_price_drop": prob_close_price_drop,
        "plot_data": plot_data
    }

    return response