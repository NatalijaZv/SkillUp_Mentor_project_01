import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import express from 'express'
import Logging from 'library/Logging'

import { AppModule } from './modules/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    bufferLogs: true,
  })
  app.enableCors({
    //very important - if we dont have enabled CORS the api request we are sending from frontend will not reach backend!
    origin: ['http://localhost:3000'],
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())
  //Setup to display files
  app.use('/files', express.static('files')) //app.use() -> Express function - it is used to set up middleware for your app -> syntax: app.use(path, callback)
  //express.static('files')  is used to serve static files(like images,CSS files JS files...) syntax: express.static(root, [options])  -the root argimentspecifies the root directory from which to serve static files
  const PORT = process.env.PORT || 8080
  await app.listen(PORT)
  Logging.log(`App is listening on : ${await app.getUrl()}`)
}
bootstrap()
