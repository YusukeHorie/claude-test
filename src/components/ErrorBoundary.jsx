import { Component } from 'react'

/**
 * エラーバウンダリコンポーネント
 * 子コンポーネントのレンダリングエラーをキャッチし、フォールバックUIを表示する
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子コンポーネント
 * @returns {JSX.Element}
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('アプリケーションエラー:', error, errorInfo)
  }

  // エラー状態をリセット
  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center min-h-[60vh] p-8">
          <div
            className="max-w-[400px] text-center px-8 py-10 rounded-[20px]"
            style={{ background: 'var(--card-gradient)', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}
          >
            <h2 className="text-xl font-bold text-red-500 mb-3">エラーが発生しました</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {this.state.error?.message || '予期しないエラーが発生しました'}
            </p>
            <button
              onClick={this.handleReset}
              className="btn-primary-gradient px-6 py-2.5 rounded-xl text-sm font-semibold text-white border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
            >
              再試行
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
