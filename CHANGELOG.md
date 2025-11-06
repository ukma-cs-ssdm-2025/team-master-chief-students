# ChangeLog 
 
## **v1.1.0 – November 6, 2025*

## 1. Breaking Changes / Deprecations  
**None**  
No breaking API changes or deprecated components introduced in this version.

---

## 2. Upgrade / Migration Notes
- **Prometheus:** Added monitoring integration. Configure `scrape_configs` with the appropriate service ports and endpoints.  
- **File Storage:** Ensure access to directories for file saving/deletion with appropriate environment permissions.  
- **CSV/PDF Export:** Confirm availability of required fonts and locales for export rendering.  

---

## 3. Known Issues / Limitations  
- Some automated tests for context initialization remain disabled (tracked separately).  
- Minor layout inconsistencies in Swagger UI documentation.  

---

## 4. Links  
- **Diff:** [compare v1.0.0...v1.1.0](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/compare/v1.0.0...v1.1.0)  
- **Closed Issues / PRs:**  
  - [#71](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/71) - Date conversion fix  
  - [#72](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/72) - Receipt endpoint  
  - [#73](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/73) - Team Charter update 
  - [#75](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/75) - Change review-log
  - [#83](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/pull/83) - Feat/add export endpoint
  - [#84](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/pull/84) - Feat/add receipt
  - [#86](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/pull/86) - Docs/lab06
  - [#88](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/88) - Fix Checkstyle error
  - [#89](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/pull/89) - Close getReceiptFile method
  - [#90](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/pull/90) - Merged into main from Develop
  - [#94](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/94) - CSV export  
  - [#99](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/99) - Team management  
  - [#100](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/pull/100) - Add debugging-log.md
  - [#101](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/101) - Role change
  - [#102](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/102) - Fix Forbidden when changing role
  - [#104](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/104) - Simplify TeamCard and fix API endpoints for team expenses
  - [#105](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/105) - Implementation and Demonstration
  - [#106](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/pull/106) - Feat/teams 
  - [#107](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/issues/107) - PDF export  

---

## 5. QA Notes  
- Disabled flaky context-init tests — marked as quarantined (`tracking via #NNN`).  
- All other tests passed successfully on CI; coverage extended for export and receipt modules.  
- Manual verification of Prometheus endpoints and export formats completed.  

---

## 6. Compatibility / Data  
No database migrations required in this version.  
Schema remains unchanged; all existing data and configurations remain valid.  

---

## 7. Stability / Readiness  
Backward compatible with **v1.0.0**; safe minor upgrade.  
Codebase optimized, CI/CD stable, and quality gates passed successfully.  

---

## Summary of Changes  
Includes new export features (CSV/PDF), improved testing and documentation, Prometheus monitoring, and refactored endpoints for better maintainability.  
