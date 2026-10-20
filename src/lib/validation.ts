export const clean = (value: unknown, max = 500): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export const isPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
};

export const isEmail = (value: string) =>
  !value || /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value);

export const isIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export const isTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
