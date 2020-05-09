const BASE_URL = "http://131.181.190.87:3000"

// Get list of stocks
export function GetStocks(industry) {
	return fetch(`${BASE_URL}/stocks/symbols${ industry != "" ? `?industry=${industry}` : "" }`)
	.then(resp => resp.json())
	.then(json => {
		// Check if there was an error
		if (json.error) {
			throw json.message;
		}

		// Otherwise it"s fine, return the data
		return json;
	})
}

// Get list of industries
export function GetIndustries() {
	return fetch(`${BASE_URL}/stocks/symbols`)
	.then(resp => resp.json())
	.then(json => {
		// Check if there was an error
		if (json.error) {
			throw json.message;
		}

		let industries = [...new Set(json.map(stock => stock.industry))];

		return industries;
	})
}

// Get latest data for a given stock
export function GetLatestStockData(symbol) {
	return fetch(`${BASE_URL}/stocks/${symbol}`)
	.then(resp => resp.json())
	.then(json => {
		// Check if there was an error
		if (json.error) {
			throw json.message;
		}

		let data = json;
		data.date = new Date(data.timestamp).toLocaleDateString(); // Nicely format date

		return data;
	})
}