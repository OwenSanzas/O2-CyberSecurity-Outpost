#!/usr/bin/env python3
"""Merge all paper sources into final papers.json."""
import json

# Load existing
with open('src/data/papers.json') as f:
    existing = json.load(f)

# Load generated
sources = [
    '/tmp/harness_papers.json',
    '/tmp/patching_papers.json',
    '/tmp/vuln_papers.json',
    '/tmp/privacy_extra_papers.json',
    '/tmp/extra_papers.json',
    '/tmp/papers_2025_2026.json',
]

all_papers = list(existing)
existing_ids = {p['id'] for p in existing}

for src in sources:
    with open(src) as f:
        new_papers = json.load(f)
    for paper in new_papers:
        if paper['id'] not in existing_ids:
            # Ensure all required fields
            paper.setdefault('slidesUrl', '')
            paper.setdefault('talkUrl', '')
            paper.setdefault('paperUrl', '')
            paper.setdefault('codeUrl', '')
            paper.setdefault('contributions', [])
            paper.setdefault('contributions_zh', [])
            paper.setdefault('abstract_zh', paper.get('summary_zh', ''))
            all_papers.append(paper)
            existing_ids.add(paper['id'])
        else:
            print(f"  DUPLICATE: {paper['id']}")

# Count by category
cats = {}
for p in all_papers:
    for c in p.get('categories', []):
        cats[c] = cats.get(c, 0) + 1

print(f"\nTotal papers: {len(all_papers)}")
print("Categories:")
for c, n in sorted(cats.items(), key=lambda x: -x[1]):
    print(f"  {c}: {n}")

# Year distribution
years = {}
for p in all_papers:
    y = p['year']
    years[y] = years.get(y, 0) + 1
print("\nYears:")
for y in sorted(years.keys()):
    print(f"  {y}: {years[y]}")

# Save
with open('src/data/papers.json', 'w') as f:
    json.dump(all_papers, f, indent=2, ensure_ascii=False)
print(f"\nSaved {len(all_papers)} papers to src/data/papers.json")
