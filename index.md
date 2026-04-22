---
layout: home
title: 嵌入式软件开发图谱
titleTemplate: false
hero:
  name: Embed Book
  text: 嵌入式开发全景知识库
  tagline: C · 驱动 · RTOS · Linux · IoT · AI on MCU
  actions:
    - theme: brand
      text: 开始学习
      link: /01-C语言基础与进阶/
    - theme: alt
      text: 学习地图
      link: /study-map
---

<script setup>
import { ref, computed } from 'vue';

const coreSections = [
  { dir: '01-C语言基础与进阶', text: 'C 语言基础与进阶', summary: '指针、内存管理、编译调试', accent: '打牢嵌入式软件基本功', link: '/01-C%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80%E4%B8%8E%E8%BF%9B%E9%98%B6/', tag: '基础' },
  { dir: '02-嵌入式系统基础知识', text: '嵌入式系统基础', summary: '启动流程、链接脚本、芯片手册', accent: 'MCU 与工具链全景', link: '/02-%E5%B5%8C%E5%85%A5%E5%BC%8F%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86/', tag: '基础' },
  { dir: '03-驱动开发与外设编程', text: '驱动与外设', summary: 'GPIO / UART / SPI / I2C / DMA', accent: '寄存器到 HAL 抽象', link: '/03-%E9%A9%B1%E5%8A%A8%E5%BC%80%E5%8F%91%E4%B8%8E%E5%A4%96%E8%AE%BE%E7%BC%96%E7%A8%8B/', tag: '驱动' },
  { dir: '04-实时操作系统', text: '实时操作系统', summary: '任务调度、线程通信、FreeRTOS', accent: 'RTOS 概念与工程配置', link: '/04-%E5%AE%9E%E6%97%B6%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/', tag: 'RTOS' },
  { dir: '05-EmbeddedLinux', text: 'Embedded Linux', summary: '设备树、驱动模型、根文件系统', accent: '嵌入式 Linux 开发核心', link: '/05-EmbeddedLinux/', tag: 'Linux' },
  { dir: '06-NetworkIot', text: '网络与物联网', summary: 'MQTT / TCP/IP / OTA', accent: '通信栈与云边协同', link: '/06-NetworkIot/', tag: 'IoT' },
  { dir: '07-Debug_Optimization', text: '调试与优化', summary: 'GDB、OpenOCD、功耗分析', accent: '定位瓶颈与低功耗调优', link: '/07-Debug_Optimization/', tag: '调试' },
  { dir: '08-项目实战与工具链', text: '工具链与实战', summary: '构建系统、CI、工程管理', accent: '知识落地到团队协作', link: '/08-%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E4%B8%8E%E5%B7%A5%E5%85%B7%E9%93%BE/', tag: '工程' }
];

const topicSections = [
  { dir: '09-2025_AI_on_MCU', text: 'AI on MCU', summary: 'TinyML / TFLite Micro / 量化部署', accent: 'MCU 端 AI 落地', link: '/09-2025_AI_on_MCU/', tag: 'AI' },
  { dir: '嵌入式图形 Qt 开发', text: 'Qt 图形开发', summary: '交叉编译、GUI、外设集成', accent: 'HMI 与工业终端', link: '/%E5%B5%8C%E5%85%A5%E5%BC%8F%E5%9B%BE%E5%BD%A2%20Qt%20%E5%BC%80%E5%8F%91/', tag: 'GUI' },
  { dir: '面试题与面经', text: '面试题与面经', summary: 'OS / Linux / 网络高频题', accent: '嵌入式岗位面试速查', link: '/%E9%9D%A2%E8%AF%95%E9%A2%98%E4%B8%8E%E9%9D%A2%E7%BB%8F/', tag: '面试' },
  { dir: 'books', text: '资源中心', summary: '电子书、PDF、网盘', accent: '阅读材料集中入口', link: '/resources', tag: '资源' }
];

const allSections = [...coreSections, ...topicSections];
const allTags = ['基础', '驱动', 'RTOS', 'Linux', 'IoT', '调试', '工程', 'AI', 'GUI', '面试', '资源'];

const filterRef = ref(null);

const displaySections = computed(() => {
  if (!filterRef.value || !filterRef.value.activeTags || filterRef.value.activeTags.length === 0) {
    return allSections;
  }
  return allSections.filter(s => filterRef.value.activeTags.includes(s.tag));
});
</script>

## 全部专题

<TagFilter ref="filterRef" :sections="allSections" :tags="allTags" />

<CourseCard :sections="displaySections" :columns="3" />
