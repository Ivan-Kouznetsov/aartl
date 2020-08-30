/*
The MIT License (MIT)

Copyright (c) 2016 Société Enkidoo Technologies Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';
function xml2json(e) {
  return (e = cleanXML(e)), xml2jsonRecurse(e, 0);
}
function xml2jsonRecurse(e) {
  for (var r, t, n, a, s, l = {}; e.match(/<[^\/][^>]*>/); )
    (s = e.match(/<[^\/][^>]*>/)[0]),
      (r = s.substring(1, s.length - 1)),
      (t = e.indexOf(s.replace('<', '</'))),
      -1 == t && ((r = s.match(/[^<][\w+$]*/)[0]), (t = e.indexOf('</' + r)), -1 == t && (t = e.indexOf('<\\/' + r))),
      (n = e.substring(s.length, t)),
      (a = n.match(/<[^\/][^>]*>/) ? xml2json(n) : n),
      void 0 === l[r] ? (l[r] = a) : Array.isArray(l[r]) ? l[r].push(a) : (l[r] = [l[r], a]),
      (e = e.substring(2 * s.length + 1 + n.length));
  return l;
}
function cleanXML(e) {
  return (
    (e = e.replace(/<!--[\s\S]*?-->/g, '')),
    (e = e.replace(/\n|\t|\r/g, '')),
    (e = e.replace(/ {1,}<|\t{1,}</g, '<')),
    (e = e.replace(/> {1,}|>\t{1,}/g, '>')),
    (e = e.replace(/<\?[^>]*\?>/g, '')),
    (e = replaceSelfClosingTags(e)),
    (e = replaceAloneValues(e)),
    (e = replaceAttributes(e))
  );
}
function replaceSelfClosingTags(e) {
  var r = e.match(/<[^\/][^>]*\/>/g);
  if (r)
    for (var t = 0; t < r.length; t++) {
      var n = r[t],
        a = n.substring(0, n.length - 2);
      a += '>';
      var s = n.match(/[^<][\w+$]*/)[0],
        l = '</' + s + '>',
        i = '<' + s + '>',
        c = a.match(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g);
      if (c)
        for (var g = 0; g < c.length; g++) {
          var u = c[g],
            f = u.substring(0, u.indexOf('=')),
            o = u.substring(u.indexOf('"') + 1, u.lastIndexOf('"'));
          i += '<' + f + '>' + o + '</' + f + '>';
        }
      (i += l), (e = e.replace(n, i));
    }
  return e;
}
function replaceAloneValues(e) {
  var r = e.match(/<[^\/][^>][^<]+\s+.[^<]+[=][^<]+>{1}([^<]+)/g);
  if (r)
    for (var t = 0; t < r.length; t++) {
      var n = r[t],
        a = n.substring(0, n.indexOf('>') + 1),
        s = n.substring(n.indexOf('>') + 1),
        l = a + '<_@ttribute>' + s + '</_@ttribute>';
      e = e.replace(n, l);
    }
  return e;
}
function replaceAttributes(e) {
  var r = e.match(/<[^\/][^>][^<]+\s+.[^<]+[=][^<]+>/g);
  if (r)
    for (var t = 0; t < r.length; t++) {
      var n = r[t],
        a = n.match(/[^<][\w+$]*/)[0],
        s = '<' + a + '>',
        l = n.match(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g);
      if (l)
        for (var i = 0; i < l.length; i++) {
          var c = l[i],
            g = c.substring(0, c.indexOf('=')),
            u = c.substring(c.indexOf('"') + 1, c.lastIndexOf('"'));
          s += '<' + g + '>' + u + '</' + g + '>';
        }
      e = e.replace(n, s);
    }
  return e;
}
module.exports = { xml2json: xml2json };
