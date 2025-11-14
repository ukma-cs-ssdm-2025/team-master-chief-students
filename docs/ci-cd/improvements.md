# Root Cause Analysis & CI/CD Improvement Backlog

This document summarizes the main sources of instability and proposes actionable improvements based on ~60 recent GitHub Actions runs.

---

# 🧠 Root Cause Analysis

## 🔻 Technical Issues
1. **Unstable (flaky) tests**  
   - Missing mocks, inconsistent execution conditions.

2. **Large or complex pull requests**  
   - PRs include code + documentation + formatting changes, making stabilization harder.

3. **Non-isolated test cases**  
   - Some tests depend on the order of execution.

---

## 🔻 Process / Cultural Issues
1. **Merging PRs before CI finishes**  
   - Causes immediate failures in the `develop` branch.

2. **High commit frequency and CI spam**  
   - Many small commits increase the probability of failures.

3. **No pre-merge testing**  
   - All tests run *after* a merge → late feedback loop.

4. **Documentation-only PRs also trigger CI**  
   - Creates unnecessary CI load.

---

# 📋 Improvement Backlog

| Metric | Problem | Root Cause | Improvement Action | Owner |
|--------|----------|-------------|----------------------|--------|
| Lead Time | Occasional delays | Large PRs | Enforce PR size limit (<300 LOC) | Team Lead |
| Lead Time | Re-running CI | Unstable tests | Add mocks; stabilize critical tests | Backend Team |
| Failure Rate | 20% CFR | PR merged before CI | Enable branch protection + required checks | DevOps |
| Failure Rate | Flaky tests | Unstable test code | Rewrite or isolate flaky tests | Backend |
| DF | Excessive CI load | Frequent small commits | Use squash merges; reduce unnecessary commits | Team |
| DF | CI triggered on docs changes | No path filtering | Use `paths-ignore` for docs-only PRs | CI Admin |
| MTTR | Slower fixes during high activity | No PR ownership | Assign PR owners/responsibles | Team Lead |
| MTTR | Repeated failures | No local test execution before push | Add pre-commit test hook | All Developers |

---

# 🟦 Summary

Addressing test stability, merge discipline, and CI configuration will lead to:

- CFR reduction from 20% → 5–10%  
- MTTR improvement toward Elite-level  
- Lower CI load and fewer wasted runs  
- More predictable and stable delivery pipeline
