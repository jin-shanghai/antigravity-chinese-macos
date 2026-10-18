#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const action = process.argv[2] || 'status';
const sourceDir = __dirname;
const home = os.homedir();
const uid = process.getuid();
const label = 'com.local.antigravity.zh-hans';
const service = `gui/${uid}/${label}`;
const installDir = path.join(home, 'Library/Application Support/Antigravity Simplified Chinese');
const launchAgentsDir = path.join(home, 'Library/LaunchAgents');
const plistPath = path.join(launchAgentsDir, `${label}.plist`);
const agyNode = path.join(home, 'Library/Application Support/Antigravity/bin/agy-node');
const installedTranslator = path.join(installDir, 'translator.js');

function xmlEscape(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function run(command, args, options = {}) {
  return spawnSync(command, args, { encoding: 'utf8', ...options });
}

function assertRuntime() {
  if (!fs.existsSync(agyNode)) {
    throw new Error('未找到 Antigravity 自带运行环境。请先正常打开一次 Antigravity，再重新安装。');
  }
}

function plistContent() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${label}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${xmlEscape(agyNode)}</string>
    <string>${xmlEscape(installedTranslator)}</string>
    <string>--daemon</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>ThrottleInterval</key>
  <integer>5</integer>
  <key>ProcessType</key>
  <string>Background</string>
  <key>StandardOutPath</key>
  <string>${xmlEscape(path.join(installDir, 'translator.log'))}</string>
  <key>StandardErrorPath</key>
  <string>${xmlEscape(path.join(installDir, 'translator-error.log'))}</string>
</dict>
</plist>
`;
}

function stopService() {
  run('/bin/launchctl', ['bootout', service]);
  run('/bin/launchctl', ['bootout', `gui/${uid}`, plistPath]);
}

function restoreCurrentPage() {
  if (!fs.existsSync(installedTranslator) || !fs.existsSync(agyNode)) return;
  run(agyNode, [installedTranslator, '--restore'], { timeout: 5000 });
}

function install() {
  assertRuntime();
  fs.mkdirSync(installDir, { recursive: true, mode: 0o700 });
  fs.mkdirSync(launchAgentsDir, { recursive: true });
  for (const name of ['translator.js', 'translations.json']) {
    const source = path.join(sourceDir, name);
    const destination = path.join(installDir, name);
    if (path.resolve(source) !== path.resolve(destination)) fs.copyFileSync(source, destination);
  }
  fs.chmodSync(installedTranslator, 0o700);
  fs.writeFileSync(plistPath, plistContent(), { mode: 0o600 });
  stopService();
  const bootstrap = run('/bin/launchctl', ['bootstrap', `gui/${uid}`, plistPath]);
  if (bootstrap.status !== 0) throw new Error(`启动中文助手失败：${bootstrap.stderr.trim() || bootstrap.stdout.trim()}`);
  run('/bin/launchctl', ['kickstart', '-k', service]);
  run(agyNode, [installedTranslator, '--once'], { timeout: 5000 });
  console.log('安装完成：Antigravity 简体中文助手已启用。');
  console.log('当前窗口会自动变为中文；如果尚未变化，请关闭并重新打开 Antigravity。');
}

function pause() {
  stopService();
  restoreCurrentPage();
  console.log('已暂停中文助手，当前界面已恢复；重新打开 Antigravity 后会保持英文。');
}

function resume() {
  assertRuntime();
  if (!fs.existsSync(plistPath) || !fs.existsSync(installedTranslator)) {
    throw new Error('尚未安装中文助手，请先运行“安装.command”。');
  }
  stopService();
  const bootstrap = run('/bin/launchctl', ['bootstrap', `gui/${uid}`, plistPath]);
  if (bootstrap.status !== 0) throw new Error(`启用中文助手失败：${bootstrap.stderr.trim() || bootstrap.stdout.trim()}`);
  run('/bin/launchctl', ['kickstart', '-k', service]);
  run(agyNode, [installedTranslator, '--once'], { timeout: 5000 });
  console.log('中文助手已重新启用。');
}

function uninstall() {
  stopService();
  restoreCurrentPage();
  if (fs.existsSync(plistPath)) fs.unlinkSync(plistPath);
  for (const name of ['translator.js', 'translations.json', 'translator.log', 'translator-error.log']) {
    const target = path.join(installDir, name);
    if (fs.existsSync(target)) fs.unlinkSync(target);
  }
  try { fs.rmdirSync(installDir); } catch {}
  console.log('卸载完成：中文助手已移除，Antigravity 官方程序和个人数据均未改动。');
}

function status() {
  const loaded = run('/bin/launchctl', ['print', service]);
  const installed = fs.existsSync(plistPath) && fs.existsSync(installedTranslator);
  console.log(`安装状态：${installed ? '已安装' : '未安装'}`);
  console.log(`运行状态：${loaded.status === 0 ? '已启用' : '未启用'}`);
  if (installed && fs.existsSync(agyNode)) {
    const page = run(agyNode, [installedTranslator, '--status'], { timeout: 5000 });
    if (page.status === 0) console.log(`界面状态：已连接并汉化\n${page.stdout.trim()}`);
    else console.log('界面状态：Antigravity 当前未运行或尚未加载完成');
  }
}

try {
  if (action === 'install') install();
  else if (action === 'pause') pause();
  else if (action === 'resume') resume();
  else if (action === 'uninstall') uninstall();
  else if (action === 'status') status();
  else throw new Error(`未知操作：${action}`);
} catch (error) {
  console.error(`操作失败：${error.message}`);
  process.exitCode = 1;
}
