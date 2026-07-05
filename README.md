# VertexFlow: Autonomous Multi-Agent Research Synthesis Engine

**Track:** Agents for Good / Freestyle  
**Subtitle:** A 4-agent pipeline that fetches real academic papers, discovers research gaps, and drafts 6-month research roadmaps — autonomously.

### 🛑 The Problem: Research Discovery is Broken
Every year, 2.5 million new scientific papers are published. For PhD students, researchers, and academics trying to stay current, this creates a genuine crisis: information overload. The typical workflow takes weeks — scanning abstracts, reading papers, synthesizing contradictions, and planning roadmaps. Most of that time is spent on pattern-matching rather than creative, hypothesis-driven work.

### 💡 The Solution: VertexFlow
VertexFlow is a multi-agent research synthesis engine that takes a single research topic as input and produces:
* A structured analysis of methodologies from current literature
* A detailed map of research gaps and unexplored areas
* Novel, testable research hypotheses targeting those gaps
* A 6-month actionable research roadmap with milestones and metrics

All in under 3 minutes. Using real, live academic papers from arXiv.

### 🧠 Why Agents?
A single LLM prompt asking "give me a research roadmap on X" produces generic, hallucinated output. VertexFlow uses agents because each stage of research synthesis requires a different cognitive role:
1. **Methodology Extractor (Research Assistant):** Scans literature for techniques.
2. **Gap Analyzer (Critical Reviewer):** Spots what's missing or contradictory.
3. **Hypothesis Engine (Creative Scientist):** Proposes new, testable ideas.
4. **Research Planner (Senior Researcher):** Structures the execution.

By chaining these agents together, each agent receives only the output of the previous one. This forces specialization and prevents hallucination.

### 🏗️ Architecture & Key Concepts
VertexFlow was built applying concepts from the Kaggle 5-Day AI Agents Intensive Course:
* **Multi-Agent System:** 4 specialized agents sequentially chained via Google GenAI (`gemini-2.5-flash`).
* **MCP Tool Server / Tool Use:** A custom tool (`mcp_server/arxiv_tool.py`) wraps the free arXiv API, allowing agents to fetch live, real-world data instead of relying on stale LLM training data.
* **Security Features:** A Python regex-based PII Scrubber runs locally before any data reaches the LLM, masking emails and phone numbers to ensure absolute data privacy.
* **Deployability:** Environment variables (`.env`), robust retry logic (exponential backoff), and model fallbacks (`gemini-2.5-flash` -> `gemini-2.0-flash` -> `gemini-1.5-flash`) handle real-world API rate limits gracefully.
* **Antigravity IDE:** Entirely built and tested within the provided agentic IDE.

---

### 🚀 Setup Instructions

**Prerequisites**
* Python 3.10+
* A Google AI Studio API key (free at aistudio.google.com)

**1. Clone the repository**
`git clone https://github.com/AryaBadugu/VertexFlow.git`
`cd VertexFlow`

**2. Navigate to the backend directory**
`cd backend`

**3. Create a virtual environment**
# On Windows
`python -m venv .venv`
`.venv\Scripts\activate`

# On macOS/Linux
`python3 -m venv .venv`
`source .venv/bin/activate`

**4. Install dependencies**
`pip install -r requirements.txt`

**5. Set up your API key**
Create a `.env` file inside the `backend` directory:
`GEMINI_API_KEY=your_actual_key_here`
*(Note: Never commit your `.env` file. It is already included in our `.gitignore`)*

**6. Run VertexFlow**
`python main.py`
You will be prompted to enter a research topic (e.g., *federated learning privacy*). The 4-agent pipeline will execute and print results for each stage to the console. The repository also includes a React frontend (`/frontend`) used for presentation visualization.

---

### 🤝 Impact and Value
VertexFlow directly supports researchers by accelerating science. By reducing the research discovery bottleneck from days to minutes, it frees researchers to focus on validation and creative problem-solving, enabling more people to contribute to scientific progress.
