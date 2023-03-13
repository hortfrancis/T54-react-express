const express = require('express');
const cors = require('cors');

// To make unique IDs for each web project
const { v4: uuidv4 } = require('uuid');

const app = express();

// Allow cross-origin requests from all origins
app.use(cors())

// Body-parser is deprecated, use express.json() to access data in the body of the HTTP requests instead
app.use(express.json());

// Specify the port number as a variable for development and production environments
const PORT = process.env.PORT || 8080;

// Store the API route as a variable
const ROUTE = '/api';


// Initialise array of default web project data
const webProjects = [
    {
        id: uuidv4(),
        title: "React Game!",
        description: "Tic tac toe game created using 'Create React App'.",
        url: "http://heroku/myapp/game/"
    },
    {
        id: uuidv4(),
        title: "Online store",
        description: "Online store created with HTML, CSS and JavaScript.",
        url: "https://git.com/myrepos/shop/index"
    }
];


/*  ROUTING METHODS */

// Return information on all web projects
app.get(ROUTE, (req, res) => {
    console.log("GET request received!");
    res.send(JSON.stringify(webProjects));
})

// Add a new web project
app.post(ROUTE, (req, res) => {

    // Create an object literal with the POST query data
    const newProject = {
        // Create a UUID in the Express app, not the frontend
        id: uuidv4(),
        title: decodeURIComponent(req.query.title),
        description: decodeURIComponent(req.query.description),
        url: decodeURIComponent(req.query.url)
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

    console.log(req.query);

    // Find the web project in the array using the ID parameter
    
    const index = webProjects.findIndex(project => project.id === req.query.id);

    // If the web project exists, remove it from the array
    if (index !== -1) {
        webProjects.splice(index, 1);
        res.write("DELETE request executed!");
        res.write("\nWeb projects:\n" + JSON.stringify(webProjects, null, '\n\t'));
        res.end();
    } else {
        // If the web project doesn't exist, return a 404 error
        res.status(404).send('Web project not found');
    }

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

/* END OF ROUTING METHODS */

// Listen for HTTP requests on the port specified
app.listen(PORT, () => console.log(`Listening for HTTP requests on port ${PORT}`));