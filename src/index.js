import path from 'path'
import { parseUrl } from './utils.js'
import config from '../config.js'
import work from './work.js'

for (const url of config.urlList) {
    const handledUrl = parseUrl(url)
    const saveDir = path.resolve(config.downloadDir, handledUrl.slice(-6))
    await work(handledUrl, saveDir)
}
