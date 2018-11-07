const express = require('express');
const hbs = require('hbs'); // handlebars framework
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + "/views/partials");

app.set('view engine', 'hbs'); // set express configuration for handlebars
//app.use(express.static(__dirname + '/public'));

// middleware
app.use((request, response, next) => {
    let now = new Date().toString();
    let log = `${now}: ${request.method} ${request.url}`
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

app.use((request, response, next) => {
    response.render('maintenance.hbs');
});

app.use(express.static(__dirname + '/public')); // static help.html page

hbs.registerHelper("getCurrentYear", () => {
    return new Date().getFullYear();
});

hbs.registerHelper("screamIt", (text) => {
    return text.toUpperCase();
});

app.get('/', (request, response) => {
    // response.send('<h1>Hello, Express! Cool...</h1>')
    // response.send({
    //     name: 'Archie',
    //     likes: [
    //         'Biking',
    //         'Games',
    //         'Don\'t starve together'
    //     ]
    // })
    response.render('home.hbs',
        {
            pageTitle: 'Start Page',
            // currentYear: new Date().getFullYear(),
            welcomeMessage: 'Welcome, young padawan.'
        });

});

app.get('/about', (request, response) => {
    // response.send('This is a test about page.');
    response.render('about.hbs',
        {
            pageTitle: 'About Page'
            // , currentYear: new Date().getFullYear()
        });
});

app.get('/bad', (request, response) => {
    response.send({
        error: 'Error handling request'
    });
});

app.get('/maintenance', (request, response) => {
    response.render('maintenance.hbs',
        {
            pageTitle: 'Maintenance'
        });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});