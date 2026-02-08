import { useState, useEffect } from 'react'
import { useCategories } from '../contexts/CategoryContext'

/**
 * カテゴリ色選択用のカラーパレット（12色）
 * @const {Array<string>}
 */
const COLOR_PALETTE = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e',
]

/**
 * カテゴリCRUD管理パネルコンポーネント
 * モーダル形式でカテゴリの一覧表示、新規追加、編集、削除を行う
 * デフォルトカテゴリは編集・削除不可。最大15個まで追加可能
 * @component
 * @param {Object} props
 * @param {Function} props.onClose - モーダルを閉じるコールバック
 * @param {Function} props.onDeleteCategory - カテゴリ削除時の通知コールバック。削除されたカテゴリIDを引数に取る
 * @returns {JSX.Element}
 */
function CategoryManager({ onClose, onDeleteCategory }) {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()
  const [newLabel, setNewLabel] = useState('')
  const [newColor, setNewColor] = useState(COLOR_PALETTE[0])
  const [editingId, setEditingId] = useState(null)
  const [editLabel, setEditLabel] = useState('')
  const [editColor, setEditColor] = useState('')
  const [error, setError] = useState('')

  // Escキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

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
    <div
      className="fixed inset-0 flex justify-center items-center z-[100]"
      style={{ background: 'var(--overlay-bg)', animation: 'fade-in 0.2s ease' }}
      onClick={onClose}
    >
      <div
        className="w-[400px] max-w-[90vw] max-h-[80vh] overflow-y-auto rounded-[20px] p-6 manager-shadow"
        style={{ background: 'var(--card-gradient)', border: '1px solid var(--manager-border)' }}
        role="dialog"
        aria-modal="true"
        aria-label="カテゴリ管理"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[1.1rem] font-bold" style={{ color: 'var(--text-primary)' }}>カテゴリ管理</h3>
          <button
            className="w-[30px] h-[30px] rounded-lg border-none flex items-center justify-center text-[1.2rem] cursor-pointer transition-all duration-200 hover:text-red-500"
            style={{ background: 'var(--manager-close-bg)', color: 'var(--text-secondary)' }}
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* エラー表示 */}
        {error && (
          <p className="text-red-500 text-[0.82rem] text-center mb-3 p-2 bg-red-500/10 rounded-lg">
            {error}
          </p>
        )}

        {/* カテゴリ一覧 */}
        <div className="flex flex-col gap-1.5 mb-5">
          {categories.filter(c => c.id !== 'none').map(cat => (
            <div
              key={cat.id}
              className="px-3 py-2.5 rounded-[10px]"
              style={{ background: 'var(--category-item-bg)', border: '1px solid var(--category-item-border)' }}
            >
              {editingId === cat.id ? (
                // 編集モード
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="px-3 py-2 text-[0.85rem] rounded-lg outline-none focus-indigo"
                    style={{ color: 'var(--text-primary)', background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
                  />
                  <div className="flex gap-1 flex-wrap">
                    {COLOR_PALETTE.map(color => (
                      <button
                        key={color}
                        className={`w-5 h-5 rounded-full border-2 border-transparent cursor-pointer transition-all duration-200 hover:scale-115 ${editColor === color ? 'swatch-selected' : ''}`}
                        style={{ background: color }}
                        onClick={() => setEditColor(color)}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="px-2 py-1 text-[0.72rem] rounded-md border-none cursor-pointer transition-all duration-200 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20"
                      onClick={saveEdit}
                    >
                      保存
                    </button>
                    <button
                      className="px-2 py-1 text-[0.72rem] rounded-md border-none cursor-pointer transition-all duration-200"
                      style={{ color: 'var(--text-secondary)', background: 'var(--manager-close-bg)' }}
                      onClick={() => setEditingId(null)}
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                // 表示モード
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 min-w-[12px] rounded-full dot-glow" style={{ background: cat.color }} />
                  <span className="flex-1 text-[0.9rem]" style={{ color: 'var(--text-primary)' }}>{cat.label}</span>
                  {cat.isDefault && (
                    <span
                      className="text-[0.65rem] px-1.5 py-0.5 rounded-md"
                      style={{ color: 'var(--text-muted)', background: 'var(--category-item-bg)' }}
                    >
                      デフォルト
                    </span>
                  )}
                  {!cat.isDefault && (
                    <div className="flex gap-1">
                      <button
                        className="px-2 py-1 text-[0.72rem] rounded-md border-none cursor-pointer transition-all duration-200 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20"
                        onClick={() => startEdit(cat)}
                      >
                        編集
                      </button>
                      <button
                        className="px-2 py-1 text-[0.72rem] rounded-md border-none cursor-pointer transition-all duration-200 text-red-500 bg-red-500/10 hover:bg-red-500/20"
                        onClick={() => handleDelete(cat.id)}
                      >
                        削除
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 新規追加フォーム */}
        <div className="pt-4" style={{ borderTop: '1px solid var(--category-divider)' }}>
          <h4 className="text-[0.85rem] font-semibold mb-2.5" style={{ color: 'var(--text-secondary)' }}>新規カテゴリ追加</h4>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="カテゴリ名"
            className="w-full px-3 py-2.5 text-[0.85rem] rounded-[10px] outline-none mb-2 focus-indigo"
            style={{ color: 'var(--text-primary)', background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
          />
          <div className="flex gap-1 flex-wrap">
            {COLOR_PALETTE.map(color => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 border-transparent cursor-pointer transition-all duration-200 hover:scale-115 ${newColor === color ? 'swatch-selected' : ''}`}
                style={{ background: color }}
                onClick={() => setNewColor(color)}
              />
            ))}
          </div>
          <button
            className="btn-primary-gradient w-full mt-2 py-2.5 text-[0.85rem] font-semibold text-white border-none rounded-[10px] cursor-pointer transition-all duration-300 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
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
