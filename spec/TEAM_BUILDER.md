# Team Builder

This document contains the master prompt for generating your AI development team structure under the `specs/` folder.

**Recommended Model:** GPT 5.2 (for comprehensive, interconnected documentation)

---

## Overview

The Team Builder creates these "virtual team members" as spec files:

```
specs/
├── 01_product_manager.md    # Vision, requirements, user stories
├── 02_backend_lead.md       # API design, server architecture
├── 03_frontend_lead.md      # UI/UX, component design, styling
├── 04_db_architect.md       # Database schema, migrations, queries
├── 05_qa_lead.md            # Testing strategy, QA processes
├── 06_devops_lead.md        # Infrastructure, CI/CD, deployment
├── backlog.md               # Single source of truth for all work
└── [feature_specs...]       # Individual feature specifications
```

---

## The Team Builder Prompt

Copy this entire prompt into GitHub Copilot Chat. Replace placeholders with your project information.

---

### PROMPT START

```
You are a Project Architect. Your job is to generate a complete AI development team structure for a software project. Create specification files that define each team role's responsibilities, standards, and guidelines.

## PROJECT CONTEXT

### Project Name
[REPLACE: Your project name]

### Project Description
[REPLACE: 2-3 sentences describing what the project does]

### Tech Stack
[REPLACE with your actual stack]
- Frontend:
- Backend:
- Database:
- Infrastructure:
- Authentication:
- Other services:

### Design Philosophy
[REPLACE: Your design approach - e.g., "Mobile-first, dark mode, minimalist UI"]

### Target Users
[REPLACE: Who uses this application]

---

## GENERATE THE FOLLOWING FILES

### FILE 1: specs/01_product_manager.md

Create a Product Manager spec with:

1. **Core Vision** - The "elevator pitch" for the product
2. **User Personas** - 2-3 key user types with goals/frustrations
3. **Core User Flows** - Primary journeys users take
4. **Product Principles** - 5-7 guiding principles for decisions
5. **Success Metrics** - Key KPIs to track
6. **Competitive Landscape** - How this differs from alternatives
7. **Roadmap Philosophy** - How features are prioritized

---

### FILE 2: specs/02_backend_lead.md

Create a Backend Lead spec with:

1. **Architecture Overview** - System design diagram (ASCII)
2. **API Design Principles** - RESTful conventions, naming, versioning
3. **Authentication & Authorization** - Auth flow, token strategy
4. **Error Handling** - Error codes, response formats
5. **Logging Standards** - What to log, formats, levels
6. **Performance Guidelines** - Caching, optimization rules
7. **Security Checklist** - OWASP considerations
8. **Code Organization** - Folder structure, naming conventions

Include actual code examples matching the tech stack.

---

### FILE 3: specs/03_frontend_lead.md

Create a Frontend Lead spec with:

1. **Design System** - Colors (with hex codes), typography, spacing
2. **Component Library** - Key component specifications with code
3. **Layout Architecture** - Page structure, navigation patterns
4. **State Management** - Store organization, data flow
5. **Animation Guidelines** - Transitions, durations, easing
6. **Responsive Rules** - Breakpoints, mobile-first approach
7. **Accessibility Standards** - WCAG requirements
8. **Performance Budget** - Bundle size, load time targets

Include Tailwind/CSS examples and component code snippets.

---

### FILE 4: specs/04_db_architect.md

Create a Database Architect spec with:

1. **Schema Overview** - ER diagram (ASCII), table relationships
2. **Naming Conventions** - Tables, columns, indexes
3. **Data Types** - Standard types for common data
4. **Core Tables** - Initial schema with CREATE statements
5. **Index Strategy** - When and what to index
6. **Migration Guidelines** - How to evolve schema safely
7. **Query Patterns** - Common queries, performance tips
8. **Backup & Recovery** - Data protection strategy

Include actual SQL for the core tables.

---

### FILE 5: specs/05_qa_lead.md

Create a QA Lead spec with:

1. **Testing Philosophy** - Test pyramid, coverage goals
2. **Unit Testing** - What to test, examples, tools
3. **Integration Testing** - API tests, component tests
4. **E2E Testing** - Critical flows to cover
5. **QA Environment Setup** - How to run tests locally
6. **Definition of Done** - Checklist before ticket completion
7. **Bug Reporting Template** - Standard format for issues
8. **Test Data Management** - Seeds, fixtures, mocks

Include test code examples for the tech stack.

---

### FILE 6: specs/06_devops_lead.md

Create a DevOps Lead spec with:

1. **Infrastructure Overview** - Deployment architecture
2. **Docker Configuration** - Dockerfile standards, compose
3. **Environment Management** - Dev/staging/prod configs
4. **CI/CD Pipeline** - Build, test, deploy steps
5. **Monitoring & Alerting** - What to monitor, alert thresholds
6. **Logging Infrastructure** - Log aggregation setup
7. **Security Hardening** - Server, network, secrets
8. **Disaster Recovery** - Backup, restore procedures

Include actual configuration files (Dockerfile, docker-compose, etc.)

---

### FILE 7: specs/backlog.md

Create a Product Backlog with:

1. **Header** - References to all spec files
2. **Architecture Vision** - ASCII diagram of system
3. **Sprint 0: Foundation** - Initial setup tickets
4. **Sprint 1: Core Feature** - First major feature
5. **Bugs & Known Issues** - Template section
6. **Future Ideas (Icebox)** - Backlog of ideas
7. **Legend** - Status emoji meanings
8. **How to Use** - Instructions for working with backlog

Use this ticket format:
| # | Ticket | Status | Owner |
|---|--------|--------|-------|
| 1.1 | Task description | 🔲 Todo | Team |

---

## OUTPUT RULES

1. **Be specific to the tech stack** - Use actual framework names, libraries
2. **Include code examples** - Real, working code snippets
3. **Use consistent terminology** - Same terms across all docs
4. **Reference other specs** - Link between documents
5. **Make it actionable** - Clear enough to implement from
6. **ASCII diagrams** - Use text-based diagrams for architecture
7. **Tables for structure** - Use markdown tables for organized data

---

Generate all 7 files now. Output each file with a clear header:

# === FILE: specs/01_product_manager.md ===
[content]

# === FILE: specs/02_backend_lead.md ===
[content]

[etc...]
```

