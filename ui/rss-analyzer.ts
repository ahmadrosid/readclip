import { blogRss } from './src/lib/data/rss';
import TurndownService from 'turndown';
import Parser from 'rss-parser';
import fs from "fs";

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

function toMarkdown(html: string) {
    const turndownService = new TurndownService();
    const markdown: string = turndownService.turndown(html);
    return markdown
}

export async function fetchOpenai(prompt: string) {
    console.log("analyzing categories")
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [
            {
              "role": "user",
              "content": prompt
            }
          ]
        })
      };
      
    return fetch('http://143.198.16.88:3040/v1/chat/completions', requestOptions)
        .then(response => response.json())
        .then(data => data.choices[0].message.content);
}

function appendFile(path: string, content: string) {
    fs.appendFileSync(path, content);
}

// const link = blogRss[blogRss.length - 38];
const link = 'https://olickel.com/rss/feed.xml';
// const content = await parseRss(link);
const parser = new Parser();
const feed = await parser.parseURL(link);

let page = "";
page += "---\n";
page += "title: " + feed.title + "\n";
page += "link: " + feed.link + "\n";
page += "description: " + (feed.description ? feed.description : "") + "\n";
page += "---\n\n";
let index = 0;
page += feed.items.map(item => {
    let description = "";
    if (item.content) {
        description = item.content
    } else if (item.description) {
        description = item.description
    }
    if (description === "") return;
    let md = toMarkdown(description);
    const words = md.split(" ");
    if (words.length > 200) {
        md = words.slice(0, 200).join(" ") + "...";
    }
    index++;
    return `# ${index}. ${item.title}\n${md}\n`;
}).slice(0, 10).join("\n");

// console.log(page);

const result = await fetchOpenai(`Here's the snippet of rss from some website. I want to know what is this site about and what are the category of the content they made. Give me only the category in a bullet point nothing more.

${page}
`)

console.log(result);


appendFile(
    "./src/lib/data/rss-categories.ts", 
    `${JSON.stringify({
        link: link,
        category: result.split("- ")
    })},\n`
);