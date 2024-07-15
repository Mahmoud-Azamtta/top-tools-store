export function createArabicSlug(name) {
  if (/[\u0600-\u06FF]/.test(name)) {
    return name
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\u0600-\u06FF0-9\-]/g, "")
      .replace(/-+/g, "-");
  } else {
    return name
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]/g, "")
      .replace(/-+/g, "-");
  }
}

