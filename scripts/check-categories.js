import fs from "node:fs";
import path from "node:path";

const postsDir = "src/content/posts";
const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
const categories = {};

files.forEach((file) => {
	const content = fs.readFileSync(path.join(postsDir, file), "utf8");
	const match = content.match(/category: "(.*)"/);
	if (match) {
		const category = match[1];
		categories[category] = (categories[category] || 0) + 1;
	}
});

console.log("Current categories:", categories);
