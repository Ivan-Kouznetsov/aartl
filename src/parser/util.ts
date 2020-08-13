const numberRegex = /^-{0,1}\d+(\.\d+){0,1}$/;

/**
 * Get the arguments, only allowing all to be quoted or all to be unquoted
 * @param str
 * @param ruleAlias
 */
export const getArgs = (str: string, ruleAlias: string): (string | number)[] => {
  const quotedArgsRegex = /(?<=").*?(?=")/g;
  const quotedArgs = (str.match(quotedArgsRegex) ?? []).filter((m) => m.trim().length > 0);
  return quotedArgs.length
    ? quotedArgs
    : str
        .replace(ruleAlias, '')
        .trim()
        .split(' ')
        .filter((i) => i.length > 0)
        .map((i) => (numberRegex.test(i) ? parseFloat(i) : i));
};
