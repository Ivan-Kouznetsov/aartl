import * as http from 'http';
import * as https from 'https';
import { TextEncoder } from 'util';
import { xml2json } from './xml2json';

const httpkeepAliveAgent = new http.Agent({ keepAlive: true });
const httpskeepAliveAgent = new https.Agent({ keepAlive: true });

/**
 * Types
 */

export interface IHashTable {
  [key: string]: string;
}

export enum ResponseDataType {
  Json,
  Xml,
  Other,
}

/**
 * Helpers
 */

const splitUrl = (url: string) => {
  // https://tools.ietf.org/html/rfc3986#appendix-B
  const parts = url.trim().match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
  if (parts === null) throw `Invalid url: ${url}`;
  const protocol = parts[2];
  const rawHostname = parts[4];
  const path = parts[5] + (parts[6] ?? '');

  const port = /(?<=:)\d+/.test(rawHostname) ? (/(?<=:)\d+/.exec(rawHostname) ?? [null])[0] : null;
  const hostnameMatches = /(\w|\.)+(?=:{0,1})/.exec(rawHostname);
  if (hostnameMatches === null) throw `Invalid url: ${url}`;

  return { protocol, hostname: hostnameMatches[0], path, port };
};

const headerArrayToHashTable = (rawHeaders: string[]): IHashTable => {
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

const tryParseXml = (str: string): Record<string, unknown> | null => {
  try {
    return <Record<string, unknown>>xml2json(str);
  } catch {
    return null;
  }
};

const getType = (headers: IHashTable): ResponseDataType => {
  if (getHeaderValue(headers, 'Content-Type')?.includes('json')) return ResponseDataType.Json;
  if (getHeaderValue(headers, 'Content-Type')?.includes('xml')) return ResponseDataType.Xml;
  return ResponseDataType.Other;
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
          const headers = headerArrayToHashTable(res.rawHeaders);
          const dataType = getType(headers);

          const json = dataType === ResponseDataType.Json ? tryParseJson(data) : null;
          const jsonFromXml = dataType === ResponseDataType.Xml ? tryParseXml(data) : null;

          resolve({
            json: json ?? jsonFromXml,
            string: data,
            headers,
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

export const getHeaderValue = (headers: IHashTable, name: string): string | null => {
  const keys = Object.keys(headers);
  for (const key of keys) {
    if (key.toLowerCase() === name.toLowerCase()) return headers[key];
  }
  return null;
};
