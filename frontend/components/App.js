import React from 'react'
import axios from 'axios'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [], 
    error: '',
    todoNameInput: '',
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
  componentDidMount() {
    // fetch all todos from server
    this.fetchAllTodos()
  }
  render() {
    return (
      <div>
        <div id="error" >Error: {this.state.error}</div>
        <div id="todos" >
          <h2>Todos:</h2>
          {
            this.state.todos.map( td  => {
              return <div key={td.id} >{td.name}</div>
            })
          }
        </div>
        <form id="todoForm" onSubmit={this.onTodoFormSubmit} >
          <input value={this.state.todoNameInput} onChange={this.onTodoNameInputChange} type="text" placeholder="Type todo"  ></input>
          <input type="submit" ></input>
          <button>Clear Completed</button>

        </form>
      </div>
    )
  }
}
