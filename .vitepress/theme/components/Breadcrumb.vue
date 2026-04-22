<script setup lang="ts">
import { computed } from 'vue';
import { useData, useRoute, withBase } from 'vitepress';

const route = useRoute();
const { frontmatter } = useData();

interface Crumb {
  text: string;
  link?: string;
}

const sectionNameMap: Record<string, string> = {
  '01-C语言基础与进阶': 'C 语言基础与进阶',
  '02-嵌入式系统基础知识': '嵌入式系统基础知识',
  '03-驱动开发与外设编程': '驱动开发与外设编程',
  '04-实时操作系统': '实时操作系统',
  '05-EmbeddedLinux': 'Embedded Linux',
  '06-NetworkIot': '网络通信与物联网',
  '07-Debug_Optimization': '调试与性能优化',
  '08-项目实战与工具链': '项目实战与工具链',
  '09-2025_AI_on_MCU': '2025 AI on MCU',
  '嵌入式图形 Qt 开发': '嵌入式图形 Qt 开发',
  '面试题与面经': '面试题与面经',
  'books': '资源下载'
};

const crumbs = computed<Crumb[]>(() => {
  const path = route.path;

  // Don't show breadcrumb on home page
  if (path === '/' || path === '') return [];

  // Also skip if it's the home layout
  if (frontmatter.value.layout === 'home') return [];

  const items: Crumb[] = [{ text: '首页', link: '/' }];

  // Decode the path for matching
  const decoded = decodeURIComponent(path);
  const segments = decoded.replace(/^\//, '').replace(/\/$/, '').split('/');

  if (segments.length === 0) return items;

  // First segment is typically the section dir
  const sectionDir = segments[0];
  const sectionName = sectionNameMap[sectionDir];

  if (sectionName) {
    if (segments.length === 1 || (segments.length === 1 && decoded.endsWith('/'))) {
      items.push({ text: sectionName });
    } else {
      items.push({
        text: sectionName,
        link: `/${encodeURIComponent(sectionDir)}/`
      });
      // Page name - remove .html extension if present
      const pageName = segments[segments.length - 1].replace(/\.html$/, '');
      items.push({ text: pageName });
    }
  } else {
    // Fallback for other pages like study-map, resources
    const pageName = segments[segments.length - 1].replace(/\.html$/, '');
    items.push({ text: pageName });
  }

  return items;
});
</script>

<template>
  <el-breadcrumb v-if="crumbs.length > 0" separator="/" class="doc-breadcrumb">
    <el-breadcrumb-item
      v-for="(crumb, index) in crumbs"
      :key="index"
    >
      <a v-if="crumb.link" :href="withBase(crumb.link)">{{ crumb.text }}</a>
      <span v-else>{{ crumb.text }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
.doc-breadcrumb {
  margin-bottom: 16px;
  padding: 8px 0;
  font-size: 13px;
}

.doc-breadcrumb a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.doc-breadcrumb a:hover {
  text-decoration: underline;
}
</style>
