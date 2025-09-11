#!/usr/bin/env bash
set -euo pipefail

# Usage: bin/move_bakkt_assets.sh <SRC_MIRROR_DIR> <MAP_FILE>
# Example: bin/move_bakkt_assets.sh mirror bin/assets-map.txt
SRC="${1:-mirror}"
MAP="${2:-bin/assets-map.txt}"
DEST="assets/bakkt-2025"

if [[ ! -d "$SRC" ]]; then
  echo "ERR: source dir '$SRC' not found" >&2; exit 1
fi
if [[ ! -f "$MAP" ]]; then
  echo "ERR: map file '$MAP' not found" >&2; exit 1
fi

mkdir -p "$DEST"/{tiles,hero,case-studies,logos}

# Enable ** globs, brace globs, and ignore non-matches
shopt -s globstar nullglob extglob

copied=()

choose_largest() {
  # pick largest file from args
  local best="" bestsz=0 f sz
  for f in "$@"; do
    [[ -f "$f" ]] || continue
    sz=$(wc -c <"$f" | tr -d '[:space:]')
    if (( sz > bestsz )); then best="$f"; bestsz="$sz"; fi
  done
  [[ -n "$best" ]] && printf '%s' "$best"
}

while IFS= read -r line; do
  # Skip comments/blank
  [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue

  # Expect: <src_glob><whitespace><dest_rel_path_without_or_with_ext>
  src_glob=$(awk '{print $1}' <<<"$line")
  dest_rel=$(awk '{print $2}' <<<"$line")

  if [[ -z "$src_glob" || -z "$dest_rel" ]]; then
    echo "WARN: bad map line (need: '<src_glob> <dest_rel>'): $line" >&2
    continue
  fi

  # Expand against SRC; allow multiple matches, choose largest
  matches=( $SRC/$src_glob )
  if (( ${#matches[@]} == 0 )); then
    echo "MISS: $src_glob → $dest_rel (no matches)"
    continue
  fi

  src_file=$(choose_largest "${matches[@]}")
  if [[ -z "$src_file" ]]; then
    echo "MISS: $src_glob → $dest_rel (no regular files)"
    continue
  fi

  # Preserve source extension if dest has none
  if [[ "$dest_rel" == *.* ]]; then
    out="$DEST/$dest_rel"
  else
    ext="${src_file##*.}"
    out="$DEST/$dest_rel.$ext"
  fi

  mkdir -p "$(dirname "$out")"
  cp -p "$src_file" "$out"
  echo "OK  : $(realpath --relative-to=. "$src_file") → $(realpath --relative-to=. "$out")"
  copied+=("$out")
done < "$MAP"

# Write a simple manifest for audit
if (( ${#copied[@]} )); then
  ts=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
  {
    echo '{'
    echo '  "source": "'"$SRC"'",'
    echo '  "captured_at_utc": "'"$ts"'",'
    echo '  "assets": ['
    for i in "${!copied[@]}"; do
      rel="${copied[$i]#assets/bakkt-2025/}"
      sep=$(( i < ${#copied[@]}-1 )) && echo '    "'"$rel"'",' || echo '    "'"$rel"'"'
    done
    echo '  ]'
    echo '}'
  } > "$DEST/manifest.json"
  echo "✓ Wrote audit manifest → $DEST/manifest.json"
else
  echo "NOTE: no files copied; check your map patterns."
fi
