import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import { CategoryProvider } from '../../contexts/CategoryContext'
import { ThemeProvider } from '../../contexts/ThemeContext'
import TodoApp from '../TodoApp'

// 全プロバイダーでラップするヘルパー関数
function renderWithProviders(ui) {
  // テスト用ユーザーを事前にlocalStorageに設定
  const testUser = { id: 'test-user-1', name: 'テスト太郎', email: 'test@example.com' }
  localStorage.setItem('todoAppUser', JSON.stringify(testUser))
  localStorage.setItem(
    'todoAppUsers',
    JSON.stringify([{ ...testUser, password: 'pass1234' }])
  )

  return render(
    <MemoryRouter>
      <ThemeProvider>
        <AuthProvider>
          <CategoryProvider userId="test-user-1">
            {ui}
          </CategoryProvider>
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('TodoApp', () => {
  beforeEach(() => {
    localStorage.clear()
    // matchMediaのモック
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('Todo追加が動作する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TodoApp />)

    // テキスト入力
    const input = screen.getByPlaceholderText('新しいタスクを追加...')
    await user.type(input, 'テストタスク')

    // 追加ボタンをクリック
    const addButton = screen.getByRole('button', { name: '追加' })
    await user.click(addButton)

    // Todoが表示される
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
  })

  it('Todo完了切替が動作する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TodoApp />)

    // まずTodoを追加
    const input = screen.getByPlaceholderText('新しいタスクを追加...')
    await user.type(input, '完了テスト')
    await user.click(screen.getByRole('button', { name: '追加' }))

    // Todoテキストが表示される
    expect(screen.getByText('完了テスト')).toBeInTheDocument()

    // チェックボタンをクリックして完了に切替
    const checkButtons = screen.getAllByRole('button').filter(
      btn => btn.classList.contains('check-btn')
    )
    expect(checkButtons.length).toBeGreaterThan(0)
    await user.click(checkButtons[0])

    // doneクラスがtodo-itemに追加される
    const todoItem = checkButtons[0].closest('.todo-item')
    expect(todoItem).toHaveClass('done')
  })

  it('Todo削除が動作する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TodoApp />)

    // Todoを追加
    const input = screen.getByPlaceholderText('新しいタスクを追加...')
    await user.type(input, '削除テスト')
    await user.click(screen.getByRole('button', { name: '追加' }))

    // Todoが表示される
    expect(screen.getByText('削除テスト')).toBeInTheDocument()

    // 削除ボタンをクリック
    const deleteButtons = screen.getAllByRole('button').filter(
      btn => btn.classList.contains('delete-btn')
    )
    expect(deleteButtons.length).toBeGreaterThan(0)
    await user.click(deleteButtons[0])

    // Todoが消える
    expect(screen.queryByText('削除テスト')).not.toBeInTheDocument()
  })
})
