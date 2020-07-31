// https://github.com/bryc/code/blob/master/jshash/PRNGs.md
const xoshiro128ss = (a: number, b: number, c: number, d: number) => {
  return function () {
    const t = b << 9;
    let r = a * 5;
    r = ((r << 7) | (r >>> 25)) * 9;
    c = c ^ a;
    d = d ^ b;
    b = b ^ c;
    a = a ^ d;
    c = c ^ t;
    d = (d << 11) | (d >>> 21);
    return (r >>> 0) / 4294967296;
  };
};

export const getRngFunctions = (
  seed: number
): {
  randomInt: (max: number) => number;
  randomStr: (length: number) => string;
} => {
  const rng = xoshiro128ss(0xf1ea5eed, seed, seed, seed);

  const randomInt = (max: number) => Math.round(rng() * max);
  const randomStr = (length: number) => {
    const letters = [
      'q',
      'w',
      'e',
      'r',
      't',
      'y',
      'u',
      'i',
      'o',
      'p',
      'a',
      's',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      'z',
      'x',
      'c',
      'v',
      'b',
      'n',
      'm',
    ];
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(letters[randomInt(letters.length - 1)]);
    }
    return result.join('');
  };

  return { randomInt, randomStr };
};
