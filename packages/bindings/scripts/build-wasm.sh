#!/bin/bash
set -e

# Configuration
TEMP_DIR="temp"
SOURCE_DIR="${TEMP_DIR}/thorvg-source"

# Change working directory
cd "$(dirname "$(dirname "$0")")"

# Auto-detect EMSDK if not provided
if [ -z "$1" ] && [ -z "$EMSDK" ]; then
    EMCC_PATH=$(which emcc 2>/dev/null)
    if [ -n "$EMCC_PATH" ]; then
        echo "Auto-detected emcc at: $EMCC_PATH"
        EMCC_DIR=$(dirname "$EMCC_PATH")
        EMSDK=$(dirname "$EMCC_DIR")
    fi
fi

EMSDK=${EMSDK:-$1}

if [ -z "$EMSDK" ]; then
    echo "Error: EMSDK path not set and emcc not found"
    echo "Usage: ./build-wasm.sh [/path/to/emsdk]"
    echo "Or set EMSDK environment variable"
    exit 1
fi

echo "Using EMSDK: ${EMSDK}"

# Generate cross-compilation file with actual EMSDK path
echo "Generating cross-compilation file..."
CROSS_FILE_TEMPLATE="cross-wasm.ini"
CROSS_FILE_GENERATED="${TEMP_DIR}/cross-wasm-generated.ini"

# Create temp directory if it doesn't exist
mkdir -p "${TEMP_DIR}"

# Replace EMSDK placeholder with actual path
sed "s|EMSDK|${EMSDK}|g" "${CROSS_FILE_TEMPLATE}" > "${CROSS_FILE_GENERATED}"

echo "Generated cross-compilation file at: ${CROSS_FILE_GENERATED}"

# Check if source directory exists
if [ ! -d "${SOURCE_DIR}" ]; then
    echo "Error: Source directory not found at ${SOURCE_DIR}"
    echo "Please run ./scripts/fetch-source.sh first"
    exit 1
fi

# Apply patches to ThorVG source
echo "Applying patches to ThorVG source..."
PATCH_FILE="patches/wasm-meson-optional-lottie.patch"
if [ -f "${PATCH_FILE}" ]; then
    cd "${SOURCE_DIR}"
    # Check if patch can be applied (returns 0 if successful, non-zero if already applied or failed)
    if patch -p1 --forward --dry-run < "../../${PATCH_FILE}" > /dev/null 2>&1; then
        patch -p1 --forward < "../../${PATCH_FILE}"
        echo "Applied patch: ${PATCH_FILE}"
    else
        echo "Patch already applied or cannot be applied: ${PATCH_FILE}"
    fi
    cd - > /dev/null
else
    echo "Warning: ${PATCH_FILE} not found, skipping patches"
fi

# Output directory
OUTPUT_DIR="wasm"

# Clear output directory
if [ -d "${OUTPUT_DIR}" ]; then
    echo "Clearing existing output directory at ${OUTPUT_DIR}..."
    rm -rf "${OUTPUT_DIR}"
fi
mkdir -p "${OUTPUT_DIR}"

# Function to build for specific engine configuration
build_engine() {
    local engine_name=$1
    local engine_config=$2
    local build_dir="${TEMP_DIR}/build-${engine_name}"

    echo "========================================="
    echo "Building ThorVG WASM with engines: ${engine_config}"
    echo "========================================="

    # Clear existing build directory for this configuration
    if [ -d "${build_dir}" ]; then
        echo "Clearing existing build directory at ${build_dir}..."
        rm -rf "${build_dir}"
    fi

    # Setup Meson build
    echo "Setting up Meson build for ${engine_name}..."
    meson setup "${build_dir}" "${SOURCE_DIR}" \
        --cross-file="${CROSS_FILE_GENERATED}" \
        --buildtype=release \
        -Db_lto=true \
        -Ddefault_library=static \
        -Dstatic=true \
        -Dloaders="" \
        -Dsavers="" \
        -Dthreads=false \
        -Dbindings="capi,wasm_beta" \
        -Dpartial=false \
        -Dengines="${engine_config}" \
        -Dfile="false" \
        -Dextra=""
    echo "Meson setup complete for ${engine_name}"

    # Compile ThorVG
    echo "Building ThorVG WASM for ${engine_name}..."
    ninja -C "${build_dir}"

    # Copy WASM files to output directory with engine-specific names
    local suffix="-${engine_name}"

    echo "Copying WASM files for ${engine_name} to ${OUTPUT_DIR}/"
    cp "${build_dir}/src/bindings/wasm/thorvg.js" "${OUTPUT_DIR}/thorvg${suffix}.js"
    cp "${build_dir}/src/bindings/wasm/thorvg.wasm" "${OUTPUT_DIR}/thorvg${suffix}.wasm"
    cp "${build_dir}/src/bindings/wasm/thorvg.d.ts" "${OUTPUT_DIR}/thorvg${suffix}.d.ts" 2>/dev/null || echo "TypeScript definitions not found for ${engine_name} (expected with --emit-tsd)"
}

# Build both engine configurations
build_engine "sw" "sw"
build_engine "gl" "gl"

echo "========================================="
echo "All builds complete! WASM files are in ${OUTPUT_DIR}/"
echo "========================================="
ls -lh "${OUTPUT_DIR}"/*.{js,wasm} 2>/dev/null || echo "WASM bindings not found"

