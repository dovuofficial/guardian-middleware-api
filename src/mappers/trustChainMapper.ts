import { components } from 'src/spec/openapi'

type TrustChainDocument = components['schemas']['TrustChainDocument']

export default (guardianTrustChainBlockData): TrustChainDocument[] =>
	guardianTrustChainBlockData
		.map(({ vpDocument, mintDocument, policyDocument, documents }) => ({
			hash: vpDocument.hash,
			tokenId: mintDocument.tokenId,
			mintDate: mintDocument.date,
			mintAmount:
				documents[0].document.document.credentialSubject[0].amount,
			topicId: vpDocument.document.topicId,
			issuer: {
				did: mintDocument.issuer,
				username: mintDocument.username,
			},
			createDate: vpDocument.document.createDate,
			updateDate: vpDocument.document.updateDate,
			messageId: vpDocument.document.messageId,
			proof: { ...vpDocument.document.document.proof },
			policy: {
				id: policyDocument.document.id,
				name: policyDocument.name,
				description: policyDocument.description,
				version: policyDocument.version,
				issuer: {
					did: policyDocument.issuer,
					username: policyDocument.username,
				},
				createDate: policyDocument.document.createDate,
				updateDate: policyDocument.document.updateDate,
			},
			trustChain: documents.map(
				({
					title,
					description,
					visible,
					issuer,
					username,
					document,
				}) => ({
					title,
					description,
					visible,
					issuer: {
						did: issuer,
						username,
					},
					messageId: document.messageId,
					issuanceDate: document.document.issuanceDate,
					createDate: document.createDate,
					updateDate: document.updateDate,
					proof: { ...document.document.proof },
					type: document.type,
				})
			),
		}))
		.filter((item) => !!parseFloat(item.mintAmount))
