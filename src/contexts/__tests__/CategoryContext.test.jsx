import { render, screen } from '@testing-library/react'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { CategoryProvider, useCategories } from '../CategoryContext'

// テスト用のコンシューマーコンポーネント
function TestConsumer() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()
  const [error, setError] = useState(null)

  // イベントハンドラ内のエラーをキャッチして表示
  const handleWithErrorCatch = (fn) => {
    try {
      fn()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <p data-testid="count">{categories.length}</p>
      {error && <p data-testid="handler-error">{error}</p>}
      <ul data-testid="categories">
        {categories.map(c => (
          <li key={c.id} data-testid={`cat-${c.id}`}>
            {c.label} ({c.color}) {c.isDefault ? '[default]' : '[custom]'}
          </li>
        ))}
      </ul>
      <button onClick={() => handleWithErrorCatch(() => addCategory('テスト', '#ff0000'))}>追加</button>
      <button
        onClick={() => handleWithErrorCatch(() => {
          const custom = categories.find(c => !c.isDefault)
          if (custom) {
            updateCategory(custom.id, { label: '更新済み', color: '#00ff00' })
          }
        })}
      >
        更新
      </button>
      <button
        onClick={() => handleWithErrorCatch(() => {
          const custom = categories.find(c => !c.isDefault)
          if (custom) {
            deleteCategory(custom.id)
          }
        })}
      >
        削除
      </button>
      <button onClick={() => handleWithErrorCatch(() => deleteCategory('work'))}>デフォルト削除</button>
      <button
        onClick={() => handleWithErrorCatch(() => {
          for (let i = 0; i < 11; i++) {
            addCategory(`追加${i}`, '#ff0000')
          }
        })}
      >
        大量追加
      </button>
    </div>
  )
}

describe('CategoryContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('デフォルトカテゴリが5つ読み込まれる', () => {
    render(
      <CategoryProvider userId="test-user">
        <TestConsumer />
      </CategoryProvider>
    )

    expect(screen.getByTestId('count').textContent).toBe('5')

    // デフォルトカテゴリが全て存在する
    expect(screen.getByTestId('cat-none')).toHaveTextContent('なし')
    expect(screen.getByTestId('cat-work')).toHaveTextContent('仕事')
    expect(screen.getByTestId('cat-personal')).toHaveTextContent('プライベート')
    expect(screen.getByTestId('cat-study')).toHaveTextContent('勉強')
    expect(screen.getByTestId('cat-health')).toHaveTextContent('健康')
  })

  it('addCategoryでカテゴリ追加', async () => {
    const user = userEvent.setup()
    render(
      <CategoryProvider userId="test-user">
        <TestConsumer />
      </CategoryProvider>
    )

    // 初期は5個
    expect(screen.getByTestId('count').textContent).toBe('5')

    // カテゴリ追加
    await user.click(screen.getByText('追加'))

    // 6個に増える
    expect(screen.getByTestId('count').textContent).toBe('6')
  })

  it('updateCategoryでカテゴリ更新', async () => {
    const user = userEvent.setup()
    render(
      <CategoryProvider userId="test-user">
        <TestConsumer />
      </CategoryProvider>
    )

    // まずカスタムカテゴリを追加
    await user.click(screen.getByText('追加'))
    expect(screen.getByTestId('count').textContent).toBe('6')

    // カスタムカテゴリを更新
    await user.click(screen.getByText('更新'))

    // 更新されたラベルが表示される
    const categories = screen.getByTestId('categories')
    expect(categories.textContent).toContain('更新済み')
  })

  it('deleteCategoryでカテゴリ削除', async () => {
    const user = userEvent.setup()
    render(
      <CategoryProvider userId="test-user">
        <TestConsumer />
      </CategoryProvider>
    )

    // まずカスタムカテゴリを追加
    await user.click(screen.getByText('追加'))
    expect(screen.getByTestId('count').textContent).toBe('6')

    // カスタムカテゴリを削除
    await user.click(screen.getByText('削除'))

    // 5個に戻る
    expect(screen.getByTestId('count').textContent).toBe('5')
  })

  it('デフォルトカテゴリは削除不可（isDefault: true）', async () => {
    const user = userEvent.setup()
    render(
      <CategoryProvider userId="test-user">
        <TestConsumer />
      </CategoryProvider>
    )

    // デフォルトカテゴリの削除を試みる
    await user.click(screen.getByText('デフォルト削除'))

    // イベントハンドラ内でキャッチされたエラーが表示される
    expect(screen.getByTestId('handler-error').textContent).toBe(
      'デフォルトカテゴリは削除できません'
    )
  })

  it('最大15個まで', async () => {
    const user = userEvent.setup()
    render(
      <CategoryProvider userId="test-user">
        <TestConsumer />
      </CategoryProvider>
    )

    // デフォルト5個の状態で11個追加を試みる
    await user.click(screen.getByText('大量追加'))

    // 15個を超えて追加されないことを確認（デフォルト5個 + カスタム10個 = 15個が上限）
    expect(Number(screen.getByTestId('count').textContent)).toBeLessThanOrEqual(15)
  })
})
