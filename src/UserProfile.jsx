import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

// ユーザープロフィールの表示・編集コンポーネント
function UserProfile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState({ userName: '', userEmail: '' })
  const [saveMessage, setSaveMessage] = useState('')

  // ログアウト処理
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // 編集モードを開始
  const handleStartEdit = () => {
    setEditFormData({
      userName: user?.name || '',
      userEmail: user?.email || '',
    })
    setIsEditing(true)
    setSaveMessage('')
  }

  // 編集をキャンセル
  const handleCancel = () => {
    setIsEditing(false)
    setSaveMessage('')
  }

  // プロフィールを保存
  const handleSave = () => {
    try {
      const trimmedName = editFormData.userName.trim()
      const trimmedEmail = editFormData.userEmail.trim()

      // バリデーション
      if (!trimmedName) {
        setSaveMessage('名前を入力してください')
        return
      }
      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        setSaveMessage('有効なメールアドレスを入力してください')
        return
      }

      // localStorageのユーザー情報を更新
      const users = JSON.parse(localStorage.getItem('todoAppUsers') || '[]')
      const updatedUsers = users.map(u =>
        u.id === user.id ? { ...u, name: trimmedName, email: trimmedEmail } : u
      )
      localStorage.setItem('todoAppUsers', JSON.stringify(updatedUsers))

      // 現在のユーザー情報も更新
      const updatedUser = { ...user, name: trimmedName, email: trimmedEmail }
      localStorage.setItem('todoAppUser', JSON.stringify(updatedUser))

      setIsEditing(false)
      setSaveMessage('保存しました')

      // 保存メッセージを3秒後にクリア
      setTimeout(() => setSaveMessage(''), 3000)
    } catch {
      setSaveMessage('保存に失敗しました')
    }
  }

  if (!user) return null

  return (
    <div className="relative max-w-[560px] w-full mx-auto mt-6 p-8 rounded-2xl overflow-hidden transition-all duration-300"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}
    >
      {/* 背景のグロー */}
      <div className="absolute -bottom-20 -left-20 w-[200px] h-[200px] pointer-events-none animate-pulse rounded-full"
        style={{ background: 'var(--profile-glow)' }}
      />

      {/* タイトル */}
      <h2 className="text-center text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
        プロフィール
      </h2>

      {isEditing ? (
        // 編集モード
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">名前</label>
            <input
              type="text"
              value={editFormData.userName}
              onChange={(e) => setEditFormData({ ...editFormData, userName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] outline-none border border-[var(--input-border)] bg-[var(--input-bg)] transition-all duration-300 focus:border-emerald-400 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] focus:bg-[var(--input-focus-bg)]"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">メールアドレス</label>
            <input
              type="email"
              value={editFormData.userEmail}
              onChange={(e) => setEditFormData({ ...editFormData, userEmail: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] outline-none border border-[var(--input-border)] bg-[var(--input-bg)] transition-all duration-300 focus:border-emerald-400 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] focus:bg-[var(--input-focus-bg)]"
            />
          </div>

          {/* 保存・キャンセルボタン */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white border-none cursor-pointer transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(16,185,129,0.45)] active:translate-y-0"
            >
              保存
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-secondary)] border border-[var(--input-border)] bg-[var(--input-bg)] cursor-pointer transition-all duration-300 hover:bg-[var(--btn-filter-hover-bg)] hover:text-[var(--text-primary)]"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        // 表示モード
        <div className="flex flex-col gap-4">
          {/* アバター */}
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-3xl font-bold text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)]">
              {user.name.charAt(0)}
            </div>
          </div>

          {/* プロフィール情報 */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-[var(--todo-item-bg)] border border-[var(--todo-item-border)]">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-muted)] w-20 shrink-0">名前</span>
              <span className="text-[var(--text-primary)]">{user.name}</span>
            </div>
            <div className="h-px bg-[var(--input-bg)]" />
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-muted)] w-20 shrink-0">メール</span>
              <span className="text-[var(--text-primary)]">{user.email}</span>
            </div>
          </div>

          {/* 編集・ログアウトボタン */}
          <button
            onClick={handleStartEdit}
            className="mt-2 py-2.5 rounded-xl text-sm font-semibold text-white border-none cursor-pointer transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(16,185,129,0.45)] active:translate-y-0"
          >
            編集する
          </button>
          <button
            onClick={handleLogout}
            className="py-2.5 rounded-xl text-sm font-semibold text-[var(--text-secondary)] border border-[var(--input-border)] bg-[var(--input-bg)] cursor-pointer transition-all duration-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
          >
            ログアウト
          </button>
        </div>
      )}

      {/* 保存結果メッセージ */}
      {saveMessage && (
        <p className={`text-center text-sm mt-4 animate-[fadeIn_0.3s_ease] ${
          saveMessage.includes('しました') ? 'text-emerald-400' : 'text-red-400'
        }`}>
          {saveMessage}
        </p>
      )}
    </div>
  )
}

export default UserProfile
