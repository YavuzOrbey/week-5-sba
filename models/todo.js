import mongoose from "mongoose";
const Schema = mongoose.Schema
const todoSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
}, {
    timestamps: true
})

const Todo = mongoose.model('Todo', todoSchema)

export { Todo };