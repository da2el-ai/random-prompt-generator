# Random Prompt Generator

🎨 **画像生成AI用プロンプトをランダム生成するWebアプリケーション**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?logo=github)](https://da2el-ai.github.io/random-prompt-generator/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🌐 ライブデモ

**👉 [https://da2el-ai.github.io/random-prompt-generator/](https://da2el-ai.github.io/random-prompt-generator/)**


## ✨ 特徴

- **3つのタググループ**: それぞれ異なる設定でタグを管理
- **柔軟な個数設定**: 各グループで最小・最大個数を指定可能
- **重み付けシステム**: タグに重みを付与（例: `(tag:1.2)`）
- **変換オプション**:
  - `()` → `\(\)` エスケープ処理
  - 空白 → `_` 変換
  - `artist:` プレフィックス付与
  - 空行挿入のON/OFF切り替え
- **永続化**: LocalStorageで設定を自動保存

## 🚀 使い方

### 1. タググループの設定
各タググループ（1〜3）で以下を設定：
- **タグ候補**: 改行区切りでタグを入力
- **最小・最大個数**: 選択するタグの数の範囲
- **最小・最大重み**: タグに付与する重みの範囲

### 2. 生成オプションの選択
- **出力数**: 生成するプロンプトの数（1〜20）
- **エスケープ処理**: `()` を `\(\)` に変換
- **空白変換**: 空白を `_` に変換
- **artist:プレフィックス**: タグの先頭に `artist:` を付与
- **空行挿入**: 生成結果間の空行の有無

### 3. プロンプト生成
「プロンプト生成」ボタンをクリックして、ランダムプロンプトを生成。

### 4. 結果の活用
- **コピー**: 生成結果をクリップボードにコピー
- **消去**: 生成結果をクリア

## 🎯 使用例

### 基本的な使い方
```
タググループ1: 1girl, cute, beautiful
タググループ2: portrait, full body, close-up
タググループ3: studio lighting, soft light, dramatic lighting

生成結果: (1girl:1.2), (beautiful:0.8), portrait, (studio lighting:1.1)
```

### オプション適用例
```
元タグ: "1girl, long hair"
↓ 変換オプション適用
結果: "artist:(1girl:1.2), artist:(long_hair:0.9)"
```

## 📄 ライセンス

MIT License


---

**🌐 [ライブデモを試す](https://da2el-ai.github.io/random-prompt-generator/)**