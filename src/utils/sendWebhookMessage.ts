import config from 'src/config'
import Hmac from 'src/utils/hmac'
import axios from 'axios'

async function sendWebhookMessage(data): Promise<void> {
	const { webhookUrl } = config

	if (!webhookUrl || !data) {
		throw new Error('Webhook URL or data is missing')
	}

	const dataAsString = JSON.stringify(data)
	const options = {
		headers: {
			'x-signature': Hmac.generateHash(dataAsString),
		},
	}

	try {
		await axios.post(webhookUrl, data, options)
	} catch (e) {
		throw new Error(`Unable to send payload to webhook ${webhookUrl}`)
	}
}

export default sendWebhookMessage
