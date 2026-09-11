const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://michellefutbool_db_user:${password}@phonebook.afz8mvj.mongodb.net/phoneBookApp?appName=Phonebook`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

/*
const note = new Person({
    name: process.argv[3],
    number: process.argv[4],
})

note.save().then(result => {
    console.log(`added ${result.name} ${result.number} to phonebook`)
    mongoose.connection.close()
})

*/

Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
        console.log(person.name, person.number)
    })
    mongoose.connection.close()
})