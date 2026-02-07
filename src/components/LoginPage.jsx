import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from './ThemeToggle'

// ログイン・新規登録ページコンポーネント
function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const { register, login } = useAuth()
  const navigate = useNavigate()

  // フォーム送信処理
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    try {
      if (isRegister) {
        // 新規登録バリデーション
        if (!name.trim()) {
          setError('名前を入力してください')
          return
        }
        if (!email.trim() || !email.includes('@')) {
          setError('有効なメールアドレスを入力してください')
          return
        }
        if (password.length < 4) {
          setError('パスワードは4文字以上で入力してください')
          return
        }
        if (password !== confirmPassword) {
          setError('パスワードが一致しません')
          return
        }

        register(name.trim(), email.trim(), password)
      } else {
        // ログインバリデーション
        if (!email.trim()) {
          setError('メールアドレスを入力してください')
          return
        }
        if (!password) {
          setError('パスワードを入力してください')
          return
        }

        login(email.trim(), password)
      }

      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  // タブ切替
  const switchMode = () => {
    setIsRegister(!isRegister)
    setError('')
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-theme-toggle">
          <ThemeToggle />
        </div>
        <div className="login-glow" />
        <h1 className="login-title">
          <span className="title-icon">&#10003;</span> Todo App
        </h1>

        {/* タブ切替 */}
        <div className="login-tabs">
          <button
            className={`login-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => switchMode()}
          >
            ログイン
          </button>
          <button
            className={`login-tab ${isRegister ? 'active' : ''}`}
            onClick={() => switchMode()}
          >
            新規登録
          </button>
        </div>

        {error && <p className="login-error">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="login-field">
              <label>名前</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="お名前"
              />
            </div>
          )}
          <div className="login-field">
            <label>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div className="login-field">
            <label>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
            />
          </div>
          {isRegister && (
            <div className="login-field">
              <label>パスワード確認</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="パスワード（再入力）"
              />
            </div>
          )}
          <button type="submit" className="login-submit">
            {isRegister ? '登録する' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
