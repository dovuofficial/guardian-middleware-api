import Joi from 'joi'
import { components } from 'src/spec/openapi'

type EcologicalProject = components['schemas']['EcologicalProject']

const schema = Joi.object({
	field0: Joi.string().required(),
	field1: Joi.string().required(),
	field2: Joi.number().required(),
	field3: Joi.string().required(),
	field4: Joi.string().required(),
	field5: Joi.string().required(),
	field6: Joi.string().required(),
	field7: Joi.string().required(),
	field8: Joi.string().required(),
})

export default (candidate: EcologicalProject): Array<string> | void => {
	const validation = schema.validate(candidate, { abortEarly: false })

	if (validation.error) {
		return validation.error.details.map((error) => error.message)
	}

	return null
}
