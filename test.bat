start /min "mongo-server" mongod
start /min "node-server" node server
start /min webdriver-manager start
timeout 3
call protractor test/conf.js
taskkill /fi "WindowTitle eq mongo-server"
taskkill /fi "WindowTitle eq node-server"
taskkill /fi "WindowTitle eq webdriver-manager   start"
