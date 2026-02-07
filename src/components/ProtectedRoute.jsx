import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 認証ガードコンポーネント：未認証時は/loginにリダイレクト
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // 認証状態の読み込み中はローディング表示
  if (loading) {
    return (
      <div className="loading-screen">
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
