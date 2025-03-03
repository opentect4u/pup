import { MMKV, Mode } from 'react-native-mmkv'

export const loginStorage = new MMKV({
    id: `login-store`,
    encryptionKey: `ssspl@signature`,
    mode: Mode.MULTI_PROCESS,
})

export const fileStorage = new MMKV({
    id: `file-store`,
    encryptionKey: `ssspl@signature`,
    mode: Mode.MULTI_PROCESS,
})

export const projectStorage = new MMKV({
    id: `project-store`,
    encryptionKey: `ssspl@signature`,
    mode: Mode.MULTI_PROCESS,
})