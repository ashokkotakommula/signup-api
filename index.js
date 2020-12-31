const express = require('express')
const mongoose = require('mongoose')
const User = require('./schema')

const app = express()

const PORT = 8000;

app.use(express.json())
app.use(express.urlencoded(true))

app.post('/signup', async (req, res) => {
    const {name, age, email, password, passwordtwo} = req.body;

    if(!name || !age || !email || !password || !passwordtwo) {
        return res.status(400).send("Please fill the All fields")
    }

    if(name.length < 10) {
        return res.status(400).send("Name length should be greater than 10 letters")
    }
    if(age < 0 || age > 100) {
        res.status(400).send("age should be less than 32 or greater than 8 years")
    }

    if(password.length < 8 || password.length > 32) {
        res.status(400).send("Password lenth should be less than 32 and greater than 8 charectes length")
    }

    if(password !== password) {
        res.send(400).send("password not matches")
    }

    const newuser = await new User({
        name: req.body,
        age: req.body,
        email: req.body,
        password: req.body,
        passwordtwo: req.body
    }).save()

    try {
        if(newuser) {
            return res.status(200).send('Successfully created account')
        }
    } catch (err) {
        return res.status(500).send({message: err})
    }



})

mongoose.connect('https://mongodb+srv://ashok:ashok@cluster0.lw48m.mongodb.net/<dbname>?retryWrites=true&w=majority', 
    { 
        useNewUrlParser: true 
    },
    ()=> {
    console.log('connected to DB')
})
app.listen(PORT, () => {
    console.log('listening to port: ', PORT);
})
