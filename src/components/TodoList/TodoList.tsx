import type { FC, FormEventHandler } from 'react'
import { useEffect, useState } from 'react'

import type { TodosQuery } from '@/generated/request'
import {
  useAddTodoMutation,
  useDeleteTodoMutation,
  useTodosQuery,
  useUpdateTodoMutation,
} from '@/generated/request'

const TodoList: FC = () => {
  const [title, setTitle] = useState<string>('')
  const [todos, setTodos] = useState<TodosQuery['todos']>([])
  const { loading, error, data, refetch } = useTodosQuery()
  const [addTodoMutation] = useAddTodoMutation()
  const [updateTodoMutation] = useUpdateTodoMutation()
  const [deleteTodoMutation] = useDeleteTodoMutation()

  useEffect(() => {
    setTodos(data?.todos ?? [])
  }, [data?.todos])

  const handleSubmit: FormEventHandler<HTMLElement> = async (
    e
  ): Promise<void> => {
    e.preventDefault()
    const { data } = await addTodoMutation({
      variables: {
        title,
      },
    })
    const addedTodo = data?.addTodo
    if (!addedTodo) return
    setTodos([addedTodo, ...todos])
    setTitle('')
    await refetch()
  }

  const handleDelete = async (todoId: string): Promise<void> => {
    const isOK = confirm('削除しますか？')
    if (!isOK) return

    const { data } = await deleteTodoMutation({
      variables: { todoId },
    })
    const deletedTodo = data?.deleteTodo
    if (!deletedTodo) return
    const newTodos = todos.filter((todo) => todo.id !== deletedTodo.id)
    setTodos(newTodos)
  }

  const handleChange = async (
    todoId: string,
    completed: boolean
  ): Promise<void> => {
    const { data } = await updateTodoMutation({
      variables: { todoId, completed },
    })
    const updatedTodo = data?.updateTodo
    if (!updatedTodo) return

    const updatedTodos = todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    )
    setTodos(updatedTodos)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error!</div>

  return (
    <div className="p-5 border rounded" onSubmit={handleSubmit}>
      <h3>Todo List</h3>
      <form className="flex gap-2">
        <input
          type="text"
          className="p-2 border"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="bg-gray-200 p-2">追加</button>
      </form>
      <ul className="mt-5">
        {todos &&
          todos.map((todo) => (
            <li className={`${todo.completed && 'line-through'}`} key={todo.id}>
              <span>{todo.completed ? '🙌 ' : '💪 '}</span>
              <span>{todo.title}</span>{' '}
              <input
                className="cursor-pointer"
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => handleChange(todo.id, e.target.checked)}
              />
              <span> / </span>
              <button onClick={() => handleDelete(todo.id)}>🗑</button>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default TodoList
