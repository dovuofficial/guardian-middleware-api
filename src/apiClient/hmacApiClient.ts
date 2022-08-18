import axios from 'axios'
import { generateHeaders } from 'src/utils/hmac'
import env from 'src/config'

let hmacInstance

const getHmacInstance = () => {
	if (!hmacInstance) {
		hmacInstance = axios.create({
			baseURL: env.apiUrl,
		})
		hmacInstance.interceptors.request.use((config) => {
			// Generate HMAC headers for every request
			const { method, url, data } = config

			const headers = generateHeaders(
				method.toUpperCase(),
				env.hmacAuthKey,
				url,
				data
			)

			return {
				...config,
				headers: {
					...config.headers,
					...headers,
				},
			}
		})
	}
	return hmacInstance
}

export default getHmacInstance()
