import React from 'react'
import axios from 'axios'
import Form from './Form'
import TodoList from './TodoList'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [], 
    error: '',
    todoNameInput: '',
    displayCompleteds: true,
  }
  onTodoNameInputChange = evt => {
    const { value } = evt.target
    this.setState( {...this.state, todoNameInput: value})
  }

  resetForm = () => this.setState({ ...this.state, todoNameInput: '' })
  setAxiosResponseError = (error) => this.setState( {...this.state, error: error.response.data.message })

  postNewTodo = () => {
    axios.post(URL, { name: this.state.todoNameInput })
    .then(response => {
      this.setState( {...this.state, todos: this.state.todos.concat(response.data.data)})
      this.resetForm();
    })
    .catch(this.setAxiosResponseError)
  }

  onTodoFormSubmit = (evt) => {
    evt.preventDefault();
    this.postNewTodo();
  }

  fetchAllTodos = () => {
    axios.get(URL)
    .then(response => {
      this.setState({ ...this.state, todos: response.data.data })
    })
    .catch(this.setAxiosResponseError)
  }

  toggleCompleted = (id) => () =>  {
    axios.patch(`${URL}/${id}`)
    .then(response => {
      this.setState({ ...this.state, todos: this.state.todos.map(td => {
        if(td.id !== id) return td
        return response.data.data
      }) })
    })
    .catch(this.setAxiosResponseError)
  }

  toggleDisplayCompleteds = () => {
    this.setState( {...this.state, displayCompleteds: !this.state.displayCompleteds})
  }

  componentDidMount() {
    // fetch all todos from server
    this.fetchAllTodos()
  }


  render() {
    return (
      <div>
        <div id="error" >Error: {this.state.error}</div>
        <TodoList 
          todos={this.state.todos}
          displayCompleteds={this.state.displayCompleteds}
          toggleCompleted={this.toggleCompleted}
        />

        <Form 
          onTodoFormSubmit={this.onTodoFormSubmit}
          onTodoNameInputChange={this.onTodoNameInputChange}
          toggleDisplayCompleteds={this.toggleDisplayCompleteds}
          todoNameInput={this.state.todoNameInput}
          displayCompleteds={this.state.displayCompleteds}
        />
      </div>
    )
  }
}
