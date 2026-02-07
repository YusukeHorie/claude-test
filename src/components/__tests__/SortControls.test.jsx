import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import SortControls from '../SortControls'

describe('SortControls', () => {
  it('3つのソートモードが表示される', () => {
    const setSortMode = vi.fn()
    render(<SortControls sortMode="manual" setSortMode={setSortMode} />)

    // 3つのモードボタンが表示される
    expect(screen.getByText('手動')).toBeInTheDocument()
    expect(screen.getByText('期限順')).toBeInTheDocument()
    expect(screen.getByText('優先度順')).toBeInTheDocument()

    // ラベルも表示される
    expect(screen.getByText('並び替え:')).toBeInTheDocument()
  })

  it('クリックでモード切替', async () => {
    const user = userEvent.setup()
    const setSortMode = vi.fn()
    render(<SortControls sortMode="manual" setSortMode={setSortMode} />)

    // 期限順ボタンをクリック
    await user.click(screen.getByText('期限順'))
    expect(setSortMode).toHaveBeenCalledWith('dueDate')

    // 優先度順ボタンをクリック
    await user.click(screen.getByText('優先度順'))
    expect(setSortMode).toHaveBeenCalledWith('priority')

    // 手動ボタンをクリック
    await user.click(screen.getByText('手動'))
    expect(setSortMode).toHaveBeenCalledWith('manual')
  })
})
