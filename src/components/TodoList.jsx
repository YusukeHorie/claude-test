import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import SortableItem from './SortableItem'

/**
 * Todoリストコンポーネント
 * DndContextとSortableContextでラップし、ドラッグ&ドロップ対応のリストを描画する
 * PointerSensorを使用し、5px以上の移動でドラッグが有効化される
 * @component
 * @param {Object} props
 * @param {Array<{id: number, text: string, done: boolean, category: string, priority: string, dueDate: string|null}>} props.todos - 表示するTodo配列
 * @param {Function} props.onDragEnd - ドラッグ終了時のコールバック
 * @param {Function} props.toggleTodo - Todo完了状態を切り替えるコールバック。TodoのIDを引数に取る
 * @param {Function} props.deleteTodo - Todo削除コールバック。TodoのIDを引数に取る
 * @param {boolean} props.dragDisabled - ドラッグ無効化フラグ（ソートモードが手動以外の場合にtrue）
 * @returns {JSX.Element}
 */
function TodoList({ todos, onDragEnd, toggleTodo, deleteTodo, dragDisabled }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={todos.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="todo-list">
          {todos.map(todo => (
            <SortableItem
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              dragDisabled={dragDisabled}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}

export default TodoList
