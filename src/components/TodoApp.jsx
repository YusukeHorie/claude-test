import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { useAuth } from '../contexts/AuthContext'
import UserProfile from './UserProfile'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import FilterBar from './FilterBar'
import ProgressBar from './ProgressBar'
import SortControls from './SortControls'
import CategoryManager from './CategoryManager'
import ThemeToggle from './ThemeToggle'

/**
 * 優先度の重み定義（ソート用）
 * 値が小さいほど優先度が高い
 * @const {Object<string, number>}
 */
const PRIORITY_WEIGHT = {
  high: 0,
  medium: 1,
  low: 2,
  none: 3,
}

/**
 * localStorageからユーザーに紐づくTodo一覧を読み込む
 * @param {string} userId - ユーザーID
 * @returns {Array<{id: number, text: string, done: boolean, category: string, priority: string, dueDate: string|null}>} Todo配列
 */
function loadTodos(userId) {
  try {
    const saved = localStorage.getItem(`todoApp_${userId}_todos`)
    if (saved) return JSON.parse(saved)
  } catch (err) {
    console.error('Todoの読み込みに失敗:', err)
  }
  return []
}

/**
 * Todoメインアプリケーションコンポーネント
 * Todo一覧の表示、追加、完了切替、削除、ドラッグ&ドロップ並び替え、
 * カテゴリフィルタリング、ソート機能を統合するメインコンポーネント
 * @component
 * @returns {JSX.Element}
 */
function TodoApp() {
  const { user } = useAuth()
  const [todos, setTodos] = useState(() => user ? loadTodos(user.id) : [])
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortMode, setSortMode] = useState('manual')
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const isInitialMount = useRef(true)

  // Todoが変わったらlocalStorageに保存（初回マウント時はスキップ）
  useEffect(() => {
    if (!user) return
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    try {
      localStorage.setItem(`todoApp_${user.id}_todos`, JSON.stringify(todos))
    } catch (err) {
      console.error('Todoの保存に失敗:', err)
    }
  }, [todos, user])

  // Todo追加
  const addTodo = useCallback(({ text, category, priority, dueDate }) => {
    setTodos(prev => [...prev, {
      id: crypto.randomUUID(),
      text,
      done: false,
      category,
      priority,
      dueDate,
    }])
  }, [])

  // Todo完了切替
  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [])

  // Todo削除
  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  // ドラッグ&ドロップ処理（フィルタ中でも正しく並び替える）
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setTodos((items) => {
      const oldIndex = items.findIndex(t => t.id === active.id)
      const newIndex = items.findIndex(t => t.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return items
      return arrayMove(items, oldIndex, newIndex)
    })
  }, [])

  // カテゴリ削除時にTodoのカテゴリをnoneに変更
  const handleDeleteCategory = useCallback((deletedCategoryId) => {
    setTodos(prev => prev.map(t =>
      t.category === deletedCategoryId ? { ...t, category: 'none' } : t
    ))
  }, [])

  // フィルタリング＋ソート（メモ化）
  const sortedTodos = useMemo(() => {
    const filtered = filterCategory === 'all'
      ? todos
      : todos.filter(t => t.category === filterCategory)

    if (sortMode === 'manual') return filtered

    return [...filtered].sort((a, b) => {
      if (sortMode === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      }
      if (sortMode === 'priority') {
        const wa = PRIORITY_WEIGHT[a.priority] ?? PRIORITY_WEIGHT.none
        const wb = PRIORITY_WEIGHT[b.priority] ?? PRIORITY_WEIGHT.none
        return wa - wb
      }
      return 0
    })
  }, [todos, filterCategory, sortMode])

  const doneCount = useMemo(() => todos.filter(t => t.done).length, [todos])
  const dragDisabled = sortMode !== 'manual'

  return (
    <>
      <div
        className="relative max-w-[560px] w-full mx-auto mt-12 px-8 py-10 rounded-[20px] overflow-hidden transition-all duration-300"
        style={{ background: 'var(--card-gradient)', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}
      >
        {/* 背景グロー */}
        <div className="glow-bg-effect absolute -top-20 -right-20 w-[250px] h-[250px] pointer-events-none" />

        {/* タイトル行 */}
        <div className="flex items-center justify-center gap-3 mb-7">
          <h1 className="gradient-title text-center text-[2rem] font-bold">
            <span className="inline-block" style={{ animation: 'bounce-icon 2s ease-in-out infinite' }}>&#10003;</span> Todo App
          </h1>
          <ThemeToggle />
        </div>

        <TodoForm onAdd={addTodo} />

        <FilterBar
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          onOpenCategoryManager={() => setShowCategoryManager(true)}
        />

        <SortControls sortMode={sortMode} setSortMode={setSortMode} />

        <ProgressBar doneCount={doneCount} totalCount={todos.length} />

        <TodoList
          todos={sortedTodos}
          onDragEnd={handleDragEnd}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          dragDisabled={dragDisabled}
        />

        {todos.length === 0 && (
          <p
            className="text-center text-sm py-8"
            style={{ color: 'var(--text-dimmed)', animation: 'fade-in 0.5s ease' }}
          >
            タスクがありません。上から追加しましょう!
          </p>
        )}
        {todos.length > 0 && sortedTodos.length === 0 && (
          <p
            className="text-center text-sm py-8"
            style={{ color: 'var(--text-dimmed)', animation: 'fade-in 0.5s ease' }}
          >
            このカテゴリにタスクはありません
          </p>
        )}
      </div>

      {/* ユーザープロフィールセクション */}
      <UserProfile />

      {/* カテゴリ管理モーダル */}
      {showCategoryManager && (
        <CategoryManager
          onClose={() => setShowCategoryManager(false)}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
    </>
  )
}

export default TodoApp
