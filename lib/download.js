import fs, { promises as fsPromises } from "node:fs";
import path from "node:path";

export async function downloadKey(downloadDir, keyUrl) {
  const res = await fetch(keyUrl);
  const data = await res.arrayBuffer();
  fs.writeFileSync(path.join(downloadDir, "key"), Buffer.from(data), {
    flag: "w",
  });
}

export async function downloadM3u8(downloadDir, indexUrl) {
  const res = await fetch(indexUrl);
  const data = await res.arrayBuffer();
  fs.writeFileSync(path.join(downloadDir, "index.m3u8"), Buffer.from(data), {
    flag: "w",
  });
}

export async function downloadTs(prefix, uri, maxRetryTime, downloadDir) {
  let tryTime = 0;
  const tsUrl = prefix + "/" + uri;
  const fileName = path.join(downloadDir, uri);
  fs.mkdirSync(downloadDir, { recursive: true });

  const retry = async () => {
    try {
      tryTime++;
      const res = await fetch(tsUrl);
      const data = await res.arrayBuffer();
      await fsPromises.writeFile(fileName, Buffer.from(data), { flag: "w" });
      console.log(uri + " download completed");
    } catch (error) {
      if (tryTime < maxRetryTime) {
        await retry();
        console.log(uri + " download failed retry " + tryTime + " times");
      } else {
        console.log("failed download " + uri);
        console.log(error);
      }
    }
  };

  await retry();
}
