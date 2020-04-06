import compression from 'compression'
import cors from 'cors'
import express, { Application } from 'express'
import helmet from 'helmet'
import logger from 'morgan'

import { api as ApiConfig, app as AppConfig } from '@config'
import { Mongoose } from '@functions'

import ApiRouter from '@router'

class App {
  public app: Application

  constructor() {
    this.app = express()

    this.setup()
  }

  private setup(): void {
    this.app.use(compression())
    this.app.use(cors())
    this.app.use(helmet())
    this.app.use(express.json())

    if (AppConfig.env === 'development') this.app.use(logger('dev'))

    // Coonect to MongoDB
    Mongoose.connect()

    this.app.use('/api', ApiRouter)
  }

  public listen(): void {
    // ==> Showing API running infos
    console.log('')
    console.log('[API] ONLINE!')
    console.log(`[API] Mode: ${AppConfig.env}`)
    console.log(`[API] Port: ${ApiConfig.port}`)
    console.log('')
  }
}

export default new App()
