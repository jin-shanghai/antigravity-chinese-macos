#!/bin/zsh
set -e
这里="${0:A:h}"
运行器="$HOME/Library/Application Support/Antigravity/bin/agy-node"
"$运行器" "$这里/manage.js" status
echo
read -k 1 "?按任意键关闭此窗口…"
