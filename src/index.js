import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const checkboxStyle = checked => ({
  textDecoration: checked ? 'line-through' : 'none',
});

class Todo extends React.Component {
  render() {
   const {todos, handleCheck, deleteTodo} = this.props;
    return (
    <ul>
     {
      todos.map(todo => 
       <li key={todo.val.toString()}
           style={checkboxStyle(todo.checked)}           
        > {todo.val}
        <input type="checkbox" checked={todo.checked} 
               onChange={() => handleCheck(todo)}/>
        <button className="done" 
                onClick={() => deleteTodo(todo)}
        > Delete
        </button>
        <a>{todo.time}</a>
       </li>
       )
      }
    </ul>
    )
  }
}

class ParentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: { 
        val: '',
        checked: false,       
        time: 0, 
      },      
      todos: [],
    };
    this.deleteTodo = this.deleteTodo.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
  }  

  componentDidMount() {
    document.addEventListener("DOMContentLoaded", this.handleLoad);
  }

  handleLoad = () => {
    if (document.cookie) { 
      let list = getTodoFromCookies();
      this.setState({ todos: list}); 
    }
  }

  handleChange = (event) => {
    let d = new Date().toLocaleTimeString();
         
    this.setState({ 
      todo: { 
        val: event.target.value, 
        checked: false,      
        time: d, 
      },
    });            
  };

  onSubmit = (event) => {
    event.preventDefault();
    if (this.state.todo.val === "") {
      alert("Type something");
      return false;
    }
    this.setState({
      todo: { 
        val: '',
        checked: false,       
        time: 0, 
      },
      todos: [...this.state.todos, this.state.todo],      
    });  
    saveTodo(this.state.todo)  
  };

  handleCheck = (item) => {
    let list = this.state.todos;
    for (let i = 0; i < list.length; i++) {
      if (list[i] === item) {
        changeItemState(item);
        let copy = item;
        copy.checked = !item.checked
        list.splice(i,1,copy)                      
      }
    }  
    this.setState({ todos: list }); 
  }; 
  
  deleteTodo = (id) => {
    removeItem(id);
    this.setState(prevState => ({
      todos: prevState.todos.filter(el => el !== id )  
    }));
   };

  render() {
    return (
      <div className="todolist">
        <div className='header'>
         <h1>Type your stuff</h1>
          <form className="addTodo" 
                onSubmit={this.onSubmit}>
           <input value={this.state.todo.val} 
                  onChange={this.handleChange} />
           <button>Add</button>
          </form>
        </div>  
        <div className="container-drag">
          <Todo todos={this.state.todos} 
                deleteTodo={this.deleteTodo}
                handleCheck={this.handleCheck}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <ParentList />,
  document.getElementById("root")
);

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires 
}

function getCookie(name)  {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
  return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '')
}

function deleteCookie(name) {
  setCookie(name, '', -1)
}

function getTodoFromCookies() {
  let c = getCookie('todo');
  let arr = [];
    if (c === '') {
      return arr;
    } else { 
      let g = JSON.parse(c); 
      for (let i = 0; i < g.length; i++) {
        let v,st;
        v = g[i]; 
        st = JSON.parse(v);
        arr.push(st)
      }
    } 
  return arr;      
};

function saveTodo(todo) {
  let cookies = getTodoFromCookies();
  cookies.push(todo);
  dumpTodosToCookies(cookies)
}

function dumpTodosToCookies(arr) {
  let strArr = [];
  let res; 
    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        let c, str;  
        c = arr[i];
        str = JSON.stringify(c);
        strArr.push(str);
       res = JSON.stringify(strArr)
      }
    } else {
      res = '';
    }  
  setCookie('todo',res,1)   
};

function removeItem(item) {
  let res = getTodoFromCookies();
  for (let i = 0; i < res.length; i++) {
    let cook = res[i]
    if (cook.val === item.val) {
      res.splice(i,1); 
    } 
  }  
  dumpTodosToCookies(res);
};

function changeItemState(item) {
  let res = getTodoFromCookies(); 
  for (let i = 0; i < res.length; i++) { 
    let cook = res[i]
    if (cook.val === item.val) {     
      let copy = cook;
      copy.checked = !cook.checked       
      res.splice(i,1,copy);
    } 
  }
  dumpTodosToCookies(res)
};