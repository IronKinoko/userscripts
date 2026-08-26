# AGENTS.md

本文件为在本仓库中工作的 AI Agent 提供指引。

## 项目概览

一个基于 **pnpm monorepo** 的 Tampermonkey / Greasemonkey 油猴脚本集合。`packages/` 下的每个包都是一个独立的油猴脚本，构建为单个 `.user.js` 文件，通过 GitHub Pages（`dist` 分支）和 Greasyfork 分发。

## 包结构

每个油猴脚本包遵循以下目录布局：

```
packages/<name>/
  package.json      # name、version、description、scripts（bocchi dev/build）
  meta.template     # UserScript 元数据块（头部注释）
  tsconfig.json     # 继承根 tsconfig
  src/
    index.ts        # 入口文件（主逻辑）
    *.ts            # 其他模块
    *.scss          # 可选样式
  dist/             # 构建输出（已 gitignore）
    index.user.js   # 最终打包产物
    index.dev.js    # 开发构建产物
```

特殊包：
- **`packages/shared`** — 内部工具库（cookie、DOM 辅助、复制、快捷键、存储等）。通过 `workspace:*` 依赖引用，本身不是油猴脚本。

### meta.template

UserScript 的头部注释。`bocchi` 在构建时会将 `#version#` 和 `#description#` 替换为 `package.json` 中对应的值。

## 关键命令

| 命令 | 用途 |
|------|------|
| `pnpm bootstrap` | 从 `scripts/bootstrap/template/` 创建新包（交互式，提示输入名称） |
| `pnpm build` | 通过 `pnpm -r build` 构建所有包（执行 `bocchi build`），然后将各包 `packages/*/dist/index.user.js` 复制到根目录 `dist/<name>.user.js` |
| `pnpm log` | 创建 changeset（`pnpm changeset`） |
| `pnpm release` | 完整发布流程：changeset 版本更新 → 安装 → 提交 → 打 tag → 推送 |

包级命令：
- `pnpm dev`（在 `packages/<name>` 中）— `bocchi dev`（watch 模式）
- `pnpm build`（在 `packages/<name>` 中）— `bocchi build`（生产构建）

## 构建系统

- **打包器**：[`bocchi`](https://github.com/...)（轻量级油猴脚本打包器）。不是 webpack，也不是 Vite。
- 每个包的 `bocchi build` 读取 `src/index.ts` + `meta.template`，将所有内容内联为单个 IIFE 风格的 `.user.js`。
- TS 中导入的 CSS/SCSS 会被内联。
- meta.template 中的 `@require`（如 jQuery）是油猴引擎在运行时加载的外部依赖，**不会被打包**。

## TypeScript

- 根 `tsconfig.json`：strict 模式、ES2018 target、ESNext modules。
- 根目录 `noEmit: true`（输出由 bocchi 处理）。
- `env.d.ts` 声明了 Tampermonkey API：`unsafeWindow`、`GM_getValue`、`GM_setValue`、`GM_xmlhttpRequest`。
- `Window` 类型声明为 `[x: string]: any`，允许宽松的 DOM 访问。
- 路径别名：`shared` → `./packages/shared/src/index.ts`。

## 代码风格

配置在 `.prettierrc`（通过 husky + `pretty-quick` 在 pre-commit 时强制执行）：

- **单引号**
- **不加分号**
- **2 空格缩进**
- **80 字符行宽**
- **trailingComma: es5**

所有新代码必须遵循此风格。

## 油猴环境

脚本运行在油猴引擎的沙箱上下文中。关键模式：

- `unsafeWindow` — 逃离沙箱以访问宿主页面的 `window`。使用 `shared` 中的 `execInUnsafeWindow` 进行跨域函数调用。
- `GM_xmlhttpRequest` — 跨域请求（需在 meta.template 中声明 `@grant` 和 `@connect`）。
- `GM_getValue` / `GM_setValue` — 持久化键值存储。
- jQuery 通常通过 `@require` 加载（不打包）。
- `@noframes` 防止脚本注入到 iframe 中。

## Shared 工具库

`packages/shared` 中提供的模块（通过 `import ... from 'shared'` 导入）：

- `cookie` — cookie 解析/操作
- `dom` — DOM 辅助函数
- `copy` — 剪贴板操作
- `execInUnsafeWindow` — 在宿主页面域中调用函数
- `gm` — GM API 封装
- `is` — 类型检查
- `keybind` — 快捷键绑定
- `sleep` — 延迟辅助
- `storage` — GM 存储封装
- `wait` / `sleep` — 异步等待
- `router` — URL 路由辅助

## 发布与部署

1. `pnpm log` — 创建 changeset 描述变更（为每个受影响的包选择 patch/minor/major）。
2. `pnpm release` — 更新版本号、生成 changelog、提交（`chore: release`）、打 tag、推送。
3. GitHub Actions（`deploy.yml`）检测到 `chore: release` 提交后，执行 `pnpm build`，将 `dist/` 部署到 `dist` 分支（GitHub Pages）。
4. 用户通过 `@downloadURL` / `@updateURL` 指向 `https://github.com/IronKinoko/userscripts/raw/dist/<name>.user.js` 进行更新。

## 约定

- 包名使用 **kebab-case**（如 `copymanga`、`e-hentai-infinite-scroll`、`bili-live`）。
- `shared` 作为裸标识符导入：`import { cookie } from 'shared'`。
- **不要**将 `shared` 添加为发布依赖 — 它只是 `workspace:*`。
- `meta.template` 必须与脚本的 `@match` 模式和权限保持同步。
- 根目录 `dist/` 是 GitHub Pages 的部署目标；不要在其中放置其他文件。

## 新建包检查清单

1. `pnpm bootstrap` → 输入新包名称。
2. 编辑 `packages/<name>/meta.template` — 填写 `@name`、`@match`、`@description`、权限。
3. 编辑 `packages/<name>/package.json` — 设置 `description`（用于 meta 占位符替换）。
4. 编写 `packages/<name>/src/index.ts`。
5. 在包目录中运行 `pnpm dev` 测试，或在 Tampermonkey 中加载 `dist/index.dev.js`。

## CI

- **Pre-commit**：`pretty-quick --staged`（自动格式化已暂存的文件）。
- **Deploy**：仅在 `chore: release` 提交信息或手动触发时运行。
