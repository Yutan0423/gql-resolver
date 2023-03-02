import {
  findAllByAltText,
  findAllByRole,
  findByText,
  getAllByRole,
  screen,
  waitFor,
} from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { customRender } from '@/libs/test'

import TaskList from './TodoList'

describe('components', () => {
  test('Should loading text correctly', () => {
    // Arrange
    customRender(<TaskList />)
    // Act
    // Assert
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('Should render TodoList correctly', async () => {
    // Arrange
    customRender(<TaskList />)
    // Act
    // Assert
    expect(await screen.findByText('Todo List')).toBeInTheDocument()
  })

  test('Should add todo item correctly', async () => {
    // Arrange
    const { user } = customRender(<TaskList />)
    const textbox = await screen.findByRole('textbox')
    // Act
    await user.type(textbox, 'testAddTodo')
    await user.click(screen.getByRole('button', { name: '追加' }))
    // Assert
    expect(await screen.findByText('testAddTodo')).toBeInTheDocument()
  })

  test('Should update todo completed correctly', async () => {
    // Arrange
    const { user } = customRender(<TaskList />)
    const checkbox = (await screen.findAllByRole('checkbox'))[0]
    // Act
    await user.click(checkbox)
    // Assert
    await waitFor((): undefined => void expect(checkbox).toBeChecked())
  })

  test('Should delete correctly', async () => {
    // Arrange
    const { user } = customRender(<TaskList />)
    const windowConfirmSpy = vi.spyOn(window, 'confirm')
    windowConfirmSpy.mockImplementation(() => true)
    // Act
    await waitFor(
      () => void expect(screen.getAllByRole('listitem').length).toBe(2)
    )
    await user.click((await screen.findAllByRole('button', { name: '🗑' }))[0])
    // Assert
    await waitFor(
      () => void expect(screen.getAllByRole('listitem').length).toBe(1)
    )
    windowConfirmSpy.mockRestore()
  })
})
