# Make Antigravity Speak Chinese

<p align="center">
  <img src="docs/hero.svg" alt="Antigravity Simplified Chinese Helper" width="900">
</p>

<p align="center">
  <strong>Unofficial Simplified Chinese UI helper for Google Antigravity on macOS</strong><br>
  No official app replacement · Reversible · Auditable · Code and user content protected
</p>

<p align="center">
  <a href="https://github.com/jin-shanghai/antigravity-chinese-macos/releases"><img src="https://img.shields.io/github/v/release/jin-shanghai/antigravity-chinese-macos?display_name=tag&sort=semver&label=release" alt="Release"></a>
  <a href="https://github.com/jin-shanghai/antigravity-chinese-macos/actions/workflows/validate.yml"><img src="https://github.com/jin-shanghai/antigravity-chinese-macos/actions/workflows/validate.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/jin-shanghai/antigravity-chinese-macos/blob/main/LICENSE"><img src="https://img.shields.io/github/license/jin-shanghai/antigravity-chinese-macos" alt="License"></a>
</p>

[中文版 README](README.md) · [Releases](https://github.com/jin-shanghai/antigravity-chinese-macos/releases) · [Security](SECURITY.md)

> A community project for Chinese-speaking Antigravity users. Not affiliated with or endorsed by Google or Antigravity.

## What it does

This project translates the Antigravity operation UI into Simplified Chinese: settings, navigation, Agent panels, permission confirmation cards, and common dynamic statuses. It deliberately leaves chat prose, user code, terminal output, inputs, project files, model requests, and account data untouched.

## Why this approach

The helper runs outside the official application. It uses Antigravity's bundled Node runtime, connects only to the local DevTools endpoint, and applies a DOM translation layer while the page is running. It does not replace `Antigravity.app`, `app.asar`, `main.js`, or official resources.

## Install

Download the latest macOS archive from [Releases](https://github.com/jin-shanghai/antigravity-chinese-macos/releases), extract it, and open `安装.command`. Or clone the repository:

```bash
git clone https://github.com/jin-shanghai/antigravity-chinese-macos.git
cd antigravity-chinese-macos
chmod +x *.command
./安装.command
```

## Safety boundary

- No official Antigravity application or proprietary resource is distributed here.
- The current source accepts only `127.0.0.1` and `localhost` DevTools targets.
- No external telemetry or remote data upload is implemented by the current source.
- Code, terminal output, editors, inputs, chat prose, and user-created content are protected from translation.
- The helper can be paused, resumed, inspected, or uninstalled.
- A local DevTools connection is a sensitive capability. Review the source and avoid untrusted repackaged binaries.

## Project identity

- Platform: macOS
- Target: Google Antigravity desktop 2.24.0
- Language: Simplified Chinese (`zh-CN`)
- Keywords: Antigravity localization, Chinese UI helper, macOS Electron localization, external CDP, DOM translation, reversible UI patch
- License: MIT for this repository's source code
- Relationship: unofficial community project

Read [`llms.txt`](llms.txt), [`SECURITY.md`](SECURITY.md), and [the privacy and safety document](docs/privacy-and-safety.md) before redistributing or integrating this project.
