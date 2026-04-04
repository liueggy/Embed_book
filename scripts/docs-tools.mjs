import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const repoRoot = path.resolve(__dirname, '..');
const README_CANDIDATES = ['README.md', 'Readme.md'];
const INTERNAL_LINK_RE = /\[([^\]]*?)\]\(([^)]+)\)/g;
const IGNORED_DIRS = new Set(['.git', '.github', '.omx', '.vitepress', 'node_modules']);

export const DOC_SECTIONS = [
  {
    dir: '01-C语言基础与进阶',
    text: 'C 语言基础与进阶',
    summary: '变量、指针、内存管理、排序算法与编译调试基础。',
    accent: '从语法、内存与调试入手，打牢嵌入式软件基本功。'
  },
  {
    dir: '02-嵌入式系统基础知识',
    text: '嵌入式系统基础知识',
    summary: '系统构成、启动流程、链接脚本、芯片手册与工具链。',
    accent: '理解 MCU、存储器、启动链路和开发调试全景。'
  },
  {
    dir: '03-驱动开发与外设编程',
    text: '驱动开发与外设编程',
    summary: 'GPIO、UART、SPI、I2C、ADC、DMA、CAN 与 STM32 工具链。',
    accent: '从寄存器级开发到 HAL/LL 抽象，覆盖常见外设驱动。'
  },
  {
    dir: '04-实时操作系统',
    text: '实时操作系统',
    summary: '任务管理、时间管理、线程通信、资源管理与 FreeRTOS。',
    accent: '把 RTOS 的概念、调度与工程化配置串起来。'
  },
  {
    dir: '05-EmbeddedLinux',
    text: 'Embedded Linux',
    summary: '启动流程、设备树、驱动模型、根文件系统与安全基础。',
    accent: '从命令行到系统启动链，覆盖嵌入式 Linux 开发核心。'
  },
  {
    dir: '06-NetworkIot',
    text: '网络通信与物联网',
    summary: '串口、Socket、无线协议、MQTT、TCP/IP、云接入与 OTA。',
    accent: '面向 IoT 产品开发的通信栈与云边协同知识。'
  },
  {
    dir: '07-Debug_Optimization',
    text: '调试与性能优化',
    summary: 'JTAG/SWD、GDB、OpenOCD、功耗优化与性能分析。',
    accent: '聚焦问题定位、性能瓶颈与低功耗调优手段。'
  },
  {
    dir: '08-项目实战与工具链',
    text: '项目实战与工具链',
    summary: '工程管理、构建系统、CI 流水线、常用开发工具。',
    accent: '把知识点落地到工程组织、构建和团队协作层面。'
  },
  {
    dir: '09-2025_AI_on_MCU',
    text: '2025 AI on MCU',
    summary: 'TinyML、TensorFlow Lite Micro、STM32 AI 与模型量化部署。',
    accent: '跟进 2025 年 MCU 端 AI 的新趋势与落地方案。'
  },
  {
    dir: '嵌入式图形 Qt 开发',
    text: '嵌入式图形 Qt 开发',
    summary: 'Qt for Embedded、交叉编译、图形界面、线程与外设集成。',
    accent: '为 HMI、工业终端和图形化设备补齐 GUI 技术栈。'
  },
  {
    dir: '面试题与面经',
    text: '面试题与面经',
    summary: '操作系统、Linux、网络原理与嵌入式岗位面试资料。',
    accent: '把知识库转换成面试场景下的高频问答与复习材料。'
  },
  {
    dir: 'books',
    text: '资源下载',
    summary: '电子书、PDF 资料与外部资源入口。',
    accent: '集中收口阅读材料、网盘资源与补充资料。'
  }
];

export function findEntryFile(dir) {
  const absoluteDir = path.isAbsolute(dir) ? dir : path.join(repoRoot, dir);
  for (const candidate of README_CANDIDATES) {
    const candidatePath = path.join(absoluteDir, candidate);
    if (fs.existsSync(candidatePath)) {
      return candidate;
    }
  }
  return null;
}

