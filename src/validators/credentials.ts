import Joi from 'joi'

const schema = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
})

export default (candidate = {}): Array<string> | void => {
	const validation = schema.validate(candidate, { abortEarly: false })

	if (validation.error) {
		return validation.error.details.map((error) => error.message)
	}

	return null
}
