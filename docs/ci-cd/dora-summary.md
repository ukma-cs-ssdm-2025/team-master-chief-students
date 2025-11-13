# DORA Metrics Summary — team-master-chief-students

The following DORA metrics were calculated based on approximately 60 recent GitHub Actions executions (CI-only workflow; no deployment workflow present).  
Therefore, CI-driven DORA interpretation is applied.

---

## 📐 1. Calculated Metrics

| Metric | Formula | Result | Category |
|---------|----------|:--------:|-----------|
| **Deployment Frequency** | #successful runs/week | ~56/week | **Elite** |
| **Lead Time for Changes** | mean(merge → green CI) | ~1–3 hours | **Elite** |
| **Change Failure Rate** | failed / total × 100% | 20% | **Medium / Low** |
| **Time to Restore** | mean(time to fix failed build) | ~40 minutes | **High** |

---

## 📊 2. Explanation of Results

### Deployment Frequency — *Elite*  
Approximately 8–10 CI runs per day, mostly successful.  
Equivalent to high delivery throughput.

### Lead Time — *Elite*  
Pull requests are typically merged within 1–3 hours; CI runs very fast (3–8 minutes).

### ❗ Change Failure Rate — *Medium/Low*  
20% failure rate caused by:
- unstable test suite  
- merging PRs before CI completes  
- many small commits triggering failures  

### ✔ Time to Restore — *High*  
Most issues are resolved within 20–60 minutes.

---

## 🧩 3. Overall Team Performance

Based on all four indicators:

**High Performance Team**
Very strong delivery speed and responsiveness, with moderate reliability due to test instability.