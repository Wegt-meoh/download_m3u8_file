import path from 'path'
import { PromisePool } from '@supercharge/promise-pool'
import { ffmpegCombineTs } from './media.js'
import { download } from './utils.js'
import fs from 'fs'
import { Parser } from 'm3u8-parser'

export default async function work(url, saveDir) {
    if (fs.existsSync(saveDir) && fs.readdirSync(saveDir).length === 0) {
        throw new Error(saveDir + ' is exist')
    }
    fs.mkdirSync(saveDir, { recursive: true })

    // download m3u8 file and key file
    const m3u8Filepath = path.join(saveDir, 'index.m3u8')
    const keyFilepath = path.join(saveDir, 'key')

    await download(m3u8Filepath, url + '/' + 'index.m3u8')

    // get ts file uri
    const parser = new Parser()
    const text = fs.readFileSync(m3u8Filepath)
    parser.push(text)
    parser.end()

    console.log(parser.manifest.segments[0])
    console.log(parser.manifest.segments[1])
    return
    const tsUri = parser.manifest.segments.map((seg) => seg.uri)

    // download ts file
    const downloadResult = await PromisePool.withConcurrency(4)
        .for(tsUri)
        .process(async (uri) => {
            await download(
                path.join(saveDir, uri),
                url + '/' + tsUri,
                undefined,
                4,
            )
        })

    if (downloadResult.errors.length === 0) {
        // convert ts file to mp4 by ffmpeg
        await ffmpegCombineTs(saveDir)

        // remove template files
        fs.readdirSync(saveDir).forEach((filename) => {
            if (!filename.endsWith('mp4')) {
                fs.rmSync(path.join(saveDir, filename))
            }
        })
    } else {
        console.log(
            `have ${downloadResult.errors.length} items can't be downloaded`,
        )
    }
}
