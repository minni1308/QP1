#!/bin/bash

# Convert SVG to ICO (multiple sizes)
convert favicon.svg -background none -define icon:auto-resize=16,24,32,48,64 favicon.ico

# Convert SVG to PNG for various sizes
convert favicon.svg -background none -resize 192x192 logo192.png
convert favicon.svg -background none -resize 512x512 logo512.png 