import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AgGridReact } from "ag-grid-react"

import { GetStocks, GetIndustries } from "../api/api"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-material.css"

// Create table of stocks
function StockTable(props) {
	const columns = [
		{ headerName: "Name", field: "name", sortable: true, filter: true, flex: 1.5 },
		{ headerName: "Symbol", field: "symbol", sortable: true, filter: true, flex: 1 },
		{ headerName: "Industry", field: "industry", sortable: true, filter: true, flex: 1.3 },
	];

	return (
		<div className="center">
			<div className="ag-theme-material" style={{
				height: "600px",
				width: "600px"
			}}>
				<AgGridReact
					columnDefs={columns}
					rowData={props.stocks}
					pagination={true}
					paginationPageSize={20}
					onRowClicked={e => props.clickedRow(e.data)}
				/>
			</div>
		</div>
	);
}

// Create selector for industries
function IndustrySelector(props) {
	let [industries, setIndustries] = useState([]);
	let [selectedIndustry, setSelectedIndustry] = useState("");
	let [innerSearch, setInnerSearch] = useState("");

	useEffect(() => {
		GetIndustries()
		.then(gotIndustries => {
			setIndustries(gotIndustries)
		})
	}, []);

	return (
		<div>
			<label htmlFor="industry-selector">Filter by industry:&nbsp;</label>
			<select id="industry-selector" value={selectedIndustry} onChange={e => {
				const selected = e.target.value;

				setSelectedIndustry(selected);
				props.onSelect(selected);

				// Reset the search query
				setInnerSearch("");
			}}>
				<option value="">All Industries</option>
				{industries.map(industry => {
					return <option key={industry} value={industry}>{industry}</option>
				})}
			</select>

			<br/>

			<label htmlFor="industry-selector">Search industry:&nbsp;</label>
			<input id="industry-search" name="industry-search" type="search"
				value={innerSearch} onChange={e => {
					const query = e.target.value;

					setInnerSearch(query);
					props.onSearch(query);

					// Reset the selected industry
					setSelectedIndustry("");
				}}
			/>
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
            let errorMessage = "Error: " + err.message;

            setError(errorMessage);
			setLoading(false);
		});
	}, [industry]);

	return (
		<div>
			<h1>Stocks list</h1>
			<p className="text-muted">Click on a stock to view pricing data</p>
			
			<br/>

			<IndustrySelector onSelect={newIndustry => setIndustry(newIndustry)}
				onSearch={query => setIndustry(query)}/>
			
			<br/>

			{loading ?
				<h4>Loading stocks...</h4>
				: 
				error ?
					<p>{error}</p>
					:
					<StockTable stocks={stocks} clickedRow={data => history.push(`/stocks/${data.symbol}`)}/>
			}			
		</div>
	);
}