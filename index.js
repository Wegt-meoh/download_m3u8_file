import fs from "node:fs";
import path from "node:path";
import { Parser } from "m3u8-parser";
import { downloadKey, downloadM3u8, downloadTs } from "./lib/download.js";
import { combineTs } from "./lib/combineTs.js";

const downloadDir = "ts1";
// const url = "https://example.com";
const url =
  "https://bspbf.seyrfy.com/exclusive/2023-12-20/e52dadc730d70ca3d91563d1e5a6ae5a1702449775163-83274c79fa68461d84e6a321163ea2ab";
fs.mkdirSync(downloadDir, { recursive: true });

// download m3u8 file
await downloadM3u8(downloadDir, url + "/" + "index.m3u8");

// download key file if ts is encrypted
await downloadKey(downloadDir, url + "/" + "key");

// get ts file uri
const parser = new Parser();
const text = fs.readFileSync(path.join(downloadDir, "index.m3u8"));
parser.push(text);
parser.end();
const tsUri = parser.manifest.segments.map((seg) => seg.uri);

// download ts file
await Promise.all(tsUri.map((uri) => downloadTs(url, uri, 5, downloadDir)));

// convert ts file to mp4 by using ffmpeg
combineTs(downloadDir);
