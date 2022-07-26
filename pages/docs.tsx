import 'swagger-ui-react/swagger-ui.css'

import dynamic from 'next/dynamic'
import { SwaggerUIProps } from 'swagger-ui-react'
const SwaggerUI = dynamic<SwaggerUIProps>(import('swagger-ui-react'), {
	ssr: false,
})

function ApiDoc() {
	return <SwaggerUI url="/api/docs" />
}

export default ApiDoc
