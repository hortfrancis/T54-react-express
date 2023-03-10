const express = require('express');

const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// req.body.name

const fs = require('fs');

// Specify the port number as a variable.
const PORT = process.env.PORT || 8080;

// Store the route in a variable
const ROUTE = '/api';

// Allow cross-origin requests from all origins
app.use(cors())


// An array of web project items
const webProjects = [
    {
        id: "1",
        title: "React Game!",
        description: "Tic tac toe game created using 'Create React App'.",
        url: "http://heroku/myapp/game/"
    },
    {
        id: "2",
        title: "Online store",
        description: "Online store created with HTML, CSS and JavaScript.",
        url: "https://git.com/myrepos/shop/index"
    }
];

// Return information on all web projects
app.get(ROUTE, (req, res) => {
    console.log("GET request executed!");
    res.send(JSON.stringify(webProjects, null, "\n"));
})

// Add a new web project
app.post(ROUTE, (req, res) => {

    // Create an object literal with the POST query data
    const newProject = {
        id: req.query.id,
        title: req.query.title,
        description: req.query.description,
        url: req.query.url
    }

    // To avoid duplicate project data, position in array is derived from id provided.  
    const newProjectIndex = Number(req.query.id) - 1;

    // Add the POST data to the array of web projects
    webProjects[newProjectIndex] = newProject;

    // Send a confirmation back
    res.write("POST request executed!");
    res.write("\nWeb projects:\n" + JSON.stringify(webProjects, null, '\n\t'));
    res.end();
});

// Delete a web project 
app.delete(ROUTE, (req, res) => {

    // Edit the array of web projects using the id provided in the query string 
    webProjects.splice(Number(req.query.id) - 1, 1);

    res.write("DELETE request executed!");
    res.write("\nWeb projects:\n" + JSON.stringify(webProjects, null, '\n\t'));
    res.end();
})

// Edit a web project 
app.put(ROUTE, (req, res) => {

    // Get the requested project using the id provided 
    const currentProject = webProjects[Number(req.query.id) - 1];

    // Assign new values 
    currentProject.id = req.query.id;
    currentProject.title = req.query.title;
    currentProject.description = req.query.description;
    currentProject.url = req.query.url;

    res.write("PUT request executed!");
    res.write(`\nProject #${req.query.id} changed.`)
    // Display current web projects to view the change
    res.write("\nWeb projects:\n" + JSON.stringify(webProjects, null, '\n\t'));
    res.end();

})

// Listen for HTTP requests on the given port.
app.listen(PORT, () => console.log(`Running on port ${PORT}`));