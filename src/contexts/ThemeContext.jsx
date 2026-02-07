import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

// localStorageからテーマを読み込む（未設定時はOS設定を参照）
function loadTheme() {
  try {
    const saved = localStorage.getItem('todoAppTheme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch (err) {
    console.error('テーマの読み込みに失敗:', err)
  }
  // OS設定のカラースキームを参照し、未対応の場合はダークをデフォルトにする
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

// テーマプロバイダー：ライト/ダークモード管理
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(loadTheme)

  // テーマ変更時にdata属性とlocalStorageを更新
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('todoAppTheme', theme)
    } catch (err) {
      console.error('テーマの保存に失敗:', err)
    }
  }, [theme])

  // テーマ切替
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// テーマコンテキストフック
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeはThemeProvider内で使用してください')
  }
  return context
}
