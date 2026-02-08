import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from './ThemeToggle'

/**
 * ログイン・新規登録ページコンポーネント
 * タブ切替でログインと新規登録フォームを表示する
 * バリデーション後、認証成功時にルートページへ遷移する
 * @component
 * @returns {JSX.Element}
 */
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
    <div className="flex justify-center items-center min-h-screen p-8">
      <div
        className="relative max-w-[420px] w-full px-8 py-10 rounded-[20px] overflow-hidden transition-all duration-300"
        style={{ background: 'var(--card-gradient)', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}
      >
        {/* テーマ切替 */}
        <div className="absolute top-5 right-5 z-10">
          <ThemeToggle />
        </div>

        {/* グロー背景 */}
        <div className="glow-bg-effect absolute -top-20 -right-20 w-[250px] h-[250px] pointer-events-none" />

        {/* タイトル */}
        <h1 className="gradient-title text-center text-[2rem] font-bold mb-6">
          <span className="inline-block" style={{ animation: 'bounce-icon 2s ease-in-out infinite' }}>&#10003;</span> Todo App
        </h1>

        {/* タブ切替 */}
        <div
          className="flex mb-6 rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--tab-border)' }}
        >
          <button
            className={`flex-1 py-3 text-[0.85rem] font-semibold border-none cursor-pointer transition-all duration-300 ${
              !isRegister ? 'tab-active' : ''
            }`}
            style={isRegister
              ? { color: 'var(--text-secondary)', background: 'var(--tab-bg)' }
              : undefined
            }
            onMouseEnter={(e) => { if (isRegister) { e.currentTarget.style.background = 'var(--tab-hover-bg)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
            onMouseLeave={(e) => { if (isRegister) { e.currentTarget.style.background = 'var(--tab-bg)'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
            onClick={() => { if (isRegister) switchMode() }}
          >
            ログイン
          </button>
          <button
            className={`flex-1 py-3 text-[0.85rem] font-semibold border-none cursor-pointer transition-all duration-300 ${
              isRegister ? 'tab-active' : ''
            }`}
            style={!isRegister
              ? { color: 'var(--text-secondary)', background: 'var(--tab-bg)' }
              : undefined
            }
            onMouseEnter={(e) => { if (!isRegister) { e.currentTarget.style.background = 'var(--tab-hover-bg)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
            onMouseLeave={(e) => { if (!isRegister) { e.currentTarget.style.background = 'var(--tab-bg)'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
            onClick={() => { if (!isRegister) switchMode() }}
          >
            新規登録
          </button>
        </div>

        {/* エラー表示 */}
        {error && (
          <p
            className="text-red-500 text-[0.82rem] text-center mb-4 p-2 bg-red-500/10 rounded-lg"
            style={{ animation: 'fade-in 0.3s ease' }}
          >
            {error}
          </p>
        )}

        {/* フォーム */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="flex flex-col gap-1">
              <label className="text-[0.8rem]" style={{ color: 'var(--text-secondary)' }}>名前</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="お名前"
                className="px-4 py-3 text-[0.95rem] rounded-xl outline-none transition-all duration-300 focus-indigo"
                style={{ color: 'var(--text-primary)', background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-[0.8rem]" style={{ color: 'var(--text-secondary)' }}>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="px-4 py-3 text-[0.95rem] rounded-xl outline-none transition-all duration-300 focus-indigo"
              style={{ color: 'var(--text-primary)', background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[0.8rem]" style={{ color: 'var(--text-secondary)' }}>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              className="px-4 py-3 text-[0.95rem] rounded-xl outline-none transition-all duration-300 focus-indigo"
              style={{ color: 'var(--text-primary)', background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
            />
          </div>
          {isRegister && (
            <div className="flex flex-col gap-1">
              <label className="text-[0.8rem]" style={{ color: 'var(--text-secondary)' }}>パスワード確認</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="パスワード（再入力）"
                className="px-4 py-3 text-[0.95rem] rounded-xl outline-none transition-all duration-300 focus-indigo"
                style={{ color: 'var(--text-primary)', background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
              />
            </div>
          )}
          <button
            type="submit"
            className="btn-primary-gradient mt-2 py-3 text-base font-semibold text-white border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isRegister ? '登録する' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
