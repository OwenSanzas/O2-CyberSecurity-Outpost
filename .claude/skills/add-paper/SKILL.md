---
name: add-paper
description: Add a new research paper to the O2 CyberSecurity Outpost website. Use when the user provides a paper URL (arXiv, DOI, conference link), a paper title, or a BibTeX entry.
argument-hint: <arXiv-URL | DOI | paper-title | BibTeX>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch, Agent
---

# Add Paper to O2 CyberSecurity Outpost

You are adding a new paper to the O2 CyberSecurity Outpost paper collection.

**Input:** `$ARGUMENTS`

## Step 1: Parse Input & Fetch Metadata

Determine the input type and fetch paper metadata:

- **arXiv URL** (contains `arxiv.org`): Extract arXiv ID, use `https://api.semanticscholar.org/graph/v1/paper/ArXiv:<id>?fields=title,authors,year,venue,abstract,externalIds,url,openAccessPdf` to fetch metadata.
- **DOI** (contains `10.`): Use `https://api.semanticscholar.org/graph/v1/paper/DOI:<doi>?fields=title,authors,year,venue,abstract,externalIds,url,openAccessPdf`
- **Paper title**: Use `https://api.semanticscholar.org/graph/v1/paper/search?query=<title>&limit=1&fields=title,authors,year,venue,abstract,externalIds,url,openAccessPdf`
- **BibTeX**: Parse the BibTeX directly for metadata, then search Semantic Scholar for additional info.

Extract:
- `title`: Paper title
- `authors`: Comma-separated author names (format: "Last, First")
- `year`: Publication year
- `venue`: Conference or journal name
- `abstract`: Full abstract text
- `paperUrl`: Link to PDF (prefer open access)
- `codeUrl`: If available from Semantic Scholar or mentioned in abstract
- `externalIds`: arXiv ID, DOI, etc.

If Semantic Scholar fails, try arXiv API: `http://export.arxiv.org/api/query?id_list=<arxiv_id>`

## Step 1.5: Version & Venue Resolution

**CRITICAL:** Always ensure the paper is at its latest published version. The input may be an arXiv preprint, but the paper may have already been accepted and published at a conference or journal.

1. Check the Semantic Scholar response for `venue` and `externalIds`. If the paper has a DOI or a non-arXiv venue, it has been formally published.
2. If the input was an arXiv link but Semantic Scholar shows a formal venue (e.g., "USENIX Security", "IEEE S&P", "ICSE"), use the **formal venue** instead of "arXiv preprint".
3. If Semantic Scholar still shows arXiv, additionally query DBLP: `https://dblp.org/search/publ/api?q=<title>&format=json&h=1` to check for a published version.
4. Priority order for venue (use the highest available):
   - Top-tier conference proceedings (S&P, CCS, USENIX Security, NDSS, ICSE, FSE, etc.)
   - Journal publication (TSE, TOSEM, TDSC, etc.)
   - Workshop / symposium
   - arXiv preprint (lowest priority)
5. When a published version is found:
   - Update `venue` to the formal venue name
   - Update `year` to the publication year (not the preprint year)
   - Update `paperUrl` to the official proceedings link (keep arXiv as fallback)
   - Update `bibtex` to the published version's BibTeX

## Step 2: Deduplication Check

Read the existing papers data at `src/data/papers.json`.

Generate the paper ID in format `<firstAuthorLastName><year><firstTitleWord>` (lowercase, e.g., `cao2024realvul`).

Check if this paper ID or a paper with the same title already exists. If duplicate found, STOP and report to user.

## Step 3: Determine Category

Based on the paper content, assign to one or more categories:
- `vulnerability-detection`: Vulnerability detection, patching, repair, code security analysis
- `fuzzing`: Fuzz testing, fuzzing techniques, crash detection, bug reproduction
- `privacy`: Data privacy, PII detection, information leakage

And subcategories if applicable:
- `fine-tuning`: Uses fine-tuning of LLMs
- `llm-sast`: Combines LLM with static analysis tools
- `semantic`: Uses semantic/program analysis with LLM
- `solidity` / `java` / `c-cpp` / `python`: Target programming language

## Step 4: Extract System Name

Identify the name of the system, tool, or framework proposed in the paper. Look for:
- Capitalized/stylized names in the title (e.g., "RealVul", "ChatAFL", "LIBRO")
- Phrases like "we propose X", "we present X", "our tool X", "our framework X" in the abstract
- If no explicit system name, set to empty string `""`

