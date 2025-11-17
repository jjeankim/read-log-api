import express from "express"
import { userRouter } from "./modules/users/user.route"

const app = express()

app.use(express.json())

app.get("/", (req,res) => {
  res.send('Hello Express')
})

app.use("/users",userRouter)



app.listen(4000,() => console.log("Server Started!"))