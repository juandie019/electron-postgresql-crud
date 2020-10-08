const {Client} = require('pg')

const connectionString = 'postgressql://postgres:toor@localhost:5432/electron_crud'

const client = new Client({
    connectionString:connectionString
})

client.connect()

function getConnection(){
    return client;
} 

module.exports = {getConnection}