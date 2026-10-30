# 内容维护指南

网站以英文为主，基于 Hugo / Wowchemy，但首页与各页面都使用 `layouts/` 下的自定义模板。大部分内容只需改 `content/` 中的 Markdown 文件。

## 首页

首页只有 Hero、Latest News、Selected Publications，页脚是联系方式。Hero 文案和打字机轮播词在 `content/_index.md`；新闻取 `content/talk/` 最近 4 条，论文取 `featured: true` 的条目（最多 5 篇）。

## 导航栏

在 `config/_default/menus.toml` 维护。带 `parent` 的条目会进入点击弹出的下拉菜单。

## 页面动效

横幅背景由 `data-scene` 决定：`graph`（知识图谱）、`clusters`（数据挖掘）、`reasoning`（可信推理）、`alignment`（模型对齐）。普通页面可在 front matter 写 `scene: "clusters"`。

## 论文主题

论文页的主题筛选和标签在 `data/topics.yaml` 中维护，每个主题的 `publications` 填论文目录名（如 `2025-acl-codetaxo`）。

## 添加成员

在 `content/authors/` 下新建以英文名命名的目录，例如：

```text
content/authors/Firstname-Lastname/
├── _index.md
└── avatar.jpg
```

头像必须命名为 `avatar.jpg` 或 `avatar.png`；没有头像时会显示姓名首字母。`user_groups` 使用以下值，People 页面的分组标签在 `content/People/index.md` 中配置：

- `导师`：顶部大卡片
- `研究生`：Students
- `研究人员` / `研究助理`：Researchers
- `本科生`：Undergraduates
- 各类 `…校友`：Alumni

可复制现有 `Member-A/_index.md`，替换姓名、职位、研究方向和社交链接，并删除标题中的“(placeholder)”。

## 添加论文

每篇公开论文是一个 publication page bundle：

```text
content/publication/2026-venue-short-name/
├── index.md
└── featured.png   # 可选：论文方法图，首页与论文列表会展示
```

`index.md` 中填写 `title`、`authors`、`tags`、`date`、`publication`、`url_pdf` 和 `url_code`：

- 作者姓名与成员 profile 的 `authors` 字段一致时，会自动高亮并链接到成员主页。
- `url_code` 为 GitHub 地址时，会自动显示 star/fork 数。

在投、双盲或保密论文不要放入这个公开仓库。

## 添加新闻

在 `content/talk/` 下复制一个现有目录，填写 `title`、`summary` 和 `date`。

## 开源与招生

- 开源项目：`content/open-source/index.md` 的 `repos` 列表。`github` 写 `owner/repo` 时会显示实时 star/fork。
- 招生名额：`content/join/index.md` 的 `openings`。

## 主题与品牌

- 页面样式在 `assets/scss/custom.scss`，交互动效在 `assets/js/custom.js`。
- 主色为南开紫 `#7E0C6E`（深色模式为粉紫 `#EA7BD8`），不使用蓝紫色。
- 默认浅色模式，导航栏按钮可切换浅色 / 深色 / 跟随系统。
- 左上角校名标识来自 `static/media/nankai-university-logo.png`。

不要删除 `go.mod`、`go.sum`、`layouts/` 或 `assets/js/`，否则会破坏模板与自定义组件。
