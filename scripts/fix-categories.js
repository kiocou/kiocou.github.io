import fs from 'fs';
import path from 'path';

const postsDir = 'src/content/posts';
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

// 分类规则
const categoryRules = [
  { keywords: ['电影', '影视', '导演', '主演', '上映', '流媒体', '院线', '票房', '大片'], category: '影视' },
  { keywords: ['动漫', '动画', '漫画', '漫改', '二次元', '新番', '番剧', '角色', '声优'], category: '动漫' },
  { keywords: ['ASMR', '掏耳朵', '助眠', '声优', '耳搔'], category: 'ASMR' },
  { keywords: ['科技', '互联网', '博主', '网红', '平台', '封禁', '网络', '技术', 'AI', '人工智能', '数字'], category: '科技' },
  { keywords: ['成人', '色', '情', '性爱', 'AV', '女优', '本子', '里番', '福利', '性感'], category: '成人' },
  { keywords: ['娱乐', '综艺', '明星', '八卦', '吃瓜', '演唱会', '节目', '绯闻'], category: '娱乐' },
];

let updatedCount = 0;

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 提取标题和当前分类
  const titleMatch = content.match(/title: "(.*)"/);
  const categoryMatch = content.match(/category: "(.*)"/);
  
  if (titleMatch) {
    const title = titleMatch[1];
    let newCategory = '其他';
    
    // 根据关键词匹配分类
    for (const rule of categoryRules) {
      if (rule.keywords.some(keyword => title.includes(keyword))) {
        newCategory = rule.category;
        break;
      }
    }
    
    // 如果当前分类与新分类不同，则更新
    if (categoryMatch && categoryMatch[1] !== newCategory) {
      const updatedContent = content.replace(/category: "(.*)"/, `category: "${newCategory}"`);
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      updatedCount++;
      console.log(`${file}: ${categoryMatch[1]} -> ${newCategory}`);
    }
  }
});

console.log(`\n共更新了 ${updatedCount} 篇文章的分类`);
