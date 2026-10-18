# 贡献指南

欢迎帮助补充简体中文词条、适配新版本和检查安全边界。

## 可以贡献什么

- 提交漏译界面的截图、原文、中文建议和 Antigravity 版本号
- 补充动态文案规则，并说明是否应保留命令、文件名或模型名
- 增加针对 DOM、属性、权限卡片和恢复流程的测试
- 改进安装说明、卸载说明和隐私说明

## 不要提交什么

- 官方 Antigravity.app、解包后的官方代码或官方安装包
- 用户聊天内容、项目文件、日志、账号信息和任何密钥
- 需要远程下载并执行未知脚本的安装逻辑
- 会改写命令、代码、终端输出或用户输入内容的翻译规则

## 提交前检查

```bash
node --check translator.js
node --check manage.js
node -e 'JSON.parse(require("fs").readFileSync("translations.json", "utf8")); console.log("translations.json OK")'
```

请在 Pull Request 中写明测试的 macOS 和 Antigravity 版本，并说明是否修改了安装路径、权限或网络行为。
