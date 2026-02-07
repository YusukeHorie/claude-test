# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # ESLint on .js/.jsx files
```

## Architecture

React 19 + Vite todo app with drag-and-drop reordering, category filtering, and dark-themed UI. All in Japanese.

**Single-page app with two components in `src/App.jsx`:**
- `App` — main component managing all state via `useState` (todos, input, selected category, filter)
- `SortableItem` — individual todo row, wrapped with `@dnd-kit/sortable` for drag-and-drop

**State shape:** todos are `{ id, text, done, category }` objects. Categories are a static `CATEGORIES` array with id/label/color.

**Styling:** CSS-only animations and transitions in `src/App.css` (no CSS-in-JS). Dark gradient theme defined in `src/index.css`. Strikethrough uses `scaleX` transform animation, not `text-decoration`.

**Key dependencies:** `@dnd-kit/core` + `@dnd-kit/sortable` for drag-and-drop with `PointerSensor` (5px activation distance to avoid accidental drags).

## Coding Rules

- コード内のコメントは日本語で書くこと
- コンポーネントは関数コンポーネントのみ使用（クラスコンポーネント禁止）
- CSSはTailwindを使用すること
- 変数名はキャメルケース（camelCase）で統一
- エラーハンドリングは必ずtry-catchで囲む

## Linting

ESLint v9 flat config with `react-hooks` and `react-refresh` plugins. No Prettier configured.
