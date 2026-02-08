import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CategoryProvider } from '../../contexts/CategoryContext'
import FilterBar from '../FilterBar'

// CategoryProviderでラップするヘルパー関数
function renderWithProvider(ui) {
  return render(
    <CategoryProvider userId="test-user">
      {ui}
    </CategoryProvider>
  )
}

describe('FilterBar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('フィルターボタンが表示される', () => {
    const setFilterCategory = vi.fn()
    const onOpenCategoryManager = vi.fn()

    renderWithProvider(
      <FilterBar
        filterCategory="all"
        setFilterCategory={setFilterCategory}
        onOpenCategoryManager={onOpenCategoryManager}
      />
    )

    // 「すべて」ボタンが表示される
    expect(screen.getByText('すべて')).toBeInTheDocument()

    // デフォルトカテゴリ（noneを除く4つ）が表示される
    expect(screen.getByText('仕事')).toBeInTheDocument()
    expect(screen.getByText('プライベート')).toBeInTheDocument()
    expect(screen.getByText('勉強')).toBeInTheDocument()
    expect(screen.getByText('健康')).toBeInTheDocument()
  })

  it('クリックでカテゴリ切替', async () => {
    const user = userEvent.setup()
    const setFilterCategory = vi.fn()
    const onOpenCategoryManager = vi.fn()

    renderWithProvider(
      <FilterBar
        filterCategory="all"
        setFilterCategory={setFilterCategory}
        onOpenCategoryManager={onOpenCategoryManager}
      />
    )

    // 「仕事」ボタンをクリック
    await user.click(screen.getByText('仕事'))
    expect(setFilterCategory).toHaveBeenCalledWith('work')

    // 「すべて」ボタンをクリック
    await user.click(screen.getByText('すべて'))
    expect(setFilterCategory).toHaveBeenCalledWith('all')

    // 「勉強」ボタンをクリック
    await user.click(screen.getByText('勉強'))
    expect(setFilterCategory).toHaveBeenCalledWith('study')
  })

  it('CategoryContextから動的にカテゴリ取得', () => {
    const setFilterCategory = vi.fn()
    const onOpenCategoryManager = vi.fn()

    // カスタムカテゴリをlocalStorageに保存
    const customCategories = [
      { id: 'none', label: 'なし', color: '#666', isDefault: true },
      { id: 'work', label: '仕事', color: '#6366f1', isDefault: true },
      { id: 'personal', label: 'プライベート', color: '#10b981', isDefault: true },
      { id: 'study', label: '勉強', color: '#f59e0b', isDefault: true },
      { id: 'health', label: '健康', color: '#ef4444', isDefault: true },
      { id: 'custom_1', label: 'カスタムA', color: '#ff0000', isDefault: false },
    ]
    localStorage.setItem(
      'todoApp_test-user_categories',
      JSON.stringify(customCategories)
    )

    renderWithProvider(
      <FilterBar
        filterCategory="all"
        setFilterCategory={setFilterCategory}
        onOpenCategoryManager={onOpenCategoryManager}
      />
    )

    // カスタムカテゴリも表示される
    expect(screen.getByText('カスタムA')).toBeInTheDocument()
  })
})
