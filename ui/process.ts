import { Database } from "bun:sqlite";
import { subReddits } from "./src/lib/data/reddit.ts";
import { dataLanguages} from "./src/lib/data/github.ts";

// Create a new SQLite database (or open if it already exists)
const db = new Database("data.sqlite");

// Create tables
db.run(`
  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    icon TEXT,
    count_users INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups (id)
  )
`);
db.run(`
    CREATE TABLE IF NOT EXISTS languages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      value TEXT NOT NULL
    )
  `);
  
// Prepare statements
const insertGroup = db.prepare("INSERT INTO groups (name) VALUES ($name)");
const insertItem = db.prepare(`
  INSERT INTO items (group_id, name, title, icon, count_users)
  VALUES ($group_id, $name, $title, $icon, $count_users)
`);
const insertLanguage = db.prepare(`
    INSERT INTO languages (label, value)
    VALUES ($label, $value)
  `);
  
// Insert data
db.transaction(() => {
  for (const groupData of subReddits) {
    const { lastInsertRowid: groupId } = insertGroup.run({ $name: groupData.group });
    
    for (const item of groupData.items) {
      insertItem.run({
        $group_id: groupId,
        $name: item.name,
        $title: item.title,
        $icon: item.icon,
        $count_users: item.count_users
      });
    }
  }
  for (const language of dataLanguages) {
    insertLanguage.run({
      $label: language.label,
      $value: language.value
    });
  }
})();

console.log("Done ✅");

db.close();
