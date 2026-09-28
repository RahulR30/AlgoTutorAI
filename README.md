# AlgoTutorAI

An algorithm-practice application with a React editor, an Express API, MongoDB-backed submissions, and a server-side code executor. The backend grades each test case and records submission results for progress tracking.

## Engineering overview

- **Frontend:** React 18, Monaco Editor, React Query, Tailwind CSS.
- **API:** Express, Mongoose, JWT authentication, bcrypt password hashing, rate limiting.
- **Execution:** generated language wrappers run submitted functions against problem inputs; results include correctness, elapsed time, and execution errors.
- **Persistence:** problem definitions, user accounts, and submission records live in MongoDB.

A submission travels from the editor to `POST /api/problems/:id/submit`, through the executor, then into a submission record and the user's progress statistics.

## Executor reliability

The regression suite exercises actual JavaScript and Python subprocesses. It checks that programs which crash or time out cannot pass merely by printing the expected output, that JSON inputs survive Python decoding, and that simultaneous submissions use distinct temporary directories. Temporary files are cleaned up after unexpected failures.

```bash
npm test --prefix backend
```

These tests require Node.js 22+ and Python 3 on PATH. They use Node's built-in test runner and need no npm installation, database, or API credentials. The timeout case takes approximately ten seconds. GitHub Actions runs the suite on Node 22 and 24.

## Run locally

Requirements: Node.js 22+, npm, Python 3, and a MongoDB instance.

```bash
git clone https://github.com/RahulR30/AlgoTutorAI.git
cd AlgoTutorAI
npm install
npm install --prefix backend
```

Create `backend/.env`:

```dotenv
PORT=5001
MONGODB_URI=mongodb://localhost:27017/algotutor-ai
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:3000
```

Start the API from the backend directory so its environment file is loaded:

```bash
cd backend
npm run dev
```

In another terminal, start the frontend from the repository root:

```bash
npm start
```

The frontend runs at `http://localhost:3000` and defaults to `http://localhost:5001/api`. To change the API host, set `REACT_APP_API_URL` in a root `.env` file before starting or building the frontend. Problem records must be populated separately; an empty database has no practice catalog.

## Repository map

- `src/`: frontend pages, editor, authentication context, and API client.
- `backend/routes/`: authentication, problems, and user endpoints.
- `backend/models/`: users, problems, and submissions.
- `backend/services/codeExecutor.js`: language wrappers, process execution, grading, and cleanup.
- `backend/test/`: executor regression tests.

## Current limits

The executor runs code as operating-system processes, **not in a security sandbox**. Use locally with trusted code; public execution needs isolation, resource controls, and a separate worker boundary. Java and C++ wrappers exist but are not covered by this regression suite. JavaScript object inputs use property insertion order as argument order; Python object inputs use keyword arguments.

`backend/routes/ai.js` contains experimental Ollama integrations, but the current server does not mount those routes. A deployed frontend alone does not demonstrate a working AI service or grading backend.

## Contributing

Reproduce the issue, add a regression case, run the backend tests, and submit a focused PR describing the failing behavior and the fix. Please include the input that reproduces grading or execution errors.
