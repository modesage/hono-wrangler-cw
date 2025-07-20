import { Hono } from 'hono'
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from '@prisma/extension-accelerate';

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post("/api/v1/signup", async (c) => {
  const body = await c.req.json();
  const prismaClient = new PrismaClient({
    //@ts-ignore
    //it will take the secret from cloudflare worker env
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  const user = await prismaClient.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password
    }
  })

  return c.json({
    message: "User signup endpoint",
    userId: user.id
  })
})

app.post("/api/v1/signin", (c) => {
  return c.json({
    message: "User signin endpoint"
  })
})

app.use(async (c, next) => {
  if (c.req.header("Authorization")) {
    // Do validation
    await next()
  } else {
    return c.text("You dont have acces");
  }
})

app.post("/api/v1/todo", (c) => {
  return c.json({
    message: "Post Todo endpoint"
  })
})

app.get("/api/v1/todo", (c) => { 
  return c.json({
    message: "Get Todo endpoint"
  })
})

export default app
