# System Overview

```mermaid
flowchart TD

UI[Frontend]

API[Express API]

DO[Decision Orchestrator]

KL[Knowledge Loader]

RS[Risk Scoring]

TH[Threshold Engine]

PE[Policy Engine]

RE[Recommendation Engine]

EX[Explanation Engine]

UI --> API

API --> DO

DO --> KL

DO --> RS

DO --> TH

DO --> PE

DO --> RE

DO --> EX
```
