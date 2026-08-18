# System Overview

```mermaid
flowchart LR

A[Analyst Dashboard]
B[Evidence Intake]
C[Express API]
D[Decision Orchestrator]
E[Knowledge Loader]
F[Risk Scoring Engine]
G[Policy Engine]
H[Threshold Engine]
I[Explanation Engine]
J[Knowledge Base]
K[Decision Response]

A --> B
B --> C
C --> D
D --> E
D --> F
D --> G
D --> H
D --> I

E --> J
F --> J
G --> J
H --> J

I --> K
K --> A
```
