//dependencies 
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()

//app use
app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json())

//database and database functions
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB database connected...'))
  .catch((err) => console.log(err))

app.get('/', async (req, res) => {
  try {
    const toDoListItems = await ToDoListItem.find()
    if (!toDoListItems) throw new Error('No toDoListItems')
    const sorted = toDoListItems.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
    res.status(200).json(sorted)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})


app.post('/', async (req, res) => {
  const newToDoListItem = new ToDoListItem(req.body)
  try {
    const toDoListItems = await newToDoListItem.save()
    if (!toDoListItems) throw new Error('Something went wrong saving the toDoListItems')
    res.status(200).json(toDoListItems)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

app.put('/:id', async (req, res) => {
  const {
    id
  } = req.params
  try {
    const response = await ToDoListItem.findByIdAndUpdate(id, req.body)
    if (!response) throw Error('Something went wrong')
    const updated = {
      ...response._doc,
      ...req.body
    }
    res.status(200).json(updated)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

app.delete('/:id', async (req, res) => {
  const {
    id
  } = req.params
  try {
    const removed = await ToDoListItem.findByIdAndDelete(id)
    if (!removed) throw Error('Something went wrong ')
    res.status(200).json(removed)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

// schema
const {
  Schema,
  model
} = require('mongoose')

const ToDoListItemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  taskstatus: {
    type: String,
    required: false,
    default: 'false',
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

const ToDoListItem = model('toDoListItems', ToDoListItemSchema)

//exports
module.exports = ToDoListItem

module.exports = {
  path: "/api/",
  handler: app
}
