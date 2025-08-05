# Full Stack Open - Part 8: GraphQL

Hello.  
This is my work for the **GraphQL** section of the [Full Stack Open](https://fullstackopen.com/en/) course.

> **Note:** If you encounter dependency installation issues due to the `mongoose` version, run the install command with `--force`.

## Time Tracking

Starting from Part 7 of the course, I began tracking my work time with **Toggl**.  
Here’s the breakdown for Part 8:

| Task | Time |
|------|------|
| **FSO. Part-8a** – GraphQL server | 3 hours 19 minutes |
| **FSO. Part-8b** – React and GraphQL | 2 hours 47 minutes |
| **FSO. Part-8c** – Database and user administration | 4 hours 26 minutes |
| **FSO. Part-8d** – Login and updating the cache | 2 hours 44 minutes |
| **FSO. Part-8e** – Fragments and subscriptions | 6 hours 47 minutes |
| **Course subtotal** | **20 hours 3 minutes** |
| **FSO. Part-8 – Additional learning** | |
| Adding custom scalars (including some from `graphql-scalars`) for validation | 1 hour 40 minutes |
| Pagination – offset-based for Authors, cursor-based for Books, cache problems and optimizations | 7 hours 42 minutes |
| Error handling & bug fixes – `errorLink` and `retryLink` in Apollo Client, fixed `formatError` hook and custom scalars on the server, added toast notifications | 4 hours 12 minutes |
| Reading about directives in GraphQL | 25 minutes |
| Implementing basic GraphQL security – query depth, cost limits, introspection toggle | 1 hour 15 minutes |
| **Add-ons subtotal** | **15 hours 14 minutes** |
| **Total** | **35 hours 17 minutes** |


## Installation & Run

```bash
npm install --force
npm run dev
```

## Extra Challenges & Lessons Learned

While working through FSO Part 8, I decided to go beyond the exercises and implement extra features — which also meant running into unexpected problems and solving them the hard way.

**Pagination & Apollo Cache**  
I added both offset-based pagination (Authors) and cursor-based pagination (Books). Offset pagination was straightforward, except Mongoose’s `toJSON` transforms don’t apply in aggregation pipelines - I had to project `_id` to `id` manually.  
Cursor pagination became tricky once I combined it with subscriptions. My old `cache.updateQuery` logic broke after introducing a custom `merge()` in Apollo’s cache - new books wouldn’t appear or showed up twice. The fix was to use `cache.modify` instead, which works in harmony with custom merge logic and normalized references.

**Error Handling**  
I centralized server-side error handling in `formatError`, unwrapping Mongoose errors (including tricky “unique” validation cases) and mapping them to proper `extensions.code` values.  
On the client, I used Apollo’s `errorLink` + `retryLink` for a robust pipeline, adding toast deduplication to avoid spamming users and fine-tuning retry behavior (e.g., skip retries for HTTP 400). I also prevented `Uncaught (in promise)` errors from mutations by explicitly handling `onError`.

These extra tasks forced me to debug deeply, understand Apollo’s cache internals, and fine-tune error handling for real-world robustness - well beyond the happy-path examples.
