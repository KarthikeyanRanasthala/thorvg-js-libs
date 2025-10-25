#!/bin/bash
set -e

# Configuration
THORVG_TAG="v1.0-pre30"
TEMP_DIR="temp"
ARCHIVE_NAME="thorvg-${THORVG_TAG}.tar.gz"
EXTRACTED_DIR="thorvg-source"

# Change working directory
cd "$(dirname "$(dirname "$0")")"

# Delete extracted location if it exists
if [ -d "${TEMP_DIR}/${EXTRACTED_DIR}" ]; then
  echo "Removing existing extracted directory..."
  rm -rf "${TEMP_DIR}/${EXTRACTED_DIR}"
fi

# Create temp directory
mkdir -p "${TEMP_DIR}"

# Download the source archive if it doesn't exist
if [ -f "${TEMP_DIR}/${ARCHIVE_NAME}" ]; then
  echo "Archive already exists, skipping download..."
else
  echo "Downloading ThorVG ${THORVG_TAG}..."
  curl -L "https://github.com/thorvg/thorvg/archive/refs/tags/${THORVG_TAG}.tar.gz" -o "${TEMP_DIR}/${ARCHIVE_NAME}"
fi

# Extract the archive
echo "Extracting archive..."
tar -xzf "${TEMP_DIR}/${ARCHIVE_NAME}" -C "${TEMP_DIR}"

# Rename extracted directory to thorvg-source (strip 'v' prefix from tag)
TAG_WITHOUT_V="${THORVG_TAG#v}"
mv "${TEMP_DIR}/thorvg-${TAG_WITHOUT_V}" "${TEMP_DIR}/${EXTRACTED_DIR}"

echo "Done! Source extracted to ${TEMP_DIR}/${EXTRACTED_DIR}"
