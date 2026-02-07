import { createContext, useContext, useState } from 'react'

/**
 * 認証コンテキスト
 * @type {React.Context<{user: Object|null, loading: boolean, register: Function, login: Function, logout: Function}|null>}
 */
const AuthContext = createContext(null)

/**
 * localStorageから保存済みのユーザー情報を読み込む
 * @returns {Object|null} ユーザー情報オブジェクト（{id, name, email}）、または未保存時はnull
 */
function loadInitialUser() {
  try {
    const saved = localStorage.getItem('todoAppUser')
    if (saved) return JSON.parse(saved)
  } catch (err) {
    console.error('ユーザー情報の復元に失敗:', err)
  }
  return null
}

/**
 * 認証プロバイダーコンポーネント
 * localStorageを使用した模擬認証機能を提供する
 * ユーザー登録、ログイン、ログアウトの機能をコンテキストで配信する
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子コンポーネント
 * @returns {JSX.Element}
 * @provides {{user: Object|null, loading: boolean, register: Function, login: Function, logout: Function}}
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadInitialUser)

  // ユーザー新規登録
  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('todoAppUsers') || '[]')

    // メール重複チェック
    if (users.some(u => u.email === email)) {
      throw new Error('このメールアドレスは既に登録されています')
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
    }

    users.push(newUser)
    localStorage.setItem('todoAppUsers', JSON.stringify(users))

    // 登録後すぐにログイン状態にする
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email }
    localStorage.setItem('todoAppUser', JSON.stringify(userData))
    setUser(userData)

    return userData
  }

  // ログイン
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('todoAppUsers') || '[]')
    const found = users.find(u => u.email === email && u.password === password)

    if (!found) {
      throw new Error('メールアドレスまたはパスワードが正しくありません')
    }

    const userData = { id: found.id, name: found.name, email: found.email }
    localStorage.setItem('todoAppUser', JSON.stringify(userData))
    setUser(userData)

    return userData
  }

  // ログアウト
  const logout = () => {
    localStorage.removeItem('todoAppUser')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading: false, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * 認証コンテキストを使用するカスタムフック
 * AuthProvider内でのみ使用可能
 * @returns {{user: Object|null, loading: boolean, register: Function, login: Function, logout: Function}}
 * @throws {Error} AuthProvider外で使用した場合にエラーをスローする
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthはAuthProvider内で使用してください')
  }
  return context
}
