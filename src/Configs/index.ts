import dotenv from 'dotenv'

import Config from './app.config'

dotenv.config({ path: Config.envPath })

export { Config as app }
export { default as api } from './api.config'
export { default as mongoose } from './mongoose.config'
