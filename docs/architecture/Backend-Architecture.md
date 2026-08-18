# Backend Architecture

```mermaid
flowchart LR

API --> DecisionOrchestrator

DecisionOrchestrator --> KnowledgeLoader

DecisionOrchestrator --> PolicyEngine

DecisionOrchestrator --> RiskScoringEngine

DecisionOrchestrator --> ThresholdEngine

DecisionOrchestrator --> ExplanationEngine
```
