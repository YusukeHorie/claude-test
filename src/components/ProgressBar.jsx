/**
 * 進捗バーコンポーネント
 * 完了数と総数から進捗率を計算し、バーとテキストで表示する
 * Todoが0件の場合は何も表示しない
 * @component
 * @param {Object} props
 * @param {number} props.doneCount - 完了済みTodo数
 * @param {number} props.totalCount - 全Todo数
 * @returns {JSX.Element|null} Todoが0件の場合はnullを返す
 */
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
