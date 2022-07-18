// This is the API for the
import axios from 'axios'

//Ugh! Port has to be 4200 for self built API - I thought it was still 3002 as that is the api gateway.
//For docker the port needs to be 3000.
const api = axios.create({
	baseURL: 'http://localhost:3000/api/v1',
	// baseURL: 'http://localhost:4200/api/v1',
	timeout: 1000000,
	headers: { 'User-Agent': 'Guardian DOVU Testing' },
})

export default api
