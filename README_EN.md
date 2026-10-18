# Google Antigravity Simplified Chinese Helper

An unofficial, low-intrusion Simplified Chinese UI helper for Google Antigravity desktop on macOS, currently validated with Antigravity 2.24.0.

This project translates UI labels, settings, navigation, Agent panels, permission confirmation cards, and common dynamic statuses. It does not translate or modify chat prose, user code, terminal output, input fields, project files, model requests, or account data.

## Design

The helper runs outside the official application. It uses Antigravity's bundled Node runtime, connects only to the local DevTools endpoint, and applies a DOM translation layer while the page is running. It does not replace `Antigravity.app`, `app.asar`, `main.js`, or any official application resource.

## Safety boundary

- No official Antigravity application or proprietary resource is distributed here.
- The current runtime accepts only `127.0.0.1` and `localhost` DevTools targets.
- No external telemetry or remote data upload is implemented by the current source.
- Code, terminal output, editors, inputs, chat prose, and user-created content are protected from translation.
- The helper can be paused, resumed, inspected, or uninstalled.
- A local DevTools connection is a sensitive capability; review the source and avoid untrusted repackaged binaries.

## Install

Download the macOS archive from [Releases](https://github.com/jin-shanghai/antigravity-zh-hans/releases), extract it, and open `安装.command`. Alternatively, clone this repository and run the command files after opening Antigravity once.

## Project identity

- Name: Antigravity Simplified Chinese Helper
- Platform: macOS
- Target: Google Antigravity desktop 2.24.0
- Language: Simplified Chinese (`zh-CN`)
- Keywords: Antigravity localization, Chinese UI patch, macOS Electron localization, reversible UI translation, external CDP, DOM translation
- License: MIT for this repository's source code
- Relationship: community project, not affiliated with or endorsed by Google or Antigravity

Read [llms.txt](llms.txt), [SECURITY.md](SECURITY.md), and [the privacy and safety document](docs/privacy-and-safety.md) before redistributing or integrating this project.
