import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文章目录
const POSTS_DIR = path.join(__dirname, "../src/content/posts");

// 处理所有文章的主函数
async function fixFrontmatter() {
	try {
		// 读取所有文章文件
		const postFiles = (await fs.readdir(POSTS_DIR)).filter((file) =>
			file.endsWith(".md"),
		);

		// 处理每篇文章
		for (const file of postFiles) {
			const filePath = path.join(POSTS_DIR, file);
			const content = await fs.readFile(filePath, "utf8");

			// 解析 Frontmatter 和正文
			const frontmatterMatch = content.match(
				/^---\n([\s\S]*?)\n---\n([\s\S]*)$/,
			);
			if (!frontmatterMatch) {
				console.warn(`Failed to parse frontmatter for ${file}`);
				continue;
			}

			const [, frontmatterStr, body] = frontmatterMatch;

			// 解析 Frontmatter 为对象
			const frontmatter = {};
			frontmatterStr.split("\n").forEach((line) => {
				const match = line.match(/^([^:]+):\s*(.+)$/);
				if (match) {
					const [, key, value] = match;
					frontmatter[key.trim()] = value.trim();
				}
			});

			// 重新构建 Frontmatter，确保所有字段都是字符串类型
			const updatedFrontmatterLines = [];
			for (const [key, value] of Object.entries(frontmatter)) {
				// 确保所有字段都是字符串类型，空值设置为空字符串
				let finalValue = value;
				if (value === "null" || value === "") {
					finalValue = "";
				} else if (typeof value === "object") {
					// 对于数组和对象，使用 JSON.stringify
					finalValue = JSON.stringify(value);
				}
				updatedFrontmatterLines.push(`${key}: ${finalValue}`);
			}

			// 重新构建文章内容
			const updatedContent = `---\n${updatedFrontmatterLines.join("\n")}\n---\n${body}`;

			// 写入更新后的文件
			await fs.writeFile(filePath, updatedContent, "utf8");

			console.log(`Fixed frontmatter for ${file}`);
		}

		console.log("\nAll posts have been fixed!");
	} catch (error) {
		console.error("Error fixing frontmatter:", error);
	}
}

// 运行主函数
fixFrontmatter();
