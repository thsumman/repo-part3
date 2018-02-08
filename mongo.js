const mongoose = require('mongoose')

const url = 'mongodb://tsummane:<password>.mlab.com:25318/part3_dev'


mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length === 4) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })
  person
    .save()
    .then(response => {
      console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
      mongoose.connection.close()
    })
}
else if (process.argv.length === 2) {
  Person
    .find({})
    .then(result => {
      console.log("puhelinluettelo:")
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}
else {
  console.log("Väärä määrä komentoriviparametreja")
  mongoose.connection.close()
}