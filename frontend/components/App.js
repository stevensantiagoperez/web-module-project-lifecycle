import React from 'react'
import axios from 'axios'

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
        <div id="todos" >
          <h2>Todos:</h2>
          {
            this.state.todos.reduce( (acc, td) => {
              if(this.state.displayCompleteds || !td.completed) return acc.concat(
                <div onClick={this.toggleCompleted(td.id)} key={td.id}   >{td.name}{td.completed ? ' ✔️' : ''}</div>
              )
              return acc
            },[])
          }
          {/* return <div onClick={this.toggleCompleted(td.id)} key={td.id}   >{td.name}{td.completed ? ' ✔️' : ''}</div> */}
        </div>
        <form id="todoForm" onSubmit={this.onTodoFormSubmit} >
          <input value={this.state.todoNameInput} onChange={this.onTodoNameInputChange} type="text" placeholder="Type todo"  ></input>
          <input type="submit" ></input>
        </form>
          <button onClick={this.toggleDisplayCompleteds} >{this.state.displayCompleteds ? 'Hide' : "Show"} Completed</button>
      </div>
    )
  }
}
