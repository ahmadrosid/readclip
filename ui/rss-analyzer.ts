import { blogRss } from './src/lib/data/rss';
import xml2js from "xml2js";

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

export async function fetchOpenai() {
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
              "content": "Hello!"
            }
          ]
        })
      };
      
    return fetch('http://localhost:3040/v1/chat/completions', requestOptions)
        .then(response => response.json())
        .then(data => data.choices[0].message.content);
}

console.log(blogRss[0]);

fetch(blogRss[0])
    .then(response => response.text())
    .then(data => {
        xml2js.parseString(data, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
            } else {
                const item = result.rss.channel[0].item[0];
                console.log(item.title.join(" "));
            }
        });
    })
    .catch(error => console.error(error));
