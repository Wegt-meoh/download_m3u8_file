import { exec } from 'node:child_process'

export async function ffmpegCombineTs(downloadDir) {
    await new Promise((res) => {
        exec(
            `cd ${downloadDir}&&ffmpeg -hide_banner -allowed_extensions ALL -i index.m3u8 -c copy -bsf:a aac_adtstoasc out.mp4`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`)
                    return
                }
                console.log(`stdout: ${stdout}`)
                console.error(`stderr: ${stderr}`)
                res()
            },
        )
    })
}
