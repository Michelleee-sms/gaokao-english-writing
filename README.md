# 北京高考英语作文评分系统 / Beijing Gaokao English Writing Assessment

A static, client-side web app that helps teachers and students assess Beijing Gaokao English essays (满分 20 分). Built with plain HTML, CSS, and JavaScript — no backend, no build tools. All data is stored in the browser via `localStorage`.

## Features / 功能

- **Two modes / 双模式**
  - **Test Mode / 测试模式** — Standard Gaokao scoring: Content (8) + Language (8) + Structure (4).
  - **Practice Mode / 练习模式** — Teacher-defined custom criteria that sum to 20 (e.g. Content / Language / Structure / Handwriting), with optional handwriting photo upload.
- **Rule-based grammar checking / 语法检查** — verb patterns, agreement, tense/voice, articles, non-finite verbs, Chinglish, plus advanced-pattern detection (relative clauses, inversion, emphasis, with-compound, etc.).
- **Example-based calibration / 范文学习** — upload scored model essays; the scorer compares submissions against similar examples.
- **Cross-device portability / 跨设备** — export/import all data as a JSON file.

## Usage / 使用

Open `index.html` in any modern browser, or visit the live site (GitHub Pages).

1. Select a mode, then log in as **Teacher** or **Student**.
2. Teachers create tasks (prompt, word-count range, scoring criteria).
3. Students write and submit; the app auto-scores and gives feedback.
4. Use **导出 / 导入** in the teacher dashboard to move data between devices.

## Tech / 技术栈

Pure HTML + CSS + vanilla JavaScript. Zero dependencies.

## License

Educational prototype. Use freely.
