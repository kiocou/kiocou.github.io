#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 获取当前脚本的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义源目录和目标目录
const sourceDir = path.join(__dirname, "../temp_articles");
const targetDir = path.join(__dirname, "../src/content/posts");

// 确保目标目录存在，先清空再创建
if (fs.existsSync(targetDir)) {
	// 清空目录中的所有文件
	const existingFiles = fs.readdirSync(targetDir);
	for (const existingFile of existingFiles) {
		const existingFilePath = path.join(targetDir, existingFile);
		fs.unlinkSync(existingFilePath);
	}
} else {
	fs.mkdirSync(targetDir, { recursive: true });
}

// 读取源目录中的所有MD文件
const files = fs.readdirSync(sourceDir).filter((file) => file.endsWith(".md"));

console.log(`找到 ${files.length} 个MD文件，开始转换...`);

files.forEach((file, index) => {
	const sourcePath = path.join(sourceDir, file);
	const content = fs.readFileSync(sourcePath, "utf8");

	// 解析文件名，提取标题
	const title = file.replace(".md", "");

	// 解析内容，提取封面图片和更新时间
	let image = "";
	let updated = "";
	let description = "";

	// 提取封面图片
	const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
	if (imageMatch?.[1]) {
		image = imageMatch[1];
	}

	// 提取更新时间
	const timeMatch = content.match(
		/本文于 (\d{4}-\d{2}-\d{2}) \d{2}:\d{2} 更新/,
	);
	if (timeMatch?.[1]) {
		updated = timeMatch[1];
	}

	// 生成摘要（取正文前150个字符）
	const textContent = content
		.replace(/^#.*$/m, "") // 移除标题
		.replace(/!\[.*?\]\(.*?\)/g, "") // 移除图片
		.replace(/^本文于.*更新.*$/m, "") // 移除更新时间
		.replace(/\s+/g, " ") // 替换多余空白
		.trim();

	if (textContent.length > 150) {
		description = `${textContent.substring(0, 150)}...`;
	} else {
		description = textContent;
	}

	// 生成Frontmatter
	const frontmatter = `---
title: "${title}"
published: ${new Date().toISOString().split("T")[0]}
${
	updated
		? `updated: ${updated}
`
		: ""
}draft: false
description: "${description}"
${
	image
		? `image: "${image}"
`
		: ""
}tags: []
category: ""
lang: ""
pinned: false
author: ""
sourceLink: ""
licenseName: ""
licenseUrl: ""
encrypted: false
password: ""
---
`;

	// 移除原始内容中的标题、图片和更新时间行
	const processedContent = content
		.replace(/^#.*$/m, "") // 移除标题
		.replace(/!\[.*?\]\(.*?\)/g, "") // 移除图片
		.replace(/^本文于.*更新.*$/m, "") // 移除更新时间
		.trim();

	// 合并Frontmatter和处理后的内容
	const finalContent = frontmatter + processedContent;

	// 生成目标文件名（使用标题的拼音或原文件名，确保唯一性）
	const targetFilename = `${Date.now()}-${index}.md`;
	const targetPath = path.join(targetDir, targetFilename);

	// 写入目标文件
	fs.writeFileSync(targetPath, finalContent, "utf8");

	console.log(`转换完成：${file} -> ${targetFilename}`);
});

console.log("所有文件转换完成！");
