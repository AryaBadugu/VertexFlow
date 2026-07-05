"""ArXiv paper search tool for the MCP server."""

import json

import arxiv


def fetch_arxiv_papers(query: str, max_results: int = 5) -> str:
    """Search ArXiv for papers matching the query.

    Args:
        query: The search query string (e.g. "transformer architecture").
        max_results: Maximum number of papers to return. Defaults to 5.

    Returns:
        A JSON-formatted string containing a list of dictionaries,
        each with 'title', 'authors', and 'summary' keys.
    """
    client = arxiv.Client()
    search = arxiv.Search(
        query=query,
        max_results=max_results,
        sort_by=arxiv.SortCriterion.Relevance,
    )

    papers = []
    for result in client.results(search):
        papers.append(
            {
                "title": result.title,
                "authors": [author.name for author in result.authors],
                "summary": result.summary,
            }
        )

    return json.dumps(papers, indent=2)


if __name__ == "__main__":
    # Quick smoke test
    results = fetch_arxiv_papers("attention is all you need", max_results=2)
    print(results)
