# 学习地图

这份学习地图把仓库里的 Markdown 内容按“先基础、再系统、后工程与专题”的顺序整理出来，适合第一次系统阅读时参考。

<script setup>
const stages = [
  {
    title: '基础打底',
    description: '把语言、硬件抽象、启动链路和常见外设串起来，形成最基本的嵌入式开发心智模型。',
    items: [
      { text: 'C 语言基础与进阶', link: '/01-C%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80%E4%B8%8E%E8%BF%9B%E9%98%B6/' },
      { text: '嵌入式系统基础知识', link: '/02-%E5%B5%8C%E5%85%A5%E5%BC%8F%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86/' },
      { text: '驱动开发与外设编程', link: '/03-%E9%A9%B1%E5%8A%A8%E5%BC%80%E5%8F%91%E4%B8%8E%E5%A4%96%E8%AE%BE%E7%BC%96%E7%A8%8B/' }
    ]
  },
  {
    title: '系统能力',
    description: '从“写代码”提升到“组织系统”。重点关注任务调度、驱动模型、设备树、协议栈和云边通信流程。',
    items: [
      { text: '实时操作系统', link: '/04-%E5%AE%9E%E6%97%B6%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/' },
      { text: 'Embedded Linux', link: '/05-EmbeddedLinux/' },
      { text: '网络通信与物联网', link: '/06-NetworkIot/' }
    ]
  },
  {
    title: '工程与优化',
    description: '更偏工程交付，适合在做项目时随查随用，包括调试链路、构建工具、CI、静态分析和团队协作习惯。',
    items: [
      { text: '调试与性能优化', link: '/07-Debug_Optimization/' },
      { text: '项目实战与工具链', link: '/08-%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E4%B8%8E%E5%B7%A5%E5%85%B7%E9%93%BE/' }
    ]
  },
  {
    title: '扩展专题与面试',
    description: '趋势方向扩展与面试复习材料。有项目经验的同学可以直接从面试入口开始，再反向查漏补缺。',
    items: [
      { text: '2025 AI on MCU', link: '/09-2025_AI_on_MCU/' },
      { text: '嵌入式图形 Qt 开发', link: '/%E5%B5%8C%E5%85%A5%E5%BC%8F%E5%9B%BE%E5%BD%A2%20Qt%20%E5%BC%80%E5%8F%91/' },
      { text: '面试题与面经', link: '/%E9%9D%A2%E8%AF%95%E9%A2%98%E4%B8%8E%E9%9D%A2%E7%BB%8F/' },
      { text: '资源中心', link: '/resources' }
    ]
  }
];
</script>

<StudyRoadmap :stages="stages" />
