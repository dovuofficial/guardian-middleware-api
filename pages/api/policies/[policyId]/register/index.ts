import onlyPost from '@app/middleware/onlyPost'
import prepare from '@app/utils/prepare'
import useGuardianContext from '@app/context/useGuardianContext'
import registerProjectHandler from '@app/handler/policies/registerProjectHandler'

export default prepare(onlyPost, useGuardianContext)(registerProjectHandler)
