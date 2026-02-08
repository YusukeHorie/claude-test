import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ThemeProvider } from '../../contexts/ThemeContext'
import ThemeToggle from '../ThemeToggle'

// プロバイダーでラップするヘルパー関数
function renderWithProviders(ui) {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  )
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    // matchMediaのモック（デフォルトはダークモード）
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

  it('テーマ切替ボタンが表示される', () => {
    renderWithProviders(<ThemeToggle />)

    // ボタンが存在する
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    // Tailwind移行後のクラスを確認
    expect(button).toHaveClass('w-9')
  })

  it('クリックでテーマが切り替わる', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ThemeToggle />)

    // 初期状態はダークモード（matchMediaがfalseなのでdarkがデフォルト）
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('title', 'ライトモードに切替')

    // クリックしてライトモードに切替
    await user.click(button)

    // ライトモードになっている
    expect(button).toHaveAttribute('title', 'ダークモードに切替')

    // もう一度クリックしてダークモードに戻る
    await user.click(button)

    // ダークモードに戻っている
    expect(button).toHaveAttribute('title', 'ライトモードに切替')
  })
})
