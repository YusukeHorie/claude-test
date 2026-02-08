import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import { ThemeProvider } from '../../contexts/ThemeContext'
import LoginPage from '../LoginPage'

// プロバイダーでラップするヘルパー関数
function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <AuthProvider>
          {ui}
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
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

  it('ログインフォームが表示される', () => {
    renderWithProviders(<LoginPage />)

    // ログインタブとsubmitボタンの2つが存在する
    const loginButtons = screen.getAllByText('ログイン')
    expect(loginButtons.length).toBe(2)

    // メールアドレスとパスワードフィールドが表示される
    expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('パスワード')).toBeInTheDocument()

    // ログイン送信ボタン（type="submit"）が存在する
    const submitBtn = loginButtons.find(btn => btn.type === 'submit')
    expect(submitBtn).toBeDefined()
  })

  it('新規登録タブに切り替わる', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />)

    // 新規登録タブをクリック
    await user.click(screen.getByText('新規登録'))

    // 名前フィールドが表示される（新規登録時のみ）
    expect(screen.getByPlaceholderText('お名前')).toBeInTheDocument()

    // パスワード確認フィールドが表示される
    expect(screen.getByPlaceholderText('パスワード（再入力）')).toBeInTheDocument()

    // 登録するボタンが表示される
    expect(screen.getByRole('button', { name: '登録する' })).toBeInTheDocument()
  })

  it('バリデーションエラーが表示される', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />)

    // メールアドレスを空のままフォーム内のログイン送信ボタンをクリック
    const form = document.querySelector('form')
    const loginSubmit = form.querySelector('button[type="submit"]')
    await user.click(loginSubmit)

    // エラーメッセージが表示される
    expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument()
  })
})
