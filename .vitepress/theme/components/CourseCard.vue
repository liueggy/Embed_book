<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import {
  Monitor,
  Cpu,
  SetUp,
  Timer,
  Platform,
  Connection,
  Search,
  Briefcase,
  MagicStick,
  Picture,
  Document,
  FolderOpened
} from '@element-plus/icons-vue';

export interface Section {
  dir: string;
  text: string;
  summary: string;
  accent: string;
  link: string;
  tag?: string;
}

const props = defineProps<{
  sections: Section[];
  columns?: number;
}>();

const iconMap: Record<string, any> = {
  '01-C语言基础与进阶': Monitor,
  '02-嵌入式系统基础知识': Cpu,
  '03-驱动开发与外设编程': SetUp,
  '04-实时操作系统': Timer,
  '05-EmbeddedLinux': Platform,
  '06-NetworkIot': Connection,
  '07-Debug_Optimization': Search,
  '08-项目实战与工具链': Briefcase,
  '09-2025_AI_on_MCU': MagicStick,
  '嵌入式图形 Qt 开发': Picture,
  '面试题与面经': Document,
  'books': FolderOpened
};

const tagMap: Record<string, string> = {
  '01-C语言基础与进阶': '基础',
  '02-嵌入式系统基础知识': '基础',
  '03-驱动开发与外设编程': '驱动',
  '04-实时操作系统': 'RTOS',
  '05-EmbeddedLinux': 'Linux',
  '06-NetworkIot': 'IoT',
  '07-Debug_Optimization': '调试',
  '08-项目实战与工具链': '工程',
  '09-2025_AI_on_MCU': 'AI',
  '嵌入式图形 Qt 开发': 'GUI',
  '面试题与面经': '面试',
  'books': '资源'
};

const tagTypeMap: Record<string, string> = {
  '基础': '',
  '驱动': 'success',
  'RTOS': 'warning',
  'Linux': 'danger',
  'IoT': 'info',
  '调试': 'warning',
  '工程': 'success',
  'AI': 'danger',
  'GUI': 'info',
  '面试': '',
  '资源': 'info'
};

function getIcon(dir: string) {
  return iconMap[dir] || Document;
}

function getTag(dir: string) {
  return tagMap[dir] || '';
}

function getTagType(tag: string) {
  return tagTypeMap[tag] || '';
}

const cols = computed(() => props.columns || 2);
</script>

<template>
  <div class="course-grid" :style="{ '--cols': cols }">
    <a
      v-for="section in sections"
      :key="section.dir"
      :href="withBase(section.link)"
      class="course-card"
    >
      <div class="card-header">
        <el-icon :size="28" class="card-icon">
          <component :is="getIcon(section.dir)" />
        </el-icon>
        <el-tag
          v-if="getTag(section.dir)"
          :type="getTagType(getTag(section.dir)) as any"
          size="small"
          round
          effect="plain"
          class="card-tag"
        >
          {{ getTag(section.dir) }}
        </el-tag>
      </div>
      <h3 class="card-title">{{ section.text }}</h3>
      <p class="card-summary">{{ section.summary }}</p>
      <p class="card-accent">{{ section.accent }}</p>
    </a>
  </div>
</template>

<style scoped>
.course-grid {
  display: grid;
  grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr));
  gap: 16px;
  margin: 20px 0 28px;
}

.course-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: inherit;
  text-decoration: none;
  transition: all 0.25s ease;
  cursor: pointer;
}

.course-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.dark .course-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-icon {
  color: var(--vp-c-brand-1);
}

.card-tag {
  flex-shrink: 0;
}

.card-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.card-summary {
  margin: 0 0 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.card-accent {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
  line-height: 1.5;
  margin-top: auto;
}

@media (max-width: 768px) {
  .course-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .course-card {
    padding: 16px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .course-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
