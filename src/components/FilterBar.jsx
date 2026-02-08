import { useCategories } from '../contexts/CategoryContext'

/**
 * カテゴリフィルターバーコンポーネント
 * 「すべて」ボタンと各カテゴリのフィルターボタン、カテゴリ管理ボタンを表示する
 * @component
 * @param {Object} props
 * @param {string} props.filterCategory - 現在選択中のフィルターカテゴリID（'all'で全表示）
 * @param {Function} props.setFilterCategory - フィルターカテゴリ変更コールバック。カテゴリIDを引数に取る
 * @param {Function} props.onOpenCategoryManager - カテゴリ管理モーダルを開くコールバック
 * @returns {JSX.Element}
 */
function FilterBar({ filterCategory, setFilterCategory, onOpenCategoryManager }) {
  const { categories } = useCategories()

  // フィルターボタンの基本スタイル
  const baseBtnClass = "flex items-center gap-1 px-3 py-1.5 text-[0.78rem] rounded-full cursor-pointer transition-all duration-300"

  return (
    <div className="flex gap-1.5 mb-3 flex-wrap items-center">
      <button
        className={`${baseBtnClass} ${filterCategory === 'all'
          ? 'shadow-sm'
          : 'hover:text-[var(--text-primary)]'
        }`}
        style={filterCategory === 'all'
          ? { color: 'var(--text-primary)', background: 'var(--btn-filter-active-bg)', border: '1px solid var(--btn-filter-active-border)' }
          : { color: 'var(--text-secondary)', background: 'var(--btn-filter-bg)', border: '1px solid var(--btn-filter-border)' }
        }
        onMouseEnter={(e) => { if (filterCategory !== 'all') e.currentTarget.style.background = 'var(--btn-filter-hover-bg)' }}
        onMouseLeave={(e) => { if (filterCategory !== 'all') e.currentTarget.style.background = 'var(--btn-filter-bg)' }}
        onClick={() => setFilterCategory('all')}
      >
        すべて
      </button>
      {categories.filter(c => c.id !== 'none').map(c => (
        <button
          key={c.id}
          className={`${baseBtnClass} ${filterCategory === c.id
            ? 'shadow-sm'
            : 'hover:text-[var(--text-primary)]'
          }`}
          style={filterCategory === c.id
            ? { color: 'var(--text-primary)', background: 'var(--btn-filter-active-bg)', border: '1px solid var(--btn-filter-active-border)' }
            : { color: 'var(--text-secondary)', background: 'var(--btn-filter-bg)', border: '1px solid var(--btn-filter-border)' }
          }
          onMouseEnter={(e) => { if (filterCategory !== c.id) e.currentTarget.style.background = 'var(--btn-filter-hover-bg)' }}
          onMouseLeave={(e) => { if (filterCategory !== c.id) e.currentTarget.style.background = 'var(--btn-filter-bg)' }}
          onClick={() => setFilterCategory(c.id)}
        >
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
          {c.label}
        </button>
      ))}
      {/* カテゴリ管理ボタン */}
      <button
        className={`${baseBtnClass} text-[0.9rem] px-2.5`}
        style={{ color: 'var(--text-secondary)', background: 'var(--btn-filter-bg)', border: '1px solid var(--btn-filter-border)' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--btn-filter-hover-bg)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--btn-filter-bg)'}
        onClick={onOpenCategoryManager}
        title="カテゴリ管理"
      >
        ⚙
      </button>
    </div>
  )
}

export default FilterBar
