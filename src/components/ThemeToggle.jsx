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
      className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[1.1rem] cursor-pointer transition-all duration-300 shrink-0 hover:scale-110"
      style={{
        border: '1px solid var(--input-border)',
        background: 'var(--theme-toggle-bg)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--theme-toggle-hover-bg)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--theme-toggle-bg)'}
      onClick={toggleTheme}
      title={theme === 'dark' ? 'ライトモードに切替' : 'ダークモードに切替'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

export default ThemeToggle
