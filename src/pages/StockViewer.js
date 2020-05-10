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
		{ headerName: "Date", field: "date", sortable: true, filter: true, flex: 1.3 },
		{ headerName: "Open", field: "open", sortable: true, filter: "number", flex: 1 },
		{ headerName: "High", field: "high", sortable: true, filter: "number", flex: 1 },
		{ headerName: "Low", field: "low", sortable: true, filter: "number", flex: 1 },
		{ headerName: "Close", field: "close", sortable: true, filter: "number", flex: 1 },
		{ headerName: "Volumes", field: "volumes", sortable: true, filter: "number", flex: 1.3 },
	];

	return (
		<div className="center">
			<div className="ag-theme-material" style={{
				height: "500px",
				width: "750px"
			}}>
				<AgGridReact
					columnDefs={columns}
					rowData={props.data}
					pagination={true}
					rowSelection={"single"}
					onRowClicked={e => props.clickedRow(e.data)}
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

	const customRadius = ctx => {
		let index = ctx.dataIndex;
		let data = props.data[index];
		let date = data.date;

		if (date === props.selectedDate) {
			return 10;
		} else {
			return 2;
		}
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
					elements: {
						point: {
							radius : customRadius,
							display: true
						}
					}
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
			<label htmlFor="date-to">to:&nbsp;</label>
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

	let [selectedDate, setSelectedDate] = useState(null);

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
				let errorMessage = err;
				if (errorMessage.message) { // If it's an object, just get the error message
					errorMessage = "Error: " + errorMessage.message;
				}

				setError(errorMessage);
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
	            let errorMessage = err;
	            if (errorMessage.message) { // If it's an object, just get the error message
	                errorMessage = "Error: " + errorMessage.message;
	            }

	            setError(errorMessage);
				setLoading(false);
			});
		}
	}, [loggedIn, stockSymbol, from, to]);

	return (
		<div style={{paddingBottom: "25px"}}>			
			<h1>{stockSymbol}{stockData.length !== 0 && stockData[0].name ? `- ${stockData[0].name}` : ""}</h1>
			<p className="text-muted">Pricing data</p>

			<Link to="/stocks">Back to stock list</Link>

			<br/><br/>

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
				error ?
					<p>{error}</p>
					: 
					<React.Fragment>
						<StockDataTable data={stockData} clickedRow={data => setSelectedDate(data.date)}/>
						{stockData.length > 1 ? <StockDataGraph data={stockData} selectedDate={selectedDate}/> : null}
					</React.Fragment>
			}
		</div>
	);
}