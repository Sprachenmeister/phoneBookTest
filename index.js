require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

let people = []

/*

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

*/

app.use(express.json())
//app.use(requestLogger)//
morgan.token('body', (request) => JSON.stringify(request.body))

app.use(morgan( ':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

app.get('/api/people', (request, response) => {
    Person.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/info', (request, response) => {
    const requestTime = new Date()
    const entryCount = persons.length

    response.send(
        `Phonebook has info for ${entryCount} people<br>${requestTime}`
    )
})

app.get('/api/people/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(note => {
            if (person) {
               response.json(note)
            } else {
                response.status(404).end()
            }
    }).catch(error => next(error))
})

/*
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(person => Number(person.id)))
        : 0
    return String(Math.floor(Math.random() * (1000000000 - maxId)) + maxId)
}

 */


app.post('/api/people', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    if (people.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/people/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then((updatedPerson) => {
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

app.delete('/api/people/:id', (request, response) => {
   Person.findByIdAndDelete (request.params.id)
       .then(result => {
           response.status(204).end()
       })
       .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, ()=>
    console.log(`Server running on port ${PORT}`))