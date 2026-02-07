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
    <div className="relative max-w-[560px] w-full mx-auto mt-6 p-8 rounded-2xl border border-white/[0.06] overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)' }}
    >
      {/* 背景のグロー */}
      <div className="absolute -bottom-20 -left-20 w-[200px] h-[200px] pointer-events-none animate-pulse rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent 70%)' }}
      />

      {/* タイトル */}
      <h2 className="text-center text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
        プロフィール
      </h2>

      {isEditing ? (
        // 編集モード
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">名前</label>
            <input
              type="text"
              value={editFormData.userName}
              onChange={(e) => setEditFormData({ ...editFormData, userName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm text-gray-200 outline-none border border-white/10 bg-white/5 transition-all duration-300 focus:border-emerald-400 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] focus:bg-white/[0.08]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">メールアドレス</label>
            <input
              type="email"
              value={editFormData.userEmail}
              onChange={(e) => setEditFormData({ ...editFormData, userEmail: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm text-gray-200 outline-none border border-white/10 bg-white/5 transition-all duration-300 focus:border-emerald-400 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] focus:bg-white/[0.08]"
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
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-400 border border-white/10 bg-white/5 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:text-gray-200"
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
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-20 shrink-0">名前</span>
              <span className="text-gray-200">{user.name}</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-20 shrink-0">メール</span>
              <span className="text-gray-200">{user.email}</span>
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
            className="py-2.5 rounded-xl text-sm font-semibold text-gray-400 border border-white/10 bg-white/5 cursor-pointer transition-all duration-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
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
