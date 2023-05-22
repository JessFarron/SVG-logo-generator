const filesystem = require('./node_modules/graceful-fs/graceful-fs')
const inquirer = require("inquirer");
const {Circle, Square, Triangle} = require("./lib/shapes");
// Imports the graceful-fs, inquirer, Circle, Square, and Triangle modules.
// Defines a Svg class that has a constructor with three methods for rendering and setting the text and shape elements in the SVG string.


class Svg{
    constructor(){
        this.textElement = ''
        this.shapeElement = ''
    }

    setTextElement(text,color){
        this.textElement = `<text x="150" y="125" font-size="60" text-anchor="middle" fill="${color}">${text}</text>`
    }
    setShapeElement(shape){
        this.shapeElement = shape.render()

    }
	render(){

        return `<svg version="1.1" width="300" height="200" xmlns="http://www.w3.org/2000/svg" >${this.shapeElement}${this.textElement}</svg>`
    }
}
// Array of questions to promt
const questions = [
    {
        type: "input",
        name: "text",
        message: "TEXT: Enter up to (3) Characters:",
    },
    {
        type: "input",
        name: "text-color",
        message: "TEXT COLOR: Enter a color keyword (OR a hexadecimal number):",
    },
    {
        type: "input",
        name: "shape",
        message: "SHAPE COLOR: Enter a color keyword (OR a hexadecimal number):",
    },
    {
        type: "list",
        name: "pixel-image",
        message: "Choose which Pixel Image you would like?",
        choices: ["Circle", "Square", "Triangle"],
    },
];

// Function to write data to file
function writeToFile(fileName, data) {
	// console.log("Writing [" + data + "] to file [" + fileName + "]")
    filesystem.writeFile(fileName, data, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Your logo.svg is ready! \n \n ");
    });
}

async function init() {
    console.log("Please answer the following questions to generate your logo");
	let svgString = "";
	let svg_file = "logo.svg";

    // Store user´s answer (prompted) in an object named answers 
    const answers = await inquirer.prompt(questions);

	
	let user_text = answers.text; //var to store user´s letters for logo 
	if (answers.text.length > 0 && answers.text.length < 4) {// check if it´s 1-3 chars
		
		
	} else {// if it isn´t, will be an invalid entry 
		console.log("Invalid user text field detected! Please enter 1-3 Characters, no more and no less"); 
		return; // Stop function execution
	}
	// Asign other values to vars. When we have hyphen in names of the questions use bracket notation instead of point to acces to the information
	let user_font_color = answers["text-color"];
	let user_shape_color = answers.shape;
	let user_shape_type = answers["pixel-image"];

	// created instance of the corresponding object to be able to use the methods in them
	if (user_shape_type === "Square" ) {
		user_shape = new Square();
		// console.log("User selected Square shape");
	}
	else if (user_shape_type === "Circle" ) {
		user_shape = new Circle();
		// console.log("User selected Circle shape");
	}
	else if (user_shape_type === "Triangle" ) {
		user_shape = new Triangle();
		// console.log("User selected Triangle shape");
	}
	else {
		console.log("Invalid shape!");
		return; // Stop function execution
	}
	user_shape.setColor(user_shape_color);

	// Create a new Svg instance and add the shape and text elements to it
	let svg = new Svg();
	svg.setTextElement(user_text, user_font_color);
	svg.setShapeElement(user_shape);
	svgString = svg.render();
	
	// displays in console user´s elections
	console.log(`This were your choices: \n LETTERS - ${user_text}  FONT COLOR - ${user_font_color} \n SHAPE - ${user_shape_type}  SHAPE COLOR - ${user_shape_color} \n\n`);
	
	//Print shape to log 
	// console.log("Displaying shape:\n\n" + svgString);
	//document.getElementById("svg_image").innerHTML = svgString;

	console.log("Shape generation complete!");
	

	console.log("Writing shape to file...");
	writeToFile(svg_file, svgString); 
}
init()
