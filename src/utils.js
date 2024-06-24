import fs from 'fs'

export function parseUrl(url) {
    return url.endsWith('/') ? url.slice(0, -1) : url
}

/**
 *
 * @param {string} filepath
 * @param {string} url
 * @param {number} timeout default: 4000ms
 * @param {number} retryTime default: 0
 * @param {string | undefined} cookie
 */
export async function download(
    filepath,
    url,
    timeout = 4000,
    retryTime = 1,
    cookie,
) {
    const retry = async () => {
        const controller = new AbortController()

        setTimeout(() => {
            controller.abort('fetch timeout')
        }, timeout)

        try {
            const res = await fetch(url, {
                signal: controller.signal,
                headers: { Cookie: cookie },
            })

            const data = await res.arrayBuffer()
            fs.writeFileSync(filepath, Buffer.from(data), {
                flag: 'wx',
            })

            console.log(filepath + ' downloaded')
        } catch (err) {
            console.error(err.name + ': ' + err.message)
            countRetryTime += 1
            if (countRetryTime < retryTime) {
                await sleep(2)
                await retry()
            } else {
                return Promise.reject()
            }
        }
    }

    let countRetryTime = 0
    await retry()
}

async function sleep(timeout) {
    await new Promise((res) => {
        setTimeout(() => {
            res()
        }, timeout)
    })
}
