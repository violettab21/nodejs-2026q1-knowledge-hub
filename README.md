# Knowledge Hub

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Generate Prisma

```
npx prisma generate
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Running application using docker

```
 docker-compose up --build
```

After starting the app on port (4000 as default) you access api via http://localhost:4000/.
Prisma migrate and seed are running automatically.

## Rest Api endpoints

1. User:

- POST /user
- GET /user
- GET /user/{id}
- PUT /user/{id}
- DELETE /user/{id}

2. Category:

- POST /category
- GET /category
- GET /category/{id}
- PUT /category/{id}
- DELETE /category/{id}

3. Article

- POST /article
- GET /article (Optional Query parameters are supported: status, categoryId, tag)
- GET /article/{id}
- PUT /article/{id}
- DELETE /article/{id}

4. Comment

- POST /comment
- GET /comment (Required Query parameters: articleId)
- GET /comment/{id} (implemented for tests, it wasn't mentioned in requirements)
- DELETE /comment/{id}

All GET endpoints support optional query parameters for pagination and sorting:

1. Pagination:

- page and limit query parameters should be passed to get response with pagination
- If page and limit query parameters are not provided, regular response without pagination logic will be received

2. sorting

- sortBy (field to sort by) and order (asc or desc) query parameters should be passed to get sorted response data
- If sortBy and order query parameters are not provided, sorting will not be applied even one of parameters provided

## Testing

Note: make sure that dependencies installed and prisma generated

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

To run refresh token tests

```
npm run test:refresh
```

To run RBAC (role-based access control) tests

```
npm run test:rbac
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
