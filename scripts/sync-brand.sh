#!/bin/bash
# Sync brand assets from submodule to public/
# Usage: ./scripts/sync-brand.sh [--force]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_ROOT="$(dirname "$SCRIPT_DIR")"
BRAND_DIR="$SITE_ROOT/vendor/brand"

SOCIAL_SRC_DIR="$BRAND_DIR/assets/social"
LOGO_SRC_FILE="$BRAND_DIR/assets/logos/svg/archivist-terminal.svg"

SOCIAL_DEST="$SITE_ROOT/public/assets/social"
LOGO_DEST="$SITE_ROOT/public/logos"

SOCIAL_FILES=(og-default.png og-article.png twitter-card.png)

usage() {
	echo "Usage: $0 [--force]" >&2
	exit 1
}

FORCE=false
for arg in "$@"; do
	case "$arg" in
	--force)
		FORCE=true
		;;
	*)
		usage
		;;
	esac
done

CP_FLAGS="-n"
if [ "$FORCE" = true ]; then
	CP_FLAGS="-f"
fi

git -C "$SITE_ROOT" submodule update --init --recursive

mkdir -p "$SOCIAL_DEST" "$LOGO_DEST"

shopt -s nullglob

copy_file() {
	local src="$1"
	local dest_dir="$2"
	echo "Copying $(basename "$src") → $dest_dir"
	cp $CP_FLAGS "$src" "$dest_dir"
}

for file in "${SOCIAL_FILES[@]}"; do
	copy_file "$SOCIAL_SRC_DIR/$file" "$SOCIAL_DEST"
done

copy_file "$LOGO_SRC_FILE" "$LOGO_DEST"

echo "Brand sync complete (docs)."
