import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { AgGridReact } from "ag-grid-react"
import { Line } from "react-chartjs-2";
import { Button } from "reactstrap"

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
							scaleLabel: {
								display: true,
								labelString: "Date"
							},
							gridLines: {
								display: false // hide vertical grid lines
							},
							type: "time",
							time: {
								unit: "day"
							}
						}],
					},
					scales: {
						yAxes: [{
							scaleLabel: {
								display: true,
								labelString: "Closing price"
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

function StockDataVisual(props) {
	let [latestData, setLatestData] = useState({});

	useEffect(() => {
		GetLatestStockData(props.symbol)
		.then(data => {
			setLatestData(data);
		})
	}, []);

	let change, changePercent;
	if (latestData.open && latestData.close) {
		change = latestData.close - latestData.open;
		changePercent = (change / latestData.close) * 100;
	}

	return (
		<div className="d-flex justify-content-center">
			<div className="stock-visual">
				
			{!latestData.name ?
				<h2>{props.symbol}</h2>
				:
				<React.Fragment> 
					<h2>{latestData.symbol} - {latestData.name}</h2>
					<h6 className="text-muted">{latestData.industry}</h6>
					
					<hr/>

					<div className="row">
						<div className="col text-left">
							<small className="text-muted">Open:</small><br/>
							<div className="font-weight-bold">{latestData.open}</div>
						</div>

						<div className="col text-center">
							<small className="text-muted">Closing price:</small><br/>
							<h3 className="mb-0">{latestData.close}</h3>
							<div className={change >= 0 ? "text-success" : "text-danger"}>{change.toFixed(2)} ({changePercent.toFixed(2)}%)</div>
						</div>

						<div className="col text-right">
							<small className="text-muted">Day's range:</small><br/>
							<div className="font-weight-bold">{latestData.low} - {latestData.high}</div>
						</div>
					</div>

					<div><small className="text-muted">Data from {latestData.date}</small></div>
					
					<hr/>
				</React.Fragment>
			}
			</div>
		</div>
	)
}

function DateSelector(props) {
	let [selectedButton, setSelectedButton] = useState(0);

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
	            let errorMessage = "Error: " + err.message;

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
	            let errorMessage = "Error: " + err.message;

	            setError(errorMessage);
				setLoading(false);
			});
		}
	}, [loggedIn, stockSymbol, from, to]);

	return (
		<div style={{paddingBottom: "25px"}}>
			<StockDataVisual symbol={stockSymbol}/>

			{loading ?
				<h4>Loading stock data...</h4>
				: 
				<React.Fragment>
					{loggedIn ?
						<React.Fragment>
							<DateSelector setFrom={date => setFrom(date)} setTo={date => setTo(date)}/>
							<br/>
						</React.Fragment>
						: 
						<React.Fragment>
							<Link to="/login">Log in to view historic data</Link>
							<br/><br/>
						</React.Fragment>
					}

					{error ?
						<p>{error}</p>
						:
						<React.Fragment>
							<StockDataTable data={stockData} clickedRow={data => setSelectedDate(data.date)}/>
							{stockData.length > 1 ? <StockDataGraph data={stockData} selectedDate={selectedDate}/> : null}
						</React.Fragment>
					}
				</React.Fragment>
			}
		</div>
	);
}