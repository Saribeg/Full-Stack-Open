# Full Stack open CI/CD

This repository is used for the CI/CD module of the Full stack open course

Fork the repository to complete course exercises

## Commands

Start by running `npm install` inside the project folder

`npm start` to run the webpack dev server
`npm test` to run tests
`npm run eslint` to run eslint
`npm run build` to make a production build
`npm run start-prod` to run your production build

## Github Actions
See `.github/workflows` in root monorepo folder `Full-Stack-Open`

## CI/CD Notes

In my workflow I decided to split the tagging step into two parts:

1. **Generate tag (dry-run)** → calculate the next version without pushing it.  
2. **Deploy** → use that tag as an image label for Fly.io deployment.  
3. **Push tag** → only after a successful deploy, the tag is pushed to Git.

This makes the pipeline closer to a real production setup, where the repository
tags always correspond to versions that were actually deployed.
