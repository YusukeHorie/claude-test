import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useCategories } from '../contexts/CategoryContext'

/**
 * 優先度に対応するカラーコード定義
 * @const {Object<string, string>}
 */
const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#3b82f6',
}

/**
 * 優先度に対応する日本語ラベル定義
 * @const {Object<string, string>}
 */
const PRIORITY_LABELS = {
  high: '高',
  medium: '中',
  low: '低',
}

/**
 * 期限日付をMM/DD形式にフォーマットする
 * @param {string|null} dateStr - YYYY-MM-DD形式の日付文字列
 * @returns {string|null} MM/DD形式の文字列、またはnull
 */
function formatDueDate(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr + 'T00:00:00')
  return `${date.getMonth() + 1}/${date.getDate()}`
}

/**
 * 指定日付が期限切れ（今日より前）かどうかを判定する
 * @param {string|null} dateStr - YYYY-MM-DD形式の日付文字列
 * @returns {boolean} 期限切れの場合true
 */
function isOverdue(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr + 'T00:00:00')
  return due < today
}

/**
 * 指定日付が今日かどうかを判定する
 * @param {string|null} dateStr - YYYY-MM-DD形式の日付文字列
 * @returns {boolean} 今日が期限の場合true
 */
function isDueToday(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return dateStr === todayStr
}

/**
 * ドラッグ&ドロップ対応のTodoアイテムコンポーネント
 * @dnd-kit/sortableを使用し、完了切替、削除、優先度表示、期限表示を含む
 * @component
 * @param {Object} props
 * @param {{id: number, text: string, done: boolean, category: string, priority: string, dueDate: string|null}} props.todo - Todoオブジェクト
 * @param {Function} props.toggleTodo - 完了状態切替コールバック。TodoのIDを引数に取る
 * @param {Function} props.deleteTodo - 削除コールバック。TodoのIDを引数に取る
 * @param {boolean} props.dragDisabled - ドラッグ無効化フラグ
 * @returns {JSX.Element}
 */
function SortableItem({ todo, toggleTodo, deleteTodo, dragDisabled }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id, disabled: dragDisabled })

  const { categories } = useCategories()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
    background: 'var(--todo-item-bg)',
    border: '1px solid var(--todo-item-border)',
    animation: 'slide-in 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  }

  // 優先度に応じた左ボーダー
  if (todo.priority && todo.priority !== 'none') {
    style.borderLeft = `3px solid ${PRIORITY_COLORS[todo.priority]}`
  }

  const category = categories.find(c => c.id === todo.category) || categories[0]
  const overdue = !todo.done && isOverdue(todo.dueDate)
  const dueToday = !todo.done && isDueToday(todo.dueDate)

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-[var(--todo-item-hover-bg)] hover:border-[var(--todo-item-hover-border)] hover:shadow-[var(--todo-item-hover-shadow)] ${todo.done ? 'todo-done' : ''} ${overdue ? 'overdue-glow' : ''}`}
    >
      {/* ドラッグハンドル */}
      <span
        className={`text-base leading-none select-none transition-colors duration-200 touch-none ${
          dragDisabled
            ? 'cursor-default opacity-40'
            : 'cursor-grab hover:text-indigo-400 active:cursor-grabbing'
        }`}
        style={{ color: dragDisabled ? 'var(--drag-disabled-color)' : 'var(--text-faint)' }}
        role="button"
        aria-label="並び替え"
        {...(dragDisabled ? {} : { ...attributes, ...listeners })}
      >
        ⠿
      </span>

      {/* チェックボタン */}
      <button
        className={`w-[22px] h-[22px] min-w-[22px] rounded-md flex items-center justify-center text-[0.7rem] p-0 cursor-pointer transition-all duration-300 ${
          todo.done
            ? 'check-btn-checked border-transparent text-white'
            : 'bg-transparent text-transparent hover:border-indigo-400'
        }`}
        style={todo.done ? { border: 'none' } : { border: '2px solid var(--checkbox-border)' }}
        role="checkbox"
        aria-checked={todo.done}
        onClick={() => toggleTodo(todo.id)}
      >
        {todo.done && <span>&#10003;</span>}
      </button>

      {/* カテゴリドット */}
      {todo.category !== 'none' && (
        <span className="w-2 h-2 min-w-[8px] rounded-full dot-glow" style={{ background: category.color }} />
      )}

      {/* Todoテキスト */}
      <span className="flex-1 cursor-pointer text-[0.95rem] relative select-none overflow-hidden" onClick={() => toggleTodo(todo.id)}>
        <span
          className="transition-colors duration-400"
          style={{ color: todo.done ? 'var(--text-dimmed)' : undefined }}
        >
          {todo.text}
        </span>
        <span className="strikethrough-line" />
      </span>

      {/* 優先度バッジ */}
      {todo.priority && todo.priority !== 'none' && (
        <span
          className="text-[0.7rem] font-semibold px-1.5 py-0.5 rounded-md shrink-0"
          style={{ color: PRIORITY_COLORS[todo.priority], background: 'var(--priority-badge-bg)' }}
        >
          {PRIORITY_LABELS[todo.priority]}
        </span>
      )}

      {/* 期限表示 */}
      {todo.dueDate && (
        <span
          className={`text-[0.72rem] shrink-0 px-1.5 py-0.5 rounded-md ${
            overdue ? 'text-red-500 bg-red-500/10' : dueToday ? 'text-amber-500 bg-amber-500/10' : ''
          }`}
          style={!overdue && !dueToday ? { color: 'var(--text-secondary)', background: 'var(--due-date-bg)' } : undefined}
        >
          {formatDueDate(todo.dueDate)}
        </span>
      )}

      {/* 削除ボタン */}
      <button
        className="delete-btn-reveal w-7 h-7 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center transition-all duration-300 opacity-0 p-0 hover:bg-[var(--delete-hover-bg)] hover:text-red-500 hover:scale-110"
        style={{ color: 'var(--text-dimmed)' }}
        aria-label="削除"
        onClick={() => deleteTodo(todo.id)}
      >
        <span className="text-[1.2rem] leading-none">&times;</span>
      </button>
    </li>
  )
}

export default SortableItem
