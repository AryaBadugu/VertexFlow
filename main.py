"""VertexFlow - Multi-agent research orchestrator powered by Gemini 2.5 Flash."""

import os
import re
import sys
import time

from dotenv import load_dotenv
from google import genai
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel

from mcp_server.arxiv_tool import fetch_arxiv_papers

console = Console()

# ── Load API key from .env file ────────────────────────────────────────────
load_dotenv()

# Fix Windows console encoding for Unicode output
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# ── Gemini client (uses GOOGLE_API_KEY env var by default) ──────────────────
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
MODEL = "gemini-2.5-flash"
FALLBACK_MODEL = "gemini-2.0-flash"
FALLBACK_MODEL_2 = "gemini-1.5-flash"
MAX_RETRIES = 5


# ── PII Scrubber ────────────────────────────────────────────────────────────
def pii_scrubber(text: str) -> str:
    """Replace email addresses and phone numbers with [REDACTED].

    Handles common formats:
      • Emails  – user@domain.tld
      • Phones  – (123) 456-7890, 123-456-7890, +1 123 456 7890, etc.
    """
    # Email pattern
    text = re.sub(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}", "[REDACTED]", text)

    # Phone pattern (international prefix optional, separators: space / dash / dot / parens)
    text = re.sub(
        r"(\+?\d{1,3}[\s\-.]?)?"        # optional country code
        r"(\(?\d{2,4}\)?[\s\-.]?)"       # area code
        r"(\d{3,4}[\s\-.]?)"             # first group
        r"(\d{3,4})",                     # second group
        "[REDACTED]",
        text,
    )
    return text


# ── Agent prompts ───────────────────────────────────────────────────────────
PROMPTS = {
    "Extract Methodologies": (
        "You are a meticulous research analyst. Given the following ArXiv paper "
        "summaries, extract and list every distinct methodology, technique, model "
        "architecture, and algorithm mentioned. Group them by paper and include a "
        "brief one-line description of each.\n\n"
        "Papers:\n{papers}\n\n"
        "User's research interest: {query}"
    ),
    "Analyze Gaps": (
        "You are a critical research reviewer. Given the methodologies extracted "
        "below, identify gaps, limitations, under-explored areas, and open "
        "problems. Be specific and cite which methodology or paper each gap "
        "relates to.\n\n"
        "Extracted Methodologies:\n{previous_output}\n\n"
        "User's research interest: {query}"
    ),
    "Generate Hypothesis": (
        "You are a creative research scientist. Based on the gap analysis below, "
        "propose 3–5 novel, testable research hypotheses. For each hypothesis, "
        "explain the rationale, the expected outcome, and how it addresses a "
        "specific gap.\n\n"
        "Gap Analysis:\n{previous_output}\n\n"
        "User's research interest: {query}"
    ),
    "Draft 6-Month Roadmap": (
        "You are a research project manager. Based on the hypotheses below, "
        "create a detailed 6-month research roadmap. Break it into monthly "
        "milestones with specific deliverables, required resources, risk factors, "
        "and success metrics.\n\n"
        "Hypotheses:\n{previous_output}\n\n"
        "User's research interest: {query}"
    ),
}


# ── Orchestrator ────────────────────────────────────────────────────────────
def run_vertexflow(user_query: str) -> None:
    """Run the full VertexFlow pipeline for a given research query."""

    # 1. Sanitize the query
    sanitized_query = pii_scrubber(user_query)
    console.print(Panel(f"[bold cyan]{sanitized_query}[/bold cyan]", title="[bold white]VertexFlow Pipeline — Query[/bold white]", border_style="cyan"))
    print()

    # 2. Fetch papers from ArXiv
    with console.status("[bold yellow]Fetching papers from ArXiv...[/bold yellow]", spinner="dots"):
        papers_json = fetch_arxiv_papers(sanitized_query, max_results=5)
    console.print("[bold green]✓ Retrieved papers from ArXiv[/bold green]\n")

    # 3. Run each agent sequentially
    previous_output = ""
    full_markdown_report = f"# VertexFlow Research Report\n**Query:** {sanitized_query}\n\n"

    for step_number, (agent_name, prompt_template) in enumerate(PROMPTS.items(), start=1):
        console.rule(f"[bold magenta]🤖 Agent {step_number}/4 — {agent_name}[/bold magenta]")
        print()

        # Build the prompt — first agent gets papers, rest get prior output
        if step_number == 1:
            prompt = prompt_template.format(papers=papers_json, query=sanitized_query)
        else:
            prompt = prompt_template.format(
                previous_output=previous_output, query=sanitized_query
            )

        # Call Gemini with retry + fallback model for transient errors
        success = False
        with console.status(f"[bold yellow]{agent_name} is thinking...[/bold yellow]", spinner="bouncingBar"):
            for model_name in [MODEL, FALLBACK_MODEL, FALLBACK_MODEL_2]:
                for attempt in range(1, MAX_RETRIES + 1):
                    try:
                        response = client.models.generate_content(model=model_name, contents=prompt)
                        previous_output = response.text
                        success = True
                        break
                    except Exception as e:
                        error_msg = str(e)
                        if attempt == MAX_RETRIES:
                            console.print(f"   [bold yellow][WARN][/bold yellow] {model_name} failed after {MAX_RETRIES} attempts. Trying fallback...")
                        else:
                            wait = 2 ** attempt
                            console.print(f"   [bold red][RETRY][/bold red] {model_name} attempt {attempt}/{MAX_RETRIES} failed: {error_msg}. Retrying in {wait}s...")
                            time.sleep(wait)
                if success:
                    break

        if not success:
            console.print(f"[bold red][ERROR] All models failed for '{agent_name}'. Aborting pipeline.[/bold red]")
            return

        console.print(Markdown(previous_output))
        full_markdown_report += f"## Agent {step_number}: {agent_name}\n\n{previous_output}\n\n---\n\n"
        print()

    # 4. Save to file
    output_filename = f"research_roadmap_{int(time.time())}.md"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(full_markdown_report)

    console.rule("[bold green]✅ VertexFlow pipeline complete.[/bold green]")
    console.print(f"[bold cyan]📁 Full report saved to:[/bold cyan] [bold white]{output_filename}[/bold white]")
    print()


# ── Entry point ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    query = input("Enter your research query: ")
    run_vertexflow(query)
