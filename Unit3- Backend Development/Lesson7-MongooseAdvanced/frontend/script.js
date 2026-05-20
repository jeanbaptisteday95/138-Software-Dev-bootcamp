const apiUrl = 'http://localhost:3000/api/todos';

async function getTodos() {
  const response = await fetch(apiUrl);
  const todos = await response.json();
  renderTodos(todos);
}

function renderTodos(todos) {
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = ''; // Clear the list

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.classList.toggle('completed', todo.completed);
    
    // Create span for the title
    const span = document.createElement('span');
    span.textContent = todo.title;

    // Create the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = todo.completed ? 'Undo' : 'Complete';
    toggleButton.onclick = () => toggleTodo(todo._id, todo.completed);

    // Create the delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteTodo(todo._id);

    // Append elements to the list item
    li.appendChild(span);
    li.appendChild(toggleButton);
    li.appendChild(deleteButton);

    // Append the list item to the todo list
    todoList.appendChild(li);
  });
}


async function addTodo(event) {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  try {
    if (title && description) {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      if (!response.ok){
        const errorData = await response.json();
        if(errorData){
          throw new Error(errorData.error)
        }
      }
      await response.json();
      title.value = '';
      description.value = '';
      getTodos();
    }
  } catch (error) {
      window.alert(error.message)
  }
  
}

async function toggleTodo(id, completed) {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !completed })
  });
  const updatedTodo = await response.json();
  getTodos();
}

async function deleteTodo(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  getTodos();
}

window.onload = getTodos;
