# Technical Debt

## Deferred from Budget implementation review

- Add dedicated automated tests for budget:
  - budget repository create/update
  - category limits persistence
  - monthly spent calculations
  - backup export/import of budgets
  - Budget screen save flow

## Deferred from UI/design review

- Fix app lock fallback when biometrics/hardware/enrollment become unavailable after lock is enabled.
- Implement a real `new-transaction` creation route or remove the misleading primary route/tab.
- Remove the glass/translucency toggle and `GlassSurface`, or convert them to opaque tokenized surfaces.
