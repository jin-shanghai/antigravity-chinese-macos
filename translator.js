#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const mode = process.argv.includes('--restore')
  ? 'restore'
  : process.argv.includes('--status')
    ? 'status'
    : process.argv.includes('--once')
      ? 'once'
      : 'daemon';
const baseDir = __dirname;
const translationsPath = path.join(baseDir, 'translations.json');
const portFile = path.join(os.homedir(), 'Library/Application Support/Antigravity/DevToolsActivePort');
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
const injectionVersion = 5;
const connections = new Map();
let stopping = false;

function log(message) {
  process.stdout.write(`[${new Date().toISOString()}] ${message}\n`);
}

function buildInjection(dictionary) {
  return `(${function installAntigravityChinese(dict, version) {
    const globalKey = '__ANTIGRAVITY_ZH_HANS__';
    if (window[globalKey]?.stats?.().version === version) {
      window[globalKey].update(dict);
      return window[globalKey].stats();
    }
    if (window[globalKey]) {
      try { window[globalKey].restore(); } catch {}
      delete window[globalKey];
      delete window.__agZh;
    }

    const originalText = new Map();
    const originalAttributes = new Map();
    const translatedText = new Map();
    const translatedAttributes = new Map();
    const originalDocumentLang = document.documentElement.getAttribute('lang');
    let dictionary = dict;
    let active = true;
    let changing = false;
    let translatedCount = 0;

    const protectedSelector = [
      'script', 'style', 'noscript', 'pre', 'code', 'kbd', 'samp',
      'textarea', 'input', '[contenteditable="true"]'
    ].join(',');
    const proseSelector = [
      '.prose', '[class*="markdown"]', '[data-testid*="message-content"]',
      '[data-testid*="chat-message"]'
    ].join(',');
    const interactiveSelector = 'button, a, label, [role="button"], [role="menuitem"], [role="option"], [role="tab"]';
    const attributeNames = ['aria-label', 'placeholder', 'title', 'data-tooltip-content'];
    const observedAttributeNames = [...attributeNames, 'lang'];

    function preserveSpace(source, replacement) {
      const match = source.match(/^(\s*)([\s\S]*?)(\s*)$/);
      return match ? `${match[1]}${replacement}${match[3]}` : replacement;
    }

    function translateDynamic(text) {
      let match;
      if ((match = text.match(/^Allow upgrading (.+)\?$/))) return `是否允许升级 ${match[1]}？`;
      if ((match = text.match(/^Allow installing (.+)\?$/))) return `是否允许安装 ${match[1]}？`;
      if ((match = text.match(/^Allow uninstalling (.+)\?$/))) return `是否允许卸载 ${match[1]}？`;
      if ((match = text.match(/^Allow downloading (.+)\?$/))) return `是否允许下载 ${match[1]}？`;
      if ((match = text.match(/^Allow running (.+)\?$/))) return `是否允许运行 ${match[1]}？`;
      if ((match = text.match(/^Allow executing (.+)\?$/))) return `是否允许执行 ${match[1]}？`;
      if ((match = text.match(/^Allow deleting (.+)\?$/))) return `是否允许删除 ${match[1]}？`;
      if ((match = text.match(/^Allow modifying (.+)\?$/))) return `是否允许修改 ${match[1]}？`;
      if ((match = text.match(/^Allow accessing (.+)\?$/))) return `是否允许访问 ${match[1]}？`;
      if ((match = text.match(/^Allow creating (.+)\?$/))) return `是否允许创建 ${match[1]}？`;
      if ((match = text.match(/^Allow opening (.+)\?$/))) return `是否允许打开 ${match[1]}？`;
      if ((match = text.match(/^Allow connecting to (.+)\?$/))) return `是否允许连接到 ${match[1]}？`;
      if ((match = text.match(/^Yes, and always allow '([\s\S]+)' in this conversation$/))) {
        return `是，并在当前对话中始终允许“${match[1]}”`;
      }
      if ((match = text.match(/^Yes, and always allow '([\s\S]+)' in this project$/))) {
        return `是，并在当前项目中始终允许“${match[1]}”`;
      }
      if ((match = text.match(/^Yes, and always allow '([\s\S]+)' when not in a project$/))) {
        return `是，并在不属于项目的对话中始终允许“${match[1]}”`;
      }
      if ((match = text.match(/^Yes, and always allow '([\s\S]+)' in this workspace$/))) {
        return `是，并在当前工作区中始终允许“${match[1]}”`;
      }
      if ((match = text.match(/^Yes, and always allow '([\s\S]+)'$/))) {
        return `是，并始终允许“${match[1]}”`;
      }
      if ((match = text.match(/^Yes, save rule for '([\s\S]+)' in this conversation$/))) {
        return `是，将“${match[1]}”保存为当前对话的规则`;
      }
      if ((match = text.match(/^Yes, save rule for '([\s\S]+)' in this project$/))) {
        return `是，将“${match[1]}”保存为当前项目的规则`;
      }
      if ((match = text.match(/^Yes, save rule for '([\s\S]+)' when not in a project$/))) {
        return `是，将“${match[1]}”保存为项目外对话的规则`;
      }
      if ((match = text.match(/^Yes, save rule for '([\s\S]+)' in this workspace$/))) {
        return `是，将“${match[1]}”保存为当前工作区的规则`;
      }
      if ((match = text.match(/^Yes, save rule for '([\s\S]+)' globally$/))) {
        return `是，将“${match[1]}”保存为全局规则`;
      }
      if ((match = text.match(/^Select project, current: (.+)$/))) return `选择项目，当前：${match[1]}`;
      if ((match = text.match(/^Select model, current: (.+)$/))) return `选择模型，当前：${match[1]}`;
      if ((match = text.match(/^Agent permissions preset selector, current: (.+)$/))) return `智能体权限预设，当前：${dictionary[match[1]] || match[1]}`;
      if ((match = text.match(/^Send feedback as (.+)$/))) return `以 ${match[1]} 的身份发送反馈`;
      if ((match = text.match(/^Your Plan: (.+)$/))) return `当前套餐：${match[1]}`;
      if ((match = text.match(/^Show (\d+) breakdowns?$/))) return `显示 ${match[1]} 项明细`;
      if ((match = text.match(/^(\d+)h$/))) return `${match[1]} 小时`;
      if ((match = text.match(/^(\d+)m$/))) return `${match[1]} 分钟`;
      if ((match = text.match(/^(\d+)d$/))) return `${match[1]} 天`;
      if ((match = text.match(/^(\d[\d,]*) tokens$/))) return `${match[1]} 个令牌`;
      if ((match = text.match(/^(.+): (\d[\d,]*) tokens$/))) return `${match[1]}：${match[2]} 个令牌`;
      if ((match = text.match(/^(\d[\d,]*) \/ (\d[\d,]*) tokens \(([\d.]+)%\)$/))) {
        return `${match[1]} / ${match[2]} 个令牌（${match[3]}%）`;
      }
      if ((match = text.match(/^Executing (.+)$/))) return `正在执行${match[1]}`;
      if ((match = text.match(/^Executed (.+)$/))) return `已执行${match[1]}`;
      if ((match = text.match(/^Failed to execute (.+)$/))) return `执行失败：${match[1]}`;
      if ((match = text.match(/^Reading (.+)$/))) return `正在读取${match[1]}`;
      if ((match = text.match(/^Read (.+)$/))) return `已读取${match[1]}`;
      if ((match = text.match(/^Writing (.+)$/))) return `正在写入${match[1]}`;
      if ((match = text.match(/^Wrote (.+)$/))) return `已写入${match[1]}`;
      if ((match = text.match(/^Searching (.+)$/))) return `正在搜索${match[1]}`;
      if ((match = text.match(/^Searched (.+)$/))) return `已搜索${match[1]}`;
      if ((match = text.match(/^Thought for (\d+)(s|m|h)$/))) return `思考了 ${match[1]}${{s:' 秒',m:' 分钟',h:' 小时'}[match[2]]}`;
      if ((match = text.match(/^Worked for (\d+)(s|m|h)$/))) return `处理了 ${match[1]}${{s:' 秒',m:' 分钟',h:' 小时'}[match[2]]}`;
      if ((match = text.match(/^Started\s+(\d+) subagents?$/))) return `已启动 ${match[1]} 个子智能体`;
      if ((match = text.match(/^Timed\s+(\d+) seconds?$/))) return `限时 ${match[1]} 秒`;
      if ((match = text.match(/^(\d+) subagents?$/))) return `${match[1]} 个子智能体`;
      if ((match = text.match(/^(\d+) seconds?$/))) return `${match[1]} 秒`;
      if ((match = text.match(/^Message from (.+)$/))) return `来自 ${match[1]} 的消息`;
      if ((match = text.match(/^Subagents\s+(\d+)$/))) return `子智能体\n${match[1]}`;
      if ((match = text.match(/^Background Tasks\s+(\d+)$/))) return `后台任务\n${match[1]}`;
      if ((match = text.match(/^Individual quota reached\. Please upgrade your subscription to increase your limits\. Resets in (.+)\.$/))) {
        return `已达到个人额度上限。请升级订阅以提高限额。${match[1]} 后重置。`;
      }
      return text;
    }

    function translateValue(value) {
      if (!value || !/[A-Za-z]/.test(value)) return value;
      const compact = value.trim().replace(/\s+/g, ' ');
      const translated = dictionary[compact] || translateDynamic(compact);
      return translated === compact ? value : preserveSpace(value, translated);
    }

    function isProtectedTextNode(node) {
      const element = node.parentElement;
      if (!element || element.closest(protectedSelector)) return true;
      if (element.closest(interactiveSelector)) return false;
      return Boolean(element.closest(proseSelector));
    }

    function translateTextNode(node) {
      if (!active || isProtectedTextNode(node)) return;
      const current = node.nodeValue;
      const last = translatedText.get(node);
      if (last !== undefined && current === last) return;
      const next = translateValue(current);
      if (next === current) return;
      originalText.set(node, current);
      translatedText.set(node, next);
      changing = true;
      node.nodeValue = next;
      changing = false;
      translatedCount += 1;
    }

    function translateElementAttributes(element) {
      if (!active || !(element instanceof Element)) return;
      if (element === document.documentElement && element.getAttribute('lang') !== 'zh-CN') {
        changing = true;
        element.setAttribute('lang', 'zh-CN');
        changing = false;
      }
      let originals = originalAttributes.get(element);
      let translated = translatedAttributes.get(element);
      for (const name of attributeNames) {
        if (!element.hasAttribute(name)) continue;
        const current = element.getAttribute(name);
        if (translated?.get(name) === current) continue;
        const next = translateValue(current);
        if (next === current) continue;
        if (!originals) originalAttributes.set(element, originals = new Map());
        if (!translated) translatedAttributes.set(element, translated = new Map());
        originals.set(name, current);
        translated.set(name, next);
        changing = true;
        element.setAttribute(name, next);
        changing = false;
        translatedCount += 1;
      }
    }

    function translateTree(root) {
      if (!active || !root) return;
      if (root.nodeType === Node.TEXT_NODE) {
        translateTextNode(root);
        return;
      }
      if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
      if (root.nodeType === Node.ELEMENT_NODE) translateElementAttributes(root);
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
        else translateElementAttributes(node);
      }
    }

    const observer = new MutationObserver((mutations) => {
      if (!active || changing) return;
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') translateTextNode(mutation.target);
        else if (mutation.type === 'attributes') translateElementAttributes(mutation.target);
        else for (const node of mutation.addedNodes) translateTree(node);
      }
    });

    function observe() {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: observedAttributeNames
      });
    }

    function start() {
      document.documentElement.setAttribute('lang', 'zh-CN');
      translateTree(document.documentElement);
      observe();
    }

    const api = {
      update(nextDictionary) {
        dictionary = nextDictionary;
        active = true;
        changing = true;
        for (const [node, value] of originalText) {
          if (node.isConnected && node.nodeValue === translatedText.get(node)) node.nodeValue = value;
        }
        for (const [element, values] of originalAttributes) {
          if (!element.isConnected) continue;
          for (const [name, value] of values) {
            if (element.getAttribute(name) === translatedAttributes.get(element)?.get(name)) element.setAttribute(name, value);
          }
        }
        originalText.clear();
        translatedText.clear();
        originalAttributes.clear();
        translatedAttributes.clear();
        translatedCount = 0;
        changing = false;
        document.documentElement.setAttribute('lang', 'zh-CN');
        translateTree(document.documentElement);
        observe();
      },
      restore() {
        active = false;
        observer.disconnect();
        changing = true;
        for (const [node, value] of originalText) {
          if (node.isConnected && node.nodeValue === translatedText.get(node)) node.nodeValue = value;
        }
        for (const [element, values] of originalAttributes) {
          if (!element.isConnected) continue;
          for (const [name, value] of values) {
            if (element.getAttribute(name) === translatedAttributes.get(element)?.get(name)) {
              element.setAttribute(name, value);
            }
          }
        }
        if (originalDocumentLang === null) document.documentElement.removeAttribute('lang');
        else document.documentElement.setAttribute('lang', originalDocumentLang);
        changing = false;
        return true;
      },
      stats() {
        return {
          active,
          version,
          dictionaryEntries: Object.keys(dictionary).length,
          translatedOperations: translatedCount,
          language: document.documentElement.lang,
          title: document.title
        };
      }
    };
    window[globalKey] = api;
    window.__agZh = api;
    start();
    return api.stats();
  }.toString()})(${JSON.stringify(dictionary)}, ${injectionVersion})`;
}

