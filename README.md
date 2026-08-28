# Skill Lab · Research Modern

这是在 HKU-CG 同款 Wowchemy 4.8.0 模板上制作的 SKILL Lab（Structural Knowledge & Intelligent Language Lab）现代研究版。网站使用南开大学官方校名标识与南开紫品牌色，以冷白、雾灰和 THUNLP 风格双面翻转卡片呈现研究方向，精选论文直接使用论文方法图，同时保留原生页面类型、搜索、论文筛选、团队成员页面和日夜模式。

原始 HKU 风格版本仍保存在相邻目录 `SkillLab-NKU-HKU-Wowchemy`，本目录为独立方案，不会覆盖原版。

模板来源和保留范围见 [UPSTREAM.md](UPSTREAM.md)，MIT 许可证见 [LICENSE.md](LICENSE.md)。

## 本地预览

需要：

- Hugo Extended 0.128.0
- Go
- Dart Sass 1.77.5

在项目目录运行：

```powershell
hugo server
```

然后打开 `http://localhost:1313/`。首次运行需要联网下载固定版本的 Wowchemy Hugo Module。

## 发布

1. 将项目全部文件上传到 `SkillLab-NKU/SkillLab-NKU.github.io` 仓库根目录。
2. 在仓库 **Settings → Pages** 中把 Source 设为 **GitHub Actions**。
3. 推送到 `main` 后，`.github/workflows/hugo.yml` 会安装与 HKU-CG 相同的 Hugo Extended 0.128.0 和 Dart Sass 1.77.5，然后构建并发布。

## 日常内容位置

- 实验室简介：`content/authors/admin/_index.md`
- 导师与成员：`content/authors/<name>/_index.md`
- 新闻：`content/talk/<news>/index.md`
- 论文：`content/publication/<paper>/index.md`
- 首页区块：`content/home/*.md`
- 菜单：`config/_default/menus.toml`
- 主题与联系方式：`config/_default/params.toml`

详细字段示例见 [CONTENT-GUIDE.md](CONTENT-GUIDE.md)。
