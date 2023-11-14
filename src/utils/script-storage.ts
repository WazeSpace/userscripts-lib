function isStorageSupported() {
  return 'GM_setValue' in window && 'GM_getValue' in window && 'GM_deleteValue';
}

export function getScriptStorageValue(key: string, defaultValue = null) {
  if (!isStorageSupported()) return defaultValue;
  return window['GM_getValue'](key);
}

export function setScriptStorageValue(key: string, value: string) {
  if (!isStorageSupported()) return false;
  window['GM_setValue'](key, value);
  return true;
}

export function deleteScriptStorageValue(key: string) {
  if (!isStorageSupported()) return false;
  window['GM_deleteValue'](key);
  return true;
}
