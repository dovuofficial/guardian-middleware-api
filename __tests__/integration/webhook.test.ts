import Status from 'src/constants/status'
import Config from 'src/config'
import Hmac from 'src/utils/hmac'
import axios from 'axios'

const { webhookUrl } = Config

test('Check webhook cannot consumed with a GET request', async () => {
	if (!webhookUrl) {
		console.warn(
			"Skipping test as 'WEBHOOK_URL' not found in environment, for these tests to pass your external service needs to be redeployed"
		)
		return
	}

	await expect(axios.get(webhookUrl)).rejects.toThrow(
		'Request failed with status code 405'
	)
})

test('Check webhook has been hit, if a signature does not exist, return 401', async () => {
	if (!webhookUrl) {
		console.warn(
			"Skipping test as 'WEBHOOK_URL' not found in environment, for these tests to pass your external service needs to be redeployed"
		)
		return
	}

	await expect(axios.post(webhookUrl)).rejects.toThrow(
		'Request failed with status code 401'
	)
})

test('Check webhook has been hit, with a bad signature', async () => {
	if (!webhookUrl) {
		console.warn(
			"Skipping test as 'WEBHOOK_URL' not found in environment, for these tests to pass your external service needs to be redeployed"
		)
		return
	}

	await expect(
		axios.post(
			webhookUrl,
			{},
			{
				headers: {
					'x-signature': '123',
				},
			}
		)
	).rejects.toThrow('Request failed with status code 401')
})

test('Check webhook has been hit, with a good signature and body', async () => {
	if (!webhookUrl) {
		console.warn(
			"Skipping test as 'WEBHOOK_URL' not found in environment, for these tests to pass your external service needs to be redeployed"
		)
		return
	}

	const mockResponse = { foo: 'bar', baz: 'qux', quux: 'corge' }
	const config = {
		headers: {
			'x-signature': Hmac.generateHash(JSON.stringify(mockResponse)),
		},
	}

	const response = await axios.post(webhookUrl, mockResponse, config)

	expect(response.status).toBe(Status.OK)
})
