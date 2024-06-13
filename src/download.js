import fs, { promises as fsPromises } from 'node:fs'
import path from 'node:path'

export async function download(downloadPath, url) {
    const res = await fetch(url)
    const data = await res.arrayBuffer()

    fs.writeFileSync(downloadPath, Buffer.from(data), {
        flag: 'w',
    })
}

export async function downloadTs(prefix, uri, maxRetryTime, downloadDir) {
    let tryTime = 0
    const tsUrl = prefix + '/' + uri
    const fileName = path.join(downloadDir, uri)

    fs.mkdirSync(downloadDir, { recursive: true })

    const retry = async () => {
        try {
            tryTime++
            const res = await fetch(tsUrl)
            const data = await res.arrayBuffer()
            await fsPromises.writeFile(fileName, Buffer.from(data), {
                flag: 'w',
            })
            console.log(uri + ' download completed')
        } catch (error) {
            if (tryTime < maxRetryTime) {
                await new Promise((res) => {
                    setTimeout(() => {
                        res()
                    }, 2000)
                })
                await retry()
                console.log(
                    uri + ' download failed retry ' + tryTime + ' times',
                )
            } else {
                console.log('failed download ' + uri)
                console.log(error)
            }
        }
    }

    await retry()
}
