## Evaluation by Criteria

W - very good.
! - needs attention/improvement.

### 1. Style and Coding Standards

- W Code is formatted using `gofmt` and `goimports` – all Go files follow the standard Go formatting style [go.dev](https://go.dev/doc/effective_go#:~:text=With%20Go%20we%20take%20an,don%27t%20work%20around%20it).
- W Package and variable names conform to Go conventions: packages – lowercase (no underscores), types and exported fields – mixed CamelCase (MixedCaps)[go.dev](https://go.dev/doc/effective_go#:~:text=MixedCaps).
- W TypeScript frontend has strict compiler settings enabled (`strict`), no unused variables and parameters, which promotes code cleanliness. ESLint configured with recommended rules for React/TypeScript.
- ! Several Go files contain unused imports (`fmt` in `app.go`, `log` in many handlers) – this does not conform to Go rules (unused imports are usually removed by `go fmt` or `golangci-lint`). Should remove unnecessary imports or use them properly.
- ! Go code additionally uses `log.Println` or `fmt.Printf` for error output instead of structured logger `zap`. For consistency, should use one logging mechanism (recommended `zap`) instead of mixing with `log`/`fmt`.

### 2. Quality and Maintainability

- W Clear separation of logic into layers: HTTP handlers call services, services work with database repositories. Such architecture (Controller → Service → Repository).
- W Presence of `ApiClient` wrapper on frontend with centralized HTTP request handling and base URL configuration.
- ! Missing unit tests and integration tests for code (neither in backend nor frontend). Business logic solutions are not covered by tests – risk of regressions during modifications.
- ! Code duplication: many CRUD handlers and service methods are similar to each other (document, group, user), which complicates maintenance. Can consider template approaches (Go generics, automatic code generation or generalized utilities) to reduce repetition.
- ! Docker and `docker-compose` configuration lacks CORS check (possibly, the Gin server side has no middleware for CORS handling). Without it, the browser may block requests from different origin (e.g., Vite server). Solution: add `cors` configuration (e.g., via `github.com/gin-contrib/cors`) for safe client operation.

### 3. Security

- W `ozzo-validation` is used for validation of main request fields (e.g., `CreateDocumentRequest.Validate()`), which prevents incorrect or empty input data and makes API more resilient to simple errors.
    
- ! Password is stored in plain text. In registration (`RegRepository.Register`) password hashing (`hashed_password`) is not performed – the password itself is written to DB. This is a serious vulnerability: if the database is compromised, an attacker will get all passwords[snyk.io](https://snyk.io/blog/secure-password-hashing-in-go/#:~:text=The%20difference%20between%20hashing%20and,hashing%20is%20the%20recommended%20approach). Solution: apply secure password hashing (bcrypt, Argon2, etc.) before writing to DB[snyk.io](https://snyk.io/blog/secure-password-hashing-in-go/#:~:text=The%20difference%20between%20hashing%20and,hashing%20is%20the%20recommended%20approach).
- ! Lack of authentication. There are no endpoints for login/JWT tokens, so all APIs are publicly accessible. Need to add authentication mechanism (e.g., JWT) and corresponding middleware in Gin to protect private routes.
- ! XSS risk when rendering Markdown. If frontend uses `dangerouslySetInnerHTML` for Markdown content without prior sanitization, this can lead to XSS attacks (attacker can inject script through input Markdown)[invicti.com](https://www.invicti.com/blog/web-security/is-react-vulnerable-to-xss/#:~:text=Example%201%3A%20Using%20unsanitized%20Markdown). Solution: apply library for safe Markdown rendering (with sanitize option) or manually remove dangerous tags.
    
- ! Additionally: access control (ACL) check for documents/groups is not currently implemented. Under current model, any user can modify any document. Should provide mechanism for binding documents to users or groups and check permissions.
    

### 4. Framework Usage

- W Modern frameworks and libraries are used: `Gin` for API (lighter project) and `Go modules` – this ensures fast server startup. `uuid` library is used for unique identifiers, `envconfig` – for convenient reading of configuration from .env.
- W Frontend uses `React 19` with TypeScript, `Vite` as builder, as well as `Material-UI` (MUI) and `Emotion` for styling. Use of React Context for theming (`ThemeProvider`) and localization (`LanguageContext`) indicates design adaptability and i18n support.
- W Swagger documentation is configured: `@Summary`, `@Router` comments in code allow generating OpenAPI spec via swaggo. API documentation is easily accessible to developers.
- ! Some services use anonymous structures instead of clear DTOs. For example, in documentation statistics, a separate `StatisticsDto` can be created for clarity and Swagger auto-generation.
- ! Frontend does not use all modern capabilities: for example, a library for Markdown processing can be connected (if it's planned).

### 5. Documentation and Static Analysis

- W Project contains well-formatted `README.md`: goal description (Markdown Circus Docs), list of participants with contacts, startup instructions (requires Go and Node.js). Also has `TeamChapter.md` with team roles.
- W Docker Compose and Taskfile exist for simplified environment startup (e.g., `task: copy:env`, `task db:migrate:up`, server startup). This makes the project quick to set up.
- W `GitHub Actions` is configured: there's a `lint` job for Go static analysis (go-task, golangci-lint) and `unit-tests` (though there are no tests, but CI structure exists). Also automatic Swagger Docs deployment on push to main.
- ! `ESLint/Prettier` is not configured in CI for frontend. Currently only Go code and Go tests are checked. It's quite reasonable to add linting and TS code formatting (e.g., as CI job with `npm run lint`)[graphite.dev](https://graphite.dev/guides/best-practices-integrating-static-analysis-pull-requests#:~:text=Why%20integrate%20static%20analysis%20into,pull%20requests), to ensure consistent code style and avoid errors.
- ! Code lacks detailed comments: though there are Swagger comments for API, GoDoc over service/repository entities and TypeScript interface descriptions are missing. Also missing tools for static analysis (like Coveralls, SonarQube) and functional tests in CI.

---

## 3 Positive Aspects

1. Clear separation of responsibilities: Code is structured by layers (handlers → services → repositories). This increases code modularity and testability. Containerization with Docker Compose allows easy project startup with one set of commands.
2. Modern technology stack: Latest versions are used (Go 1.25, React 19 with TypeScript). Libraries and frameworks (Gin, Material UI, Ozzo Validation, Swagger) are applied competently. Code shows understanding and adherence to development standards on these platforms.
3. Documentation and CI: Full README with startup instructions exists, participant roles in documentation. Swagger is applied for API documentation, which facilitates client development. CI for backend is already configured – lint and migrations are run.
    

---

## 3 Improvement Suggestions

1. Secure password storage: Instead of storing password in plain text, should use bcrypt/Argon2 for hashing before saving to DB. Also worth implementing authentication mechanism (login) with JWT issuance to restrict access to private endpoints.
2. CI and tests: Add unit and integration tests (e.g., for backend services). In GitHub Actions CI expand testing: run ESLint/Prettier for frontend and test framework (Jest, Testing Library) for React. This will ensure code quality maintenance and early error detection[graphite.dev](https://graphite.dev/guides/best-practices-integrating-static-analysis-pull-requests#:~:text=Why%20integrate%20static%20analysis%20into,pull%20requests).
3. Logging and validation: Unify logging approach: use `zap` throughout code instead of transitional `log.Println`. Review error handling – possibly create separate error types (not just `ErrInternal`) for better distinction. For frontend – add Markdown sanitization (e.g., use `DOMPurify`), to protect against possible XSS attacks.
    

---

> Potential vulnerability:
> Password is stored in plain text. In User model, password is passed to DB without hashing. This means that in case of any DB leak, all passwords will become available to an attacker. Recommendation: hash password before saving (e.g., bcrypt) and return in API only hashed or not – best not to return it from API at all.

---

## Overall Conclusion

Code quality – Average. Project architecture is built correctly with clear layer distribution, code is generally clean and understandable. Project uses modern technologies and has sufficient documentation. Main areas for improvement – security (password hashing, adding authentication), improving test coverage and configuring static analysis for frontend. When the mentioned points are fixed, quality can be considered high.

## Conclusion Received from Another Team

Currently missing (will be updated when available).
