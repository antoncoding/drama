export function parseTwitterStatusId(text: string) {
  const matched = text.match(
    /(^|[^'"])(https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+))/
  );
  if (!matched) return undefined;

  return matched[4];
}
