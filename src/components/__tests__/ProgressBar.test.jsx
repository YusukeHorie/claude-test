import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProgressBar from '../ProgressBar'

describe('ProgressBar', () => {
  it('進捗率が正しく表示される', () => {
    render(<ProgressBar doneCount={3} totalCount={10} />)

    // 「3 / 10 完了」テキストが表示される
    expect(screen.getByText('3 / 10 完了')).toBeInTheDocument()

    // プログレスバーのfillが30%幅で表示される
    const fill = document.querySelector('.progress-fill-gradient')
    expect(fill).toHaveStyle({ width: '30%' })
  })

  it('0件時の表示', () => {
    const { container } = render(<ProgressBar doneCount={0} totalCount={0} />)

    // totalCountが0の場合はnullを返す（何もレンダリングされない）
    expect(container.firstChild).toBeNull()
  })

  it('全完了時の表示', () => {
    render(<ProgressBar doneCount={5} totalCount={5} />)

    // 「5 / 5 完了」テキストが表示される
    expect(screen.getByText('5 / 5 完了')).toBeInTheDocument()

    // プログレスバーのfillが100%幅で表示される
    const fill = document.querySelector('.progress-fill-gradient')
    expect(fill).toHaveStyle({ width: '100%' })
  })
})
