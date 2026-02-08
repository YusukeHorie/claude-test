import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import { ThemeProvider } from '../../contexts/ThemeContext'
import ProtectedRoute from '../ProtectedRoute'

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

describe('ProtectedRoute', () => {
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

  it('認証済みの場合、子コンポーネントが表示される', () => {
    // テスト用ユーザーをlocalStorageに設定
    const testUser = { id: 'test-user-1', name: 'テスト太郎', email: 'test@example.com' }
    localStorage.setItem('todoAppUser', JSON.stringify(testUser))

    renderWithProviders(
      <ProtectedRoute>
        <div>保護されたコンテンツ</div>
      </ProtectedRoute>
    )

    // 子コンポーネントが表示される
    expect(screen.getByText('保護されたコンテンツ')).toBeInTheDocument()
  })

  it('未認証の場合、/loginにリダイレクトされる', () => {
    // localStorageにユーザーを設定しない（未認証状態）
    renderWithProviders(
      <ProtectedRoute>
        <div>保護されたコンテンツ</div>
      </ProtectedRoute>
    )

    // 子コンポーネントが表示されない
    expect(screen.queryByText('保護されたコンテンツ')).not.toBeInTheDocument()
  })
})
