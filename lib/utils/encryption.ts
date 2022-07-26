import crypto, { BinaryLike } from 'crypto'
import config from 'lib/config'

const IV_LENGTH = 16 // For AES, this is always 16

function encrypt(text: BinaryLike, encryptionKey = config.encryptionKey) {
	const iv = Buffer.from(crypto.randomBytes(IV_LENGTH))
		.toString('hex')
		.slice(0, IV_LENGTH)
	const cipher = crypto.createCipheriv(
		'aes-256-cbc',
		Buffer.from(encryptionKey),
		iv
	)
	const encrypted = cipher.update(text)
	const buffer = Buffer.concat([encrypted, cipher.final()])

	return `${iv}:${buffer.toString('hex')}`
}

function decrypt(text: string, encryptionKey = config.encryptionKey) {
	const textParts = text.includes(':') ? text.split(':') : []
	const iv = Buffer.from(textParts.shift() || '', 'binary')
	const encryptedText = Buffer.from(textParts.join(':'), 'hex')
	const decipher = crypto.createDecipheriv(
		'aes-256-cbc',
		Buffer.from(encryptionKey),
		iv
	)
	const decrypted = decipher.update(encryptedText)
	const buffer = Buffer.concat([decrypted, decipher.final()])

	return buffer.toString()
}

const encryption = {
	decrypt,
	encrypt,
}

export default encryption