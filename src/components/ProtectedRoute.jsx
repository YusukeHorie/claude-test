import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * 認証ガードコンポーネント
 * 未認証ユーザーを/loginにリダイレクトし、認証済みユーザーのみ子コンポーネントを表示する
 * 認証状態読み込み中はローディング画面を表示する
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - 認証済み時に表示する子コンポーネント
 * @returns {JSX.Element}
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // 認証状態の読み込み中はローディング表示
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-base" style={{ color: 'var(--text-secondary)' }}>
        <p>読み込み中...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
