# Team Charter

## 1. Basic Information
- **Team Name**: Master Chief Students
- **Members**:
    - Єрмолович Захар Максимович (GitHub: @Ermolz, електронна пошта НаУКМА: z.yermolovych@ukma.edu.ua )
    - Загоруй Нікіта Євгенович (GitHub: @nikkkitosss, електронна пошта НаУКМА: n.zahorui@ukma.edu.ua)
    - Костенко Нікіта Сергійович (GitHub: @nikitakost, електронна пошта НаУКМА: n.kostenko@ukma.edu.ua)
    - Слободян Володимир Олександрович (GitHub: @opitral, електронна пошта НаУКМА: v.slobodian@ukma.edu.ua)

## 2. Roles and Responsibilities
- **Repo Maintainer, Quality Lead, Backend Lead, Code Reviewer**: Єрмолович Захар
- **CI Maintainer, Requirements Lead, Integration Lead, Security Analyst**: Слободян Володимир
- **Documentation Lead**: Загоруй Нікіта
- **Issue Tracker Lead, Traceability Lead, Quality Lead, Review Manager**: Костенко Нікіта

## 3. Communication Plan
- **Primary Channel**: Discord
- **Meeting Schedule**: 1-2 mandatory meetings, additional meetings as needed. On weekends and after practice sessions.
- **Response Expectations**: 6 hours

## 4. Collaboration and Workflow

### Branching Strategy
We create **feature branches** for new functionality. After completing work, we create a Pull Request to main for integrating changes.

### Commit Practices

1. **Commit Frequency**
   - Commits are made after completing a functional block, not for minor changes.
   - Each commit should contain a logically complete code change.

2. **Commit Message Format**
   We use the standard format:
   ```
   <type>: <short description>
   ```
   
   **Commit Types**:
   - `feat` — new functionality
   - `fix` — bug fix
   - `docs` — documentation changes
   - `chore` — miscellaneous changes that don't affect functionality (e.g., dependency updates)
   
   The first line is a short description of changes (maximum 50 characters).
   The second paragraph is not used — we don't describe changes in detail.

### Code Review Rules
- **Who reviews**: At least one colleague, not the author of the changes.
- **What we check**: Logic, code style, performance, documentation.
- **Process**: All changes go through Pull Request. PR is merged only after review and passing tests.

### Task Workflow
Open task → Assign responsible person → Work → Create PR → Pass review → Close task

## 5. Conflict Resolution
- **Conflict Resolution Plan**: Disagreements are resolved through discussion at meetings. If needed, majority vote among team members.

## 6. Availability and Workload
- **Member Availability**:
  - Ermolovych Zakhar: 6 hours
  - Zahorui Nikita: 5 hours
  - Kostenko Nikita: 7 hours
  - Slobodian Volodymyr: 6 hours

## 7. Coding Standards and Quality Policy

### Style Guide

#### Backend (Java + Spring Boot)
- We follow the [**Google Java Style Guide**](https://google.github.io/styleguide/javaguide.html).
- Guiding principles: **SOLID**, **Clean Code**, **DRY**.
- We use **DTOs** for data transfer between layers and controllers.
- Controllers contain only HTTP logic; business logic is located in services.
- Class and method naming — `PascalCase` and `camelCase` respectively.
- Controller testing — through **JUnit 5**, **MockMvc**, and **Mockito**.

#### Frontend (React + Tailwind CSS)
- Project architecture is built on **Feature-Sliced Design (FSD)** principles.
- We follow the [**Airbnb JavaScript Style Guide**](https://github.com/airbnb/javascript).
- React components are **functional**, no classes.
- Styling is done through **Tailwind CSS**, avoiding inline styles.
- Minimize repetition — extract common UI elements into separate `shared` components.

### Required Tools

#### Backend (Java + Spring Boot)
- **Lombok** — reducing boilerplate code (`@Getter`, `@Setter`, `@Builder`, constructors, etc.)
- **JUnit 5 + Mockito + Spring MockMvc** — unit and integration testing of controllers and services
- **Spring Security Test** — for testing security and authentication
- **Swagger / OpenAPI (springdoc-openapi)** — REST API documentation
- **Spring Boot Starter Data JPA** + **PostgreSQL** — ORM and database
- **JWT (jjwt-api, jjwt-impl, jjwt-jackson)** — working with access tokens

#### Frontend (React + Tailwind CSS)
- **React** — library for building UI
- **React Router Dom** — routing between pages
- **Vite** — fast build and project startup
- **Tailwind CSS** + **@tailwindcss/postcss** + **PostCSS** + **Autoprefixer** — component styling
- **ESLint** + **@eslint/js** + **eslint-plugin-react-hooks** + **eslint-plugin-react-refresh** — code style checking
- **TypeScript types for React** (`@types/react`, `@types/react-dom`) — IDE assistance and typing

#### Common Tools
- **Git + GitHub** — version control system and code review
- **CI/CD** (GitHub Actions) — automatic testing and checks before merging

### Peer Review Steps

1. **Creating a Pull Request (PR)**
   - Each new feature or fix is created in a separate branch.
   - PR is created from the feature branch to `develop` or release branch.

2. **Automatic CI/CD Checks**
   - **Check Commit Message** — checking commit format
   - **Generate API Docs** — generating REST API documentation
   - **Java CI with Maven & Docs Generation** — backend build and unit tests
   - **pages-build-deployment** — frontend build and page readiness check

3. **Code Review by Other Team Members**
   - Reviewing code changes, checking style, architecture, and logic.
   - Identifying potential bugs or technical debt.
   - Comments and suggestions in PR.

4. **Fixing Comments**
   - PR author makes corrections according to feedback.
   - Re-running CI/CD checks.

5. **Approval and Merge**
   - After approval by at least one (or two) reviewers, PR can be merged into `develop` / `main`.
   - Squash/merge possible depending on team policy.

6. **Closing PR and Updating Local Branches**
   - After merging, each member updates local branches (`git pull`) to synchronize with remote repo.

## 8. Ethical and Professional Conduct
- **Shared Principles**:
  - Clarity and transparency — all changes and tasks should be clear to the team.
  - Code quality — following code style, writing tests, avoiding technical debt.
  - Responsibility — everyone is responsible for their changes and tasks.
  - Collaboration — helping each other, discussing solutions, and supporting the work process.

## 9. Signatures
## 9. Підписи
- [x] Єрмолович Захар (GitHub: @Ermolz)
- [x] Загоруй Нікіта (GitHub: @nikkkitosss)
- [x] Костенко Нікіта (GitHub: @nikitakost)
- [x] Слободян Володимир (GitHub: @opitral)