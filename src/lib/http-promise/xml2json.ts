/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */

export const xml2json = (xmlStr: string): object => {
  xmlStr = cleanXML(xmlStr);
  return xml2jsonRecurse(xmlStr);
};

/**
 * Recursively parses an XML string
 * @param xmlStr XML string
 */
const xml2jsonRecurse = (xmlStr: string) => {
  const obj: { [key: string]: string | object | Array<object> } = {};

  let tagName: string, indexClosingTag: number, inner_substring: string, tempVal, openingTag;

  while (xmlStr.match(/<[^/][^>]*>/)) {
    openingTag = xmlStr.match(/<[^/][^>]*>/)![0];
    tagName = openingTag.substring(1, openingTag.length - 1);
    tagName = tagName.includes(' ') ? /\S*(?=\s)/.exec(tagName)![0] : tagName;

    indexClosingTag = xmlStr.indexOf(openingTag.replace('<', '</'));

    inner_substring = xmlStr.substring(openingTag.length, indexClosingTag);
    if (inner_substring.match(/<[^/][^>]*>/)) {
      tempVal = xml2json(inner_substring);
    } else {
      tempVal = inner_substring;
    }
    // account for array or obj //
    if (obj[tagName] === undefined) {
      obj[tagName] = tempVal;
    } else if (Array.isArray(obj[tagName])) {
      (<Array<string | object>>obj[tagName]).push(tempVal);
    } else {
      obj[tagName] = [obj[tagName], tempVal];
    }

    xmlStr = xmlStr.substring(openingTag.length * 2 + 1 + inner_substring.length);
  }

  return obj;
};

/**
 * Removes charaters that impede parsing
 * @param xmlStr XML string
 */
const cleanXML = (xmlStr: string) => {
  xmlStr = xmlStr.replace(/<!--[\s\S]*?-->/g, ''); //remove commented lines
  xmlStr = xmlStr.replace(/\n|\t|\r/g, ''); //replace special characters
  xmlStr = xmlStr.replace(/ {1,}<|\t{1,}</g, '<'); //replace leading spaces and tabs
  xmlStr = xmlStr.replace(/> {1,}|>\t{1,}/g, '>'); //replace trailing spaces and tabs
  xmlStr = xmlStr.replace(/<\?[^>]*\?>/g, ''); //delete docType tags

  xmlStr = replaceSelfClosingTags(xmlStr); //replace self closing tags
  xmlStr = replaceAloneValues(xmlStr); //replace the alone tags values
  xmlStr = replaceAttributes(xmlStr); //replace attributes

  return xmlStr;
};

/**
 * Replaces all the self closing tags with attributes with another tag containing its attribute as a property.
 *  Example : &lt;tagName attrName="attrValue" />' becomes &lt;tagName>&lt;attrName>attrValue&lt;/attrName>&lt;/tagName>
 * @param xmlStr XML string
 */
const replaceSelfClosingTags = (xmlStr: string) => {
  const escQuote = '__ESCAPED_QUOTE__';
  const escQuoteRegex = new RegExp(`${escQuote}`, 'g');

  const selfClosingTags = xmlStr.match(/<[^/][^>]*\/>/g);

  if (selfClosingTags) {
    for (let i = 0; i < selfClosingTags.length; i++) {
      const oldTag = selfClosingTags[i];
      let tempTag = oldTag.substring(0, oldTag.length - 2);
      tempTag += '>';

      const tagName = oldTag.match(/[^<][\w+$]*/)![0];
      const closingTag = '</' + tagName + '>';
      let newTag = '<' + tagName + '>';
      tempTag = tempTag.replace(/\\"/g, escQuote);
      const attrs = tempTag.match(/(\S+)="?((?:.(?!"?\s+(?:\S+)=|[>"]))+.)"?/g);

      if (attrs) {
        for (let j = 0; j < attrs.length; j++) {
          const attr = attrs[j];
          const attrName = attr.substring(0, attr.indexOf('='));
          const attrValue = attr.substring(attr.indexOf('"') + 1, attr.lastIndexOf('"'));

          newTag += '<' + attrName + '>' + attrValue.replace(escQuoteRegex, '"') + '</' + attrName + '>';
        }
      }

      newTag += closingTag;

      xmlStr = xmlStr.replace(oldTag, newTag);
    }
  }

  return xmlStr;
};

/**
 * Replaces all the tags with attributes and a value with a new tag.
 * Example : &lt;tagName attrName="attrValue"&gt;tagValue&lt;/tagName"&gt; becomes &lt;tagName&gt;&lt;attrName"&gt;attrValue&lt;/attrName&gt;&lt;_@attribute&gt;tagValue&lt;/_@attribute&gt;&lt;/tagName&gt;
 * @param xmlStr XML string
 */
const replaceAloneValues = (xmlStr: string) => {
  const tagsWithAttributesAndValue = xmlStr.match(/<[^/][^>][^<]+\s+.[^<]+[=][^<]+>{1}([^<]+)/g);

  if (tagsWithAttributesAndValue) {
    for (let i = 0; i < tagsWithAttributesAndValue.length; i++) {
      const oldTag = tagsWithAttributesAndValue[i];
      const oldTagName = oldTag.substring(0, oldTag.indexOf('>') + 1);
      const oldTagValue = oldTag.substring(oldTag.indexOf('>') + 1);

      const newTag = oldTagName + '<_@ttribute>' + oldTagValue + '</_@ttribute>';

      xmlStr = xmlStr.replace(oldTag, newTag);
    }
  }

  return xmlStr;
};

/**
 * Replaces all the tags with attributes with another tag containing its attribute as a property.
 * Example : &lt;tagName attrName="attrValue">&lt;/tagName> becomes &lt;tagName>&lt;attrName>attrValue&lt;/attrName>&lt;/tagName>
 * @param xmlStr XML string
 */
const replaceAttributes = (xmlStr: string) => {
  const tagsWithAttributes = xmlStr.match(/<([^/^>^<])+\s+.[^<]+[=][^<]+>/g);

  if (tagsWithAttributes) {
    for (let i = 0; i < tagsWithAttributes.length; i++) {
      const oldTag = tagsWithAttributes[i];
      const tagName = oldTag.match(/[^<]\S*/)![0];
      let newTag = '<' + tagName + '>';
      const attrs = oldTag.match(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g)!;

      for (let j = 0; j < attrs.length; j++) {
        const attr = attrs[j];
        const attrName = attr.substring(0, attr.indexOf('='));
        const attrValue = attr.substring(attr.indexOf('"') + 1, attr.lastIndexOf('"'));

        newTag += '<' + attrName + '>' + attrValue + '</' + attrName + '>';
      }

      xmlStr = xmlStr.replace(oldTag, newTag);
    }
  }

  return xmlStr;
};