## Step 5: Extract Contributions

**THIS IS THE MOST IMPORTANT STEP.**

Carefully analyze the abstract to extract the paper's key contributions. Write 3-5 bullet points, each a concise sentence.

Rules:
- Be **specific**, not generic. Include concrete details: what method, what dataset, what improvement.
- Each bullet should be independently understandable.
- Focus on **what they did** and **what they achieved**, not background or motivation.
- If the paper reports quantitative results, include the key numbers.

Bad example:
- "This paper proposes a new method for vulnerability detection."
- "The results show improvement over baselines."

Good example:
- "Proposes RealVul, the first LLM-based framework specifically designed for PHP vulnerability detection."
- "Introduces a normalization technique to isolate vulnerability triggers and reduce noise in code samples."
- "Achieves significant improvement in detection accuracy over existing methods across 180 real-world PHP projects."
- "Addresses the scarcity of PHP vulnerability samples through improved data synthesis methods."

Also translate contributions to Chinese (`contributions_zh`), using natural academic Chinese.

## Step 6: Extract Experiment Details

Analyze the abstract to populate the experiment metadata. Only include what is **explicitly mentioned or clearly implied**.

```json
{
  "language": [],
  "platform": [],
  "target_domain": [],
  "llm": [],
  "model_family": [],
  "model_size": [],
  "fine_tuning": false,
  "fine_tuning_method": "",
  "fuzzer": [],
  "static_tool": [],
  "dataset": [],
  "benchmark_size": "",
  "baselines": [],
  "vulnerability_type": [],
  "key_results": "",
  "real_world_impact": "",
  "open_source": false,
  "cost": ""
}
```

Field guidelines:

| Field | Values / Notes |
|-------|---------------|
| `language` | `"C/C++", "Java", "Python", "PHP", "Solidity", "JavaScript", "Go"` etc. |
| `platform` | `"Linux", "Ethereum", "IoT", "Android", "Web"` etc. |
| `target_domain` | `"software-vulnerability", "os-vulnerability", "smart-contract", "network-protocol", "web-application", "firmware", "iot", "dbms"` |
| `llm` | Specific model names: `"GPT-4", "GPT-3.5", "ChatGPT", "CodeLlama", "CodeBERT", "CodeT5", "StarCoder", "Llama2", "Claude", "Gemini", "DeepSeek"` etc. |
| `model_family` | `"gpt", "claude", "llama", "codellama", "codebert", "codet5", "starcoder", "gemini", "deepseek", "falcon"` |
| `model_size` | `"7B", "13B", "34B", "70B"` etc. |
| `fine_tuning` | `true/false` — whether fine-tuning was performed |
| `fine_tuning_method` | `"full", "LoRA", "QLoRA", "prefix-tuning", "adapter"` etc. Empty if no fine-tuning. |
| `fuzzer` | `"AFL", "AFL++", "LibFuzzer", "AFLNET", "NSFUZZ"` etc. |
| `static_tool` | `"CodeQL", "Semgrep", "Coverity", "Infer", "Fortify"` etc. |
| `dataset` | `"Big-Vul", "Devign", "SARD", "D2A", "Defects4J", "CVEfixes", "CrossVul", "REVEAL", "ProFuzzBench", "Juliet"` etc. |
| `benchmark_size` | Free text: `"180 projects"`, `"5000 samples"`, `"15 real-world vulnerabilities"` |
| `baselines` | Other tools/methods compared against |
| `vulnerability_type` | `"buffer-overflow", "SQL-injection", "XSS", "reentrancy", "NPD", "use-after-free", "integer-overflow", "command-injection", "memory-leak"` etc. |
| `key_results` | Free text with key quantitative results: `"F1: 0.91, 47.6% more state transitions, 29.5% more states"` |
| `real_world_impact` | `"Found 11 zero-days"`, `"15 CVEs assigned"`, `"9 previously unknown vulnerabilities"` |
| `open_source` | `true` if code repo link is available |
| `cost` | `"4x A100"`, `"$0.5 per project"`, or empty |

Rules:
- If not mentioned, use empty array `[]`, empty string `""`, or `false`.
- Do NOT guess or hallucinate. Only extract what the abstract states.

## Step 7: Recommendation Level

Assign based on venue:

