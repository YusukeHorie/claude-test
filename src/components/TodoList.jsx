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

// DndContext + SortableContextラッパーコンポーネント
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
