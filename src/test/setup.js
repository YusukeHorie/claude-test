import '@testing-library/jest-dom'

// Node.js v22+の組み込みlocalStorageがjsdomと競合するため、
// Web Storage API準拠のモックで上書きする
class StorageMock {
  constructor() {
    this._store = {}
  }
  get length() {
    return Object.keys(this._store).length
  }
  key(index) {
    return Object.keys(this._store)[index] ?? null
  }
  getItem(key) {
    return this._store[key] ?? null
  }
  setItem(key, value) {
    this._store[key] = String(value)
  }
  removeItem(key) {
    delete this._store[key]
  }
  clear() {
    this._store = {}
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new StorageMock(),
  writable: true,
  configurable: true,
})
