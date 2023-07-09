const mongoose = require('mongoose');

// in this i am connecting my dataBase

const connectTheDatabase = () =>{
    mongoose.connect("mongodb+srv://ashwani04:ash04wani31@cluster0.bsg0u6y.mongodb.net/HabitDB",{useNewUrlParser : true}).then(()=>{
        console.log("Database succesully connected");
    })   
}

module.exports = connectTheDatabase