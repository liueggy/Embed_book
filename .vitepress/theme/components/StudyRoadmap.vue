<script setup lang="ts">
import { withBase } from 'vitepress';

interface Stage {
  title: string;
  description: string;
  items: { text: string; link: string }[];
}

const props = defineProps<{
  stages: Stage[];
}>();
</script>

<template>
  <div class="roadmap-container">
    <el-timeline>
      <el-timeline-item
        v-for="(stage, index) in stages"
        :key="index"
        :timestamp="'第' + (index + 1) + '阶段'"
        placement="top"
        :color="index === 0 ? '#1f4b6e' : index === stages.length - 1 ? '#67C23A' : '#409EFF'"
        :size="'large'"
      >
        <el-card shadow="hover" class="roadmap-card">
          <h3 class="stage-title">{{ stage.title }}</h3>
          <p class="stage-desc">{{ stage.description }}</p>
          <div class="stage-links">
            <a
              v-for="(item, i) in stage.items"
              :key="i"
              :href="withBase(item.link)"
              class="stage-link"
            >
              <el-tag effect="plain" round size="default">
                {{ item.text }}
              </el-tag>
            </a>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<style scoped>
.roadmap-container {
  margin: 24px 0;
}

.roadmap-card {
  border-radius: 12px;
}

.stage-title {
  margin: 0 0 8px;
  font-size: 17px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.stage-desc {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.stage-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stage-link {
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s ease;
}

.stage-link:hover {
  transform: translateY(-1px);
}

.stage-link .el-tag {
  cursor: pointer;
}
</style>
