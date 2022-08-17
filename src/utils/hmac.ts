import Crypto from 'crypto'

function base64Sha256(object: Record<string, unknown>): string {
	return Crypto.createHash('sha256')
		.update(JSON.stringify(object))
		.digest('base64')
}

export function generateStringToSign(
	verb: string,
	host: string,
	url: string,
	date: string,
	contentHash?: string
): string {
	if (contentHash) {
		return `${verb}\n${url}\n${date};${host};${contentHash}`
	}

	return `${verb}\n${url}\n${date};${host}`
}

export function generateHmac(stringToSign: string, secret: string): string {
	if (typeof stringToSign !== 'string') {
		throw new Error('Your payload object must be converted in to a string')
	}

	return Crypto.createHmac('sha256', secret)
		.update(stringToSign)
		.digest('base64')
}

export function generateHeaders(
	verb: string,
	secret: string,
	url: string,
	body?: Record<string, unknown>
): any {
	const endpoint = new URL(url)
	const { host, pathname } = endpoint
	const date = new Date().toUTCString()

	const contentHash = body && base64Sha256(body)

	const stringToSign = generateStringToSign(
		verb,
		host,
		pathname,
		date,
		contentHash
	)

	const signature = generateHmac(stringToSign, secret)

	return {
		...(contentHash ? { 'x-content-sha256': contentHash } : {}),
		'x-signature': signature,
		'x-date': date,
	}
}

export function validateSignature(
	stringToSign: string,
	signature: string,
	secret: string
): boolean {
	const hash = generateHmac(stringToSign, secret)

	return hash === signature
}
