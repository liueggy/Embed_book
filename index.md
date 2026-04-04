---
layout: home
title: 2025 嵌入式软件开发图谱
titleTemplate: false
hero:
  name: 2025 嵌入式软件开发图谱
  text: 从 Markdown 仓库整理成可阅读、可导航的静态文档站
  tagline: 用一套清晰的学习地图串起 C 语言、驱动开发、RTOS、Embedded Linux、网络通信与 AI on MCU。
  actions:
    - theme: brand
      text: 开始阅读
      link: /study-map
    - theme: alt
      text: C 语言基础
      link: /01-C语言基础与进阶/
    - theme: alt
      text: 资源下载
      link: /resources
features:
  - title: 分层学习路线
    details: 顶层保留原仓库章节结构，把知识点按学习顺序重新组织成可浏览的文档导航。
  - title: 文档站式阅读体验
    details: 侧边栏、页内目录、本地搜索、上一页/下一页都已补齐，适合连续学习。
  - title: 面试与资源补充
    details: 将面试题、电子书、PDF 资料单独收口，避免和正文主线互相打断。
---

<div class="portal-strip">
  推荐阅读顺序：<strong>C 语言基础</strong> → <strong>嵌入式系统基础</strong> → <strong>驱动开发</strong> → <strong>RTOS</strong> → <strong>Embedded Linux / IoT</strong> → <strong>AI on MCU</strong>
</div>

## 学习总览

这套站点保留了原始 Markdown 的内容密度，但把阅读入口改造成了更适合长期使用的文档首页。你可以按章节系统学习，也可以从专题、面试或资料区直接切入。

<div class="portal-image">

![嵌入式软件开发思维导图](./%E5%B5%8C%E5%85%A5%E5%BC%8F%E8%BD%AF%E4%BB%B6%E5%BC%80%E5%8F%91%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE.png)

</div>

## 主线专题

<div class="portal-grid">
  <a class="portal-card" href="/Embed_book/01-C%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80%E4%B8%8E%E8%BF%9B%E9%98%B6/">
    <span class="portal-kicker">Core</span>
    <h3>C 语言基础与进阶</h3>
    <p>变量、指针、内存、排序算法与编译调试，适合作为整套知识库的起点。</p>
  </a>
  <a class="portal-card" href="/Embed_book/03-%E9%A9%B1%E5%8A%A8%E5%BC%80%E5%8F%91%E4%B8%8E%E5%A4%96%E8%AE%BE%E7%BC%96%E7%A8%8B/">
    <span class="portal-kicker">Driver</span>
    <h3>驱动开发与外设编程</h3>
    <p>GPIO、UART、SPI、I2C、ADC、DMA、CAN，以及 STM32 常见工具链。</p>
  </a>
  <a class="portal-card" href="/Embed_book/04-%E5%AE%9E%E6%97%B6%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/">
    <span class="portal-kicker">RTOS</span>
    <h3>实时操作系统</h3>
    <p>任务调度、线程通信、资源管理与 FreeRTOS 配置，适合工程化提升。</p>
  </a>
  <a class="portal-card" href="/Embed_book/05-EmbeddedLinux/">
    <span class="portal-kicker">System</span>
    <h3>Embedded Linux</h3>
    <p>从启动流程、设备树到驱动模型与根文件系统，覆盖 Linux 嵌入式主线。</p>
  </a>
</div>

## 精选入口

- [学习地图](/study-map.md)：按阶段浏览全部内容，适合第一次进入仓库时快速建立全局认知。
- [网络通信与物联网](/06-NetworkIot/)：如果你正在做联网设备或云端对接，可以从这里直接进入。
- [2025 AI on MCU](/09-2025_AI_on_MCU/)：关注 TinyML、模型量化部署和 STM32 AI 套件的新趋势。
- [嵌入式图形 Qt 开发](/%E5%B5%8C%E5%85%A5%E5%BC%8F%E5%9B%BE%E5%BD%A2%20Qt%20%E5%BC%80%E5%8F%91/)：补齐 HMI、工业终端和 GUI 场景所需的图形能力。

## 面试与资料

<div class="portal-grid">
  <a class="portal-card" href="/Embed_book/%E9%9D%A2%E8%AF%95%E9%A2%98%E4%B8%8E%E9%9D%A2%E7%BB%8F/">
    <span class="portal-kicker">Interview</span>
    <h3>面试题与面经</h3>
    <p>把操作系统、Linux、网络原理等高频面试内容集中整理成复习入口。</p>
  </a>
  <a class="portal-card" href="/Embed_book/resources">
    <span class="portal-kicker">Library</span>
    <h3>资源中心</h3>
    <p>电子书、PDF、books 页和网盘资源都被统一收口，便于下载和补充阅读。</p>
  </a>
</div>

## 适合谁读

<div class="portal-note">
  这套内容最适合想系统学习嵌入式软件的同学、准备校招社招面试的开发者，以及希望把零散知识点整理成长期参考资料的人。
</div>
