<script setup lang="ts">
import { ref, computed } from 'vue';

export interface FilterableSection {
  dir: string;
  text: string;
  tag: string;
  [key: string]: any;
}

const props = defineProps<{
  sections: FilterableSection[];
  tags: string[];
}>();

const emit = defineEmits<{
  (e: 'filter', filtered: FilterableSection[]): void;
}>();

const activeTags = ref<string[]>([]);

function toggleTag(tag: string) {
  const idx = activeTags.value.indexOf(tag);
  if (idx > -1) {
    activeTags.value.splice(idx, 1);
  } else {
    activeTags.value.push(tag);
  }
  emit('filter', filtered.value);
}

function clearAll() {
  activeTags.value = [];
  emit('filter', filtered.value);
}

const filtered = computed(() => {
  if (activeTags.value.length === 0) return props.sections;
  return props.sections.filter((s) => activeTags.value.includes(s.tag));
});

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
  '资源': 'info',
  '全部': ''
};

defineExpose({ filtered, activeTags });
</script>

<template>
  <div class="tag-filter">
    <div class="tag-filter-row">
      <el-check-tag
        :checked="activeTags.length === 0"
        @change="clearAll"
        class="filter-tag"
      >
        全部
      </el-check-tag>
      <el-check-tag
        v-for="tag in tags"
        :key="tag"
        :checked="activeTags.includes(tag)"
        @change="toggleTag(tag)"
        class="filter-tag"
      >
        {{ tag }}
      </el-check-tag>
    </div>
  </div>
</template>

<style scoped>
.tag-filter {
  margin: 16px 0;
}

.tag-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.filter-tag {
  cursor: pointer;
  border-radius: 20px;
  font-size: 13px;
  padding: 4px 14px;
  transition: all 0.2s ease;
}

@media (max-width: 768px) {
  .tag-filter-row {
    gap: 6px;
  }

  .filter-tag {
    font-size: 12px;
    padding: 3px 10px;
  }
}
</style>
