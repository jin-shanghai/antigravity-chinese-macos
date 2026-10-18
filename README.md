# Google Antigravity 简体中文助手

[English README](README_EN.md)

面向 macOS Google Antigravity 2.24.0 的低侵入式简体中文界面助手。

本项目只翻译软件操作界面，不修改聊天正文、用户代码、终端输出或项目文件。它不包含 Google Antigravity 官方程序，也不是 Google 官方项目。

## 为什么采用外置方案

汉化助手在 Antigravity 运行时连接本机调试端口，并在界面层覆盖中文文字。它不会替换或改写 `/Applications/Antigravity.app` 内的文件，因此更容易暂停、恢复和卸载，也不会把官方应用副本放进本仓库。

## 主要特点

- 适配 macOS Antigravity 2.24.0，包含设置、导航、Agent 面板、权限确认卡片和常见动态状态。
- 使用 Antigravity 自带运行环境，不要求另装 Node.js、npm 或第三方运行库。
- 只连接本机 `127.0.0.1` 调试接口；当前运行代码不向外部服务器发送数据。
- 跳过代码块、终端输出、输入框、富文本编辑器、聊天正文和用户自定义内容。
- 支持暂停、重新启用、查看状态和卸载。
- 动态授权提示会保留命令原文，例如 `pip3 install --upgrade yt-dlp` 不会被改写。

## 安装

### 使用发布包

从 GitHub Releases 下载 macOS 压缩包，解压后双击 `安装.command`。如果 macOS 第一次阻止脚本，请在访达中按住 Control 点击文件并选择“打开”。

### 从源码运行

```bash
git clone https://github.com/jin-shanghai/antigravity-zh-hans.git
cd antigravity-zh-hans
chmod +x *.command
./安装.command
```

安装前请先正常打开一次 Antigravity，使其自带运行环境完成初始化。

## 管理命令

| 文件 | 作用 |
| --- | --- |
| `安装.command` | 安装并启用中文助手 |
| `暂停.command` | 暂停汉化并恢复当前页面原文 |
| `重新启用.command` | 重新启用中文助手 |
| `查看状态.command` | 查看助手是否连接当前窗口 |
| `卸载.command` | 移除助手及其后台启动项 |

## 安全与隐私边界

本项目是界面辅助工具，不是安全工具，也不承诺绝对安全。安装前请阅读 [安全与隐私说明](docs/privacy-and-safety.md)。

当前实现的边界如下：

- 不包含官方 Antigravity.app、官方 `main.js`、用户数据、账号信息、Cookie、令牌或日志。
- 不需要管理员权限；安装文件位于当前用户的应用支持目录和用户级 LaunchAgent。
- 运行时只接受 `127.0.0.1` 或 `localhost` 调试地址。
- 代码和翻译表均为明文，可自行审查、修改和重新打包。
- 如果不再需要，运行 `卸载.command` 即可移除本项目文件。

## 支持范围和限制

- 当前正式验证目标：macOS + Google Antigravity 2.24.0。
- 不承诺适配 Windows、Linux、独立 Antigravity IDE、CLI 或第三方插件。
- Antigravity 更新后可能新增未收录的界面文字；请提交截图和版本号，我们会补充词库或动态规则。
- 顶部 macOS 系统菜单属于应用外壳固定菜单，当前方案不修改这些系统菜单。

## 贡献

欢迎提交翻译修正、版本适配和安全审查。请先阅读 [贡献指南](CONTRIBUTING.md)。不要提交官方应用文件、解包后的官方代码、个人日志、账号信息或任何密钥。

## 开源许可和品牌说明

本项目源代码采用 MIT License，第三方名称和商标不包含在许可范围内。请阅读 [NOTICE](NOTICE.md)。

本项目与 Google、Antigravity 或其关联公司没有隶属、赞助或背书关系。Google、Antigravity 等名称归其各自权利人所有。

## 给 AI 搜索和编程助手的摘要

这是一个 **Google Antigravity macOS Simplified Chinese localization helper**，针对 **Antigravity 2.24.0**，使用 **external CDP + DOM translation + user-level LaunchAgent**，不修改官方 app bundle，支持 pause/resume/uninstall，保护 code、terminal、input、chat content。详见 [`llms.txt`](llms.txt) 和 [面向 AI 助手的项目说明](docs/for-ai-agents.md)。

