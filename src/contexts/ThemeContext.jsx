import { createContext, useContext, useState, useEffect } from 'react'

/**
 * テーマコンテキスト
 * @type {React.Context<{theme: string, toggleTheme: Function}|null>}
 */
const ThemeContext = createContext(null)

/**
 * localStorageからテーマ設定を読み込む
 * 未設定時はOSのカラースキーム設定を参照し、デフォルトはダークモード
 * @returns {'light'|'dark'} テーマ文字列
 */
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

/**
 * テーマプロバイダーコンポーネント
 * ライト/ダークモードの切替機能を提供し、data-theme属性とlocalStorageに同期する
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子コンポーネント
 * @returns {JSX.Element}
 * @provides {{theme: 'light'|'dark', toggleTheme: Function}}
 */
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

/**
 * テーマコンテキストを使用するカスタムフック
 * ThemeProvider内でのみ使用可能
 * @returns {{theme: 'light'|'dark', toggleTheme: Function}}
 * @throws {Error} ThemeProvider外で使用した場合にエラーをスローする
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeはThemeProvider内で使用してください')
  }
  return context
}
