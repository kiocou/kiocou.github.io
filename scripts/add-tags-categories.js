import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文章目录
const POSTS_DIR = path.join(__dirname, "../src/content/posts");

// 定义常用分类和标签映射
const CATEGORY_MAP = {
	ASMR: ["asmr", "掏耳朵", "声控"],
	娱乐: ["女优", "明星", "电影", "视频", "成人"],
	历史: ["历史", "事件", "人物"],
	技术: ["域名", "网站", "视频网站"],
	杂谈: ["其他", "杂谈", "分享"],
};

// 处理所有文章的主函数
async function processPosts() {
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
					// 移除引号并处理空值，确保所有字段都是字符串类型
					const trimmedValue = value.trim().replace(/^"|"$/g, "");
					// 确保空值被设置为空字符串，而不是null
					frontmatter[key.trim()] =
						trimmedValue === "" || trimmedValue === "null" ? "" : trimmedValue;
				}
			});

			// 确保所有必填字段都存在且为字符串类型
			const requiredFields = [
				"lang",
				"author",
				"sourceLink",
				"licenseName",
				"licenseUrl",
				"password",
			];
			requiredFields.forEach((field) => {
				if (
					frontmatter[field] === undefined ||
					frontmatter[field] === null ||
					frontmatter[field] === "null"
				) {
					frontmatter[field] = "";
				}
			});

			// 分析文章内容，确定标签和分类
			const fullText = `${frontmatter.title || ""} ${frontmatter.description || ""} ${body}`;
			let category = "";
			const tags = [];

			// 确定分类
			for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
				if (keywords.some((keyword) => fullText.includes(keyword))) {
					category = cat;
					break;
				}
			}

			// 如果没有匹配到分类，使用默认分类
			if (!category) {
				category = "杂谈";
			}

			// 确定标签
			if (
				fullText.includes("ASMR") ||
				fullText.includes("asmr") ||
				fullText.includes("掏耳朵")
			) {
				tags.push("ASMR", "声控");
			}

			if (fullText.includes("女优") || fullText.includes("明星")) {
				tags.push("娱乐", "明星");
			}

			if (fullText.includes("历史") || fullText.includes("事件")) {
				tags.push("历史", "事件");
			}

			if (fullText.includes("域名") || fullText.includes("网站")) {
				tags.push("技术", "域名");
			}

			// 添加一些通用标签
			if (fullText.includes("视频")) {
				tags.push("视频");
			}

			if (fullText.includes("网盘") || fullText.includes("下载")) {
				tags.push("资源", "下载");
			}

			// 去重标签
			const uniqueTags = [...new Set(tags)];

			// 更新 Frontmatter
			frontmatter.category = category;
			frontmatter.tags = JSON.stringify(uniqueTags);

			// 重新构建文章内容
			const updatedFrontmatter = Object.entries(frontmatter)
				.map(([key, value]) => {
					// 确保所有字段都为字符串类型，空值使用空字符串
					const stringValue =
						typeof value === "string" ? value : JSON.stringify(value);
					// 修复可能的null值问题
					const finalValue = stringValue === "null" ? "" : stringValue;
					return `${key}: ${finalValue}`;
				})
				.join("\n");

			const updatedContent = `---\n${updatedFrontmatter}\n---\n${body}`;

			// 写入更新后的文件
			await fs.writeFile(filePath, updatedContent, "utf8");

			console.log(
				`Updated ${file}: category=${category}, tags=${uniqueTags.join(", ")}`,
			);
		}

		console.log("\nAll posts have been updated with tags and categories!");
	} catch (error) {
		console.error("Error processing posts:", error);
	}
}

// 运行主函数
processPosts();
