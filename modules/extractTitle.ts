export function extractTitle(title: string) {
  title = title.replace(/^Re:\s*/, '');
  title = title.replace(/^Fw:\s*/, '');
  title = title.replace(/^\[[^\]]+\]\s*/, '');

  return title;
}
