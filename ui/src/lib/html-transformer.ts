import { BaseDeck } from "@/components/feed";
import ReactHtmlParser from "react-html-parser";

export default function HtmlTransformer(html: string, type: BaseDeck["type"]) {
  return ReactHtmlParser(html, {
    transform(node) {
      if (node.type === "tag" && node.name === "a") {
        if (node.attribs) {
          node.attribs.target = "_blank";
          node.attribs.class = "hover:underline";
          if (type === "reddit" && node.attribs.href[0] === "/") {
            node.attribs.href = "https://www.reddit.com" + node.attribs.href;
          }
        }
      }
    },
  });
}
