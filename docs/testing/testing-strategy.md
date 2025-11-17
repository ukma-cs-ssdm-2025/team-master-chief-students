# Testing Regulations

## 1. Description
This document defines mandatory rules and standards aimed at ensuring stability, maintainability, and overall test quality.  
Compliance with these regulations is the responsibility of each team member.

---

## 2. Test Writing Standards

### 2.1. "Arrange-Act-Assert" (AAA) Structure
Each test must have clearly separated blocks:
- **Arrange** — data preparation
- **Act** — action execution
- **Assert** — result verification

It is recommended to use blank lines or comments for visual separation of sections.

---

### 2.3. Single Responsibility Principle
One test case should verify **one logical aspect** of functionality.  
A test should have one, and only one, reason to fail.

---

### 2.4. Boundary Value Analysis
Testing must necessarily include verification of boundary conditions:
- `null`, `BigDecimal.ZERO`
- empty strings and collections
- negative numbers
- maximum allowable values, etc.

---

## 3. Bug Fixing Process

### 3.1. Step 1: Reproduction
The defect must be stably reproduced.  
A new test case is created that simulates the conditions of the error occurrence and **fails**.

### 3.2. Step 2: Isolation and Diagnosis
Analysis is conducted to identify the root cause.  
It is recommended to use:
- debugger (breakpoints in IntelliJ IDEA)
- `DEBUG` level logs
- `stack trace` analysis

### 3.3. Step 3: Fix
**Minimally necessary code** is introduced to eliminate the root cause of the defect.

### 3.4. Step 4: Verification
- Run the test that previously failed — it should now pass.
- Run the full test suite (`mvn test`) to verify absence of side effects.

---

## 4. Codebase and Test Maintenance

### 4.1. Test Refactoring
Tests are a full part of the codebase.  
The same code cleanliness standards apply to them.  
It is recommended:
- Extract repeated data into helper methods or `@BeforeEach`
- Use meaningful variable names
- Avoid duplication

### 4.2. Test Updates
When functionality is changed or removed, tests **are updated or removed** in the same Pull Request.

### 4.3. Regular Test Updates
Monthly review of critical module coverage is recommended to add new scenarios.

### 4.4. Commenting Complex Scenarios
If a test verifies complex or non-obvious business logic — a brief comment explaining it should be added.

---

## 5. Tooling

### 🔹 Main Framework: **JUnit 5 (Jupiter)**
- **Purpose:** unit and integration tests
- **Main annotations:** `@Test`, `@BeforeEach`, `@AfterEach`, `@BeforeAll`, `@AfterAll`, `@Disabled`, `@DisplayName`

---

### 🔹 Spring Component Testing

#### @WebMvcTest
- **Purpose:** testing REST controllers without loading full context
- **Advantages:** fast execution, web layer isolation

#### @DataJpaTest
- **Purpose:** testing JPA repositories with in-memory database (H2)
- **Advantages:** fast verification of DB queries without starting the application

#### @SpringBootTest
- **Purpose:** E2E testing with full context
- **Advantages:** used for critical integration scenarios

---

### 🔹 Dependency Isolation: **Mockito**
- **Purpose:** creating mocks for services, repositories, APIs
- **Main capabilities:**  
  `when()`, `verify()`, `@Mock`, `@InjectMocks`

---

### 🔹 Coverage Measurement: **JaCoCo**
- **Execution:**
    - `mvn clean test jacoco:report` — generate report
    - `mvn jacoco:check` — check minimum thresholds
- **Minimum thresholds:**
    - Overall coverage ≥ 80%
    - Services/repositories ≥ 90%
    - Controllers ≥ 85%

---

### 🔹 CI/CD: **GitHub Actions**
- **Purpose:** automatic test execution on each push/PR
- **Main steps:** setup JDK → run tests → check coverage → report

---

### 🔹 Static Code Analysis
| Tool | Purpose |
|-------------|--------------|
| **Checkstyle** | Code style control |
| **SpotBugs** | Potential bug detection |
| **PMD** | Code smell and suboptimal construction detection |

---

## 6. Check Types and Their Purpose

| Check Type | What it checks | When executed | Tools |
|----------------|--------------|------------------|--------------|
| **Static code analysis** | Style, potential errors | On each push | Checkstyle, SpotBugs, PMD |
| **Unit tests** | Individual methods/classes | On each push | JUnit + Mockito |
| **Web Layer Tests** | REST API, routing, JSON | On each push | @WebMvcTest |
| **Integration tests** | Full flow (Controller → DB) | On PR to develop/main | @SpringBootTest |
| **Repository Tests** | JPA queries | On each push | @DataJpaTest |
| **Code Coverage Gate** | Code coverage percentage | On PR to develop/main | JaCoCo |

---

## 8. Best Practices

### 8.1. Test Execution Speed
- Use **mocks** instead of real dependencies
- Minimize number of `@SpringBootTest`
- Don't make real HTTP requests to external APIs

### 8.2. Test Isolation
- Each test — independent
- Don't depend on execution order
- Each test creates its own data

### 8.3. Using Constants
- Frequently used data is stored in `TestConstants` or `TestDataBuilder`

### 8.4. Exception Verification
- Use `assertThrows()`
- Verify exception message if it has business value

### 8.5. Avoiding Code Duplication
- Extract repeated logic into helper methods, `@BeforeEach`, or builder classes
- Tests must be **clean, short, and understandable**
