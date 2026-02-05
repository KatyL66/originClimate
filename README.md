
HazardSense is an experimental, frontend-focused project built to explore a simple but persistent problem:

Why is hazard and environmental information technically available, but still difficult to use when someone needs to make an actual decision?

Instead of exposing users to raw data or technical dashboards, this project focuses on translating location-based signals into clear, interpretable guidance that supports real-world decision-making.

-----What this project does-----

At a high level, HazardSense:

Uses user location (GPS or manual input) to evaluate potential environmental or hazard-related constraints

Structures location-based signals into simple, human-readable risk indicators

Emphasizes clarity and interpretability over complex or opaque logic

The goal is not to predict everything, but to help users answer:

“Given where I am, is this route or action reasonable?”

------How it’s built------

Language: JavaScript

Framework: React (JSX, functional components, custom hooks)

Architecture:

Modular component structure

Custom hooks for location handling

Separated logic layers for routing and hazard evaluation

APIs: Browser / device Geolocation APIs

Version Control: GitHub (public repository)

-----Design choices & trade-offs-----

Some decisions were made intentionally:

Frontend-first logic
Core evaluation happens client-side to keep the system transparent and easy to reason about.

Interpretability over complexity
The logic is written so that recommendations can be explained, not just returned.

Explicit error and loading states
Location access failures, delays, and user denial are treated as first-class cases, not edge cases.

These choices reflect how real users interact with systems under uncertainty.

------Validation & behavior------

Rather than focusing on performance metrics, the project emphasizes:

Clear user feedback during GPS access and loading states

Predictable system behavior when location data is unavailable or incomplete

Graceful fallbacks such as manual location input

This helps ensure the system remains usable even when assumptions break.

------What this project demonstrates------

Applying product thinking to frontend systems

Designing decision-support logic in user-facing applications

Structuring complex ideas into modular, maintainable React code

Working with real-world constraints like permissions, uncertainty, and incomplete data

------Future directions------

Possible next steps include:

Adding more granular hazard logic

Connecting to external data sources

Introducing a backend service if scale or persistence becomes necessary

Building a more polished UI for non-technical users
