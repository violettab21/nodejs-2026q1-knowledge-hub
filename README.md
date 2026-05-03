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

### Running app and db in docker

```
 docker-compose up --build
```

After starting the app on port (4000 as default) you access api via http://localhost:4000/.
Prisma migrate and seed are running automatically.

### Running db only in docker and app locally

1. Run db in docker via command

```
 docker run --name my_postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:16-alpine
```

2. Change env variable DATABASE_URL for localhost: postgresql://user:password@localhost:5432/postgres?schema=public

3. Generate Prisma

```
npx prisma generate
```

4. Migrate Prisma schema

```
npx prisma migrate dev
```

5. Run application

```
npm start
```

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

5. AI

- POST /ai/articles/{articleId}/summarize
- POST /ai/articles/{articleId}/translate
- POST /ai/articles/{articleId}/analyze
- POST /ai/generate
- GET /ai/usage

All GET endpoints support optional query parameters for pagination and sorting:

1. Pagination:

- page and limit query parameters should be passed to get response with pagination
- If page and limit query parameters are not provided, regular response without pagination logic will be received

2. sorting

- sortBy (field to sort by) and order (asc or desc) query parameters should be passed to get sorted response data
- If sortBy and order query parameters are not provided, sorting will not be applied even one of parameters provided

## How to test AI related endpoints

### Case1: You don't have any region restrictions for Gemini AI usage.

#### Way1: Running DB in docker and app locally

1. Navigate to https://aistudio.google.com and login
2. Create New project if you doesn't have yet
3. Click API Keys -> Create API key
4. Enter key name and select created project
5. Copy API key and pass it in env variable GEMINI_API_KEY
6. Model gemini-2.5-flash-lite can be used as alternative
7. Check instruction above how to run app locally and db in docker

#### Way2: Running DB and APP in docker

1. Navigate to https://aistudio.google.com and login
2. Create New project if you doesn't have yet
3. Click API Keys -> Create API key
4. Enter key name and select created project
5. Copy API key and pass it in env variable GEMINI_API_KEY
6. Model gemini-2.5-flash-lite can be used as alternative
7. Check instruction above how to run app and db in docker

### Case2: You have region restrictions for Gemini AI usage

#### Way1: Running DB in docker and app locally with VPN

1. Use VPN (USA preferable)
2. Open browser in incognito model
3. Navigate to https://aistudio.google.com and login
4. Create New project if you doesn't have yet
5. Click API Keys -> Create API key
6. Enter key name and select created project
7. Copy API key and pass it in env variable GEMINI_API_KEY
8. Test if GEMINI API is available locally in browser: https://generativelanguage.googleapis.com/v1/models?key=your-key
9. Check models available based on your key in response. Make sure that GEMINI_MODEL from env file is in the list.
10. Check how many requests can be sent per date for the model in https://aistudio.google.com/rate-limit?timeRange=last-28-days. Make sure that more than 0 value is present in RPD column.
11. Model gemini-2.5-flash-lite can be used as alternative
12. Check instruction above how to run app locally and db in docker

#### Way2:Running DB and app in docker with VPN

1. Use VPN (USA preferable)
2. Open browser in incognito model
3. Navigate to https://aistudio.google.com and login
4. Create New project if you doesn't have yet
5. Click API Keys -> Create API key
6. Enter key name and select created project
7. Copy API key and pass it in env variable GEMINI_API_KEY
8. Check instruction above how to run app and db in docker

If you are still facing location related issue when running in docker set up proxy (ex. Fiddler):
1. Download Fiddler if you don't have it
2. In Fiddler check port where Fiddler listens (Tools -> Options -> Connections)
3. In file ai.module.ts uncomment proxy set up for HTTP Module.
4. Check instruction above how to run app and db in docker

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
