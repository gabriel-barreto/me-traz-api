import Mongoose from 'mongoose'

import { mongoose as Config } from '@config'

function connect(): void {
  // ==> Create connection listeners
  Mongoose.connection.on('connected', () => {
    console.log('[MONGO] Connected')
  })
  Mongoose.connection.on('disconnected', () => {
    console.warn('[MONGO] Disconnected')
  })
  Mongoose.connection.on('error', err => {
    console.error(`[MONGO] An error occurred: ${err.message}`)
  })
  Mongoose.connection.on('open', () => {
    console.log('[MONGO] Ready')
  })

  // Connecting
  Mongoose.connect(Config.uri, Config.options)
  Mongoose.Promise = global.Promise
}

export default { connect }
