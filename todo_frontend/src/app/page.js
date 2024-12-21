'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/todos';

export default function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editingTodo, setEditingTodo] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    // Fetch todos
    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get("http://localhost:5000/todos", { title: "test", description: "test", priority: 1 });
            console.log(response.data);
            setTodos(response.data);
        } catch (err) {
            console.error('Error fetching todos:', err);
        }
    };

    const addTodo = async () => {
        if (!newTodo.trim()) return;
        try {
            const response = await axios.post(API_BASE_URL, { title: newTodo });
            setTodos([...todos, response.data]);
            setNewTodo('');
        } catch (err) {
            console.error('Error adding todo:', err);
        }
    };

    const startEditing = (todo) => {
        setEditingTodo(todo);
        setEditTitle(todo.title);
    };

    const updateTodo = async (id) => {
        if (!editTitle.trim()) return;
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, { title: editTitle });
            setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
            setEditingTodo(null);
            setEditTitle('');
        } catch (err) {
            console.error('Error updating todo:', err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            setTodos(todos.filter((todo) => todo._id !== id));
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    };

    return (
        <div className="container">
            <h1>Todo App</h1>
            <div className="new-todo">
                <input
                    type="text"
                    placeholder="Add a new todo"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button onClick={addTodo}>Add</button>
            </div>

            <ul>
                {todos.map((todo) => (
                    <li key={todo._id}>
                        {editingTodo && editingTodo._id === todo._id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                                <button onClick={() => updateTodo(todo._id)}>Save</button>
                                <button onClick={() => setEditingTodo(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                {todo.title}
                                <button onClick={() => startEditing(todo)}>Edit</button>
                                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                                <div>
                                {todo.description}
                            </div>
                            </div>
                            
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
