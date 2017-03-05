export default function get(obj, keyName) {
  if (keyName == null || keyName === '') {
    return undefined;
  }

  let parts = keyName.split('.');
  for (let i = 0; i < parts.length; ++i) {
    if (obj == null) {
      return;
    }

    let key = parts[i];
    if (key[0] === '[' && key[key.length - 1] === ']') {
      obj = obj[parseInt(key.slice(1, -1), 10)];
    } else {
      obj = obj[key];
    }
  }

  return obj;
}
