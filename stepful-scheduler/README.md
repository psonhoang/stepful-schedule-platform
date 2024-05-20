## Description

A NestJS (TypeScript) scheduler API server for the Stepful Scheduling Platform. The codebase follows the MVC pattern with domain-specific modules and dependency injection.

## Installation

```bash
$ npm install
```

## Database

Run postgres image and database container

```bash
$ docker compose up
```

Run database migration

```bash
$ npx prisma db push
```

Run seed script

```bash
$ npx prisma db seed
```

## Database Visualizer

To see running database, use the following command

```bash
$ npx prisma studio
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Documentation / Playground

To see documentation or interact with the API endpoints without the platform web appliaction go to `localhost:8080/docs`

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
