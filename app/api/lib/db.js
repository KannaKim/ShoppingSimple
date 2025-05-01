// db.js
import postgres from 'postgres'
console.log(process.env.PASSWORD)
const sql = postgres({
    host                 : process.env.HOST,            // Postgres ip address[s] or domain name[s]
    port                 : process.env.PSQL_PORT,          // Postgres server port[s]
    database             : process.env.DB,            // Name of database to connect to
    username             : process.env.PSQL_USERNAME,            // Username of database user
    password             : process.env.PASSWORD            // Password of database user
  })

export default sql