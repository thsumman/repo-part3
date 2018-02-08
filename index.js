const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.static('build'))
morgan.token('bodyData', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :bodyData :status :res[content-length] - :response-time ms'))
const bodyParser = require('body-parser')

app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/info', (request, response) => {
  Person
    .find({},{__v:0})
    .then(persons => {
      const lkm = persons.length
      response.send(`puhelinluettelossa on ${lkm} henkilön tiedot`)
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({error: 'malformatted id'})
    })
})

app.get('/api/persons', (request, response) => {
  Person
    .find({},{__v:0})
    .then(persons => {
      response.json(persons.map(Person.format))
    })
    .catch((error => {
      console.log(error)
    }))
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({error: 'malformatted id'})
    })
  })

/*app.post('/api/persons', (request, response) => {
  const body = request.body

  if ((body.name === undefined) || (body.number === undefined)) {
    return response.status(400).json({error: 'name or number missing'})
  }

  const person = new Person ({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => {
      response.json(Person.format(savedPerson))
    })
    .catch((error) => {
      console.log(error)
    })
  
})*/

app.post('/api/persons', (request, response) => {
  const body = request.body

  if ((body.name === undefined) || (body.number === undefined)) {
    return response.status(400).json({error: 'name or number missing'})
  }

  const person = new Person ({
    name: body.name,
    number: body.number,
  })

  Person
    .find({name: person.name})
    .then(result => {
      if (result.length > 0) {
        response.status(400).json({error: 'name already in use'})
      }
      else {
        person
          .save()
          .then(savedPerson => {
            response.json(Person.format(savedPerson))
          })
          .catch((error) => {
            console.log(error)
          })
      }
    })
    .catch((error) => {
      console.log(error)
    })
  })
  

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }
  Person
    .findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({error: 'malformatted id'})
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})