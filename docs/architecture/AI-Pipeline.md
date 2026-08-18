# AI Processing Pipeline

```mermaid
flowchart LR

Evidence --> AIExtractor

Image --> VisionAI

News --> NLP

VisionAI --> StructuredData

NLP --> StructuredData

StructuredData --> DecisionEngine

DecisionEngine --> Recommendation
```
