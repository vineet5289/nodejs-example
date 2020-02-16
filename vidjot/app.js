const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//connect to mongo db
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Mongodb connected"))
.catch(err => console.log(err));

// load idea module
require('./models/Idea');
const Idea = mongoose.model('ideas');


// hanlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'handlebars');

//middleware use
// app.use(function(request, response, next){
//     request.name = "Test Middlerware";
//     next();
// });

// index route
app.get('/', (request, response) => {
    const title = 'Welcome';
    response.render('index', {
        title: title
    });
});

// about page route
app.get('/about', (request, response) => {
    response.render('about');
});

//Add Idea form
app.get('/ideas/add', (request, response) => {
    response.render('ideas/add');
});

// process add idea form
app.post('/ideas', (request, response) => {
    let errors = [];
    if(!request.body.title) {
        errors.push({text: 'Please add title'});
    }
    if(!request.body.details) {
        errors.push({text: 'Please add details'});
    }

    if(errors.length > 0) {
        response.render('ideas/add', {
            errors: errors,
            title: request.body.title,
            details: request.body.details
        });
    } else {
        const newIdeas = {
            title: request.body.title,
            details: request.body.details
        }
        new Idea(newIdeas)
        .save()
        .then(
            response.redirect('/ideas')
        );
    }
});

// Idea index page
app.get('/ideas', (request, response) => {
    Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
        response.render('ideas/index', {
            ideas: ideas
        });
    });
});

//Edit idea
app.get('/ideas/edit/:id', (request, response) => {
    Idea.findOne({
        _id: request.params.id
    })
    .then(idea => {
        response.render('ideas/edit', {
            idea: idea
        });
    });
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});