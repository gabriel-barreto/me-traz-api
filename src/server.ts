import http from 'http'

import App from './app'

import { api as config } from './Configs'

http.createServer(App.app).listen(config.port, App.listen)
