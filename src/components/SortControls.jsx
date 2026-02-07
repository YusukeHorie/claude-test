// ソート切替コンポーネント（手動/期限/優先度）
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
