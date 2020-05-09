import jwt from "jsonwebtoken"

const BASE_URL = "http://131.181.190.87:3000"

// Get list of stocks
export function GetStocks(industry) {
	return fetch(`${BASE_URL}/stocks/symbols${ industry !== "" ? `?industry=${industry}` : "" }`)
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

		// Get date
		json.date = new Date(json.timestamp).toLocaleDateString();

		return json;
	})
}

// Get history for a given stock
export function GetStockHistory(symbol, from, to) {
	let token = localStorage.getItem("token");

	let url = new URL(`${BASE_URL}/stocks/authed/${symbol}`);

	if (from) url.searchParams.append("from", from);
	if (to) url.searchParams.append("to", to);

	return fetch(url, {
		headers: new Headers({
			"Authorization": `Bearer ${token}`,
			"Content-Type": "application/json"
		}),
	})
	.then(resp => resp.json())
	.then(json => {
		// Check if there was an error
		if (json.error) {
			throw json.message;
		}

		let results = json;

		// Turn the results into an array even if it's just one result
		if (!Array.isArray(results))
			results = [results];

		// Get dates for each result
		for (let result of results) {
			result.date = new Date(result.timestamp).toLocaleDateString();
		}

		return results;
	})
}

// Tries to log in a user
export function Login(email, password) {
	return fetch(`${BASE_URL}/user/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email: email,
			password: password
		})
	})
	.then(resp => resp.json())
	.then(json => {
		// Check if there was an error
		if (json.error) {
			throw json.message;
		}

		// We logged in, store the token in localstorage
		localStorage.setItem("token", json.token);

		return json;
	})
}

// Registers a user
export function Register(email, password) {
	return fetch(`${BASE_URL}/user/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email: email,
			password: password
		})
	})
	.then(resp => resp.json())
	.then(json => {
		// Check if there was an error
		if (json.error) {
			throw json.message;
		}

		return json;
	})
}

// Log out the current user
export function Logout() {    
	// Remove the login token
	localStorage.removeItem("token");
}

// Check if the current user is logged in
export function IsLoggedIn() {
	// Get login token
	let token = localStorage.getItem("token");
	if (!token) {
		return false;
	}

	// Get token data
	let tokenData = jwt.decode(token);

	let stillValid = true;

	// Check if the token has expired
	if (Date.now() >= tokenData.exp * 1000) {
		stillValid = false;
	}

	return stillValid;
}