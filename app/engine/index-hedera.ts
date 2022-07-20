import { BlockData } from 'app/guardian/policies'
import Guardian from '../guardian'

const executeRootBlock = async (accessToken: string, policyId: string) => {
	const rootBlock = await Guardian.policies.blocks(accessToken, policyId)
	await executeBlock(accessToken, policyId, rootBlock.id)
	console.log(`Finished root block execution for policy: ${policyId}`)
}

const executeBlock = async (
	accessToken: string,
	policyId: string,
	blockId: string
): Promise<boolean | void> => {
	const data = await Guardian.policies.blockById(
		accessToken,
		policyId,
		blockId
	)
	// console.log(data.blockType)
	switch (data.blockType) {
		case 'interfaceContainerBlock':
			return await interfaceContainerBlock(accessToken, policyId, data)
		case 'interfaceStepBlock':
			return await interfaceStepBlock(accessToken, policyId, data)
		case 'policyRolesBlock':
			return await policyRolesBlock(accessToken, policyId, data)
		case 'requestVcDocumentBlock':
			return await requestVcDocument(accessToken, policyId, data)
		case 'informationBlock':
			return informationBlock(accessToken, policyId, data)

		default:
			// Guardian does not send some data for this blocks
			if (data.roles) {
				// policyRolesBlock
				return await policyRolesBlock(accessToken, policyId, {
					id: blockId,
					roles: data.roles,
					uiMetaData: data.uiMetaData,
					blockType: 'policyRolesBlock',
				})
			} else if (
				Object.getOwnPropertyNames(data).length == 1 &&
				data.uiMetaData
			) {
				return informationBlock(accessToken, policyId, {
					id: blockId,
					uiMetaData: data.uiMetaData,
					blockType: 'informationBlock',
				})
			}
			break
	}
	return null
}

const interfaceContainerBlock = async (
	accessToken: string,
	policyId: string,
	blockData: BlockData
) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)

	const blocks = blockData.blocks.filter((element) => element != null)
	for (let i = 0; i < blocks.length; i++) {
		const stop = await executeBlock(accessToken, policyId, blocks[i].id)
		if (stop) {
			return true
		} else {
			return await executeBlock(accessToken, policyId, blockData.id) // Re-execute this block
		}
	}
}

const policyRolesBlock = async (
	accessToken: string,
	policyId: string,
	blockData: BlockData
) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)
	uiMeta.description && console.log(`Description: ${uiMeta.description}`)

	blockData.roles.forEach((element, ix) => {
		console.log(`[${ix}] - ${element}`)
	})

	while (true) {
		const ix = 0
		if (!isNaN(ix) && blockData.roles.length > ix && ix >= 0) {
			const data = { role: blockData.roles[ix] }
			await Guardian.policies.sendToBlock(
				accessToken,
				policyId,
				blockData.id,
				data
			)
			return
		}
	}
}

const interfaceStepBlock = async (
	accessToken: string,
	policyId: string,
	blockData: BlockData
) => {
	const blocks = blockData.blocks.filter((element) => element != null)
	for (let i = 0; i < blocks.length; i++) {
		const stop = await executeBlock(accessToken, policyId, blocks[i].id)
		if (stop) {
			return true
		} else {
			await executeBlock(accessToken, policyId, blockData.id) // Re-execute this block
		}
	}
}

const requestVcDocument = async (
	accessToken: string,
	policyId: string,
	blockData: BlockData
) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)
	uiMeta.description && console.log(`Description: ${uiMeta.description}`)

	console.log('Fields: ')
	blockData.schema.fields.forEach((field) => {
		console.log(
			`Name: ${field.name} Type: ${field.type} Title: ${
				field.title
			} Req: ${field.required ? 'true' : 'false'}`
		)
	})

	// Generating a document for our schema
	// This should be done by the user instead
	const doc = {
		document: {
			field0: 'A Farm Name',
			field1: 'Pepe Name',
			field2: 100,
			field3: 'Havana Location',
			type: blockData.schema.type,
			'@context': [blockData.schema.contextURL],
		},
		ref: null,
	}

	console.log('Sending document')

	await Guardian.policies.sendToBlock(
		accessToken,
		policyId,
		blockData.id,
		doc
	)
}

const informationBlock = (
	accessToken: string,
	policyId: string,
	blockData: BlockData
) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)
	uiMeta.description && console.log(`Description: ${uiMeta.description}`)
	return true // stop processing
}

const indexHedera = {
	executeRootBlock: (token: string, policyId: string) =>
		executeRootBlock(token, policyId),
}

export default indexHedera
