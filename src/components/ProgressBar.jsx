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
    <div className="mb-5">
      <div
        className="h-1.5 rounded-sm overflow-hidden"
        style={{ background: 'var(--progress-track)' }}
        role="progressbar"
        aria-valuenow={doneCount}
        aria-valuemin={0}
        aria-valuemax={totalCount}
        aria-label="進捗"
      >
        <div
          className="progress-fill-gradient h-full rounded-sm transition-[width] duration-500"
          style={{ width: `${progress}%`, transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </div>
      <p className="text-right text-[0.8rem] mt-1.5" style={{ color: 'var(--text-secondary)' }}>
        {doneCount} / {totalCount} 完了
      </p>
    </div>
  )
}

export default ProgressBar
