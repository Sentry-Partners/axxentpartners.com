# Contributing to Axxent Partners Site

## Branching
- `main`: production
- `dev`: active work
- feature branches: `feat/<short-thing>`

## Workflow
1. Branch from `dev`
2. Commit small, clear changes
3. Open PR into `dev` (auto checks run)
4. Squash & merge
5. Release: PR `dev` → `main`

## Local Preview
Just open `index.html` (no build). For a simple server:
```bash
python3 -m http.server 5173
# open http://localhost:5173
```