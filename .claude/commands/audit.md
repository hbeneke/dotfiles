# Technical Audit

Act as a senior software architect and perform a complete and honest technical audit of the project.

Evaluate:

1. General Functionality
- Does it correctly fulfill its purpose?
- Are there broken flows, inconsistencies, or duplicated logic?

2. Security
- Are sensitive routes/endpoints properly protected?
- Is there a clear separation of roles (e.g., user/admin)?
- Are there risks of unauthorized access, data exposure, or insufficient validations?
- Is the principle of least privilege respected?

3. Business Logic
- Is the logic correctly centralized or scattered?
- Are rules and invariants protected?
- Is the model rich or anemic?

4. Use Cases
- Are all relevant behaviors encapsulated?
- Is there a clear intent behind each operation?
- Are domain and infrastructure properly orchestrated?

5. Separation of Concerns
- Is there real decoupling between business and technical details?
- Are responsibilities mixed?

6. Persistence
- Is it decoupled from the domain?
- Does it distort the conceptual model?

7. Overall Quality
- Is the code coherent and maintainable?
- Is there technical debt, over-engineering, or fragile design?

Enter deep analysis mode.

Do not be complacent.

Point out real weaknesses, future risks, and clear structural improvements.

Prioritize technical honesty over diplomacy.
