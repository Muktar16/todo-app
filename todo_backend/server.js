const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors());



// MongoDB Connection
const connectToDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/todoApp');
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

connectToDB();

// Todo Schema
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '', required: false },
    priority: { type: Number, required: true }, // Add priority as a number field
}); 

const Todo = mongoose.model('Todo', todoSchema);

// Custom Middleware - Check if 'priority' is a number in request body
const checkPriority = (req, res, next) => {
    const { priority } = req.body;
    if (priority && typeof priority === 'number') {
        next(); // Proceed to the next middleware or route handler
    } else {
        res.status(400).json({ message: 'Priority must be a number' });
    }
};

app.post("/todos",checkPriority, async (req, res) => {
    console.log("Post request called");
    const { title, description, priority } = req.body;
    const todo = new Todo({
        title,
        description,
        priority,
    });
    try {
        await todo.save();
        res.send(todo);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get("/todos", async (req, res) => {
    const todos = await Todo.find();
    res.send(todos);
})


app.get("/todos/:id", async (req, res) => {
    const id = req.params.id;
    const todo = await Todo.findById(id);
    res.send(todo);
});


app.put("/todos/:id", async (req, res) => {
    const id = req.params.id;
    const { title, description, priority } = req.body;
    const todo = await Todo.findById(id);
    todo.title = title;
    todo.description = description;
    todo.priority = priority;
    await todo.save();
    res.send(todo);
});


app.delete("/todos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await Todo.findById(id);
        await todo.deleteOne();
        res.send(todo);
    } catch (error) {
        res.status(500).send("Someting went wrong");
    }
});


app.listen(5000, (err)=> {
    if(err) {
        console.log("Error starting server");
    }
    console.log("Server started successfully");
});











// const express = require("express");
// const app = express();

// const blockingWait = async(ms) => {
//     const start = Date.now();
//     while (Date.now() - start < ms) {}
// }

// const nonBlockingWait = async(ms) => {
//     setTimeout(() => {
//         console.log("Non blocking wait");
//     }, ms);
// }


// app.get("/", async(req, res) => {
//     blockingWait(15000);
//     // nonBlockingWait(15000);
//     res.send("Home Page");    
// });

// app.get("/about", (req, res) => {
//     res.send("About route");
// });

// // listen with error handling
// app.listen(7000, (err) => {
//   if (err) {
//     console.log("Error starting server:");
//   } else {
//     console.log("Server started successfully http://localhost:7000");
//   }
// });
