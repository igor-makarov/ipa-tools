#!/bin/bash -e

find apps -type f -name "*.ipa" -maxdepth 1 -print0 | while IFS= read -r -d '' file; do
  >&2 echo "Processing IPA: $file"
  base="$(basename "$file" .ipa)"
  appdir="apps/$base"
  rm -rf "$appdir" || true
  unzip "$file" -d "apps/$base" &> /dev/null
  plist_path=("$appdir"/Payload/*.app/Info.plist)
  echo "Extracting plist: $plist_path"
  cp "$plist_path" "apps/$base.plist"
  plutil -convert xml1 "apps/$base.plist"
done