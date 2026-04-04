import { defineConfig } from 'vitepress';
import { buildNav, buildRewrites, buildSidebar } from '../scripts/docs-tools.mjs';

export default defineConfig({
  lang: 'zh-CN',
  title: 'Embed Book',
  description: '嵌入式软件开发全景知识库，覆盖 C 语言、驱动开发、RTOS、Embedded Linux、IoT 与 AI on MCU。',
  base: '/Embed_book/',
  srcExclude: ['README.md', 'LICENSE.md', '.omx/**', 'node_modules/**'],
  cleanUrls: true,
  rewrites: buildRewrites(),
  ignoreDeadLinks: [/^http:\/\/localhost:\d+/],
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#0f172a' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Embed Book' }],
    ['meta', { property: 'og:description', content: '为嵌入式软件学习打造的可阅读、可导航静态文档站。' }]
  ],
  themeConfig: {
    siteTitle: 'Embed Book',
    logo: '/1.png',
    nav: buildNav(),
    sidebar: buildSidebar(),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/liueggy/Embed_book' }
    ],
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '导航',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    lastUpdated: {
      text: '最后更新于'
    },
    footer: {
      message: '以 GitHub Pages 发布，使用 VitePress 构建。',
      copyright: 'Content under CC BY-NC-SA 4.0 where applicable.'
    }
  }
});
