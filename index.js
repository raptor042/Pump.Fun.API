import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { get, launch, remove, swap } from "./__web3__/index.js"

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get("/launch", async (req, res) => {
    const response = await launch()
    console.log(response)

    res.status(200).json(response)
})

app.get("/swap", async (req, res) => {
    const response = await swap()
    console.log(response)

    res.status(200).json(response)
})

app.get("/get", async (req, res) => {
    const response = await get()
    console.log(response)

    res.status(200).json(response)
})

app.get("/remove", async (req, res) => {
    const response = await remove()
    console.log(response)

    res.status(200).json(response)
})

app.listen(process.env.PORT || 8000, (err) => {
    err ? console.log(err) : console.log(`Connection at 8000 is successful.`)
})