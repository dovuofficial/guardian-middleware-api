// This is the API for the
import axios from 'axios'
import config from 'lib/config'

// Ugh! Port has to be 4200 for self built API - I thought it was still 3002 as that is the api gateway.
// For docker the port needs to be 3000.
const api = axios.create({
	baseURL: config.guardianApiUrl,
	// baseURL: 'http://localhost:4200/api/v1',
	timeout: 1000000,
	headers: { 'User-Agent': 'DOVU Guardian Middleware API' },
})

export default api
