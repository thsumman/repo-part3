import React from 'react'
import personService from './services/persons'
import Notification from './Notifications_2_18'
import './index_2_18__2_19.css'

class App extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        persons: [
        ],
        newName: 'jotain',
        newNumber: 'joku numero',
        filter: '',
        personsToShow: [
        ],
        info: ''
      }
    }
  
    addName = (event) => {
      event.preventDefault()
      const findSameName = (element) => {
        return (
          element.name === this.state.newName
        )
      }
      
      const apu_ind = this.state.persons.findIndex(findSameName);
  
      if (apu_ind === -1) {
        const personObject = {
          name: this.state.newName,
          number: this.state.newNumber
        }
        const newName = this.state.newName
        personService
        .create(personObject)
        .then(response => {
          const persons = this.state.persons.concat(response.data)
          const personsToShow = persons
          this.setState({
            persons: persons,
            newName: '',
            newNumber: '',
            filter: '',
            personsToShow,
            info: `Lisättiin ${newName} !`
          })
          setTimeout(() => {
            this.setState({info: null})
          }, 5000)
        })
      }
      else {
        const newName = this.state.newName
        if (window.confirm(newName + " on jo luettelossa, korvataanko entinen numero uudella?")) {
          const newNameNumber = this.state.persons[apu_ind]
          const id = newNameNumber.id
          const changedNameNumber = { ...newNameNumber, number: this.state.newNumber }
          personService
          .update(id, changedNameNumber)
          .then(changedNamenumber => {
            const persons = this.state.persons.filter(person => person.name !== newName)
            this.setState({
              persons: persons.concat(changedNameNumber),
              newName: '',
              newNumber: '',
              filter: '',
              personsToShow: persons.concat(changedNameNumber),
              info: `Henkilön ${newName} numeron vaihto onnistui!`
            })
            setTimeout(() => {
              this.setState({info: null})
            }, 5000)
          })
          .catch(error => {
            alert(`Henkilö '${newName}' on jo valitettavasti poistettu palvelimelta`)
            const persons = this.state.persons.filter(person => person.id !== id)
            this.setState({ 
              persons,
              personsToShow : persons
            })
          })
        }
      }
    }
  
    handleNameChange = (event) => {
      console.log(event.target.value)
      this.setState({ newName: event.target.value })
    }
  
    handleNumberChange = (event) => {
      console.log(event.target.value)
      this.setState({ newNumber: event.target.value })
    }
  
    handleChoose = (event) => {
      console.log("event",event)
      const personsToShow = this.state.persons.filter((person) => person.name.toLowerCase().indexOf(event.target.value.toLowerCase(),0) === 0
      )
      this.setState({ filter: event.target.value })
      this.setState({personsToShow: personsToShow})
    }

    handleClick = (event) => {
      const id = event.target.value
      const delPerson = this.state.persons.find(person => person.id === Number(id))
      if (window.confirm("Poistetaanko "+ delPerson.name)) {
        personService
        .deleteObj(id)
        .then(response => {
          const persons = this.state.persons.filter(person => person.id !== Number(id))
            this.setState({
              persons: persons,
              newName: '',
              newNumber: '',
              filter: '',
              personsToShow: persons,
              info: `Henkilön ${delPerson.name} poisto onnistui!`
            }
          )
          setTimeout(() => {
            this.setState({info: null})
          }, 5000)
        })
        .catch(error =>
          console.log("Virhe")
        )
      }
    }
  
    componentWillMount() {
      personService
        .getAll()
        .then(response => {
          this.setState({
            persons: response.data,
            personsToShow: response.data
          })
        }
      )

    }

    render() {
      const personsToShow = this.state.personsToShow
      return (
        <div>
          <h1>Puhelinluettelo</h1>
          <Notification message={this.state.info}/>
          Rajaa näytettäviä: <input value={this.state.filter} onChange={this.handleChoose}/>
          <h2>Lisää numero</h2>
          <form onSubmit={this.addName}>
            <div>
              nimi: <input value={this.state.newName}  onChange={this.handleNameChange} />
            </div>
            <div>
              numero: <input value={this.state.newNumber}  onChange={this.handleNumberChange}/>
            </div>
            <div>
              <button type="submit">lisää</button>
            </div>
          </form>
          <h2>Numerot</h2>
          <div>
          {personsToShow.map((person) => 
            <p key={person.name}>{person.name} {person.number} <button value={person.id} onClick={this.handleClick}>Poista</button></p>)}
          </div>
        </div>
      )
    }
  }

  export default App