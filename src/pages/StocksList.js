import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AgGridReact } from "ag-grid-react"

import { GetStocks, GetIndustries } from "../api/api"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-material.css"

// Create table of stocks
function StockTable(props) {
	const columns = [
		{ headerName: "Name", field: "name", sortable: true, filter: true, width: 250 },
		{ headerName: "Symbol", field: "symbol", sortable: true, width: 100 },
		{ headerName: "Industry", field: "industry", sortable: true, width: 200 },
	];

	return (
		<div className="center">
			<div className="ag-theme-material" style={{
				height: "500px",
				width: "570px"
			}}>
				<AgGridReact
					columnDefs={columns}
					rowData={props.stocks}
					pagination={true}
					onRowClicked={e => props.clickedRow(e.data)}
				/>
			</div>
		</div>
	);
}

// Create selector for industries
function IndustrySelector(props) {
	let [industries, setIndustries] = useState([]);

	useEffect(() => {
		GetIndustries()
		.then(gotIndustries => {
			setIndustries(gotIndustries)
		})
	}, []);
	
	return (
		<div>
			<label htmlFor="industry-selector">Filter by industry:&nbsp;</label>
			<select id="industry-selector" onChange={e => props.onChange(e.target.value)}>
				<option value="">All Industries</option>
				{industries.map(industry => {
					return <option key={industry} value={industry}>{industry}</option>
				})}
			</select>
		</div>
	)
}

export function StocksList(props) {
	let [industry, setIndustry] = useState("");
	let [stocks, setStocks] = useState([]);
	let [loading, setLoading] = useState(true);
	let [error, setError] = useState(null);
 	let history = useHistory();

	useEffect(() => {
		GetStocks(industry)
		.then(stocks => {
			setStocks(stocks);
			
			setError(null);
			setLoading(false);
		})
		.catch(err => {
			setError("Failed to retrieve stocks.");
			setLoading(false);
		});
	}, [industry]);

	return (
		<div>
			<h1>Stocks list</h1>
			
			<br/>

			<IndustrySelector onChange={newIndustry => setIndustry(newIndustry)}/>
			
			<br/>

			{loading ?
				<h4>Loading stocks...</h4>
				: 
				error ? error : <StockTable stocks={stocks} clickedRow={data => history.push(`/stocks/${data.symbol}`)}/>
			}			
		</div>
	);
}