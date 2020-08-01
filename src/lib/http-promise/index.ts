import * as http from 'http';
import * as https from 'https';
import { TextEncoder } from 'util';

/**
 * Helpers
 */

const splitUrl = (url: string) => {
  // https://tools.ietf.org/html/rfc3986#appendix-B
  const parts = url.trim().match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
  const protocol = parts[2];
  const rawHostname = parts[4];
  const path = parts[5];
  const port = /:\d+/.test(rawHostname) ? /(?<=:)\d+/.exec(rawHostname)[0] : null;

  return { protocol, hostname: /(\w|\.)+(?=:{0,1})/.exec(rawHostname)[0], path, port };
};

const headerArrayToHashTable = (rawHeaders: string[]): { [key: string]: string } => {
  const result: { [key: string]: string } = {};
  for (let i = 0; i < rawHeaders.length; i = i + 2) {
    result[rawHeaders[i]] = rawHeaders[i + 1];
  }

  return result;
};

const tryParseJson = (str: string): Record<string, unknown> => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

export const request = (
  url: string,
  method: string,
  headers: { [key: string]: string },
  body: string,
  timeout?: number
): Promise<{
  error: string;
  response: { json: Record<string, unknown>; string: string; headers: { [key: string]: string }; status?: number };
}> => {
  const urlParts = splitUrl(url);

  return new Promise((resolve, _) => {
    if (['http', 'https'].includes(urlParts.protocol.toLowerCase()) === false) {
      resolve({ error: 'Only http and https supported', response: null });
      return;
    }
    if (timeout) {
      setTimeout(() => {
        resolve({ error: 'Timed out', response: null });
      }, timeout);
    }

    if (body !== null) {
      headers['Content-Length'] = new TextEncoder().encode(body).length.toString();
      if (headers['Content-Type'] === undefined) {
        if (!/{.+}/.test(body)) {
          headers['Content-Type'] = 'text/plain';
        } else {
          headers['Content-Type'] = 'application/json';
        }
      }
    }
    const options = {
      protocol: urlParts.protocol + ':',
      hostname: urlParts.hostname,
      port: urlParts.port ?? (urlParts.protocol === 'http' ? 80 : 443),
      path: urlParts.path,
      method: method,
      headers: headers,
    };

    const req = (urlParts.protocol === 'http' ? http : https)
      .request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const json = tryParseJson(data);
          resolve({
            response: {
              json,
              string: data,
              headers: headerArrayToHashTable(res.rawHeaders),
              status: res.statusCode,
            },
            error: null,
          });
        });
      })
      .on('error', (err) => {
        resolve({ error: err.message, response: null });
      });

    if (body) req.write(body);
    req.end();
  });
};