function walkMarkdownFiles(rootDir) {
  const results = [];
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) {
      continue;
    }

    const absolutePath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      results.push(...walkMarkdownFiles(absolutePath));
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      results.push(absolutePath);
    }
  }

  return results;
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

function splitLinkTarget(rawTarget) {
  const target = rawTarget.trim();
  const titleMatch = target.match(/^(\S+)(\s+["'][^"']*["'])$/);
  if (titleMatch) {
    return { pathPart: titleMatch[1], suffix: titleMatch[2] };
  }
  return { pathPart: target, suffix: '' };
}

function splitHash(target) {
  const hashIndex = target.indexOf('#');
  if (hashIndex === -1) {
    return { pathPart: target, hashPart: '' };
  }

  return {
    pathPart: target.slice(0, hashIndex),
    hashPart: target.slice(hashIndex)
  };
}

function isExternalLink(target) {
  return /^(?:[a-z]+:)?\/\//i.test(target) || /^(?:mailto:|tel:|data:)/i.test(target);
}

function isRootReadme(filePath) {
  return path.resolve(filePath) === path.join(repoRoot, 'README.md');
}

function normalizeLeadingDots(linkPath) {
  if (/^\.[^/]/.test(linkPath)) {
    return `./${linkPath.slice(1)}`;
  }
  return linkPath;
}

function toRelativeTarget(fromFile, absoluteTarget) {
  const relativePath = toPosixPath(path.relative(path.dirname(fromFile), absoluteTarget));
  if (relativePath.startsWith('../')) {
    return relativePath;
  }
  if (relativePath.startsWith('./')) {
    return relativePath;
  }
  return `./${relativePath}`;
}

function toDirectoryTarget(fromFile, absoluteDirectory, isAbsolute) {
  if (isAbsolute) {
    const relativeDirectory = toPosixPath(path.relative(repoRoot, absoluteDirectory));
    return relativeDirectory ? `/${relativeDirectory}/` : '/';
  }

  const relativeDirectory = toPosixPath(path.relative(path.dirname(fromFile), absoluteDirectory));
  if (!relativeDirectory) {
    return './';
  }
  if (relativeDirectory.startsWith('../')) {
    return `${relativeDirectory}/`;
  }
  if (relativeDirectory.startsWith('./')) {
    return `${relativeDirectory}/`;
  }
  return `./${relativeDirectory}/`;
}

function encodePathForMarkdown(linkPath) {
  if (!linkPath) {
    return linkPath;
  }

  if (linkPath.startsWith('/')) {
    return encodeURI(linkPath);
  }

  const prefix = linkPath.startsWith('./')
    ? './'
    : linkPath.startsWith('../')
      ? '../'.repeat(linkPath.match(/^(\.\.\/)+/)?.[0].split('../').length - 1 || 1)
      : '';

  if (prefix) {
    return `${prefix}${encodeURI(linkPath.slice(prefix.length)).replace(/\(/g, '%28').replace(/\)/g, '%29')}`;
  }

  return encodeURI(linkPath).replace(/\(/g, '%28').replace(/\)/g, '%29');
}

function existingReadmePath(dir) {
  for (const candidate of README_CANDIDATES) {
    const candidatePath = path.join(dir, candidate);
    if (fs.existsSync(candidatePath)) {
      return candidatePath;
    }
  }
  return null;
}

function resolveLocalTarget(fromFile, rawPath) {
  const cleaned = normalizeLeadingDots(rawPath.replace(/\.md\/$/i, '.md'));
  const decoded = decodeURI(cleaned);
  const isAbsolute = decoded.startsWith('/');
  const absoluteBase = isAbsolute
    ? path.join(repoRoot, decoded.slice(1))
    : path.resolve(path.dirname(fromFile), decoded);

  const exactFile = absoluteBase;
  if (fs.existsSync(exactFile) && fs.statSync(exactFile).isFile()) {
    if (README_CANDIDATES.includes(path.basename(exactFile))) {
      return toDirectoryTarget(fromFile, path.dirname(exactFile), isAbsolute);
    }
    return isAbsolute
      ? `/${toPosixPath(path.relative(repoRoot, exactFile))}`
      : toRelativeTarget(fromFile, exactFile);
  }

  if (fs.existsSync(absoluteBase) && fs.statSync(absoluteBase).isDirectory()) {
    const readmePath = existingReadmePath(absoluteBase);
    if (readmePath) {
      return toDirectoryTarget(fromFile, absoluteBase, isAbsolute);
    }
  }

  if (!path.extname(absoluteBase)) {
    const markdownCandidate = `${absoluteBase}.md`;
    if (fs.existsSync(markdownCandidate) && fs.statSync(markdownCandidate).isFile()) {
      if (README_CANDIDATES.includes(path.basename(markdownCandidate))) {
        return toDirectoryTarget(fromFile, path.dirname(markdownCandidate), isAbsolute);
      }
      return isAbsolute
        ? `/${toPosixPath(path.relative(repoRoot, markdownCandidate))}`
        : toRelativeTarget(fromFile, markdownCandidate);
    }
  }

  return null;
}

