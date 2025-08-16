# Exercise 11.1. Assuming that the application is coded with `Go`.

## Common steps in a CI setup (Go ecosystem)

- **Linting**

  - `go vet` – native Go command for catching suspicious constructs.
  - `gofmt` – native formatter, ensures code style consistency.
  - `golangci-lint` – community tool that aggregates many linters (e.g. `staticcheck`, `ineffassign`).

- **Testing**

  - `go test ./...` – native test runner, covers unit and integration tests.
  - Options: `-race` for race detection, `-cover` for coverage reports.
  - `testify` – popular assertion library (external, installed via Go modules).

- **Building / Packaging**
  - `go build` – native Go command to compile the binary.
  - `goreleaser` – external tool that automates cross-compilation, packaging, release notes, and Docker images.

---

## Alternatives to Jenkins and GitHub Actions

- GitLab CI
- CircleCI
- Buildkite
- Azure Pipelines
- Bitbucket Pipelines
- TeamCity
- Travis CI (legacy but still used)

All of these support Go projects, the main differences are in pricing, UI, and runner flexibility.

---

## Self-hosted vs Cloud-based

To make a decision I need the following information:

- Security and compliance requirements (e.g. handling of secrets, data residency, ISO/SOC2).
- Expected build frequency and duration (to estimate cost of cloud minutes vs owning hardware).
- Need for **custom runners** – own servers for CI jobs, usually required when we want more resources or a special environment.
- Access to **internal networks** – some companies have private services and repositories that can only be reached from inside the corporate network.
- Artifact storage requirements – where to keep build outputs (binaries, logs, caches) so they are available for reuse or debugging.
- Team’s experience with maintaining infrastructure.

My assessment:

- A **cloud-based CI** is usually the better default: quick setup, minimal maintenance, and predictable workflow. This works especially well for small or medium teams.
- A **self-hosted setup** becomes relevant if there are strong compliance or security requirements, a need for full control over the environment, or very heavy workloads where cloud minutes turn too costly.

---
