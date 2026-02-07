// 進捗バーコンポーネント
function ProgressBar({ doneCount, totalCount }) {
  const progress = totalCount > 0 ? (doneCount / totalCount) * 100 : 0

  if (totalCount === 0) return null

  return (
    <div className="progress-section">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-text">{doneCount} / {totalCount} 完了</p>
    </div>
  )
}

export default ProgressBar
