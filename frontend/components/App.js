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

  fetchAllTodos = () => {
    axios.get(URL)
    .then(response => {
      this.setState({ ...this.state, todos: response.data.data })
    })
    .catch(error => {
      this.setState( {...this.state, error: error.response.data.message })
    })
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
        <form id="todoForm" >
          <input value={this.state.todoNameInput} onChange={this.onTodoNameInputChange} type="text" placeholder="Type todo"  ></input>
          <input type="submit" ></input>
          <button>Clear Completed</button>

        </form>
      </div>
    )
  }
}
