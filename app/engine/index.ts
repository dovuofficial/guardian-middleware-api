import Guardian from '../guardian'

const executeRootBlock = async (accessToken, policyId, doc) => {
	const rootBlock = await Guardian.policies.blocks(accessToken, policyId)
	await executeBlock(accessToken, policyId, rootBlock.id, doc)
	console.log(`Finished root block execution for policy: ${policyId}`)
}

const executeTag = async (accessToken, policyId, tag, doc) => {
	const blockId = await Guardian.policies.blockByTag(
		accessToken,
		policyId,
		tag
	)

	await executeBlock(accessToken, policyId, blockId, doc)
}

const fetchBlockSubmissions = async (accessToken, policyId, tag) => {
	const blockId = await Guardian.policies.blockByTag(
		accessToken,
		policyId,
		tag
	)

	return await Guardian.policies.blockById(accessToken, policyId, blockId)
}

const sendActionToBlock = async (accessToken, policyId, blockId, doc) => {
	// console.log(doc)
	console.log(blockId)

	// tighten this.
	await Guardian.policies.sendToBlock(accessToken, policyId, blockId, doc)
}

const executeBlock = async (accessToken, policyId, blockId, doc) => {
	const data = await Guardian.policies.blockById(
		accessToken,
		policyId,
		blockId
	)

	console.log(data.blockType)

	switch (data.blockType) {
		case 'interfaceContainerBlock':
			return await interfaceContainerBlock(
				accessToken,
				policyId,
				data,
				doc
			)
		case 'interfaceStepBlock':
			return await interfaceStepBlock(accessToken, policyId, data, doc)
		case 'policyRolesBlock':
			return await policyRolesBlock(accessToken, policyId, data, doc)
		case 'requestVcDocumentBlock':
			return await requestVcDocument(accessToken, policyId, data, doc)
		case 'interfaceActionBlock':
			return await sendActionToBlock(accessToken, policyId, blockId, doc)
		case 'buttonBlock': // This has been added as a "buttonBlock" is a thing
			return await sendActionToBlock(accessToken, policyId, blockId, doc)
		case 'informationBlock':
			return await informationBlock(data)

		default:
			// Guardian does not send some data for this blocks
			if (data.roles) {
				// policyRolesBlock
				return await policyRolesBlock(
					accessToken,
					policyId,
					{
						id: blockId,
						roles: data.roles,
						uiMetaData: data.uiMetaData,
						blockType: 'policyRolesBlock',
					},
					doc
				)
			} else if (
				Object.getOwnPropertyNames(data).length == 1 &&
				data.uiMetaData
			) {
				return await informationBlock({
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
	accessToken,
	policyId,
	blockData,
	doc
) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)

	console.log('stuck')
	console.log(blockData)

	const blocks = blockData.blocks.filter((element) => element != null)
	for (let i = 0; i < blocks.length; i++) {
		const stop = await executeBlock(
			accessToken,
			policyId,
			blocks[i].id,
			doc
		)
		if (stop) {
			return true
		} else {
			return await executeBlock(accessToken, policyId, blockData.id, doc) // Re-execute this block
		}
	}
}

const policyRolesBlock = async (accessToken, policyId, blockData, doc) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)
	uiMeta.description && console.log(`Description: ${uiMeta.description}`)

	blockData.roles.forEach((element, ix) => {
		console.log(`[${ix}] - ${element}`)
	})

	while (true) {
		// rl.question('Rol: ? ', async function (rol) {
		// let ix = parseInt(rol);
		const ix = 0
		if (!isNaN(ix) && blockData.roles.length > ix && ix >= 0) {
			const data = { role: blockData.roles[ix] }
			await Guardian.policies.sendToBlock(
				accessToken,
				policyId,
				blockData.id,
				data,
				doc
			)
			return
		}
		// });
	}
}

const interfaceStepBlock = async (accessToken, policyId, blockData, doc) => {
	const blocks = blockData.blocks.filter((element) => element != null)
	for (let i = 0; i < blocks.length; i++) {
		const stop = await executeBlock(
			accessToken,
			policyId,
			blocks[i].id,
			doc
		)
		if (stop) {
			return true
		} else {
			await executeBlock(accessToken, policyId, blockData.id, doc) // Re-execute this block
		}
	}
}

const requestVcDocument = async (accessToken, policyId, blockData, doc) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)
	uiMeta.description && console.log(`Description: ${uiMeta.description}`)

	// We adjust the doc with injecting context and schema types were appropriate
	doc.document['@context'] = blockData.schema.contextURL
	doc.document['type'] = blockData.schema.type

	blockData.schema.fields.map((field) => {
		if (!field.isRef) {
			return
		}

		doc.document[field.name].type = field.type.substring(1)
	})

	console.log('Sending document')

	await Guardian.policies.sendToBlock(
		accessToken,
		policyId,
		blockData.id,
		doc
	)
}

const informationBlock = async (blockData) => {
	const uiMeta = blockData.uiMetaData
	uiMeta.title && console.log(`Title: ${uiMeta.title}`)
	uiMeta.description && console.log(`Description: ${uiMeta.description}`)
	return true // stop processing
}

// TODO: This should be more fluent with injecting policy id and modifying auth
// Possible signature:
// Engine.usePolicy(policyId).authorise(token).executeBlock(block)
// Engine.usePolicy(policyId).authorise(token).withTag('tag').executeBlock(doc)
const engine = {
	executeRootBlock: (token, policyId, doc) =>
		executeRootBlock(token, policyId, doc),
	executeBlock: (token, policyId, blockId, doc) =>
		executeBlock(token, policyId, blockId, doc),
	executeBlockViaTag: (token, policyId, tag, doc) =>
		executeTag(token, policyId, tag, doc),
	fetchBlockSubmissions: (token, policyId, tag) =>
		fetchBlockSubmissions(token, policyId, tag),
}

export default engine
