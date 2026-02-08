/**
 * ソート切替コンポーネント
 * 手動（ドラッグ&ドロップ）、期限順、優先度順の3モードを切り替える
 * @component
 * @param {Object} props
 * @param {'manual'|'dueDate'|'priority'} props.sortMode - 現在のソートモード
 * @param {Function} props.setSortMode - ソートモード変更コールバック。ソートモードIDを引数に取る
 * @returns {JSX.Element}
 */
function SortControls({ sortMode, setSortMode }) {
  const modes = [
    { id: 'manual', label: '手動' },
    { id: 'dueDate', label: '期限順' },
    { id: 'priority', label: '優先度順' },
  ]

  return (
    <div className="flex items-center gap-1.5 mb-4">
      <span className="text-[0.75rem] mr-0.5" style={{ color: 'var(--text-muted)' }}>並び替え:</span>
      {modes.map(mode => (
        <button
          key={mode.id}
          className={`px-2.5 py-1 text-[0.73rem] rounded-2xl cursor-pointer transition-all duration-300 ${
            sortMode === mode.id
              ? 'sort-active'
              : 'hover:text-[var(--text-primary)]'
          }`}
          style={sortMode === mode.id
            ? undefined
            : { color: 'var(--text-secondary)', background: 'var(--sort-btn-bg)', border: '1px solid var(--sort-btn-border)' }
          }
          onMouseEnter={(e) => { if (sortMode !== mode.id) e.currentTarget.style.background = 'var(--sort-btn-hover-bg)' }}
          onMouseLeave={(e) => { if (sortMode !== mode.id) e.currentTarget.style.background = 'var(--sort-btn-bg)' }}
          onClick={() => setSortMode(mode.id)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}

export default SortControls
