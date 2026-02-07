import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { CategoryProvider } from './contexts/CategoryContext'
import LoginPage from './components/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import TodoApp from './components/TodoApp'
import './App.css'

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
  )
}

export default App