function normalizeLink(fromFile, rawTarget) {
  const { pathPart, suffix } = splitLinkTarget(rawTarget);
  if (!pathPart || isExternalLink(pathPart) || pathPart.startsWith('#')) {
    return { changed: false, nextTarget: rawTarget, broken: false };
  }

  const { pathPart: rawPathPart, hashPart } = splitHash(pathPart);
  const resolvedPath = resolveLocalTarget(fromFile, rawPathPart);
  if (!resolvedPath) {
    return { changed: false, nextTarget: rawTarget, broken: true };
  }

  const normalizedPath = encodePathForMarkdown(resolvedPath);
  const nextTarget = `${normalizedPath}${hashPart}${suffix}`;
  return {
    changed: nextTarget !== rawTarget,
    nextTarget,
    broken: false
  };
}

function processMarkdownFile(filePath, mode) {
  const original = fs.readFileSync(filePath, 'utf8');
  const brokenLinks = [];
  let inFence = false;
  const nextContent = original
    .split(/\r?\n/)
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return line;
      }

      if (inFence) {
        return line;
      }

      return line.replace(INTERNAL_LINK_RE, (fullMatch, text, target) => {
        const normalized = normalizeLink(filePath, target);
        if (normalized.broken) {
          brokenLinks.push(target);
          return fullMatch;
        }

        if (!normalized.changed) {
          return fullMatch;
        }

        return `[${text}](${normalized.nextTarget})`;
      });
    })
    .join('\n');

  const changed = nextContent !== original;
  if (mode === 'fix' && changed) {
    fs.writeFileSync(filePath, nextContent, 'utf8');
  }

  return { changed, brokenLinks };
}

export function getManagedMarkdownFiles() {
  return walkMarkdownFiles(repoRoot).filter((filePath) => !isRootReadme(filePath));
}

export function runLinkWorkflow(mode = 'check') {
  const markdownFiles = getManagedMarkdownFiles();
  const changedFiles = [];
  const brokenEntries = [];

  for (const filePath of markdownFiles) {
    const result = processMarkdownFile(filePath, mode === 'fix' ? 'fix' : 'check');
    if (result.changed) {
      changedFiles.push(path.relative(repoRoot, filePath));
    }

    for (const brokenLink of result.brokenLinks) {
      brokenEntries.push({
        file: path.relative(repoRoot, filePath),
        link: brokenLink
      });
    }
  }

  return { changedFiles, brokenEntries };
}

function compareEntries(a, b) {
  return a.localeCompare(b, 'zh-CN-u-kn-true');
}

function toRoute(relativeFilePath) {
  const normalized = toPosixPath(relativeFilePath);
  const basename = path.posix.basename(normalized);

  if (README_CANDIDATES.includes(basename)) {
    const directory = path.posix.dirname(normalized);
    return directory === '.' ? '/' : `/${directory}/`;
  }

  return `/${normalized.replace(/\.md$/i, '')}`;
}

function encodeRoute(route) {
  return encodeURI(route);
}

function getEntryRoute(section) {
  const entryFile = findEntryFile(section.dir);
  if (!entryFile) {
    throw new Error(`Missing README entry for ${section.dir}`);
  }
  return encodeRoute(toRoute(path.posix.join(section.dir, entryFile)));
}

