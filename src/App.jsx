import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { CategoryProvider } from './contexts/CategoryContext'
import ErrorBoundary from './components/ErrorBoundary'
import LoginPage from './components/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import TodoApp from './components/TodoApp'

/**
 * ルーティングシェルコンポーネント
 * ログインページと認証保護されたTodoアプリのルートを定義する
 * 認証済みユーザーにはCategoryProviderをユーザーIDに紐づけて提供する
 * @component
 * @returns {JSX.Element}
 */
function App() {
  const { user } = useAuth()

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CategoryProvider key={user?.id} userId={user?.id}>
                <TodoApp />
              </CategoryProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
