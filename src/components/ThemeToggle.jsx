import { useTheme } from '../contexts/ThemeContext'

/**
 * テーマ切替トグルボタンコンポーネント
 * ダークモード時は太陽アイコン、ライトモード時は月アイコンを表示する
 * @component
 * @returns {JSX.Element}
 */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'ライトモードに切替' : 'ダークモードに切替'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

export default ThemeToggle
