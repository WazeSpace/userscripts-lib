function normalizeArray(parts: string[], allowAboveRoot: boolean) {
  const res = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];

    // ignore empty parts
    if (!p || p === '.') continue;

    if (p === '..') {
      if (res.length && res[res.length - 1] !== '..') {
        res.pop();
      } else if (allowAboveRoot) {
        res.push('..');
      }
    } else {
      res.push(p);
    }
  }

  return res;
}
function normalize(path: string) {
  const isAbsolute = path.charAt(0) === '/',
    trailingSlash = path && path[path.length - 1] === '/',
    isHttp = path.startsWith('http://'),
    isHttps = path.startsWith('https://');

  if (isHttp) path = path.substring(7);
  else if (isHttps) path = path.substring(8);

  // Normalize the path
  path = normalizeArray(path.split('/'), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  if (path && isHttp) {
    path = 'http://' + path;
  }
  if (path && isHttps) {
    path = 'https://' + path;
  }

  return (isAbsolute ? '/' : '') + path;
}

export function join(...paths: string[]) {
  let path = '';
  for (let i = 0; i < arguments.length; i++) {
    const segment = paths[i];

    if (segment) {
      if (!path) {
        path += segment;
      } else {
        path += '/' + segment;
      }
    }
  }
  return normalize(path);
}
