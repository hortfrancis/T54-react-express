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


// Helper function to find the index of a web project in the array from a UUID
function findWebProjectIndex(id) {
    return webProjects.findIndex(project => project.id === id);
}


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
});

// Add a new web project
app.post(ROUTE, (req, res) => {

    console.log("POST request received!");

    // Check for required data from the client 
    if (!req.query.title || !req.query.description || !req.query.url) {
        console.log("Missing required data");
        res.status(400).send({ error: 'Missing required data' });
        return;
    }

    // Create an object literal with the POST query data
    const newProject = {
        // Create a UUID in the Express app, not the frontend
        id: uuidv4(),
        title: decodeURIComponent(req.query.title),
        description: decodeURIComponent(req.query.description),
        url: decodeURIComponent(req.query.url)
    }

    // Add the new project to the array
    webProjects.push(newProject);

    // Send a confirmation message to the client
    res.status(201).send({ message: 'New project created successfully.' });
});

// Delete a web project 
app.delete(ROUTE, (req, res) => {

    console.log('DELETE request received!');

    // Find the web project in the array using the ID parameter
    const index = findWebProjectIndex(req.query.id);

    // If the web project exists, remove it from the array
    if (index !== -1) {
        webProjects.splice(index, 1);
        // Use 204 to indicate successful DELETE request with no response body
        res.status(204).send({ message: 'Project deleted successfully.' }); 
    } else {
        // If the web project doesn't exist, return a 404 error
        res.status(404).send({ error: 'Web project not found' });
    }

});


// Edit a web project 
app.put(ROUTE, (req, res) => {

    console.log('PUT request received!');

    // Get the requested project using the id provided 
    const index = findWebProjectIndex(req.query.id);

    if (index !== -1) {
        // Assign new values 
        const currentProject = webProjects[index];
        currentProject.title = req.query.title;
        currentProject.description = req.query.description;
        currentProject.url = req.query.url;

        // Use 204 to indicate successful PUT request with no response body
        res.status(204).send({ message: 'Project edited successfully.' }); 
    } else {
        res.status(404).send({ error: 'Web project not found' });
    }

});

/* END OF ROUTING METHODS */

// Listen for HTTP requests on the port specified
app.listen(PORT, () => console.log(`Listening for HTTP requests on port ${PORT}`));