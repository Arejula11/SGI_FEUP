import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import { MyContents } from './MyContents.js';
import Display from './src/Display.js';


const display = new Display();
// create the application object
let app = new MyApp(display)
// initializes the application
app.init()

// create the contents object
let contents = new MyContents(app, "scenes/main/scene_initial.json")
// initializes the contents
await new Promise(resolve => setTimeout(resolve, 1000));
contents.init()
// hooks the contents object in the application object
app.setContents(contents);

// create the gui interface object
// let gui = new MyGuiInterface(app)
// set the contents object in the gui interface object
// gui.setContents(contents)

// we call the gui interface init 
// after contents were created because
// interface elements may control contents items
// gui.init();

// main animation loop - calls every 50-60 ms.
app.render()
