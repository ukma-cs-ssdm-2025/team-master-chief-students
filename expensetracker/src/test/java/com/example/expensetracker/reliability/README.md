# Reliability Tests

This folder contains reliability tests for the Expense Tracker API. These tests help ensure the system handles errors gracefully and maintains data integrity under various conditions.

## Test Structure

### 1. ErrorHandlingReliabilityTest
**What it does:** Verifies that the system handles exceptions and errors properly without crashing.

**What it checks:**
- System doesn't crash when errors occur
- Error messages are clear and helpful
- Handles null, empty, and invalid values correctly
- Deals with special characters and extremely long strings

**How to run:**
```bash
mvn test -Dtest=ErrorHandlingReliabilityTest
```

---

### 2. ExternalFailureReliabilityTest
**What it does:** Tests how the system behaves when external dependencies fail (like database issues).

**What it checks:**
- Handles database constraint violations gracefully
- Prevents deletion of resources that are still in use
- Transaction rollbacks work correctly
- Data stays consistent after failed operations
- Read operations have proper fallback behavior

**How to run:**
```bash
mvn test -Dtest=ExternalFailureReliabilityTest
```

---

### 3. BoundaryReliabilityTest
**What it does:** Tests edge cases and boundary conditions to make sure the system handles extreme values properly.

**What it checks:**
- Null and empty values
- Minimum and maximum valid values
- Negative values
- Unicode and special characters
- String length boundaries (like 99, 100, 101 characters)

**How to run:**
```bash
mvn test -Dtest=BoundaryReliabilityTest
```

---

## Running All Reliability Tests

To run all reliability tests at once:

```bash
mvn test -Dtest=*ReliabilityTest
```

## Notes

- All tests use `AbstractPostgresContainerTest` for integration testing with a real database
- Tests automatically clean up data before each test runs
- These tests don't modify the main project structure - they're isolated

