# Full Stack Open - Part 8: GraphQL

Hello.  
This is my work for the **GraphQL** section of the [Full Stack Open](https://fullstackopen.com/en/) course.

> **Note:** If you encounter dependency installation issues due to the `mongoose` version, run the install command with `--force`.

## Time Tracking

Starting from Part 7 of the course, I began tracking my work time with **Toggl**.  
Here’s the breakdown for Part 8:

| Task                                                                                                                                                            | Time                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **FSO. Part-8a** – GraphQL server                                                                                                                               | 3&nbsp;hours&nbsp;19&nbsp;minutes      |
| **FSO. Part-8b** – React and GraphQL                                                                                                                            | 2&nbsp;hours&nbsp;47&nbsp;minutes      |
| **FSO. Part-8c** – Database and user administration                                                                                                             | 4&nbsp;hours&nbsp;26&nbsp;minutes      |
| **FSO. Part-8d** – Login and updating the cache                                                                                                                 | 2&nbsp;hours&nbsp;44&nbsp;minutes      |
| **FSO. Part-8e** – Fragments and subscriptions                                                                                                                  | 6&nbsp;hours&nbsp;47&nbsp;minutes      |
| **Course subtotal**                                                                                                                                             | **20&nbsp;hours&nbsp;3&nbsp;minutes**  |
| **FSO. Part-8 – Additional learning**                                                                                                                           |                                        |
| Adding custom scalars (including some from `graphql-scalars`) for validation                                                                                    | 1&nbsp;hour&nbsp;40&nbsp;minutes       |
| Pagination – offset-based for Authors, cursor-based for Books, cache problems and optimizations                                                                 | 7&nbsp;hours&nbsp;42&nbsp;minutes      |
| Error handling & bug fixes – `errorLink` and `retryLink` in Apollo Client, fixed `formatError` hook and custom scalars on the server, added toast notifications | 4&nbsp;hours&nbsp;12&nbsp;minutes      |
| Reading about directives in GraphQL                                                                                                                             | 25&nbsp;minutes                        |
| Implementing basic GraphQL security – query depth, cost limits, introspection toggle                                                                            | 1&nbsp;hour&nbsp;15&nbsp;minutes       |
| **Add-ons subtotal**                                                                                                                                            | **15&nbsp;hours&nbsp;14&nbsp;minutes** |
| **Total**                                                                                                                                                       | **35&nbsp;hours&nbsp;17&nbsp;minutes** |

## Installation & Run

### 1. Install dependencies in both server and client

```bash
cd Part-8/library/apollo-client
npm install

cd ../apollo-server
npm install --force
```

### 2. Create a `.env` file inside `Part-8/library/apollo-server` with at least:

```ini
TEST_MONGODB_URI=your_test_mongodb_uri
TEST_SECRET=your_test_secret
```

### 3. Start the project from the client folder

```bash
cd ../apollo-client
npm run dev
```

> This will use `concurrently` to launch both the Apollo Client (frontend) and Apollo Server (backend) at the same time.

## Extra Challenges & Lessons Learned

While working through FSO Part 8, I decided to go beyond the exercises and implement extra features — which also meant running into unexpected problems and solving them the hard way.

**Pagination & Apollo Cache**  
I added both offset-based pagination (Authors) and cursor-based pagination (Books). Offset pagination was straightforward, except Mongoose’s `toJSON` transforms don’t apply in aggregation pipelines - I had to project `_id` to `id` manually.  
Cursor pagination became tricky once I combined it with subscriptions. My old `cache.updateQuery` logic broke after introducing a custom `merge()` in Apollo’s cache - new books wouldn’t appear or showed up twice. The fix was to use `cache.modify` instead, which works in harmony with custom merge logic and normalized references.

**Error Handling**  
I centralized server-side error handling in `formatError`, unwrapping Mongoose errors (including tricky “unique” validation cases) and mapping them to proper `extensions.code` values.  
On the client, I used Apollo’s `errorLink` + `retryLink` for a robust pipeline, adding toast deduplication to avoid spamming users and fine-tuning retry behavior (e.g., skip retries for HTTP 400). I also prevented `Uncaught (in promise)` errors from mutations by explicitly handling `onError`.

These extra tasks forced me to debug deeply, understand Apollo’s cache internals, and fine-tune error handling for real-world robustness - well beyond the happy-path examples.
