import { BlockData } from '@app/guardian/policies'
import guardian from '../guardian'

const executeRootBlock = async (accessToken: string, policyId: string) => {
	const rootBlock = await guardian.policies.blocks(accessToken, policyId)
	await executeBlock(accessToken, policyId, rootBlock.id)
	console.log(`Finished root block execution for policy: ${policyId}`)
}

const interfaceContainerBlock = async (
	accessToken: string,
	policyId: string,
	blockData: BlockData
) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)

	const blocks = blockData.blocks?.filter((element) => element != null)
	if (!blocks) {
		return
	}
	for (let i = 0; i < blocks.length; i++) {
		const stop = await executeBlock(accessToken, policyId, blocks[i].id)
		if (stop) {
			return true
		}
		return await executeBlock(accessToken, policyId, blockData.id)
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

	if (!blockData.roles) {
		return
	}

	blockData.roles.forEach((element, ix) => {
		console.log(`[${ix}] - ${element}`)
	})

	while (true) {
		const ix = 0
		if (!isNaN(ix) && blockData.roles.length > ix && ix >= 0) {
			const data = { role: blockData.roles[ix] }
			await guardian.policies.sendToBlock(
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
	if (!blockData.blocks) {
		return
	}

	const blocks = blockData.blocks.filter((element) => element != null)
	for (let i = 0; i < blocks.length; i++) {
		const stop = await executeBlock(accessToken, policyId, blocks[i].id)
		if (stop) {
			return true
		}
		await executeBlock(accessToken, policyId, blockData.id) // Re-execute this block
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
	if (!blockData.schema) {
		return
	}

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

	await guardian.policies.sendToBlock(
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
	return true
}

const executeBlock = async (
	accessToken: string,
	policyId: string,
	blockId: string
): Promise<boolean | void> => {
	const data = await guardian.policies.blockById(
		accessToken,
		policyId,
		blockId
	)
	// console.log(data.blockType)
	switch (data.blockType) {
		case 'interfaceContainerBlock':
			return interfaceContainerBlock(accessToken, policyId, data)
		case 'interfaceStepBlock':
			return interfaceStepBlock(accessToken, policyId, data)
		case 'policyRolesBlock':
			return policyRolesBlock(accessToken, policyId, data)
		case 'requestVcDocumentBlock':
			return requestVcDocument(accessToken, policyId, data)
		case 'informationBlock':
			return informationBlock(accessToken, policyId, data)

		default:
			// Guardian does not send some data for this blocks
			if (data.roles) {
				// policyRolesBlock
				return policyRolesBlock(accessToken, policyId, {
					id: blockId,
					roles: data.roles,
					uiMetaData: data.uiMetaData,
					blockType: 'policyRolesBlock',
				})
			}
			if (
				Object.getOwnPropertyNames(data).length === 1 &&
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

	return Promise.resolve()
}

const indexHedera = {
	executeRootBlock: (token: string, policyId: string) =>
		executeRootBlock(token, policyId),
}

export default indexHedera
