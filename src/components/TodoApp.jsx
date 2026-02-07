import { useState, useEffect, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { useAuth } from '../contexts/AuthContext'
import UserProfile from '../UserProfile'
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
  const addTodo = ({ text, category, priority, dueDate }) => {
    setTodos(prev => [...prev, {
      id: Date.now(),
      text,
      done: false,
      category,
      priority,
      dueDate,
    }])
  }

  // Todo完了切替
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  // Todo削除
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  // ドラッグ&ドロップ処理
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex(t => t.id === active.id)
        const newIndex = items.findIndex(t => t.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // カテゴリ削除時にTodoのカテゴリをnoneに変更
  const handleDeleteCategory = (deletedCategoryId) => {
    setTodos(prev => prev.map(t =>
      t.category === deletedCategoryId ? { ...t, category: 'none' } : t
    ))
  }

  // フィルタリング
  const filteredTodos = filterCategory === 'all'
    ? todos
    : todos.filter(t => t.category === filterCategory)

  // ソート
  const sortedTodos = sortMode === 'manual'
    ? filteredTodos
    : [...filteredTodos].sort((a, b) => {
        if (sortMode === 'dueDate') {
          // 期限なしは最後に
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

  const doneCount = todos.filter(t => t.done).length
  const dragDisabled = sortMode !== 'manual'

  return (
    <>
      <div className="app">
        <div className="glow-bg" />
        <div className="title-row">
          <h1 className="title">
            <span className="title-icon">&#10003;</span> Todo App
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
          <p className="empty-state">タスクがありません。上から追加しましょう!</p>
        )}
        {todos.length > 0 && sortedTodos.length === 0 && (
          <p className="empty-state">このカテゴリにタスクはありません</p>
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
