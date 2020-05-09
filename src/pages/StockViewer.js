import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react"

import { GetLatestStockData } from "../api/api"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css"

// Create table of stocks
function StockDataTable(props) {
	const columns = [
		{ headerName: "Date", field: "date", sortable: true, width: 100 },
		{ headerName: "Open", field: "open", sortable: true, width: 100 },
		{ headerName: "High", field: "high", sortable: true, width: 100 },
		{ headerName: "Low", field: "low", sortable: true, width: 100 },
		{ headerName: "Close", field: "close", sortable: true, width: 100 },
		{ headerName: "Volumes", field: "volumes", sortable: true, width: 100 },
	];

	return (
		<div className="center">
			<div className="ag-theme-balham-dark" style={{
				height: "500px",
				width: "620px"
			}}>
				<AgGridReact
					cellClicked={e => {console.log("clicked cell", e)}}
					columnDefs={columns}
					rowData={props.data}
					pagination={true}
				/>
			</div>
		</div>
	);
}

export function StockViewer(props) {
	let [stockData, setStockData] = useState({});
	let [loading, setLoading] = useState(true);
	let [error, setError] = useState(null);

	const stockSymbol = props.match.params.symbol;

	useEffect(() => {
		// Get stock data
		GetLatestStockData(stockSymbol)
		.then(gotStockData => {
			setStockData(gotStockData);
			console.log(gotStockData);

			setLoading(false);
		})
		.catch(err => {
			setError("Failed to retrieve stock data.");
			setLoading(false);
		});
	}, []);

	return (
		<div>
			<h1>{stockSymbol}{stockData.name ? `- ${stockData.name}` : ""}</h1>

			<br/>

			{loading ?
				<h4>Loading stock data...</h4>
				: 
				error ? error : <StockDataTable data={[stockData]}/>
			}
		</div>
	);
}