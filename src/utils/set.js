import isArrayKey from './is_array_key';

export default function set(obj, keyName, value) {
  if (keyName == null || keyName === '') {
    return undefined;
  }

  let parts = keyName.split('.');
  for (let i = 0; i < parts.length; ++i) {
    let lastIteration = i === parts.length - 1;

    if (obj == null) {
      return;
    }

    let key = parts[i];

    if (lastIteration) {
      if (isArrayKey(key)) {
        obj[parseInt(key.slice(1, -1), 10)] = value;
      } else {
        obj[key] = value;
      }
    } else {
      if (isArrayKey(key)) {
        obj = obj[parseInt(key.slice(1, -1), 10)];
      } else {
        obj = obj[key];
      }
    }
  }
}
