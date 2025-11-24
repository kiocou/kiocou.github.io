// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	visitUrl?: string; // 添加前往项目链接字段
}

export const projectsData: Project[] = [
	{
		id: "mizuki-blog",
		title: "Mizuki Blog Theme",
		description:
			"基于Astro框架开发的现代博客主题，支持多语言、深色模式和响应式设计。",
		image: "/assets/images/projects/mizuki-blog.webp",
		category: "web",
		techStack: ["Astro", "TypeScript", "Tailwind CSS", "Svelte"],
		status: "completed",
		liveDemo: "https://example.com",
		sourceCode: "https://github.com/kiocou/mizuki",
		visitUrl: "https://example.com",
		startDate: "2024-01-01",
		endDate: "2024-06-01",
		featured: true,
		tags: ["博客", "主题", "开源"],
	},
	{
		id: "personal-website",
		title: "个人网站",
		description:
			"展示个人信息、技能和项目的个人网站。",
		image: "/assets/images/projects/personal-website.webp",
		category: "web",
		techStack: ["Astro", "TypeScript", "Tailwind CSS"],
		status: "completed",
		liveDemo: "https://kiocou.github.io",
		sourceCode: "https://github.com/kiocou/kiocou.github.io",
		visitUrl: "https://kiocou.github.io",
		startDate: "2023-09-01",
		endDate: "2023-12-01",
		featured: true,
		tags: ["个人网站", "作品集", "Astro"],
	},
	{
		id: "todo-app",
		title: "待办事项应用",
		description:
			"简单高效的待办事项管理应用，支持任务分类和优先级设置。",
		image: "/assets/images/projects/todo-app.webp",
		category: "web",
		techStack: ["React", "TypeScript", "Redux", "Firebase"],
		status: "in-progress",
		sourceCode: "https://github.com/kiocou/todo-app",
		startDate: "2024-03-01",
		tags: ["Web应用", "待办事项", "React"],
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter((p) => p.status === "completed").length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
};
