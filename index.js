import express from 'express'
import mongoose from 'mongoose'
import { Todo } from './models/todo.js'
import { User } from './models/user.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
const app = express();
const port = 5000;

const uri = "type in a mongodb atlas uri here";
mongoose.connect(uri)

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established')
})
//middleware
app.use(express.json())


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

app.post("/register", (req, res) => {
    const email = req.body.email;

    User.findOne({ email: email }, function (err, user) {
        if (user === null) {
            const plainTextPassword = req.body.password;
            const saltRounds = 10;
            bcrypt.hash(plainTextPassword, saltRounds, function (err, hash) {
                const newUser = new User({ email, password: hash })
                newUser.save()
                    .then(() => res.json({ type: "success", message: "Successfully registered!" }))
                    .catch(saveErr => {
                        console.log(saveErr)
                        return res.status(400).json('Error ' + saveErr)
                    })
            });
        }
        else {
            return res.status(200).json({ type: "error", message: "User already exists!" })
        }
    })
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    if (!email) {
        console.log("Email is required")
        return res.status(400).json('Error: Invalid Login Credentials');
    }

    User.findOne({ email })
        .then((user) => {
            if (user == null) {
                return res.status(400).json('Error: Invalid Login Credentials');
            }
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result) {
                    const user = { email }
                    const accessToken = jwt.sign(user, "secret_token")
                    return res.status(200).json({ message: 'Welcome Back', accessToken });
                }
                else
                    return res.status(400).json('Error: Invalid Login Credentials');
            })
        }).catch((err) => console.error(err))

});

const authenticateToken = (req, res, next) => {
    console.log("Trying to authenticate request")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === undefined) return res.sendStatus(401)
    jwt.verify(token, "secret_token", (err, user) => {
        if (err) return res.status(403)
        req.user = user;
        next();
    })
}
app.get("/todos", authenticateToken, (req, res) => {
    Todo.find()
        .then((todos) => res.json(todos))
        .catch((err) => res.status(400).json("Error: " + err));
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
