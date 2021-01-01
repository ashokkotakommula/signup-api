const express = require('express')
const mongoose = require('mongoose')
const User = require('./schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

const PORT = 8000;

app.use(express.json())
app.use(express.urlencoded(true))

const uri = "mongodb+srv://ashok:ashok@cluster0.lw48m.mongodb.net/<dbname>?retryWrites=true&w=majority";

app.post('/signup', async (req, res) => {
    try {
        const {name, age, email, password, passwordtwo} = req.body;

        const user = await User.findOne({email})
        if(user) {
            return res.status(400).json({
                msg: "email already exists"
            })
        }

        if(!name || !age || !email || !password || !passwordtwo) {
            return res.status(400).json({msg: "please fill all fields"})
        }

        if(name.length < 8) {
            return res.status(400).json({msg: "name length should more than 8 letters"})
        }

        if(password.length < 8 || password.length > 32 && passwordtwo.length < 8 || passwordtwo.length > 32) {
            return res.status(400).json({msg: "password atleast 8 charecters long and not exceed 32 charecters"})
        }

        if(age===0) {
            return res.status(400).json({msg: "Age should be greater than zero"})
        }

        function validateEmail(em) {
            var re = /\S+@\S+\.\S+/;
            return re.test(em);
        }

       const testEmail = validateEmail(email)
       if(!testEmail) {
           return res.status(400).json({msg: "please enter valid email address"})
       }

       if(password !== passwordtwo) {
           return res.status(400).json({msg: "password does not match"})
       }
       const passwordHash = await bcrypt.hash(password, 10)

       const newUser = new User({
           name, age, email, password: passwordHash,
       })

       await newUser.save()

       res.json({msg: "successfully created account"})

    } catch (err) {
        res.status(500).json({msg: err.message})
    }
})

mongoose.connect(uri, { useNewUrlParser: true , useUnifiedTopology: true })
.then(() => console.log('Connected to DataBase'))
.catch((err) => console.log(err))

app.listen(PORT, () => {
    console.log('listening to port: ', PORT);
})
