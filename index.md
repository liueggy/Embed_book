---
layout: home
title: 嵌入式软件开发图谱
titleTemplate: false
hero:
  name: 嵌入式软件开发图谱
  text: 系统化学习路径与技术参考
  tagline: 覆盖 C 语言、驱动开发、RTOS、Embedded Linux、IoT 与 AI on MCU 的全景知识库
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
  { dir: '01-C语言基础与进阶', text: 'C 语言基础与进阶', summary: '变量、指针、内存管理、排序算法与编译调试基础。', accent: '从语法、内存与调试入手，打牢嵌入式软件基本功。', link: '/01-C%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80%E4%B8%8E%E8%BF%9B%E9%98%B6/', tag: '基础' },
  { dir: '02-嵌入式系统基础知识', text: '嵌入式系统基础知识', summary: '系统构成、启动流程、链接脚本、芯片手册与工具链。', accent: '理解 MCU、存储器、启动链路和开发调试全景。', link: '/02-%E5%B5%8C%E5%85%A5%E5%BC%8F%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86/', tag: '基础' },
  { dir: '03-驱动开发与外设编程', text: '驱动开发与外设编程', summary: 'GPIO、UART、SPI、I2C、ADC、DMA、CAN 与 STM32 工具链。', accent: '从寄存器级开发到 HAL/LL 抽象，覆盖常见外设驱动。', link: '/03-%E9%A9%B1%E5%8A%A8%E5%BC%80%E5%8F%91%E4%B8%8E%E5%A4%96%E8%AE%BE%E7%BC%96%E7%A8%8B/', tag: '驱动' },
  { dir: '04-实时操作系统', text: '实时操作系统', summary: '任务管理、时间管理、线程通信、资源管理与 FreeRTOS。', accent: '把 RTOS 的概念、调度与工程化配置串起来。', link: '/04-%E5%AE%9E%E6%97%B6%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/', tag: 'RTOS' },
  { dir: '05-EmbeddedLinux', text: 'Embedded Linux', summary: '启动流程、设备树、驱动模型、根文件系统与安全基础。', accent: '从命令行到系统启动链，覆盖嵌入式 Linux 开发核心。', link: '/05-EmbeddedLinux/', tag: 'Linux' },
  { dir: '06-NetworkIot', text: '网络通信与物联网', summary: '串口、Socket、无线协议、MQTT、TCP/IP、云接入与 OTA。', accent: '面向 IoT 产品开发的通信栈与云边协同知识。', link: '/06-NetworkIot/', tag: 'IoT' },
  { dir: '07-Debug_Optimization', text: '调试与性能优化', summary: 'JTAG/SWD、GDB、OpenOCD、功耗优化与性能分析。', accent: '聚焦问题定位、性能瓶颈与低功耗调优手段。', link: '/07-Debug_Optimization/', tag: '调试' },
  { dir: '08-项目实战与工具链', text: '项目实战与工具链', summary: '工程管理、构建系统、CI 流水线、常用开发工具。', accent: '把知识点落地到工程组织、构建和团队协作层面。', link: '/08-%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E4%B8%8E%E5%B7%A5%E5%85%B7%E9%93%BE/', tag: '工程' }
];

const topicSections = [
  { dir: '09-2025_AI_on_MCU', text: '2025 AI on MCU', summary: 'TinyML、TensorFlow Lite Micro、STM32 AI 与模型量化部署。', accent: '跟进 2025 年 MCU 端 AI 的新趋势与落地方案。', link: '/09-2025_AI_on_MCU/', tag: 'AI' },
  { dir: '嵌入式图形 Qt 开发', text: '嵌入式图形 Qt 开发', summary: 'Qt for Embedded、交叉编译、图形界面、线程与外设集成。', accent: '为 HMI、工业终端和图形化设备补齐 GUI 技术栈。', link: '/%E5%B5%8C%E5%85%A5%E5%BC%8F%E5%9B%BE%E5%BD%A2%20Qt%20%E5%BC%80%E5%8F%91/', tag: 'GUI' },
  { dir: '面试题与面经', text: '面试题与面经', summary: '操作系统、Linux、网络原理与嵌入式岗位面试资料。', accent: '把知识库转换成面试场景下的高频问答与复习材料。', link: '/%E9%9D%A2%E8%AF%95%E9%A2%98%E4%B8%8E%E9%9D%A2%E7%BB%8F/', tag: '面试' },
  { dir: 'books', text: '资源中心', summary: '电子书、PDF 资料与外部资源入口。', accent: '集中收口阅读材料、网盘资源与补充资料。', link: '/resources', tag: '资源' }
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
