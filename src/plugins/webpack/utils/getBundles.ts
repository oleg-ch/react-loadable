import reduce from 'lodash/reduce'
import { BuildManifest, BuildManifestItem } from '../../../types'

const getBundles = (manifest: BuildManifest, moduleIds: string[]) => {
    return reduce(
        moduleIds,
        (acc, moduleId) => {
            return acc.concat(manifest[moduleId])
        },
        [] as BuildManifestItem[]
    )
}

export { getBundles }
