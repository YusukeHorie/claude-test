import { useCategories } from '../contexts/CategoryContext'

// カテゴリフィルターバーコンポーネント
function FilterBar({ filterCategory, setFilterCategory, onOpenCategoryManager }) {
  const { categories } = useCategories()

  return (
    <div className="filter-bar">
      <button
        className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
        onClick={() => setFilterCategory('all')}
      >
        すべて
      </button>
      {categories.filter(c => c.id !== 'none').map(c => (
        <button
          key={c.id}
          className={`filter-btn ${filterCategory === c.id ? 'active' : ''}`}
          style={{ '--cat-color': c.color }}
          onClick={() => setFilterCategory(c.id)}
        >
          <span className="filter-dot" style={{ background: c.color }} />
          {c.label}
        </button>
      ))}
      {/* カテゴリ管理ボタン */}
      <button
        className="filter-btn category-manage-btn"
        onClick={onOpenCategoryManager}
        title="カテゴリ管理"
      >
        ⚙
      </button>
    </div>
  )
}

export default FilterBar
