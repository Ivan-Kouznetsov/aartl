import * as http from 'http';
import * as https from 'https';
import { TextEncoder } from 'util';
const httpkeepAliveAgent = new http.Agent({ keepAlive: true });
const httpskeepAliveAgent = new https.Agent({ keepAlive: true });

/**
 * Helpers
 */

const splitUrl = (url: string) => {
  // https://tools.ietf.org/html/rfc3986#appendix-B
  const parts = url.trim().match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
  if (parts === null) throw `Invalid url: ${url}`;
  const protocol = parts[2];
  const rawHostname = parts[4];
  const path = parts[5];

  const port = /(?<=:)\d+/.test(rawHostname) ? (/(?<=:)\d+/.exec(rawHostname) ?? [null])[0] : null;
  const hostnameMatches = /(\w|\.)+(?=:{0,1})/.exec(rawHostname);
  if (hostnameMatches === null) throw `Invalid url: ${url}`;

  return { protocol, hostname: hostnameMatches[0], path, port };
};

const headerArrayToHashTable = (rawHeaders: string[]): { [key: string]: string } => {
  const result: { [key: string]: string } = {};
  for (let i = 0; i < rawHeaders.length; i = i + 2) {
    result[rawHeaders[i]] = rawHeaders[i + 1];
  }

  return result;
};

const tryParseJson = (str: string): Record<string, unknown> | null => {
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
  body?: string,
  timeout?: number
): Promise<{
  json: Record<string, unknown> | null;
  string: string;
  headers: { [key: string]: string };
  status?: number;
}> => {
  const urlParts = splitUrl(url);

  return new Promise((resolve, reject) => {
    if (['http', 'https'].includes(urlParts.protocol.toLowerCase()) === false) {
      reject('Only http and https supported');
      return;
    }
    if (timeout) {
      setTimeout(() => {
        reject('Timed out');
      }, timeout);
    }

    if (body !== undefined) {
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
      agent: urlParts.protocol === 'http' ? httpkeepAliveAgent : httpskeepAliveAgent,
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
            json,
            string: data,
            headers: headerArrayToHashTable(res.rawHeaders),
            status: res.statusCode,
          });
        });
      })
      .on('error', (err) => {
        reject(err.message);
      });

    if (body) req.write(body);
    req.end();
  });
};
