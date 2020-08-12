/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* JSONPath 0.8.0 - XPath for JSON
 *
 * Copyright (c) 2007 Stefan Goessner (goessner.net)
 * Licensed under the MIT licence.
 */

export enum ResultType {
  Value,
  Path,
}

export function jsonPath(obj: string | Record<string, any>, expr: string, arg?: { resultType: ResultType }) {
  if (expr === '$') return Array.isArray(obj) ? obj : [obj];
  const P = {
    resultType: (arg && arg.resultType) || ResultType.Value,
    result: <any[]>[],
    normalize: function (expr: string) {
      const subx: any[] = [];
      return expr
        .replace(/[\['](\??\(.*?\))[\]']/g, function (_$0: any, $1: any) {
          return '[#' + (subx.push($1) - 1) + ']';
        })
        .replace(/'?\.'?|\['?/g, ';')
        .replace(/;;;|;;/g, ';..;')
        .replace(/;$|'?\]|'$/g, '')
        .replace(/#([0-9]+)/g, function (_$0: any, $1: any) {
          return subx[$1];
        });
    },
    asPath: function (path: string) {
      const x = path.split(';');
      let p = '$';
      for (let i = 1, n = x.length; i < n; i++) p += /^[0-9*]+$/.test(x[i]) ? '[' + x[i] + ']' : "['" + x[i] + "']";
      return p;
    },
    store: function (p: any, v: any) {
      if (p) P.result[P.result.length] = P.resultType == ResultType.Path ? P.asPath(p) : v;
      return !!p;
    },
    trace: function (expr: string, val: string | Record<string, any>[], path: string) {
      if (expr) {
        let x: string | string[] = expr.split(';');
        const loc = x.shift();
        x = x.join(';');
        if (val && val.hasOwnProperty(<string>loc))
          P.trace(x, (<Record<string, any>>val)[<string>loc], path + ';' + loc);
        else if (loc === '*')
          P.walk(loc, x, val, path, function (m: string, _l: any, x: string, v: any, p: any) {
            return P.trace(m + ';' + x, v, p);
          });
        else if (loc === '..') {
          P.trace(x, val, path);
          P.walk(loc, x, val, path, function (m: string, _l: any, x: string, v: { [x: string]: any }, p: string) {
            return typeof v[m] === 'object' && P.trace('..;' + x, v[m], p + ';' + m);
          });
        } else if (/,/.test(<string>loc)) {
          // [name1,name2,...]
          for (let s = (<string>loc).split(/'?,'?/), i = 0, n = s.length; i < n; i++)
            P.trace(s[i] + ';' + x, val, path);
        } else if (/^\(.*?\)$/.test(<string>loc))
          // [(expr)]
          P.trace(P.eval(<string>loc, val, path.substr(path.lastIndexOf(';') + 1)) + ';' + x, val, path);
        else if (/^\?\(.*?\)$/.test(<string>loc))
          // [?(expr)]
          P.walk(loc, x, val, path, function (
            m: string,
            l: string,
            x: string,
            v: string | { [x: string]: any },
            p: any
          ) {
            if (P.eval(l.replace(/^\?\((.*?)\)$/, '$1'), (<{ [x: string]: any }>v)[m], m))
              P.trace(m + ';' + x, <string>v, p);
          });
        else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(<string>loc))
          // [start:end:step]  phyton slice syntax
          P.slice(<any>loc, x, val, path);
      } else P.store(path, val);
    },
    walk: function (loc: any, expr: string, val: string | object[], path: any, f: (...args: any) => void) {
      if (val instanceof Array) {
        for (let i = 0, n = val.length; i < n; i++) if (i in val) f(i, loc, expr, val, path);
      } else if (typeof val === 'object') {
        for (const m in <object[]>val) if ((<object>val).hasOwnProperty(m)) f(m, loc, expr, val, path);
      }
    },
    slice: function (
      loc: { replace: (arg0: RegExp, arg1: (_$0: any, $1: any, $2: any, $3: any) => void) => void },
      expr: string,
      val: string | any[],
      path: string
    ) {
      if (val instanceof Array) {
        const len = val.length;
        let start = 0,
          end = len,
          step = 1;
        loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function (_$0: any, $1: any, $2: any, $3: any) {
          start = parseInt($1 || start);
          end = parseInt($2 || end);
          step = parseInt($3 || step);
        });
        start = start < 0 ? Math.max(0, start + len) : Math.min(len, start);
        end = end < 0 ? Math.max(0, end + len) : Math.min(len, end);
        for (let i = start; i < end; i += step) P.trace(i + ';' + expr, val, path);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eval: function (x: string, _v: any, _vname: any) {
      try {
        return $ && _v && eval(x.replace(/@/g, '_v'));
      } catch (e) {
        throw new SyntaxError('jsonPath: ' + e.message + ': ' + x.replace(/@/g, '_v').replace(/\^/g, '_a'));
      }
    },
  };

  const $ = obj;
  if (expr && obj && (P.resultType == ResultType.Value || P.resultType == ResultType.Path)) {
    P.trace(P.normalize(expr).replace(/^\$;/, ''), <any>obj, '$');
    return P.result.length ? P.result : false;
  }
  return false;
}
