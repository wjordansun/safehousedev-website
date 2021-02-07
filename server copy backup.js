console.log('May Node be with you') // shows that node is working

const express = require('express') // in order to use express you need to require it
const bodyParser = require('body-parser')
const app = express()

const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://wjordansun:ekoater@cluster0.dqtjr.mongodb.net/star-wars-quotes?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

client.connect(err => {
 	// perform actions on the collection object
 	if (err) return console.error(err)
 	console.log('Connected to Database')

 	const db = client.db('star-wars-quotes')
 	const quotesCollection = db.collection('quotes')

 	app.set('view engine', 'ejs') // tells Express we're using EJS as template engine, goes before express handlers

 	app.listen(3000, function() {		// creates a server on port 3000, access on localhost:3000
		console.log('listening on 3000')
	})

	// app.get('/', function(req, res) {	// function(request, response)
	// 		res.send('Hello World')
	// })

	// app.get('/', (req, res) => {	// same code as above
	// 		res.send('Hello World')		// send method comes with response object
	// })

	app.use(bodyParser.urlencoded({ extended: true })) //body-parser goes before CRUD handlers
	app.use(bodyParser.json())
	app.use(express.static('public'))

 	app.get('/', (req, res) => {
		console.log('appid: ' + process.env.APP_ID)
		db.collection('quotes').find().toArray()
 			.then(results => {
 				res.render('index.ejs', { quotes: results })
 			})
 			.catch(error => console.error(error))
	})

 	app.post('/quotes', (req, res) => {
 		quotesCollection.insertOne(req.body)
 			.then(result => {
 				res.redirect('/')
 			})
 			.catch(error => console.error(error))
 	})

 	app.put('/quotes', (req, res) => {
 		quotesCollection.findOneAndUpdate(
 			{ name: 'Yoda' },
 			{
 				$set: {
 					name: req.body.name,
 					quote: req.body.quote
 				}
 			},
 			{
 				upsert: true
 			}
 		)
 		.then(result => {
 			res.json('Success')
 		})
 		.catch(error => console.error(error))
 	})

 	app.delete('/quotes', (req, res) => {
 		quotesCollection.deleteOne(
 			{ name: req.body.name }
 		)
 			.then(result => {
 				if (result.deletedCount == 0) {
 					return res.json('No quote to delete')
 				}
 				res.json(`Deleted Darth Vadar's quote`)
 			})
 			.catch(error => console.error(error))
 	})

})








