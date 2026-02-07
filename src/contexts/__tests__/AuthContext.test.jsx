import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../AuthContext'

// テスト用のコンシューマーコンポーネント
function TestConsumer() {
  const { user, register, login, logout } = useAuth()

  return (
    <div>
      <p data-testid="user">{user ? JSON.stringify(user) : 'null'}</p>
      <button
        onClick={() => {
          try {
            register('テスト太郎', 'test@example.com', 'pass1234')
          } catch (err) {
            document.getElementById('error').textContent = err.message
          }
        }}
      >
        登録
      </button>
      <button
        onClick={() => {
          try {
            register('別ユーザー', 'test@example.com', 'pass5678')
          } catch (err) {
            document.getElementById('error').textContent = err.message
          }
        }}
      >
        重複登録
      </button>
      <button
        onClick={() => {
          try {
            login('test@example.com', 'pass1234')
          } catch (err) {
            document.getElementById('error').textContent = err.message
          }
        }}
      >
        ログイン
      </button>
      <button
        onClick={() => {
          try {
            login('test@example.com', 'wrongpass')
          } catch (err) {
            document.getElementById('error').textContent = err.message
          }
        }}
      >
        不正ログイン
      </button>
      <button onClick={logout}>ログアウト</button>
      <p id="error" data-testid="error"></p>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    // テストごとにlocalStorageをクリア
    localStorage.clear()
  })

  it('register: 新規ユーザー登録が成功する', async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // 初期状態はnull
    expect(screen.getByTestId('user').textContent).toBe('null')

    // 登録ボタンを押す
    await user.click(screen.getByText('登録'))

    // ユーザー情報が設定される
    const userData = JSON.parse(screen.getByTestId('user').textContent)
    expect(userData.name).toBe('テスト太郎')
    expect(userData.email).toBe('test@example.com')
    expect(userData.id).toBeDefined()
  })

  it('register: 既存メールで登録するとエラー', async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // まず正常に登録
    await user.click(screen.getByText('登録'))

    // 同じメールアドレスで重複登録を試みる
    await user.click(screen.getByText('重複登録'))

    // エラーメッセージが表示される
    expect(screen.getByTestId('error').textContent).toBe(
      'このメールアドレスは既に登録されています'
    )
  })

  it('login: 正しい認証情報でログイン成功', async () => {
    const user = userEvent.setup()

    // 事前にユーザーをlocalStorageに登録しておく
    const existingUsers = [
      { id: '123', name: 'テスト太郎', email: 'test@example.com', password: 'pass1234' },
    ]
    localStorage.setItem('todoAppUsers', JSON.stringify(existingUsers))

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // ログインボタンを押す
    await user.click(screen.getByText('ログイン'))

    // ユーザー情報が設定される
    const userData = JSON.parse(screen.getByTestId('user').textContent)
    expect(userData.name).toBe('テスト太郎')
    expect(userData.email).toBe('test@example.com')
  })

  it('login: 間違ったパスワードでエラー', async () => {
    const user = userEvent.setup()

    // 事前にユーザーをlocalStorageに登録しておく
    const existingUsers = [
      { id: '123', name: 'テスト太郎', email: 'test@example.com', password: 'pass1234' },
    ]
    localStorage.setItem('todoAppUsers', JSON.stringify(existingUsers))

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // 不正なパスワードでログインを試みる
    await user.click(screen.getByText('不正ログイン'))

    // エラーメッセージが表示される
    expect(screen.getByTestId('error').textContent).toBe(
      'メールアドレスまたはパスワードが正しくありません'
    )
  })

  it('logout: ログアウトでuserがnullになる', async () => {
    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // まず登録してログイン状態にする
    await user.click(screen.getByText('登録'))
    expect(screen.getByTestId('user').textContent).not.toBe('null')

    // ログアウト
    await user.click(screen.getByText('ログアウト'))
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('localStorageにユーザー情報が保存される', async () => {
    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // 登録する
    await user.click(screen.getByText('登録'))

    // localStorageにユーザー情報が保存されている
    const savedUser = JSON.parse(localStorage.getItem('todoAppUser'))
    expect(savedUser.name).toBe('テスト太郎')
    expect(savedUser.email).toBe('test@example.com')

    // ユーザー一覧にも保存されている
    const users = JSON.parse(localStorage.getItem('todoAppUsers'))
    expect(users.length).toBe(1)
    expect(users[0].email).toBe('test@example.com')
  })
})
