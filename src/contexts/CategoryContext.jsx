import { createContext, useContext, useState, useCallback } from 'react'

/**
 * カテゴリコンテキスト
 * @type {React.Context<{categories: Array, addCategory: Function, updateCategory: Function, deleteCategory: Function}|null>}
 */
const CategoryContext = createContext(null)

/**
 * デフォルトカテゴリ一覧（削除不可）
 * @const {Array<{id: string, label: string, color: string, isDefault: boolean}>}
 */
const DEFAULT_CATEGORIES = [
  { id: 'none', label: 'なし', color: '#666', isDefault: true },
  { id: 'work', label: '仕事', color: '#6366f1', isDefault: true },
  { id: 'personal', label: 'プライベート', color: '#10b981', isDefault: true },
  { id: 'study', label: '勉強', color: '#f59e0b', isDefault: true },
  { id: 'health', label: '健康', color: '#ef4444', isDefault: true },
]

/**
 * localStorageからユーザーに紐づくカテゴリ一覧を読み込む
 * @param {string|undefined} userId - ユーザーID。未指定時はデフォルトカテゴリを返す
 * @returns {Array<{id: string, label: string, color: string, isDefault: boolean}>} カテゴリ配列
 */
function loadCategories(userId) {
  if (!userId) return DEFAULT_CATEGORIES
  try {
    const saved = localStorage.getItem(`todoApp_${userId}_categories`)
    if (saved) return JSON.parse(saved)
  } catch (err) {
    console.error('カテゴリの読み込みに失敗:', err)
  }
  return DEFAULT_CATEGORIES
}

/**
 * カテゴリプロバイダーコンポーネント
 * 動的なカテゴリの追加・更新・削除機能を提供し、localStorageに永続化する
 * @component
 * @param {Object} props
 * @param {string} props.userId - カテゴリの保存先を決定するユーザーID
 * @param {React.ReactNode} props.children - 子コンポーネント
 * @returns {JSX.Element}
 * @provides {{categories: Array, addCategory: Function, updateCategory: Function, deleteCategory: Function}}
 */
export function CategoryProvider({ userId, children }) {
  const [categories, setCategories] = useState(() => loadCategories(userId))

  // カテゴリ追加（最大15個まで）
  const addCategory = useCallback((label, color) => {
    setCategories(prev => {
      if (prev.length >= 15) {
        throw new Error('カテゴリは最大15個までです')
      }

      const newCategory = {
        id: `custom_${Date.now()}`,
        label,
        color,
        isDefault: false,
      }

      const updated = [...prev, newCategory]
      if (userId) {
        try {
          localStorage.setItem(`todoApp_${userId}_categories`, JSON.stringify(updated))
        } catch (err) {
          console.error('カテゴリの保存に失敗:', err)
        }
      }
      return updated
    })
  }, [userId])

  // カテゴリ更新
  const updateCategory = useCallback((id, updates) => {
    setCategories(prev => {
      const target = prev.find(c => c.id === id)
      if (!target || target.isDefault) {
        throw new Error('このカテゴリは編集できません')
      }

      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c)
      if (userId) {
        try {
          localStorage.setItem(`todoApp_${userId}_categories`, JSON.stringify(updated))
        } catch (err) {
          console.error('カテゴリの保存に失敗:', err)
        }
      }
      return updated
    })
  }, [userId])

  // カテゴリ削除
  const deleteCategory = useCallback((id) => {
    let deletedId = null
    setCategories(prev => {
      const target = prev.find(c => c.id === id)
      if (!target || target.isDefault) {
        throw new Error('デフォルトカテゴリは削除できません')
      }

      deletedId = id
      const filtered = prev.filter(c => c.id !== id)
      if (userId) {
        try {
          localStorage.setItem(`todoApp_${userId}_categories`, JSON.stringify(filtered))
        } catch (err) {
          console.error('カテゴリの保存に失敗:', err)
        }
      }
      return filtered
    })
    return deletedId
  }, [userId])

  return (
    <CategoryContext.Provider value={{
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
    }}>
      {children}
    </CategoryContext.Provider>
  )
}

/**
 * カテゴリコンテキストを使用するカスタムフック
 * CategoryProvider内でのみ使用可能
 * @returns {{categories: Array<{id: string, label: string, color: string, isDefault: boolean}>, addCategory: Function, updateCategory: Function, deleteCategory: Function}}
 * @throws {Error} CategoryProvider外で使用した場合にエラーをスローする
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useCategories() {
  const context = useContext(CategoryContext)
  if (!context) {
    throw new Error('useCategoriesはCategoryProvider内で使用してください')
  }
  return context
}
