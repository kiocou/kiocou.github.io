import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文章目录
const POSTS_DIR = path.join(__dirname, "../src/content/posts");

// 处理所有文章的主函数
async function fixNullValues() {
	try {
		// 读取所有文章文件
		const postFiles = (await fs.readdir(POSTS_DIR)).filter((file) =>
			file.endsWith(".md"),
		);

		// 处理每篇文章
		for (const file of postFiles) {
			const filePath = path.join(POSTS_DIR, file);
			let content = await fs.readFile(filePath, "utf8");

			// 将所有 `null` 值替换为空字符串
			content = content.replace(/:\s*null\s*$/gm, ": ");

			// 写入更新后的文件
			await fs.writeFile(filePath, content, "utf8");

			console.log(`Fixed null values in ${file}`);
		}

		console.log("\nAll posts have been fixed!");
	} catch (error) {
		console.error("Error fixing null values:", error);
	}
}

// 运行主函数
fixNullValues();
