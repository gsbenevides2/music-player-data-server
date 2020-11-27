import express from 'express'
import routes from './routes'

const app = express()
const port = process.env.PORT || 5000

app.use(routes)

app.listen(port, ()=>{
 console.log("Servidor Operando na Porta:", port)
})
