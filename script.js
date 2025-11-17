// DOM Elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const tasksList = document.getElementById('tasks-list');
const emptyState = document.getElementById('empty-state');
const tasksCount = document.getElementById('tasks-count');

// Tasks array
let tasks = [];

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
    updateTasksCount();
});

// Add task function
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        taskInput.focus();
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        edited: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateTasksCount();
    
    // Clear input and focus
    taskInput.value = '';
    taskInput.focus();
}

// Edit task function
function editTask(id) {
    const taskItem = document.querySelector(`[data-id="${id}"]`);
    const taskText = taskItem.querySelector('.task-text');
    const taskActions = taskItem.querySelector('.task-actions');
    
    // Create edit input
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'task-edit-input';
    editInput.value = taskText.textContent;
    
    // Replace text with input
    taskText.replaceWith(editInput);
    editInput.focus();
    
    // Change buttons
    taskActions.innerHTML = `
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `;
    
    // Add editing class
    taskItem.classList.add('editing');
    
    // Save button event
    taskActions.querySelector('.save-btn').addEventListener('click', () => {
        saveTaskEdit(id, editInput.value);
    });
    
    // Cancel button event
    taskActions.querySelector('.cancel-btn').addEventListener('click', () => {
        cancelTaskEdit(id);
    });
    
    // Save on Enter key
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveTaskEdit(id, editInput.value);
        }
    });
}

// Save task edit
function saveTaskEdit(id, newText) {
    if (newText.trim() === '') {
        cancelTaskEdit(id);
        return;
    }
    
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].text = newText.trim();
        tasks[taskIndex].edited = true;
        saveTasks();
        renderTasks();
    }
}

// Cancel task edit
function cancelTaskEdit(id) {
    renderTasks();
}

// Delete task function
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateTasksCount();
}

// Render tasks to the DOM
function renderTasks() {
    tasksList.innerHTML = '';
    
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.setAttribute('data-id', task.id);
        
        taskItem.innerHTML = `
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                ${task.edited ? '<span class="edited-badge">(edited)</span>' : ''}
            </div>
            <div class="task-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        
        tasksList.appendChild(taskItem);
        
        // Add event listeners
        taskItem.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(task.id);
        });
        
        taskItem.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTask(task.id);
        });
    });
}

// Update tasks count
function updateTasksCount() {
    const count = tasks.length;
    tasksCount.textContent = `${count} ${count === 1 ? 'task' : 'tasks'}`;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event Listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});