class CdpConnection {
  constructor(target, source) {
    this.target = target;
    this.source = source;
    this.ws = null;
    this.nextId = 1;
    this.pending = new Map();
    this.installed = false;
  }

  async connect() {
    const wsUrl = new URL(this.target.webSocketDebuggerUrl);
    if (!['127.0.0.1', 'localhost'].includes(wsUrl.hostname)) throw new Error('拒绝非本机调试地址');
    this.ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const pending = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
    this.ws.addEventListener('close', () => {
      for (const pending of this.pending.values()) pending.reject(new Error('连接已关闭'));
      this.pending.clear();
      connections.delete(this.target.id);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  async install() {
    if (!this.installed) {
      await this.send('Page.enable');
      await this.send('Runtime.enable');
      await this.send('Page.addScriptToEvaluateOnNewDocument', { source: this.source });
      this.installed = true;
    }
    const current = await this.evaluate('window.__agZh?.stats() ?? null');
    if (current?.active && current.version === injectionVersion) return current;
    const result = await this.send('Runtime.evaluate', {
      expression: this.source,
      awaitPromise: true,
      returnByValue: true
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || '页面注入失败');
    return result.result?.value;
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    return result.result?.value;
  }

  close() {
    try { this.ws?.close(); } catch {}
  }
}

async function readTargets() {
  const content = await fs.promises.readFile(portFile, 'utf8');
  const [portText] = content.trim().split(/\s+/);
  const port = Number(portText);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) throw new Error('调试端口无效');
  const response = await fetch(`http://127.0.0.1:${port}/json/list`, { signal: AbortSignal.timeout(1500) });
  const targets = await response.json();
  return targets.filter((target) => target.type === 'page' && /^https:\/\/(127\.0\.0\.1|localhost):\d+\//.test(target.url));
}

async function connectTarget(target) {
  if (connections.has(target.id)) return connections.get(target.id);
  const connection = new CdpConnection(target, buildInjection(translations));
  await connection.connect();
  connections.set(target.id, connection);
  return connection;
}

async function runOnePass() {
  const targets = await readTargets();
  const alive = new Set(targets.map((target) => target.id));
  for (const [id, connection] of connections) {
    if (!alive.has(id)) {
      connection.close();
      connections.delete(id);
    }
  }
  const results = [];
  for (const target of targets) {
    try {
      const connection = await connectTarget(target);
      if (mode === 'restore') results.push(await connection.evaluate('window.__agZh?.restore() ?? false'));
      else if (mode === 'status') results.push(await connection.evaluate('window.__agZh?.stats() ?? {active:false}'));
      else results.push(await connection.install());
    } catch (error) {
      connections.get(target.id)?.close();
      connections.delete(target.id);
      log(`页面处理失败：${error.message}`);
    }
  }
  return results;
}

async function main() {
  if (mode !== 'daemon') {
    try {
      const results = await runOnePass();
      process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
      for (const connection of connections.values()) connection.close();
      process.exit(results.length ? 0 : 1);
    } catch (error) {
      process.stderr.write(`Antigravity 当前未运行或尚未加载：${error.message}\n`);
      process.exit(1);
    }
  }

  log(`简体中文助手已启动，词条 ${Object.keys(translations).length} 条`);
  while (!stopping) {
    try {
      const before = connections.size;
      await runOnePass();
      if (connections.size > before) log(`已连接 ${connections.size} 个 Antigravity 窗口`);
    } catch (error) {
      if (connections.size) log(`等待 Antigravity 恢复：${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
}

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    stopping = true;
    for (const connection of connections.values()) connection.close();
  });
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
