const morgan = require('morgan')
const express = require('express')
const cors = require('cors')

const app = express()

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan((tokens, req, res) => {
  const body = req.method === 'POST' ? JSON.stringify(req.body) : ''
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    body
  ].join('  ')
}))
app.use(cors())
app.use(express.static('dist'))


app.get('/api/persons', (request, response)=>{
    response.json(persons)
})

app.get('/info', (request, response)=>{
    const count = persons.length;
    const serverTime = new Date().toString()
    response.send(`<p>Phonebook has info for ${count} people.</p>
        <p>${serverTime}</p>`)
})

app.get('/api/persons/:id' , (req, res)=>{
    const id = req.params.id
    const person=persons.find((per)=>per.id===id)
    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res)=>{
    const id = req.params.id
    persons=persons.filter((per)=> per.id!=id )
    
    res.status(204).end()
})

const generateId = () =>{
    return Math.floor(Math.random()* 1e7).toString();
}
app.post('/api/persons', (req,res)=>{
    const body= req.body
    const name=persons.find((per)=> body.name===per.name)
    if(!body.name || !body.number){
        return res.status(400).json({
            error:"content missing",
        })
    }
    if(name){
        return res.status(400).json({
            error:"name should be unique",
        })
    }

    const note = {
        "id": generateId(),
        "name": body.name,
        "number": body.number,
    }

    persons= persons.concat(note)
    res.json(note)
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})