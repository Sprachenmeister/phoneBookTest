const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.set('runValidators', true)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose
    .connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(value) {
                return /\d{3}-\d{7}/.test(value)
            },
            message: props => 'Enter valid number.'
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
