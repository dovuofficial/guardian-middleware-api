/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { createSwaggerSpec } from 'next-swagger-doc'
import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'
import Config from 'app/config'

const SwaggerUI = dynamic<{
	spec: any
}>(import('swagger-ui-react'), { ssr: false })

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	return <SwaggerUI spec={spec} />
}

export const getStaticProps: GetStaticProps = () => {
	const spec: Record<string, any> = createSwaggerSpec({
		definition: Config.openApiDefinition,
	})

	return {
		props: {
			spec,
		},
	}
}

export default ApiDoc
