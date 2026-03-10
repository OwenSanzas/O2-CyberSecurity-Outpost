#!/usr/bin/env python3
"""Add final batch to papers.json."""
import json

with open('src/data/papers.json') as f:
    existing = json.load(f)

with open('/tmp/final_papers.json') as f:
    new_papers = json.load(f)

existing_ids = {p['id'] for p in existing}
added = 0
for paper in new_papers:
    if paper['id'] not in existing_ids:
        existing.append(paper)
        existing_ids.add(paper['id'])
        added += 1
    else:
        print(f"  DUPLICATE: {paper['id']}")

# Count
cats = {}
for p in existing:
    for c in p.get('categories', []):
        cats[c] = cats.get(c, 0) + 1

years = {}
for p in existing:
    y = p['year']
    years[y] = years.get(y, 0) + 1

print(f"Added {added} new papers")
print(f"Total: {len(existing)}")
print("\nCategories:")
for c, n in sorted(cats.items(), key=lambda x: -x[1]):
    print(f"  {c}: {n}")
print("\nYears:")
for y in sorted(years.keys()):
    print(f"  {y}: {years[y]}")

with open('src/data/papers.json', 'w') as f:
    json.dump(existing, f, indent=2, ensure_ascii=False)
