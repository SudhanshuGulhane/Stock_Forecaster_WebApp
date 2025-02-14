# **Stock Forecaster WebApp**

### **📌 Overview**  
Stock prices are influenced by various factors, including **customer complaints**. This project explores how **consumer sentiment analysis** can enhance stock price prediction. By integrating **big data processing (Hadoop HDFS, Hive)** with **machine learning (Gradient Boosting, LSTM)** and a **full-stack web application**, this system provides **real-time stock movement forecasting** with improved accuracy.  

For Big Data & Hive Query Implementation, please visit this repository: [here](https://github.com/SudhanshuGulhane/Stock_Forecaster_Big_Data_Storage)
---

## **🚀 Features**  

- **📊 Predictive Stock Forecasting**: Uses **Gradient Boosting** and **LSTM** to forecast stock price movements.  
- **📁 Big Data Integration**: Processes **4GB+ of stock & complaint data** using **Hadoop HDFS & Hive**.  
- **🌍 Full-Stack Web Application**: Built with **React (frontend)** and **FastAPI (backend)** for interactive analysis.  
- **⏱️ Real-Time Querying**: Fetches and visualizes stock trends & complaint correlations dynamically.  
- **🛠 Optimized Query Performance**: Uses **Parquet columnar storage**, reducing query execution time by **3.08x**.  

---

## **🛠 Tech Stack**  

| Category        | Technology Used  |
|----------------|-----------------|
| **Frontend**   | React, TypeScript, MUI Charts |
| **Backend**    | FastAPI, Python, Uvicorn |
| **Machine Learning** | Gradient Boosting, LSTM |
| **Big Data**   | Hadoop HDFS, Hive, Parquet |
| **Storage**    | Dockerized Hive Environment |

---

## **📂 Project Structure**  

```
Stock_Forecaster_WebApp/
│── backend/                 # FastAPI backend for processing queries & ML inference
│── frontend/                # React frontend for interactive visualization
│── README.md                # Project documentation
│── requirements.txt         # Python dependencies
│── LICENSE                  # MIT License
```

---

## **⚡ Installation & Setup**  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/SudhanshuGulhane/Stock_Forecaster_WebApp.git
cd Stock_Forecaster_WebApp
```

### **2️⃣ Set Up Backend (FastAPI)**  
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### **3️⃣ Set Up Hadoop & Hive (Docker)**  
Please refer this repository for more details: [Visit](https://github.com/SudhanshuGulhane/Stock_Forecaster_Big_Data_Storage)

### **4️⃣ Start the Frontend**  
```bash
cd client-side
npm install
npm start
```
---

## **🖥️ How It Works**  

1️⃣ **User Inputs Data**  
- Company Name  
- Date Range  
- Number of Complaints  
- Yesterday's Stock Prices (optional: for predicting the percentage increase/decrease in stock price)

2️⃣ **Backend Fetches & Processes Data**  
- Queries **Hive database** for historical trends  
- Runs **Gradient Boosting & LSTM models** for prediction (for model evaluation using LSTM, please visit [here](https://github.com/SudhanshuGulhane/Stock-Price-Prediction) )

3️⃣ **Results Are Visualized**  
- **Stock Trends** (Line Chart)  
- **Complaints vs Stock Changes** (Scatter Plot)  
- **Predicted Stock Movement in Percentage** 

---

## **📜 License**  
This project is licensed under the **MIT License**.  

---
