// Skill data configuration file
// Used to manage data for the skill display page

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string; // Iconify icon name
	category: "frontend" | "backend" | "database" | "tools" | "other";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[]; // Related project IDs
	certifications?: string[];
	color?: string; // Skill card theme color
}

export const skillsData: Skill[] = [
	// Frontend Skills
	{
		id: "vue",
		name: "Vue.js",
		description: "一种渐进式JavaScript框架，易于学习和使用，适合快速开发。",
		icon: "logos:vue",
		category: "frontend",
		level: "intermediate",
		experience: { years: 1, months: 3 },
		color: "#4FC08D",
	},
	{
		id: "91",
		name: "91",
		description: "熟练度最顶级的技能。",
		icon: "tabler:number-91-small",
		category: "other",
		level: "expert",
		experience: { years: 18, months: 0 },
		color: "#FFD700",
	},
	{
		id: "hexo",
		name: "Hexo",
		description: "一个基于Node.js的快速、简洁且高效的博客框架。",
		icon: "logos:hexo",
		category: "frontend",
		level: "intermediate",
		experience: { years: 3, months: 3 },
		color: "#0E83CD",
	},

	// Backend Skills
	{
		id: "nodejs",
		name: "Node.js",
		description: "基于Chrome V8引擎的JavaScript运行时，用于服务器端开发。",
		icon: "logos:nodejs-icon",
		category: "backend",
		level: "intermediate",
		experience: { years: 3, months: 3 },
		color: "#339933",
	},
	{
		id: "python",
		name: "Python",
		description: "一种通用编程语言，适用于Web开发、数据分析、机器学习等领域。",
		icon: "logos:python",
		category: "backend",
		level: "intermediate",
		experience: { years: 2, months: 1 },
		color: "#3776AB",
	},
	{
		id: "java",
		name: "Java",
		description: "企业应用开发的主流编程语言，跨平台、面向对象。",
		icon: "logos:java",
		category: "backend",
		level: "beginner",
		experience: { years: 0, months: 8 },
		color: "#ED8B00",
	},

	// Database Skills
	{
		id: "mysql",
		name: "MySQL",
		description: "世界上最流行的开源关系型数据库管理系统，广泛应用于Web应用。",
		icon: "logos:mysql-icon",
		category: "database",
		level: "advanced",
		experience: { years: 2, months: 6 },
		color: "#4479A1",
	},
	{
		id: "mongodb",
		name: "MongoDB",
		description: "一种面向文档的NoSQL数据库，具有灵活的数据模型。",
		icon: "logos:mongodb-icon",
		category: "database",
		level: "intermediate",
		experience: { years: 1, months: 2 },
		color: "#47A248",
	},

	// Tools
	{
		id: "git",
		name: "Git",
		description: "分布式版本控制系统，代码管理和团队协作的必备工具。",
		icon: "logos:git-icon",
		category: "tools",
		level: "advanced",
		experience: { years: 3, months: 5 },
		color: "#F05032",
	},
	{
		id: "vscode",
		name: "VS Code",
		description: "轻量级但功能强大的代码编辑器，拥有丰富的插件生态系统。",
		icon: "logos:visual-studio-code",
		category: "tools",
		level: "expert",
		experience: { years: 5, months: 6 },
		color: "#007ACC",
	},
	{
		id: "webstorm",
		name: "WebStorm",
		description:
			"JetBrains开发的专业JavaScript和Web开发IDE，具有智能代码辅助功能。",
		icon: "logos:webstorm",
		category: "tools",
		level: "advanced",
		experience: { years: 1, months: 1 },
		color: "#00CDD7",
	},
	{
		id: "photoshop",
		name: "Photoshop",
		description: "专业的图像编辑和设计软件。",
		icon: "logos:adobe-photoshop",
		category: "tools",
		level: "intermediate",
		experience: { years: 2, months: 10 },
		color: "#31A8FF",
	},
	{
		id: "premiere",
		name: "Premiere Pro",
		description: "专业的视频编辑软件。",
		icon: "logos:adobe-premiere",
		category: "tools",
		level: "intermediate",
		experience: { years: 1, months: 6 },
		color: "#9999FF",
	},
	{
		id: "docker",
		name: "Docker",
		description: "容器化平台，简化应用部署和环境管理。",
		icon: "logos:docker-icon",
		category: "tools",
		level: "intermediate",
		experience: { years: 1, months: 0 },
		color: "#2496ED",
	},
	{
		id: "nginx",
		name: "Nginx",
		description: "高性能Web服务器和反向代理服务器。",
		icon: "logos:nginx",
		category: "tools",
		level: "intermediate",
		experience: { years: 1, months: 2 },
		color: "#009639",
	},
];

// Get skill statistics
export const getSkillStats = () => {
	const total = skillsData.length;
	const byLevel = {
		beginner: skillsData.filter((s) => s.level === "beginner").length,
		intermediate: skillsData.filter((s) => s.level === "intermediate").length,
		advanced: skillsData.filter((s) => s.level === "advanced").length,
		expert: skillsData.filter((s) => s.level === "expert").length,
	};
	const byCategory = {
		frontend: skillsData.filter((s) => s.category === "frontend").length,
		backend: skillsData.filter((s) => s.category === "backend").length,
		database: skillsData.filter((s) => s.category === "database").length,
		tools: skillsData.filter((s) => s.category === "tools").length,
		other: skillsData.filter((s) => s.category === "other").length,
	};

	return { total, byLevel, byCategory };
};

// Get skills by category
export const getSkillsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return skillsData;
	}
	return skillsData.filter((s) => s.category === category);
};

// Get advanced skills
export const getAdvancedSkills = () => {
	return skillsData.filter(
		(s) => s.level === "advanced" || s.level === "expert",
	);
};

// Calculate total years of experience
export const getTotalExperience = () => {
	const totalMonths = skillsData.reduce((total, skill) => {
		return total + skill.experience.years * 12 + skill.experience.months;
	}, 0);
	return {
		years: Math.floor(totalMonths / 12),
		months: totalMonths % 12,
	};
};
