window.fs = require('fs-extra')
window.os = require('os')
window.path = require('path')
window.cp = require('child_process')
window.jszip = require('jszip')
window.https = require('follow-redirects').https
window.dialog = require('@electron/remote').dialog
window.main = require('@electron/remote').getCurrentWindow()
window.ini = require('ini')

window.formatPath = (path) => {
  if (process.platform === 'win32') {
    return path
      .replace(/^\/c\//i, 'C:\\')
      .replace(/^\//, 'C:\\')
      .replace(/\//g, '\\')
  }
  return path
    .replace(/^(\w):\\/ig, '/$1/')
    .replace(/\\/ig, '/')
}