function listSectionPages(section) {
  const sectionRoot = path.join(repoRoot, section.dir);
  const entries = fs.readdirSync(sectionRoot, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    if (!entry.name.toLowerCase().endsWith('.md')) {
      continue;
    }

    if (README_CANDIDATES.includes(entry.name)) {
      continue;
    }

    pages.push({
      text: entry.name.replace(/\.md$/i, ''),
      link: encodeRoute(toRoute(path.posix.join(section.dir, entry.name)))
    });
  }

  return pages.sort((a, b) => compareEntries(a.text, b.text));
}

export function buildNav() {
  const studyItems = DOC_SECTIONS.slice(0, 10).map((section) => ({
    text: section.text,
    link: getEntryRoute(section)
  }));

  return [
    { text: '首页', link: '/' },
    { text: '学习地图', link: '/study-map' },
    { text: '专题文档', items: studyItems },
    {
      text: '面试与资源',
      items: [
        { text: '面试题与面经', link: getEntryRoute(DOC_SECTIONS.find((section) => section.dir === '面试题与面经')) },
        { text: '资源下载', link: '/resources' },
        { text: 'books 资源页', link: getEntryRoute(DOC_SECTIONS.find((section) => section.dir === 'books')) }
      ]
    }
  ];
}

export function buildSidebar() {
  const rootSidebar = [
    {
      text: '站点导航',
      items: [
        { text: '首页', link: '/' },
        { text: '学习地图', link: '/study-map' },
        { text: '资源中心', link: '/resources' }
      ]
    },
    {
      text: '主线专题',
      items: DOC_SECTIONS.filter((section) => !['面试题与面经', 'books'].includes(section.dir)).map((section) => ({
        text: section.text,
        link: getEntryRoute(section)
      }))
    },
    {
      text: '附录与资料',
      items: [
        { text: '面试题与面经', link: getEntryRoute(DOC_SECTIONS.find((section) => section.dir === '面试题与面经')) },
        { text: 'books 资源页', link: getEntryRoute(DOC_SECTIONS.find((section) => section.dir === 'books')) }
      ]
    }
  ];

  const sidebar = {
    '/': rootSidebar
  };

  for (const section of DOC_SECTIONS) {
    const entryRoute = getEntryRoute(section);
    const items = [{ text: '章节导读', link: entryRoute }];

    if (section.dir === '面试题与面经') {
      items.push(...listSectionPages(section));
    }

    if (section.dir === 'books') {
      items.push({ text: '资源中心', link: '/resources' });
    }

    sidebar[entryRoute] = [
      {
        text: section.text,
        items
      }
    ];
  }

  return sidebar;
}

export function buildRewrites() {
  const rewrites = {};

  for (const section of DOC_SECTIONS) {
    const entryFile = findEntryFile(section.dir);
    if (!entryFile) {
      continue;
    }

    const source = `${section.dir}/${entryFile}`;
    const target = `${section.dir}/index.md`;
    rewrites[source] = target;
  }

  return rewrites;
}

function printHelp() {
  console.log('Usage: node scripts/docs-tools.mjs <fix-links|check-links|print-sidebar>');
}

function runCli() {
  const command = process.argv[2];
  if (!command) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  if (command === 'print-sidebar') {
    console.log(JSON.stringify(buildSidebar(), null, 2));
    return;
  }

  if (command !== 'fix-links' && command !== 'check-links') {
    printHelp();
    process.exitCode = 1;
    return;
  }

  const { changedFiles, brokenEntries } = runLinkWorkflow(command === 'fix-links' ? 'fix' : 'check');

  if (changedFiles.length > 0) {
    const label = command === 'fix-links' ? 'Updated link targets in:' : 'Link normalization would change:';
    console.log(label);
    for (const filePath of changedFiles) {
      console.log(`- ${filePath}`);
    }
  }

  if (brokenEntries.length > 0) {
    console.error('Broken local links:');
    for (const entry of brokenEntries) {
      console.error(`- ${entry.file}: ${entry.link}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(command === 'fix-links' ? 'Local markdown links normalized.' : 'Local markdown links look valid.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  runCli();
}
