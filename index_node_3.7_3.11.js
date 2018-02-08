const express = require('express')
const cors = require('cors')

const morgan = require('morgan')
const app = express()
app.use(cors())
app.use(express.static('build'))
morgan.token('bodyData', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :bodyData :status :res[content-length] - :response-time ms'))
const bodyParser = require('body-parser')

app.use(bodyParser.json())


let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/info', (req, res) => {
  const lkm = persons.length
  const teksti1 = `puhelinluettelossa on ${lkm} henkilön tiedot`
  const day = new Date()
  res.send(`<p>${teksti1}</p>${day}<p></p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if ( person ) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  response.json(person)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const id = Math.floor(Math.random() * Math.floor(1000000))
  return id
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if ((body.name === undefined) || (body.number === undefined)) {
    return response.status(400).json({error: 'name or number missing'})
  }
//  response.json(body)
  const earlierPerson = persons.find((person) => person.name === body.name)
  
  if (earlierPerson !== undefined) {
    return response.status(400).json({error: 'name must be unique'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})