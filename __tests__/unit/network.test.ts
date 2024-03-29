import Environment from 'src/constants/environment'

test('Make sure that testnet has the correct value', () => {
	expect(Environment.TESTNET).toBe('testnet')
})

test('Make sure that previewnet has the correct value', () => {
	expect(Environment.PREVIEWNET).toBe('previewnet')
})

test('Make sure that mainnet has the correct value', () => {
	expect(Environment.MAINNET).toBe('mainnet')
})
