<script setup lang="ts">
import { MdvIcon } from '@mdv-ui/mdv'
import appsIcon from '@iconify-icons/material-symbols/apps'
import ComponentLibrary from '@/components/docs/ComponentLibrary.vue'
</script>

# 简介

MDV（`@mdv-ui/mdv`）是基于 Material Design 3 的 Vue 3 组件库。你可以在现有的 Vue 应用中用它添加界面控件、导航和操作反馈。

## 使用条件

MDV 需要 Vue 3.5 或更新的 Vue 3 版本，以及 Tailwind CSS v4。组件库提供 TypeScript 类型声明，以及独立的主题样式和组件样式。MDV 所需的工具类由你的应用通过 Tailwind 生成，组件库不提供预编译的 Tailwind 工具类。

## <MdvIcon :icon="appsIcon" class="me-2 inline-block align-[-0.15em] text-mdv-primary" /> 组件库

<ComponentLibrary locale="zh-CN" />

## 开始使用

1. 按照[安装与配置](/zh-CN/getting-started/setup)安装 MDV，并在项目中配置 Tailwind 和样式表。
2. 打开[按钮变体示例](/zh-CN/components/button#变体)，比较不同外观，再展开示例源码，了解如何导入和使用 `MdvButton`。
3. 如果正在构建表单，可以试试[文本框校验示例](/zh-CN/components/text-field#原生表单与校验)：先输入格式不正确的邮箱地址并提交，修正后再提交，看看原生校验和表单提交如何配合。
