# 🗺️ Technical Roadmap

| Priority | Item                                  | Description                                                                                                         |
| -------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1        | **Refactor Search Pages**             | Extract `useSearchParams`, `SearchPresenter`, `SearchSections` to reduce size of `SearchPage` / `SearchByTypePage`. |
| 2        | **Extract Header Search Logic**       | Create `SearchBarContainer` (state + hooks) leaving `Header` purely presentational.                                 |
| 3        | **Delegate Navigation to Containers** | Pass `onSelect` to cards/sections; remove `window.open` / `navigate` inside UI components.                          |
| 4        | **Centralise API Limits**             | Create `src/constants/limits.ts` to remove magic numbers.                                                           |
| 5        | **DTOs & Mappers Layer**              | Introduce mapping layer to break direct dependency on Spotify SDK structures.                                       |

> Phases **1** and **2** will be implemented first for quick wins in readability and to keep full compatibility with the current UI.
