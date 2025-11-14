# ChangeLog 
 
## **v1.2.0 – November 13, 2025**

## 1. Breaking Changes / Deprecations  
**None**  
No breaking API changes or deprecated functionality were introduced in this release. All existing endpoints remain compatible.

---

## 2. Upgrade / Migration Notes
- **Dashboard & UI Refactor:** The dashboard layout was redesigned for improved usability. Check updated structure and styling dependencies before redeployment.  
- **Filtering Service:** Added cursor-based expense filtering — ensure pagination logic aligns with API consumers.  
- **Prometheus:** No new configuration required; metrics collection remains stable.  
- **Export System:** Enhanced CSV/PDF export stability; make sure required locales and fonts remain installed.   

---

## 3. Known Issues / Limitations  
- Some integration tests for CI pipeline remain disabled pending refactoring (#125).  
- Minor UI inconsistencies in the analytics view on smaller screens.  
- Occasional delay in multi-account data synchronization under heavy load.   

---

## 4. Links  
- **Diff:** [compare v1.1.0...v1.2.0](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/compare/v1.1.0...v1.2.0)  
- **Closed Issues / PRs:**  
  - [#110](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/110) - Dashboard redesign and UI improvements
  - [#111](http://github.com/ukma-cs-ssdm-2025/team-master-chief-students/pull/111) - Improve UI structure
  - [#114](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/114) - Cursor-based expense filtering  
  - [#117](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/117) - Delete team endpoint  
  - [#118](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/118) - Share and export enhancements  
  - [#120](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/120) - Codebase improvements  
  - [#122](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/122) - Performance optimization  
  - [#123](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/123) - Testing infrastructure implementation
  - [#125](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/125) - Fix CI workflow
  - [#126](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/126) - DTO validation and exception handling  
  - [#128](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/128) - Multi-account support  
  - [#131](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/131) - Authentication service tests  
  - [#135](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/135) - Time series statistics  
  - [#136](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/136) - Team analytics filters  
  - [#137](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/137) - UI enhancement and refactor

---

## 5. QA Notes  
- All unit and integration tests passed successfully on CI.  
- Disabled tests for context-init remain quarantined (`tracked via #125`).  
- New performance tests confirm improved response times (<250ms p95).  
- UI tested manually across Chrome and Edge — layout verified.  
- API tested on postman with automated tests  

---

## 6. Compatibility / Data  
No database schema or data migrations required.  
Existing configurations and API tokens remain valid across the update.  

---

## 7. Stability / Readiness  
Backward compatible with **v1.1.0**; safe minor upgrade.  
All endpoints validated, CI/CD workflows remain stable, and overall performance improved.  

---

## Summary of Changes  
This release introduces a major dashboard redesign, adds cursor-based expense filtering, multi-account support, enhanced exports, and improved validation and testing coverage.  
It focuses on improving system performance, UI experience, and maintainability while keeping full backward compatibility. 
