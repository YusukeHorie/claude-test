# Todo App

> React 19 + Vite 7 + dnd-kit で構築された、多機能Todoアプリケーション（日本語UI）

## 機能一覧

### Todo管理
- Todoの追加・完了・削除
- ドラッグ&ドロップによるTodoの並び替え（`@dnd-kit` による直感的な操作）
- 完了済みTodoの打ち消し線アニメーション（`scaleX` トランスフォーム）

### カテゴリ管理
- カテゴリ別フィルタリング（全て / 個別カテゴリ）
- カスタムカテゴリのCRUD管理（作成・編集・削除）
- 最大15個までカテゴリを作成可能
- デフォルト5種のカテゴリは削除不可

### 優先度・期限
- 優先度設定（高 / 中 / 低）と色分け表示
- 期限日の設定
- 期限切れTodoのハイライト表示

### ソート機能
- 手動並び替え（ドラッグ&ドロップ）
- 期限順ソート
- 優先度順ソート

### 認証・ユーザー管理
- ログイン・新規登録機能（localStorage模擬認証）
- ユーザー別データの分離保存
- プロフィール表示・編集
- 認証ガードによるルート保護

### UI/UX
- ダークモード / ライトモード切り替え（OS設定を参照、localStorage で永続化）
- プログレスバーによる進捗の可視化
- ダークグラデーションテーマ
- CSS アニメーションとトランジション

## スクリーンショット

<!-- スクリーンショットをここに追加してください -->
<!-- 例: ![Todoアプリ メイン画面](./screenshots/main.png) -->
<!-- 例: ![ダークモード](./screenshots/dark-mode.png) -->
<!-- 例: ![カテゴリ管理](./screenshots/category-manager.png) -->

## 技術スタック

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | React | 19 |
| ビルドツール | Vite | 7 |
| ドラッグ&ドロップ | @dnd-kit/core + @dnd-kit/sortable | 6.x / 10.x |
| ルーティング | react-router-dom | 7 |
| スタイリング | Tailwind CSS | 4 |
| リンター | ESLint (flat config) | 9 |

## プロジェクト構成

```
claude-test/
├── public/                    # 静的ファイル
├── src/
│   ├── assets/                # 画像等のアセット
│   ├── components/
│   │   ├── CategoryManager.jsx   # カテゴリ管理モーダル
│   │   ├── FilterBar.jsx         # カテゴリフィルター
│   │   ├── LoginPage.jsx         # ログイン・新規登録ページ
│   │   ├── ProgressBar.jsx       # 進捗バー
│   │   ├── ProtectedRoute.jsx    # 認証ガード
│   │   ├── SortableItem.jsx      # 個別Todoアイテム（ドラッグ対応）
│   │   ├── SortControls.jsx      # ソート切替コントロール
│   │   ├── ThemeToggle.jsx       # テーマ切替ボタン
│   │   ├── TodoApp.jsx           # メインTodoアプリ
│   │   ├── TodoForm.jsx          # Todo追加フォーム
│   │   └── TodoList.jsx          # Todoリスト（DndContext）
│   ├── contexts/
│   │   ├── AuthContext.jsx       # 認証コンテキスト
│   │   ├── CategoryContext.jsx   # カテゴリコンテキスト
│   │   └── ThemeContext.jsx      # テーマコンテキスト
│   ├── App.jsx                # ルーティングシェル
│   ├── App.css                # アプリケーションスタイル
│   ├── index.css              # グローバルスタイル
│   ├── main.jsx               # エントリポイント
│   └── UserProfile.jsx        # プロフィール表示・編集
├── index.html                 # HTMLテンプレート
├── vite.config.js             # Vite設定
├── eslint.config.js           # ESLint設定（flat config）
├── package.json
└── CLAUDE.md                  # Claude Code用ガイドライン
```

## セットアップ手順

### 前提条件

- Node.js 18 以上
- npm 9 以上

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/<your-username>/claude-test.git

# プロジェクトディレクトリに移動
cd claude-test

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:5173 にアクセスしてアプリを確認できます。

## 利用可能なコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | Vite開発サーバーを起動（http://localhost:5173） |
| `npm run build` | 本番用ビルドを `dist/` に出力 |
| `npm run preview` | 本番ビルドのプレビューサーバーを起動 |
| `npm run lint` | ESLintによるコード検査を実行 |

## コンポーネント構成

アプリケーションのコンポーネントツリーは以下の通りです。

```
BrowserRouter
└── ThemeProvider
    └── AuthProvider
        └── App (ルーティングシェル)
```

| ファイル | コンポーネント | 説明 |
|---------|--------------|------|
| `src/main.jsx` | - | エントリポイント。`BrowserRouter` > `ThemeProvider` > `AuthProvider` > `App` のプロバイダ階層を構成 |
| `src/App.jsx` | `App` | ルーティングシェル。`react-router-dom` によるページ遷移を管理 |
| `src/UserProfile.jsx` | `UserProfile` | ユーザープロフィールの表示・編集画面 |
| `src/components/TodoApp.jsx` | `TodoApp` | メインのTodoアプリケーション。Todo状態の管理を統括 |
| `src/components/TodoForm.jsx` | `TodoForm` | 新しいTodoを追加するフォーム（テキスト、カテゴリ、優先度、期限を入力） |
| `src/components/TodoList.jsx` | `TodoList` | Todoリストの表示。`DndContext` によるドラッグ&ドロップ領域を提供 |
| `src/components/SortableItem.jsx` | `SortableItem` | 個別のTodoアイテム。`@dnd-kit/sortable` でドラッグ対応 |
| `src/components/FilterBar.jsx` | `FilterBar` | カテゴリ別のフィルタリングバー |
| `src/components/ProgressBar.jsx` | `ProgressBar` | Todo完了率のプログレスバー |
| `src/components/SortControls.jsx` | `SortControls` | ソート方式の切替コントロール（手動 / 期限順 / 優先度順） |
| `src/components/CategoryManager.jsx` | `CategoryManager` | カテゴリのCRUD管理モーダル |
| `src/components/LoginPage.jsx` | `LoginPage` | ログイン・新規登録ページ |
| `src/components/ProtectedRoute.jsx` | `ProtectedRoute` | 未認証ユーザーをログインページにリダイレクトする認証ガード |
| `src/components/ThemeToggle.jsx` | `ThemeToggle` | ダークモード / ライトモードの切替ボタン |

### コンテキスト

| ファイル | コンテキスト | 説明 |
|---------|------------|------|
| `src/contexts/AuthContext.jsx` | `AuthContext` | 認証状態（ログイン/ログアウト、ユーザー情報）を管理 |
| `src/contexts/CategoryContext.jsx` | `CategoryContext` | カテゴリ一覧とCRUD操作を管理 |
| `src/contexts/ThemeContext.jsx` | `ThemeContext` | テーマ（ダーク/ライト）の状態管理とOS設定の参照 |

## ライセンス

MIT License
