# 安全说明

## 运行边界

本项目使用当前用户权限运行，通过 Antigravity 自带的 Node 运行环境连接本机调试端口。当前代码只接受 `127.0.0.1` 或 `localhost`，不包含外部网络上报逻辑。

由于本机调试接口具有较高权限，用户应只使用来自本仓库或自行审查、自行构建的代码。不要运行来历不明的二次打包版本。

## 不要公开提交的内容

- 账号、密码、API Key、Cookie、Token、私钥或环境变量文件
- `~/Library/Application Support/Antigravity` 下的个人数据和日志
- 聊天记录、项目文件、终端输出和屏幕截图中的敏感信息
- 官方 Antigravity.app、官方 `main.js`、解包后的官方资源

## 报告安全问题

请使用 GitHub 的 Private Vulnerability Reporting（如果仓库已启用），或先创建不包含敏感细节的 Issue 请求私下联系。不要在公开 Issue 中粘贴令牌、完整日志或可直接利用的攻击细节。
