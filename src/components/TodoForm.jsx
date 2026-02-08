import { useState } from 'react'
import { useCategories } from '../contexts/CategoryContext'

/**
 * Todo追加フォームコンポーネント
 * テキスト入力、カテゴリ選択、優先度選択、期限設定を提供する
 * @component
 * @param {Object} props
 * @param {Function} props.onAdd - Todo追加コールバック。{text, category, priority, dueDate}を引数に取る
 * @returns {JSX.Element}
 */
function TodoForm({ onAdd }) {
  const [input, setInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('none')
  const [priority, setPriority] = useState('none')
  const [dueDate, setDueDate] = useState('')

  const { categories } = useCategories()

  // フォーム送信処理
  const handleSubmit = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    try {
      onAdd({
        text,
        category: selectedCategory,
        priority,
        dueDate: dueDate || null,
      })
      setInput('')
      setPriority('none')
      setDueDate('')
    } catch (err) {
      console.error('Todo追加に失敗:', err)
    }
  }

  return (
    <form className="flex flex-col gap-2 mb-4" onSubmit={handleSubmit}>
      {/* 行1: テキスト入力 + 追加ボタン */}
      <div className="flex gap-2">
        <label htmlFor="todo-input" className="sr-only">新しいタスク</label>
        <input
          id="todo-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="新しいタスクを追加..."
          className="flex-1 px-4 py-3 text-[0.95rem] rounded-xl outline-none transition-all duration-300 focus-indigo"
          style={{
            color: 'var(--text-primary)',
            background: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
          }}
        />
        <button
          type="submit"
          className="btn-primary-gradient px-5 py-3 text-[0.95rem] font-semibold text-white border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
        >
          追加
        </button>
      </div>
      {/* 行2: カテゴリ、優先度、期限 */}
      <div className="flex gap-2">
        <select
          className="select-reset flex-1 px-2.5 py-2 text-[0.82rem] rounded-xl outline-none cursor-pointer transition-all duration-300 focus-indigo"
          style={{
            color: 'var(--text-primary)',
            background: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
          }}
          aria-label="カテゴリ"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <select
          className="select-reset flex-1 px-2.5 py-2 text-[0.82rem] rounded-xl outline-none cursor-pointer transition-all duration-300 focus-indigo"
          style={{
            color: 'var(--text-primary)',
            background: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
          }}
          aria-label="優先度"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="none">優先度なし</option>
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
        <input
          type="date"
          className="date-input-scheme flex-1 px-2.5 py-2 text-[0.82rem] rounded-xl outline-none cursor-pointer transition-all duration-300 focus-indigo"
          style={{
            color: 'var(--text-primary)',
            background: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
          }}
          aria-label="期限"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
    </form>
  )
}

export default TodoForm
