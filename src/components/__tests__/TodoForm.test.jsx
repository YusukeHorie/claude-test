import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CategoryProvider } from '../../contexts/CategoryContext'
import TodoForm from '../TodoForm'

// プロバイダーでラップするヘルパー関数
function renderWithProviders(ui) {
  return render(
    <CategoryProvider userId="test-user-1">
      {ui}
    </CategoryProvider>
  )
}

describe('TodoForm', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('テキスト入力してsubmitするとonAddが呼ばれる', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    renderWithProviders(<TodoForm onAdd={onAdd} />)

    // テキスト入力
    const input = screen.getByPlaceholderText('新しいタスクを追加...')
    await user.type(input, 'テストタスク')

    // 追加ボタンをクリック
    await user.click(screen.getByRole('button', { name: '追加' }))

    // onAddが正しい引数で呼ばれる
    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'テストタスク' })
    )
  })

  it('空のテキストではsubmitされない', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    renderWithProviders(<TodoForm onAdd={onAdd} />)

    // 空のまま追加ボタンをクリック
    await user.click(screen.getByRole('button', { name: '追加' }))

    // onAddが呼ばれない
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('submit後に入力がクリアされる', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    renderWithProviders(<TodoForm onAdd={onAdd} />)

    // テキスト入力
    const input = screen.getByPlaceholderText('新しいタスクを追加...')
    await user.type(input, 'クリアテスト')

    // 追加ボタンをクリック
    await user.click(screen.getByRole('button', { name: '追加' }))

    // 入力がクリアされている
    expect(input).toHaveValue('')
  })
})
