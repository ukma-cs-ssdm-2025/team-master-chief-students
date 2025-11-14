# CI/CD Raw Metrics — team-master-chief-students

The following data is collected from approximately 60 recent GitHub Actions runs (workflow: *Tests with Maven*).

## 📊 General Statistics

| Metric | Value |
|--------|--------|
| Total number of runs | ~60 |
| Successful runs | ~48 |
| Failed runs | ~12 |
| Average CI duration | 3–8 minutes |
| Average time between failure → success | 20–60 minutes |
| Run frequency | ~8–10 runs/day |

## 📘 Simplified Run Table

(Aggregated based on visible patterns; exact timestamps are available in GitHub Actions UI.)

| Run # | Status | Notes |
|------:|:-------:|--------|
| 1 | ✅ | Merge PR |
| 2 | ❌ | Test failure |
| 3 | ✅ | Fix applied |
| 4 | ❌ | Tests failed |
| 5 | ❌ | Merge conflict |
| 6 | ❌ | Tests failed |
| 7 | ❌ | Repeated tests failure |
| 8 | ✅ | Fix applied |
| 9 | ❌ | Test failure |
| 10 | ❌ | Test failure |
| 11 | ❌ | Unstable tests |
| 12 | ❌ | Build error |
| 13 | ❌ | Test suite error |
| 14 | ❌ | Conflict |
| 15 | ❌ | Tests failed |
| ... | ... | ... |
| ~60 | Mixed | Various issues |

> These raw metrics are used for calculating the DORA indicators in `dora-summary.md`.