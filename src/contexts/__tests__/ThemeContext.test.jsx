import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ThemeProvider, useTheme } from '../ThemeContext'

// テスト用のコンシューマーコンポーネント
function TestConsumer() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      <p data-testid="theme">{theme}</p>
      <button onClick={toggleTheme}>テーマ切替</button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    // テストごとにlocalStorageとdata-theme属性をクリア
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')

    // matchMediaのモック（darkモードをデフォルトとする）
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

  it('デフォルトテーマが正しく設定される', () => {
    // matchMediaがlightに一致しない場合、デフォルトはdark
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme').textContent).toBe('dark')
  })

  it('toggleThemeでdark↔light切り替え', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )

    // 初期値はdark
    expect(screen.getByTestId('theme').textContent).toBe('dark')

    // ライトモードに切替
    await user.click(screen.getByText('テーマ切替'))
    expect(screen.getByTestId('theme').textContent).toBe('light')

    // ダークモードに戻す
    await user.click(screen.getByText('テーマ切替'))
    expect(screen.getByTestId('theme').textContent).toBe('dark')
  })

  it('localStorageに保存される', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )

    // テーマ切替後、localStorageに保存される
    await user.click(screen.getByText('テーマ切替'))
    expect(localStorage.getItem('todoAppTheme')).toBe('light')

    // もう一度切替
    await user.click(screen.getByText('テーマ切替'))
    expect(localStorage.getItem('todoAppTheme')).toBe('dark')
  })

  it('data-theme属性が設定される', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )

    // 初期状態でdata-theme属性が設定される
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    // テーマ切替後にdata-theme属性が変わる
    await user.click(screen.getByText('テーマ切替'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
