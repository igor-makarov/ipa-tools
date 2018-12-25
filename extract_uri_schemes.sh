#!/bin/bash

plistbuddy='/usr/libexec/PlistBuddy -c'

# params: <file> <path in plist>
function plist_array_indices () {
  i=0
  while true ; do
    $plistbuddy "Print $2:$i" "$1" &> /dev/null
    if [ $? -ne 0 ]; then
      break
    fi
    echo "$i"
    i=$(($i + 1))
  done
}

find apps -type f -name "*.plist" -maxdepth 1 -print0 | while IFS= read -r -d '' file; do
  >&2 echo "Processing plist: $file"

  if [ "$(plist_array_indices "$file" ":CFBundleURLTypes")" == "" ]; then
    >&2 echo "No URIs!"
    continue
  fi

  for i in $(plist_array_indices "$file" ":CFBundleURLTypes"); do
    for j in $(plist_array_indices "$file" ":CFBundleURLTypes:$i:CFBundleURLSchemes"); do
      $plistbuddy "Print :CFBundleURLTypes:$i:CFBundleURLSchemes:$j" "$file" 2> /dev/null
    done
  done
done