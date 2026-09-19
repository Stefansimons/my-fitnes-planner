 # My Fitness Planner - Architecture Audit

 ## 1. Scope

 This document records the current architecture before the Angular modernization. The goal is to preserve the working legacy version as a reference and define a safe migration path.

 ## 2. Current technology

 - Angular 12.2.x with the classic `NgModule` architecture
 - TypeScript 4.3.x
 - RxJS 6.6.x
 - Angular CLI 12.2.x
 - Angular Material 12 and Bootstrap 5
 - Firebase Authentication and Cloud Firestore through `@angular/fire/compat`
 - Node.js 14.19.0 and npm 8.5.0 are declared in `package.json`
 - Express is used by `server.js` for serving the built application

 ## 3. Current module structure

 ### AppModule

 `AppModule` is the root module. It initializes Firebase, imports the shared and Material modules, configures animations and reactive forms, and bootstraps `AppComponent`.

 ### Core module

 The Core area contains the home page and authentication guards:

 - `AuthGuard` protects authenticated routes.
 - `RoleGuard` protects role-specific routes.
 - `ResolveGuard` loads data before selected training routes are displayed.
 - `HomeComponent` is the main public page.

 ### Shared module

 `SharedModule` contains reusable UI components and cross-cutting services:

 - Header, footer, login, register, spinner and toast components
 - `AuthenticationService`
 - `UserService`
 - `FirestoreService`
 - `SpinnerService`, `ToastService`, `HelperService` and message handling

 ### Training module

 The Training feature is lazy-loaded at `/training` and contains:

 - `TrainingComponent` for creating or editing a workout
 - `TrainingListComponent` for filtering, sorting and paginating workouts
 - `StatisticsComponent` for training statistics
 - `TrainingFormComponent` for the workout form
 - `TrainingService` for workout state, search, sorting and persistence orchestration

 ### Nutrition module

 The Nutrition feature is lazy-loaded at `/nutrition` and currently contains the dashboard. Access is protected by `RoleGuard`.

 ## 4. Routing

 - `/home` -> `HomeComponent`
 - `/login` -> `LoginComponent`
 - `/register` -> `RegisterComponent`
 - `/training` -> lazy-loaded `TrainingModule`, protected by `AuthGuard`
 - `/nutrition` -> lazy-loaded `NutritionModule`, protected by `RoleGuard`
 - `/training/list` -> training list with `ResolveGuard`
 - `/training/statistics` -> training statistics
 - Empty path redirects to `/home`

 ## 5. Current data flow

 1. `AuthenticationService` signs users in or out through Firebase Authentication.
 2. `UserService` loads the user's Firestore document and keeps user and training values in RxJS `Subject`/`BehaviorSubject` instances.
 3. User data is also copied to browser `localStorage` under `userData`.
 4. `TrainingService` reads the current user's workouts, applies search, sorting and pagination, and calls `FirestoreService` for updates.
 5. `FirestoreService` is the direct persistence layer for user documents and authentication operations.
 6. Components subscribe to service observables and use service setters or methods to update state.

 ## 6. Current domain model

 The main domain is a user with a collection of workouts:

 - `Training`: date, type, exercises, active flag and update timestamp
 - `Exercise`: name and series
 - `Series`: repetitions and weight
 - `User`: authentication/profile data and workouts

 Firebase document data is currently used directly as application data. There is no separate domain model, API DTO model or adapter layer yet.

 ## 7. Known architecture and maintenance issues

 - The application uses Angular 12 `NgModule` patterns instead of standalone components.
 - AngularFire compatibility APIs and a mixture of Firebase API styles are used.
 - `TrainingService` owns persistence orchestration, local state, filtering, sorting, pagination and UI loading coordination.
 - User and training state is spread across services, component subscriptions and `localStorage`.
 - Firebase documents are exposed directly to feature code; DTO-to-domain mapping is missing.
 - Several services contain mutable state and public subjects.
 - `any` and weakly typed Firebase responses are present in authentication and persistence flows.
 - Some components contain business logic that should move to a facade or feature service.
 - RxJS subscriptions and loading/error handling should be reviewed for consistent cleanup and composition.
 - Legacy Angular concepts such as `entryComponents` and compatibility modules should be removed during the upgrade.
 - The test suite contains unit tests, but a complete user-flow smoke/E2E test is not yet documented.

 ## 8. Legacy assessment

 ### Strengths to preserve

 - Feature boundaries already exist for Training and Nutrition.
 - Training and Nutrition are lazy-loaded instead of being loaded by the root module.
 - Authentication, role protection and route resolution are separated into guards.
 - Firebase persistence and authentication are already isolated in services rather than called directly from every component.
 - Training, Exercise and Series have dedicated TypeScript interfaces.
 - Reactive Forms, unit-test files and shared UI components are already present.
 - The existing application provides a useful behavioral reference for regression testing.

 ### Risks to address

 - `AppModule` imports `environment.prod` directly, which can bypass the intended environment replacement flow.
 - Authentication error handlers return raw errors instead of an Observable error result.
 - `TrainingService` combines UI state, filtering, pagination, persistence and loading coordination.
 - Firebase DTOs are used as application data without a typed adapter or domain boundary.
 - User data and authentication state are copied to `localStorage`, creating consistency and security risks.
 - Mutable subjects, weak typing and `any` make state changes difficult to trace.
 - The Angular 12 and AngularFire compatibility stack increases upgrade and maintenance cost.

 ### Baseline rating

 The legacy version is a workable educational CRUD baseline with a reasonable feature structure, but it is not yet a clean production architecture. The modernization should preserve its routing, feature separation and working user flows while reducing coupling between components, state and Firebase.

 ## 9. Target architecture

 The intended architecture is feature-based and separates responsibilities:

 ```text
 UI components
	 -> Feature Facade / Signals state
	 -> API service
	 -> Adapter
	 -> Firestore / Firebase
					|
			 Domain models
 ```

 Target principles:

 - Standalone components and modern Angular template syntax
 - Clear feature boundaries for Training and Nutrition
 - Facades as the public API used by components
 - Signals for local and derived UI state; RxJS for asynchronous streams
 - API services limited to Firebase/HTTP communication
 - Adapters that map Firebase DTOs to typed domain models and back
 - Reactive Forms with typed validation and minimal form logic in templates
 - `OnPush` change detection and stable tracking for rendered lists
 - Consistent loading, error and empty states
 - Unit, component/integration and E2E coverage for critical workflows

 ## 10. Migration order

 1. Keep `chore/legacy-version` unchanged as the reference baseline.
 2. Record a successful build, test run and manual smoke test.
 3. Upgrade Angular and related packages in compatible steps.
 4. Modernize routing and convert the first small feature to standalone components.
 5. Introduce typed domain models, API services and adapters.
 6. Move Training state and orchestration behind a facade.
 7. Introduce Signals for local and derived state while keeping RxJS for async Firebase work.
 8. Modernize forms, templates, change detection and list tracking.
 9. Add regression tests and compare behavior with the legacy version.

 ## 11. Week 1 audit checklist

 - [x] Preserve the legacy branch.
 - [x] Record the current dependency and module structure.
 - [x] Document current routes, services and data flow.
 - [ ] Run and record the application smoke test.
 - [ ] Run and record the baseline build.
 - [ ] Run and record the baseline test suite.
 - [ ] Create the modernization branch from the preserved baseline.
