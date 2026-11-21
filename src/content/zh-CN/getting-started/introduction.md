# 简介

MDV（`@mdv-ui/mdv`）是基于 Material Design 3 的 Vue 3 组件库。你可以在现有的 Vue 应用中用它添加界面控件、导航和操作反馈。

## 使用条件

MDV 需要 Vue 3.5 或更新的 Vue 3 版本，以及 Tailwind CSS v4。组件库提供 TypeScript 类型声明，以及独立的主题样式和组件样式。MDV 所需的工具类由你的应用通过 Tailwind 生成，组件库不提供预编译的 Tailwind 工具类。

## 按用途查找组件

可以根据界面需要支持的任务选择组件：

- **操作**：用[按钮](/zh-CN/components/button)提供带文字标签的操作，或用[图标按钮](/zh-CN/components/icon-button)节省空间。
- **表单**：用[文本框](/zh-CN/components/text-field)收集文本，或用[时间选择器](/zh-CN/components/time-picker)让用户选择时刻。
- **内容展示**：用[卡片](/zh-CN/components/card)组织相关信息，或用[列表](/zh-CN/components/list)展示一组条目。
- **导航**：用[导航抽屉](/zh-CN/components/navigation-drawer)提供页面入口，或用[标签页](/zh-CN/components/tabs)切换相关视图。
- **浮层与反馈**：用[对话框](/zh-CN/components/dialog)请求确认，用[提示气泡](/zh-CN/components/tooltip)解释控件，或用[消息提示](/zh-CN/components/snackbar)显示简短的状态消息。

## 开始使用

1. 按照[安装与配置](/zh-CN/getting-started/setup)安装 MDV，并在项目中配置 Tailwind 和样式表。
2. 打开[按钮变体示例](/zh-CN/components/button#变体)，比较不同外观，再展开示例源码，了解如何导入和使用 `MdvButton`。
3. 如果正在构建表单，可以试试[文本框校验示例](/zh-CN/components/text-field#原生表单与校验)：先输入格式不正确的邮箱地址并提交，修正后再提交，看看原生校验和表单提交如何配合。
