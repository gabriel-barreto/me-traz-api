const { MONGO_URI: uri = '' } = process.env

export default {
  uri,
  options: {
    keepAlive: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
}
