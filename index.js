import express from 'express'
import mongoose from 'mongoose'
import { Todo } from './models/todo.js'
const app = express();
const port = 5000;

const uri = "mongodb+srv://yavuz:IC0L0ZynA5zBRGD9@cluster0.5stic.mongodb.net/week5sba?retryWrites=true&w=majority";
mongoose.connect(uri)

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established')
})
//middleware
app.use(express.json())

app.get("/todos", (req, res) => {
    Todo.find()
        .then((todos) => res.json(todos))
        .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/todo/:id", (req, res) => {
    Todo.findById(req.params.id)
        .then((todo) => res.json(todo))
        .catch((err) => res.status(400).json('Error ' + err))
});
app.post("/todo", (req, res) => {
    if (req.body.content) {
        const newTodo = new Todo({ content: req.body.content })
        newTodo.save()
            .then(() => res.json({ type: "success", message: "Todo added!" }))
            .catch(saveErr => {
                console.log(saveErr)
                return res.status(400).json('Error ' + saveErr)
            })
    }

})

app.put("/todo/:id", (req, res) => {
    Todo.findByIdAndUpdate(req.params.id, { content: req.body.content })
        .then(() => res.json("Todo updated"))
        .catch((err) => res.status(400).json('Error ' + err))
})

app.delete("/todo/:id", (req, res) => {
    Todo.findByIdAndDelete(req.params.id)
        .then(() => res.json("Todo deleted"))
        .catch((err) => res.status(400).json('Error ' + err))
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})