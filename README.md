# JING AI PLAYGROUND

荆的个人 AI 创作者主页、实验室与作品存档站。

## 本地运行

```bash
npm install
npm run dev
```

然后访问 `http://localhost:3000`。

## 构建纯静态网站

```bash
npm run build
```

构建结果会生成在 `out/`，其中只有 HTML、CSS、JavaScript、字体和图片，不需要服务器或 ChatGPT 登录。

## 发布到 GitHub Pages

1. 在 GitHub 新建一个仓库。
2. 将这个项目推送到仓库的 `main` 分支。
3. 打开仓库的 **Settings → Pages**。
4. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
5. 项目自带的 `.github/workflows/deploy-pages.yml` 会自动构建并发布网站。

普通项目仓库的访问地址通常是：

```text
https://你的用户名.github.io/仓库名/
```

如果仓库名是 `你的用户名.github.io`，访问地址就是：

```text
https://你的用户名.github.io/
```

## 修改内容

作品、实验和工具数据集中维护在：

```text
app/data/content.ts
```

新增内容时，向 `stories`、`experiments` 或 `tools` 数组添加一条数据即可。
