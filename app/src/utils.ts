//TODO: Find I18n version of this
export function toSentence(items: string[]): string {
  let sentence: string = items.slice(0, -1).join(", ") + " and " + items.slice(-1).join();
  return sentence;
}