### PROMPT END

---

## Example Usage

```
@workspace

You are a Project Architect...

## PROJECT CONTEXT

### Project Name
TaskFlow

### Project Description
A task management application for small teams. Features real-time collaboration,
Kanban boards, time tracking, and AI-powered task prioritization.

### Tech Stack
- Frontend: React 18 + TypeScript + Tailwind CSS + Zustand
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL with Prisma ORM
- Infrastructure: Docker + Contabo VPS
- Authentication: JWT with refresh tokens
- Other: Redis for caching, OpenAI API for AI features

### Design Philosophy
Clean, minimal interface. White background with subtle grays.
Blue accent color. Mobile-responsive but desktop-optimized.

### Target Users
- Small team leads (5-15 people)
- Freelancers managing multiple projects
- Startups without dedicated PM tools

[REST OF PROMPT...]
```

---

## Post-Generation Steps

### 1. Create the specs folder

```bash
mkdir -p specs
```

### 2. Save each file

Copy each generated section into its respective file:

```bash
# Create each file
touch specs/01_product_manager.md
touch specs/02_backend_lead.md
touch specs/03_frontend_lead.md
touch specs/04_db_architect.md
touch specs/05_qa_lead.md
touch specs/06_devops_lead.md
touch specs/backlog.md
```

### 3. Review and customize

Each generated file is a starting point. Review and adjust:
- Add project-specific details
- Update code examples for your exact versions
- Add team-specific conventions

### 4. Commit to repository

```bash
git add specs/
git commit -m "Add spec-driven development team structure"
```

---

## Team Member Reference

| File | Role | Primary Responsibility |
|------|------|------------------------|
| 01_product_manager.md | Product Manager | What to build, why, for whom |
| 02_backend_lead.md | Backend Lead | API design, server architecture |
| 03_frontend_lead.md | Frontend Lead | UI/UX, components, styling |
| 04_db_architect.md | DB Architect | Schema design, queries, migrations |
| 05_qa_lead.md | QA Lead | Testing strategy, quality gates |
| 06_devops_lead.md | DevOps Lead | Infrastructure, deployment, monitoring |
| backlog.md | Backlog | All tickets, sprints, priorities |

---

## Customizing the Team

### Adding Specialists

For larger projects, add specialized roles:

```
specs/07_security_lead.md    # Security-focused projects
specs/08_ml_engineer.md      # AI/ML projects
specs/09_mobile_lead.md      # Mobile app projects
specs/10_data_engineer.md    # Data-heavy projects
```

### Role Prompt Template

```
### FILE X: specs/XX_[role].md

Create a [Role Name] spec with:

1. **[Section 1]** - Description
2. **[Section 2]** - Description
...

Include [specific requirements for this role].
```

---

## Using Team Members During Development

### Reference Specs in Prompts

```
@workspace Execute ticket 5.3 from specs/backlog.md.
Follow the API patterns in @file:specs/02_backend_lead.md.
Use the component patterns from @file:specs/03_frontend_lead.md.
```

### QA Review Flow

```
@workspace Review my changes against @file:specs/05_qa_lead.md.
Check:
1. Does it meet Definition of Done?
2. Are tests written per testing guidelines?
3. Any bugs to add to backlog?
```

---

## Next Steps

- [MISSION_WORKFLOW.md](./MISSION_WORKFLOW.md) - Execute work using your team
- [SPECIFICATION_GENERATOR.md](./SPECIFICATION_GENERATOR.md) - Generate feature specs
