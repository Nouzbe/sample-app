Sample-app is a [MEAN](https://github.com/linnovate/mean/blob/master/README.md) based wanna-be-simplest generic web application, to be used as a starting point to create specific applications.

MEAN stands for [MongoDB](http://www.mongodb.org/), [Express](http://expressjs.com/), [AngularJS](http://angularjs.org/) and [Node.js](http://www.nodejs.org/). 

## Install
**1 - Get node and mongo installed. Check the links above if needed.**

**2 - Install the project**
>$ path\to\app\root>npm install

## Start
**1 - Don't forget to start your mongo server**

>$ path\to\mongo\bin>mongod

**2 - Start your node server**

>$ path\to\app\root>node server

**3 - Open a browser and go to**
>http://localhost:3000


## Debug the server
We use [node-inspector](https://github.com/node-inspector/node-inspector/blob/master/README.md).

**1 - Get it**

>$ wherever>npm install -g node-inspector

**2 - Start a debugger instance :**
>$ wherever>node-inspector

You will be able access the debugger at http://127.0.0.1:8080/?ws=localhost:8080&port=5858, and it will try to connect by default to port 5858 (so at first it will not get hooked to anything, that's normal)

**3 - Start your application in debug mode**
>$ path\to\app\root>node --debug server

This will listen by default to port 5858, so if you open http://127.0.0.1:3000, you'll get the app, and if you refresh http://127.0.0.1:8080/?ws=localhost:8080&port=5858, hopefully your debugger will have connected to your node server. Now you can debug !


## Debug the client
You can do that by using [Chrome DevTools](https://developer.chrome.com/devtools).


## Get a glance at the data
We recommend [Robomongo](http://robomongo.org/). It's a nice mongo client GUI.


## Test the application
We use [Protractor](https://github.com/angular/protractor). It's an end to end test framework for AngularJS applications, based on Selenium and built on top of WebDriverJS.

**1 - Get it**

>$ wherever>npm install -g protractor

>$ wherever>webdriver-manager update --standalone

**2 - Start your node server**

See above.

**3 - Start your webdriver**

>$ path\to\app\root\test>webdriver-manager start

Also note that you need java to use that.

**4 - Launch the tests suite**

>$ path\to\app\root\test>protractor todo-spec.js

**5 - Write more tests**

Take examples in todo-spec.js. 