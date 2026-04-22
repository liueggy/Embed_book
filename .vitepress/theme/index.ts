import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { h } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import './custom.css';

import CourseCard from './components/CourseCard.vue';
import StudyRoadmap from './components/StudyRoadmap.vue';
import TagFilter from './components/TagFilter.vue';
import Breadcrumb from './components/Breadcrumb.vue';

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(ElementPlus);
    app.component('CourseCard', CourseCard);
    app.component('StudyRoadmap', StudyRoadmap);
    app.component('TagFilter', TagFilter);
    app.component('Breadcrumb', Breadcrumb);
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(Breadcrumb)
    });
  }
};

export default theme;
