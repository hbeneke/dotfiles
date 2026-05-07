import { Marked } from "marked";
import { highlight, detectLang } from "./highlight";
import type { BundledLanguage } from "shiki";

const marked = new Marked({
  gfm: true,
  breaks: false,
  async: true,
});

marked.use({
  async: true,
  async walkTokens(token) {
    if (token.type === "code") {
      const lang = (token.lang as BundledLanguage) || detectLang(`code.${token.lang || "txt"}`);
      try {
        token.text = await highlight(token.text, lang);
        token.escaped = true;
      } catch {
        // leave token as-is if highlighting fails
      }
    }
  },
  renderer: {
    code(token) {
      if (token.escaped) return token.text;
      const escaped = token.text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<pre><code>${escaped}</code></pre>`;
    },
  },
});

export async function renderMarkdown(source: string): Promise<string> {
  return marked.parse(source) as Promise<string>;
}
