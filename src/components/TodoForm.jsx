import { useState } from 'react'
import { useCategories } from '../contexts/CategoryContext'

// Todo追加フォーム（テキスト、カテゴリ、優先度、期限入力付き）
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
    <form className="todo-form" onSubmit={handleSubmit}>
      {/* 行1: テキスト入力 + 追加ボタン */}
      <div className="form-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="新しいタスクを追加..."
        />
        <button type="submit">追加</button>
      </div>
      {/* 行2: カテゴリ、優先度、期限 */}
      <div className="form-row form-options">
        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <select
          className="priority-select"
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
          className="date-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
    </form>
  )
}

export default TodoForm
