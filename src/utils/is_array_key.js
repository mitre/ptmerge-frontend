export default function isArrayKey(key) {
  return key[0] === '[' && key[key.length - 1] === ']';
};
