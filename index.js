const express = require('express')
const app = express()
const mongoose = require('mongoose')
const routes = require('./routes')


app.use(express.json())


// app.get("/", function(){
//     console.log('god speaking');
// })

app.use('/', routes)

mongoose.connect('mongodb+srv://sainath47:16oct1996@saicluster2.kzyf6n0.mongodb.net/atest').then(
    console.log('MongoDb connected')
).catch(e=> console.log(e))

app.listen(3000, function(){
    console.log('app listening on ' + 3000);
})
