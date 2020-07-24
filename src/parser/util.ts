/**
 * Get the arguments, only allowing all to be quoted or all to be unquoted
 * @param str
 * @param ruleAlias
 */
export const getArgs = (str: string, ruleAlias: string): string[] => {
  const quotedArgsRegex = /(?<=").*?(?=")/g;
  const quotedArgs = (str.match(quotedArgsRegex) ?? []).filter((m) => m.trim().length > 0);
  return quotedArgs.length
    ? quotedArgs
    : str
        .replace(ruleAlias, '')
        .trim()
        .split(' ')
        .filter((i) => i.length > 0);
};
