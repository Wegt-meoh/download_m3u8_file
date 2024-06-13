import fs from 'node:fs'
import path from 'node:path'
import { Parser } from 'm3u8-parser'
import { download, downloadTs } from './download.js'
import { combineTs } from './combineTs.js'
import { PromisePool } from '@supercharge/promise-pool'
import config from '../config.js'

for (const url of config.urlList) {
    const handledUrl = url.endsWith('/') ? url.slice(0, -1) : url
    const saveDir = path.resolve(config.downloadDir, handledUrl.slice(-6))
    await work(handledUrl, saveDir)
}

async function work(url, saveDir) {
    if (fs.existsSync(saveDir)) {
        throw new Error(saveDir + ' is exist')
    }
    fs.mkdirSync(saveDir, { recursive: true })

    // download m3u8 file and key file
    const m3u8Filepath = path.join(saveDir, 'index.m3u8')
    const keyFilepath = path.join(saveDir, 'key')

    await Promise.all([
        download(m3u8Filepath, url + '/' + 'index.m3u8'),
        download(keyFilepath, url + '/' + 'key'),
    ])

    // get ts file uri
    const parser = new Parser()
    const text = fs.readFileSync(m3u8Filepath)
    parser.push(text)
    parser.end()
    const tsUrl = parser.manifest.segments.map((seg) => seg.uri)

    // download ts file
    // await Promise.all(tsUri.map((uri) => downloadTs(url, uri, 5, downloadDir)));
    await PromisePool.withConcurrency(4)
        .for(tsUrl)
        .process(async (uri) => {
            await downloadTs(url, uri, 5, saveDir)
        })

    // convert ts file to mp4 by using ffmpeg
    await combineTs(saveDir)

    // remove useless files
    fs.readdirSync(saveDir).forEach((filename) => {
        if (!filename.endsWith('mp4')) {
            fs.rmSync(path.join(saveDir, filename))
        }
    })
}
