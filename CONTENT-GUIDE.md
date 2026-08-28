# Wowchemy 内容维护指南

## 添加成员

在 `content/authors/` 下新建以英文名命名的目录，例如：

```text
content/authors/Firstname-Lastname/
├── _index.md
└── avatar.jpg
```

头像必须命名为 `avatar.jpg` 或 `avatar.png`。成员分组使用以下中文值（需要与 `content/People/people.md` 中的顺序保持一致）：

- `导师`
- `研究生`
- `研究人员`
- `研究助理`
- `本科生`

可复制现有 `Member-A/_index.md`，替换姓名、职位、研究方向、社交链接，并删除标题中的“（示例）”。

## 添加论文

每篇公开论文是一个 Wowchemy publication page bundle：

```text
content/publication/2026-venue-short-name/
├── index.md
└── featured.png   # 可选论文缩略图
```

`index.md` 中填写 `title`、`authors`、`tags`、`date`、`publication`、`url_pdf` 和 `url_code`。论文作者姓名应和成员 profile 的 `authors` 字段一致。

在投、双盲或保密论文不要放入这个公开仓库。Wowchemy 4.8.0 没有上一版自建模板的 `public: false` 数据过滤层；敏感稿件应只留在私有 registry，公开后再复制到 `content/publication/`。

## 添加新闻

在 `content/talk/` 下复制一个现有目录，填写 `title`、`summary` 和 `date`。首页 News widget 会按日期倒序展示最近五条。

## 修改主题与品牌

Wowchemy 的关键设置在 `config/_default/params.toml`，南开紫配色在 `data/themes/skill_lab.toml`，页面细节在 `assets/scss/custom.scss`。左上角南开大学校名标识来自：

- `static/media/nankai-university-logo.png`

建议保持主色 `#7E0C6E` 与中文优先的信息层级。不要删除 `go.mod`、`go.sum`、`layouts/` 或 `assets/js/`，否则会破坏 Wowchemy 模板与自定义组件。
