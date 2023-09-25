import { spawn } from "child_process";
import fs from "fs-extra";
import { createServer } from "http";
import { createSecureServer } from "http2";
import log from "@vladmandic/pilogger";
import path from "path";
import { fileURLToPath } from "url";
import { readJsonFileSync } from "./utils.mjs";
import { findUpSync } from "find-up";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app configuration
// you can provide your server key and certificate or use provided self-signed ones
// self-signed certificate generated using:
// openssl req -x509 -newkey rsa:4096 -nodes -keyout https.key -out https.crt -days 365 -subj "/C=US/ST=Florida/L=Miami/O=@vladmandic"
// client app does not work without secure server since browsers enforce https for webcam access

const { server } = readJsonFileSync(path.resolve(__dirname, "config.json"));

const httpsKeyPath = findUpSync("https.key");
const key = fs.readFileSync(httpsKeyPath);

const httpsCertPath = findUpSync("https.crt");
const cert = fs.readFileSync(httpsCertPath);

const defaultFolder = path.join(".", "client");

const options = {
  key,
  cert,
  defaultFolder,
  defaultFile: "index.html",
  httpPort: server.httpPort,
  httpsPort: server.httpsPort,
};

// just some predefined mime types
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".wasm": "application/wasm",
  ".m3u8": "application/x-mpegURL",
  ".ts": "video/MP2T",
  ".mpd": "application/dash+xml",
};

function handle(uri) {
  const url = uri.split(/[?#]/)[0];

  const result = {
    ok: false,
    stat: {},
    file: "",
  };

  const checkFile = (f) => {
    result.file = f;
    if (fs.existsSync(f)) {
      result.stat = fs.statSync(f);
      if (result.stat.isFile()) {
        result.ok = true;
        return true;
      }
    }
    return false;
  };

  const checkFolder = (f) => {
    result.file = f;
    if (fs.existsSync(f)) {
      result.stat = fs.statSync(f);
      if (result.stat.isDirectory()) {
        result.ok = true;
        return true;
      }
    }
    return false;
  };

  return new Promise((resolve) => {
    const cwd = process.cwd();

    const { defaultFolder, defaultFile } = options;

    if (checkFile(path.join(__dirname, url))) {
      resolve(result);
      return;
    }

    if (checkFile(path.join(__dirname, url, defaultFile))) {
      resolve(result);
      return;
    }

    if (checkFile(path.join(__dirname, defaultFolder, url))) {
      resolve(result);
      return;
    }

    if (checkFile(path.join(__dirname, defaultFolder, url, defaultFile))) {
      resolve(result);
      return;
    }

    if (checkFolder(path.join(__dirname, url))) {
      resolve(result);
      return;
    }

    if (checkFolder(path.join(__dirname, defaultFolder, url))) {
      resolve(result);
      return;
    }

    resolve(result);
  });
}

// process http requests
async function httpRequest(req, res) {
  handle(decodeURI(req.url)).then((result) => {
    // get original ip of requestor, regardless if it's behind proxy or not
    const forwarded = (req.headers["forwarded"] || "").match(/for="\[(.*)\]:/);

    const ip =
      (Array.isArray(forwarded) ? forwarded[1] : null) ||
      req.headers["x-forwarded-for"] ||
      req.ip ||
      req.socket.remoteAddress;

    if (!result || !result.ok || !result.stat) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end("Error 404: Not Found\n", "utf-8");
      log.warn(
        `${req.method}/${req.httpVersion}`,
        res.statusCode,
        decodeURI(req.url),
        ip
      );
      return;
    }

    if (result?.stat?.isFile()) {
      const ext = String(path.extname(result.file)).toLowerCase();
      const contentType = mime[ext] || "application/octet-stream";

      res.writeHead(200, {
        "Content-Language": "en",
        "Content-Type": contentType,
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
        "Access-Control-Allow-Origin": "*",
      });

      if (!req.headers.range) {
        const stream = fs.createReadStream(result.file);
        stream.pipe(res); // don't compress data
        log.data(
          `${req.method}/${req.httpVersion}`,
          "full",
          res.statusCode,
          contentType,
          result.stat.size,
          req.url,
          ip
        );
        return;
      }

      const range = req.headers.range.split("=")[1].split("-");
      const start = parseInt(range[0] || 0);
      const end = parseInt(range[1] || 0);

      if (end - start > 0) {
        const buffer = Buffer.alloc(end - start);
        const fd = fs.openSync(result.file, "r");
        fs.readSync(fd, buffer, 0, end - start, start);
        fs.closeSync(fd);
        res.write(buffer);
        log.data(
          `${req.method}/${req.httpVersion}`,
          "range",
          res.statusCode,
          contentType,
          start,
          end,
          end - start,
          req.url,
          ip
        );

        return;
      }

      const stream = fs.createReadStream(result.file);
      stream.pipe(res);
      log.data(
        `${req.method}/${req.httpVersion}`,
        "full",
        res.statusCode,
        contentType,
        0,
        0,
        result.stat.size,
        req.url,
        ip
      );
      return;
    }

    if (result?.stat?.isDirectory()) {
      res.writeHead(200, {
        "Content-Language": "en",
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      });
      let dir = fs.readdirSync(result.file);
      dir = dir.map((f) => path.join(decodeURI(req.url), f));
      res.end(JSON.stringify(dir), "utf-8");
      log.data(
        `${req.method}/${req.httpVersion}`,
        res.statusCode,
        "directory/json",
        result.stat.size,
        req.url,
        ip
      );
    }
  });
}

async function startStreamServer() {
  const streamPath = path.resolve(__dirname, "stream");
  const streamServer = spawn(streamPath);

  streamServer.stdout.on("data", (data) =>
    log.data("stream:", data?.toString().replace(/[\r\n]+/gm, ""))
  );

  streamServer.stderr.on("data", (data) =>
    log.data("stream:", data?.toString().replace(/[\r\n]+/gm, ""))
  );

  streamServer.on("close", (data) =>
    log.data("stream closed:", data?.toString())
  );
}

// app main entry point
async function main() {
  log.header();
  process.chdir(path.join(__dirname, ".."));

  if (options.httpPort && options.httpPort > 0) {
    const server1 = createServer(options, httpRequest);

    server1.on("listening", () =>
      log.state("http server listening:", options.httpPort)
    );

    server1.on("error", (err) => log.error("http server:", err.message || err));
    server1.listen(options.httpPort);
  }

  if (options.httpsPort && options.httpsPort > 0) {
    const server2 = createSecureServer(options, httpRequest);

    server2.on("listening", () =>
      log.state("http2 server listening:", options.httpsPort)
    );

    server2.on("error", (err) =>
      log.error("http2 server:", err.message || err)
    );

    server2.listen(options.httpsPort);
  }

  if (server.startStreamServer) {
    startStreamServer();
  }
}

main().catch((err) => {
  log.error("💥main:", err.message || err);
  throw err;
});
