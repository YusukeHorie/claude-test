import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useCategories } from '../contexts/CategoryContext'

// 優先度の色定義
const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#3b82f6',
}

// 優先度ラベル
const PRIORITY_LABELS = {
  high: '高',
  medium: '中',
  low: '低',
}

// 期限の表示フォーマット（MM/DD）
function formatDueDate(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr + 'T00:00:00')
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 期限切れかどうかを判定
function isOverdue(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr + 'T00:00:00')
  return due < today
}

// 今日が期限かどうかを判定
function isDueToday(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return dateStr === todayStr
}

// ドラッグ&ドロップ対応のTodoアイテムコンポーネント
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
  }

  // 優先度に応じた左ボーダー
  if (todo.priority && todo.priority !== 'none') {
    style.borderLeft = `3px solid ${PRIORITY_COLORS[todo.priority]}`
  }

  const category = categories.find(c => c.id === todo.category) || categories[0]
  const overdue = !todo.done && isOverdue(todo.dueDate)
  const dueToday = !todo.done && isDueToday(todo.dueDate)

  // 期限切れクラスの追加
  let itemClass = `todo-item ${todo.done ? 'done' : ''}`
  if (overdue) itemClass += ' overdue'

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={itemClass}
    >
      <span
        className={`drag-handle ${dragDisabled ? 'drag-disabled' : ''}`}
        {...(dragDisabled ? {} : { ...attributes, ...listeners })}
      >
        ⠿
      </span>
      <button
        className={`check-btn ${todo.done ? 'checked' : ''}`}
        onClick={() => toggleTodo(todo.id)}
      >
        {todo.done && <span>&#10003;</span>}
      </button>
      {todo.category !== 'none' && (
        <span className="category-dot" style={{ background: category.color }} />
      )}
      <span className="todo-text" onClick={() => toggleTodo(todo.id)}>
        <span className="todo-text-inner">{todo.text}</span>
        <span className="strikethrough-line" />
      </span>
      {/* 優先度バッジ */}
      {todo.priority && todo.priority !== 'none' && (
        <span
          className="priority-badge"
          style={{ color: PRIORITY_COLORS[todo.priority] }}
        >
          {PRIORITY_LABELS[todo.priority]}
        </span>
      )}
      {/* 期限表示 */}
      {todo.dueDate && (
        <span className={`due-date ${overdue ? 'overdue' : ''} ${dueToday ? 'due-today' : ''}`}>
          {formatDueDate(todo.dueDate)}
        </span>
      )}
      <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
        <span className="delete-icon">&times;</span>
      </button>
    </li>
  )
}

export default SortableItem
