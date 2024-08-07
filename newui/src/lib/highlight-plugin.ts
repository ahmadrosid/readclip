import { type Plugin } from "svelte-exmarkdown";
import rehypeHighlight from 'rehype-highlight';
import svelte from "./svelte-hljs";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import go from "highlight.js/lib/languages/go";
import css from "highlight.js/lib/languages/css";
import php from "highlight.js/lib/languages/php";
import bash from "highlight.js/lib/languages/bash";
import java from "highlight.js/lib/languages/java";
import rust from "highlight.js/lib/languages/rust";

export const highlightPlugin: Plugin = {
  rehypePlugin: [rehypeHighlight, { languages: { typescript, javascript, xml, go, css, php, bash, java, rust, svelte } }],
};
