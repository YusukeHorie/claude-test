import { useState } from 'react'
import { useCategories } from '../contexts/CategoryContext'

// カラーパレット（12色）
const COLOR_PALETTE = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e',
]

// カテゴリCRUD管理パネルコンポーネント
function CategoryManager({ onClose, onDeleteCategory }) {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()
  const [newLabel, setNewLabel] = useState('')
  const [newColor, setNewColor] = useState(COLOR_PALETTE[0])
  const [editingId, setEditingId] = useState(null)
  const [editLabel, setEditLabel] = useState('')
  const [editColor, setEditColor] = useState('')
  const [error, setError] = useState('')

  // 新規カテゴリ追加
  const handleAdd = () => {
    const trimmed = newLabel.trim()
    if (!trimmed) {
      setError('カテゴリ名を入力してください')
      return
    }

    try {
      addCategory(trimmed, newColor)
      setNewLabel('')
      setNewColor(COLOR_PALETTE[0])
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  // 編集開始
  const startEdit = (category) => {
    setEditingId(category.id)
    setEditLabel(category.label)
    setEditColor(category.color)
    setError('')
  }

  // 編集保存
  const saveEdit = () => {
    const trimmed = editLabel.trim()
    if (!trimmed) {
      setError('カテゴリ名を入力してください')
      return
    }

    try {
      updateCategory(editingId, { label: trimmed, color: editColor })
      setEditingId(null)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  // 削除確認
  const handleDelete = (id) => {
    if (!window.confirm('このカテゴリを削除しますか？\n使用中のTodoは「なし」に変更されます。')) {
      return
    }

    try {
      const deletedId = deleteCategory(id)
      // 親に通知してTodoのカテゴリを更新
      onDeleteCategory(deletedId)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="category-manager-overlay" onClick={onClose}>
      <div className="category-manager" onClick={(e) => e.stopPropagation()}>
        <div className="category-manager-header">
          <h3>カテゴリ管理</h3>
          <button className="category-manager-close" onClick={onClose}>&times;</button>
        </div>

        {error && <p className="category-manager-error">{error}</p>}

        {/* カテゴリ一覧 */}
        <div className="category-list">
          {categories.filter(c => c.id !== 'none').map(cat => (
            <div key={cat.id} className="category-list-item">
              {editingId === cat.id ? (
                // 編集モード
                <div className="category-edit-row">
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="category-edit-input"
                  />
                  <div className="color-palette-mini">
                    {COLOR_PALETTE.map(color => (
                      <button
                        key={color}
                        className={`color-swatch ${editColor === color ? 'selected' : ''}`}
                        style={{ background: color }}
                        onClick={() => setEditColor(color)}
                      />
                    ))}
                  </div>
                  <div className="category-edit-actions">
                    <button className="cat-action-btn save" onClick={saveEdit}>保存</button>
                    <button className="cat-action-btn cancel" onClick={() => setEditingId(null)}>取消</button>
                  </div>
                </div>
              ) : (
                // 表示モード
                <div className="category-display-row">
                  <span className="category-dot-lg" style={{ background: cat.color }} />
                  <span className="category-name">{cat.label}</span>
                  {cat.isDefault && <span className="category-default-badge">デフォルト</span>}
                  {!cat.isDefault && (
                    <div className="category-actions">
                      <button className="cat-action-btn edit" onClick={() => startEdit(cat)}>編集</button>
                      <button className="cat-action-btn delete" onClick={() => handleDelete(cat.id)}>削除</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 新規追加フォーム */}
        <div className="category-add-section">
          <h4>新規カテゴリ追加</h4>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="カテゴリ名"
            className="category-add-input"
          />
          <div className="color-palette">
            {COLOR_PALETTE.map(color => (
              <button
                key={color}
                className={`color-swatch ${newColor === color ? 'selected' : ''}`}
                style={{ background: color }}
                onClick={() => setNewColor(color)}
              />
            ))}
          </div>
          <button
            className="category-add-btn"
            onClick={handleAdd}
            disabled={categories.length >= 15}
          >
            {categories.length >= 15 ? '上限に達しました' : '追加'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryManager
