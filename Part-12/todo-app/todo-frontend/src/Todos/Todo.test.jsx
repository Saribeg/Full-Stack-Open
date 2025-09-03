import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Todo from "./Todo"

describe("Todo component", () => {
  const sampleTodoDone = { id: 1, text: "Done task", done: true }
  const sampleTodoNotDone = { id: 2, text: "Not done task", done: false }

  test("renders todo text", () => {
    render(<Todo todo={sampleTodoDone} deleteTodo={() => {}} completeTodo={() => {}} />)
    expect(screen.getByText("Done task")).toBeInTheDocument()
  })

  test("shows 'This todo is done' when done = true", () => {
    render(<Todo todo={sampleTodoDone} deleteTodo={() => {}} completeTodo={() => {}} />)
    expect(screen.getByText("This todo is done")).toBeInTheDocument()
    expect(screen.queryByText("This todo is not done")).not.toBeInTheDocument()
  })

  test("shows 'This todo is not done' when done = false", () => {
    render(<Todo todo={sampleTodoNotDone} deleteTodo={() => {}} completeTodo={() => {}} />)
    expect(screen.getByText("This todo is not done")).toBeInTheDocument()
    expect(screen.queryByText("This todo is done")).not.toBeInTheDocument()
  })

  test("calls deleteTodo when Delete button is clicked", async () => {
    const user = userEvent.setup()
    const mockDelete = vi.fn()
    render(<Todo todo={sampleTodoNotDone} deleteTodo={mockDelete} completeTodo={() => {}} />)

    await user.click(screen.getByText("Delete"))
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledWith(sampleTodoNotDone)
  })

  test("calls completeTodo when Set as done button is clicked", async () => {
    const user = userEvent.setup()
    const mockComplete = vi.fn()
    render(<Todo todo={sampleTodoNotDone} deleteTodo={() => {}} completeTodo={mockComplete} />)

    await user.click(screen.getByText("Set as done"))
    expect(mockComplete).toHaveBeenCalledTimes(1)
    expect(mockComplete).toHaveBeenCalledWith(sampleTodoNotDone)
  })
})