// File: utils/parse.js

/** int | null */
export const toIntOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

/** float | null */
export const toFloatOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
};

/** enum[] (validate with allowlist) */
export const toEnumArray = (v, allowlist = []) => {
  const arr = Array.isArray(v) ? v : v != null ? [v] : [];
  const set = new Set(allowlist);
  return arr
    .map(String)
    .map((s) => s.trim())
    .filter((s) => set.has(s));
};

/** connect object for Prisma if id present */
export const connectIf = (id) =>
  id ? { connect: { id: typeof id === "string" ? id : String(id) } } : null;

/**
 * Return array of files by field name from various multer shapes:
 * - multer.fields(): req.files = { images: [..], videos: [..] }
 * - accidental keys with []: { 'images[]': [..] }
 * - multer.array(): req.files = [ { fieldname: 'images', ... }, ... ]
 */
export const filesOf = (files, field) => {
  if (!files) return [];
  // fields() case
  if (files[field]) return files[field];
  if (files[`${field}[]`]) return files[`${field}[]`];

  // array() case
  if (Array.isArray(files)) {
    return files.filter(
      (f) => f?.fieldname === field || f?.fieldname === `${field}[]`
    );
  }
  return [];
};
