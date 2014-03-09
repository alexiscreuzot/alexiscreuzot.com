#!/bin/sh

FILES=./app/scribbles/*.md
for f in $FILES
do
  directory=$(dirname "$f")
  filename=$(basename "$f")
  extension="${filename##*.}"
  filename="${filename%.*}"

  # Process file
  echo "Processing $filename"
  compiledscheme="_compiled.html"
  compiledname="$directory/$filename$compiledscheme"
  echo "Processing $compiledname"

  # Check if compiled file already exists
  if [ -f $compiledname ]; then
  	content=$(cat "$f")
  	json="{\"text\":\"$content\"}"
  	echo $(curl -X POST --data $json https://api.github.com/markdown --header "Content-Type:application/json") > $compiledname 
  else
    echo "$compiledname does exist"
  fi

done