**Level 3 (Top-tier)**:
IEEE S&P, USENIX Security, ACM CCS, NDSS, OSDI, SOSP, ICSE, FSE/ESEC, ASE, ISSTA, PLDI, POPL, OOPSLA, EuroSys, ATC, ASPLOS, MobiSys, SIGCOMM, NeurIPS, ICML, ICLR, ACL, EMNLP, NAACL

**Level 2 (Quality)**:
TOSEM, TSE, TDSC, TIFS, JSA, SANER, MSR, ISSRE, DSN, RAID, ACSAC, ESORICS, SecureComm, AAAI, IJCAI, COLING, Electronics (MDPI), ACM Computing Surveys, ACM SIGAPP

**Level 1 (Standard)**:
arXiv preprint, workshops, other journals, unknown venues

If venue string contains "arXiv" or "preprint", set level to 1.
If venue is not recognized, default to level 1.

## Step 8: Generate Summaries & Translations

### 8a. One-line Summary (English)
Write a single sentence (max 30 words) that captures what the paper does and its key result. Be specific, not generic.

Bad: "This paper uses LLM for vulnerability detection."
Good: "Fine-tunes CodeLlama on PHP vulnerabilities, achieving 92% detection accuracy on 180 real-world projects."

### 8b. Chinese Translations
Translate the following to Chinese:
- One-line summary → `summary_zh`
- Key contributions → `contributions_zh` (already generated in Step 5)
- Abstract → `abstract_zh`

Translation should be natural and accurate, not word-for-word. Use standard Chinese academic terminology.

## Step 9: Write to papers.json

Read the current `src/data/papers.json`, append the new paper entry with this structure:

```json
{
  "id": "<generated-id>",
  "title": "<title>",
  "authors": "<authors>",
  "year": 2024,
  "venue": "<venue>",
  "abstract": "<abstract>",
  "abstract_zh": "<chinese-abstract>",
  "summary": "<one-line-summary>",
  "summary_zh": "<chinese-one-line-summary>",
  "contributions": ["<bullet1>", "<bullet2>", "..."],
  "contributions_zh": ["<chinese-bullet1>", "<chinese-bullet2>", "..."],
  "system_name": "<system-name-or-empty>",
  "paperUrl": "<url>",
  "codeUrl": "<url>",
  "slidesUrl": "",
  "talkUrl": "",
  "categories": ["<category>"],
  "subcategories": ["<subcategory>"],
  "experiment": {
    "language": [],
    "platform": [],
    "target_domain": [],
    "llm": [],
    "model_family": [],
    "model_size": [],
    "fine_tuning": false,
    "fine_tuning_method": "",
    "fuzzer": [],
    "static_tool": [],
    "dataset": [],
    "benchmark_size": "",
    "baselines": [],
    "vulnerability_type": [],
    "key_results": "",
    "real_world_impact": "",
    "open_source": false,
    "cost": ""
  },
  "recommendation": 1,
  "bibtex": "<bibtex-entry>"
}
```

Sort the full array by ID alphabetically after insertion.

## Step 10: Commit & Submit PR

Create a new branch, commit the changes, and open a pull request.

```bash
cd <project-root>
BRANCH="add-paper/$(echo '<paper-id>' | tr '[:upper:]' '[:lower:]')"
git checkout -b "$BRANCH"
git add src/data/papers.json
git commit -m "Add paper: <short-title>"
git push -u origin "$BRANCH"
gh pr create --title "Add paper: <short-title>" --body "$(cat <<'PREOF'
## New Paper

- **Title:** <title>
- **Authors:** <authors>
- **Year:** <year>
- **Venue:** <venue>
- **System:** <system_name>
- **Recommendation:** Level <1|2|3>
- **Category:** <categories>

### Key Contributions
<contributions as bullet list>

### Experiment
- **LLM:** <llm>
- **Language:** <language>
- **Key Results:** <key_results>

Auto-generated by `/add-paper`.
PREOF
)"
git checkout master
```

## Output

After completion, print a summary:

```
Paper added via PR: <title>
   System: <system_name>
   Authors: <authors>
   Year: <year> | Venue: <venue> | Level: <recommendation>
   Category: <category>
   Key Contributions:
     - <bullet1>
     - <bullet2>
   Experiment: <llm>, <language>, fine-tuning: <yes/no>
   Key Results: <key_results>
   ID: <paper-id>
   PR: <pr-url>
```
