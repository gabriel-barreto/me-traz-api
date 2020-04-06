/* eslint-disable @typescript-eslint/no-var-requires */
const { dest, series, src } = require('gulp')
const ts = require('gulp-typescript')
const copy = require('gulp-copy')
const rimraf = require('rimraf')

const tsProject = ts.createProject('tsconfig.json')

function clean(cb) {
  rimraf('dist', cb)
}

function buildTs(cb) {
  src('src/**/*.ts')
    .pipe(tsProject())
    .pipe(dest('dist'))
  cb()
}

function copyTemplatesHtml(cb) {
  src('src/Templates/html/*.*').pipe(copy('dist', { prefix: 1 }))
  cb()
}

function copyTemplatesTxt(cb) {
  src('src/Templates/text/*.*').pipe(copy('dist', { prefix: 1 }))
  cb()
}

exports.default = series(clean, buildTs, copyTemplatesTxt, copyTemplatesHtml)
