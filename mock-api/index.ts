import UserController from './src/controllers/user/user.controller';
import { create, defaults, router } from 'json-server';
import * as bodyParser from 'body-parser';

create()
  .use(
    defaults(),
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json(),
    UserController.ROUTES,
    router('./src/db/db.json')
  )
  .listen(3001, () => console.log('Run Auth API Server'));
