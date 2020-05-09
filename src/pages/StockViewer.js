import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { AgGridReact } from "ag-grid-react"
import { Line } from "react-chartjs-2";

import { IsLoggedIn, GetStockHistory, GetLatestStockData } from "../api/api"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-material.css"

// Create table of stocks
function StockDataTable(props) {
	const columns = [
		{ headerName: "Date", field: "date", sortable: true, width: 120 },
		{ headerName: "Open", field: "open", sortable: true, width: 100 },
		{ headerName: "High", field: "high", sortable: true, width: 100 },
		{ headerName: "Low", field: "low", sortable: true, width: 100 },
		{ headerName: "Close", field: "close", sortable: true, width: 100 },
		{ headerName: "Volumes", field: "volumes", sortable: true, width: 100 },
	];

	return (
		<div className="center">
			<div className="ag-theme-material" style={{
				height: "500px",
				width: "640px"
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

function StockDataGraph(props) {
	const data = {
		labels: props.data.map(historyData => historyData.date),
		datasets: [
			{
				label: "Closing price",
				fill: false,
				borderColor: "#8fffe5",
				borderWidth: 2,
				tension: 0,
				data: props.data.map(historyData => historyData.close)
			}
		]
	}

	return (
		<div style={{marginTop: "20px"}}>
			<Line data={data}
				options={{
					title: {
						display: true,
						text: "Closing price history",
						fontSize: 20
					},
					scales: {
						xAxes: [{
							gridLines: {
								display: false // hide vertical grid lines
							},
							type: "time",
							time: {
								unit: "month"
							}
						}],
					},
				}}/>
		</div>
	);
}

function RangeSelector(props) {
	return (
		<div>
			<label htmlFor="date-from">From:&nbsp;</label>
			<input id="date-from" name="date-from" type="date"
				onChange={e => props.setFrom(e.target.value)}/>
			&nbsp;
			<label htmlFor="date-to">To:&nbsp;</label>
			<input id="date-to" name="date-to" type="date"
				onChange={e => props.setTo(e.target.value)}/>
		</div>
	)
}

export function StockViewer(props) {
	let [stockData, setStockData] = useState([]);
	let [loading, setLoading] = useState(true);
	let [error, setError] = useState(null);

	let [from, setFrom] = useState(null);
	let [to, setTo] = useState(null);

	const loggedIn = IsLoggedIn();
	const stockSymbol = props.match.params.symbol;

	useEffect(() => {
		if (loggedIn) {
			GetStockHistory(stockSymbol, from, to)
			.then(data => {
				setStockData(data);

				setError(null);
				setLoading(false);
			})
			.catch(err => {
				setError(err);
				setLoading(false);
			});
		} else {
			GetLatestStockData(stockSymbol)
			.then(data => {
				setStockData([data]);

				setError(null);
				setLoading(false);
			})
			.catch(err => {
				setError(err);
				setLoading(false);
			});
		}
	}, [loggedIn, stockSymbol, from, to]);

	return (
		<div>
			<h1>{stockSymbol}{stockData.length != 0 && stockData[0].name ? `- ${stockData[0].name}` : ""}</h1>

			<br/>

			{loggedIn ?
				<React.Fragment>
					<RangeSelector setFrom={date => setFrom(date)} setTo={date => setTo(date)}/>
					<br/>
				</React.Fragment>
			: 
				<React.Fragment>
					<Link to="/login">Log in to view history data</Link>
					<br/><br/>
				</React.Fragment>
			}

			{loading ?
				<h4>Loading stock data...</h4>
				: 
				error ? error : 
				<React.Fragment>
					<StockDataTable data={stockData}/>
					{stockData.length > 1 ? <StockDataGraph data={stockData}/> : null}
				</React.Fragment>
			}
		</div>
	);
}