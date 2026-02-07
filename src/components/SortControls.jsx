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
    <div className="sort-controls">
      <span className="sort-label">並び替え:</span>
      {modes.map(mode => (
        <button
          key={mode.id}
          className={`sort-btn ${sortMode === mode.id ? 'active' : ''}`}
          onClick={() => setSortMode(mode.id)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}

export default SortControls
