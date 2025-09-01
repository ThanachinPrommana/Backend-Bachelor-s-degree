// utils/parse.js
const isEmpty = (v) => v === "" || v === undefined || v === null;

const toIntOrNull = (v) => {
  if (isEmpty(v)) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

const toFloatOrNull = (v) => {
  if (isEmpty(v)) return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
};

/** v: string | string[] | undefined; allowed: string[] */
const toEnumArray = (v, allowed = []) => {
  const arr = Array.isArray(v) ? v : (isEmpty(v) ? [] : [v]);
  return arr.filter(Boolean).filter((x) => allowed.includes(x));
};

/** รองรับทั้ง multer.fields และ multer.array */
const filesOf = (files, fieldName) => {
  if (Array.isArray(files)) return files.filter((f) => f.fieldname === fieldName);
  return files?.[fieldName] || [];
};

const connectIf = (id) => (id ? { connect: { id } } : undefined);

module.exports = {
  toIntOrNull,
  toFloatOrNull,
  toEnumArray,
  filesOf,
  connectIf,
};
