import { exec } from "node:child_process";

export function combineTs(downloadDir) {
  exec(
    `cd ${downloadDir}&&ffmpeg -allowed_extensions ALL -i index.m3u8 -c copy -bsf:a aac_adtstoasc out.mp4`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );
}
