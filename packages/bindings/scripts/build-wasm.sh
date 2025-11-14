#!/bin/bash
set -e

cd "$(dirname "$(dirname "$0")")"

temp_dir="temp"
wasm_dest_dir="wasm"
thorvg_source_dir="${temp_dir}/thorvg-source"
thorvg_patch_file="patches/wasm-meson-optional-lottie.patch"
cross_file_template="cross-wasm.ini"

if [ ! -d "${thorvg_source_dir}" ]; then
    echo "Error: ThorVG source directory not found at ${thorvg_source_dir}"
    echo "Please run ./scripts/fetch-source.sh first"
    exit 1
fi

if [ -z "$EMSDK" ]; then
    echo "Warning: EMSDK environment variable not set, trying to auto-detect..."
    emcc_path=$(which emcc 2>/dev/null)
    if [ -n "$emcc_path" ]; then
        emcc_dir=$(dirname "$emcc_path")
        emsdk=$(dirname "$emcc_dir")
        echo "Auto-detected EMSDK at ${emsdk}"
    else
        echo "Error: EMSDK not found"
        exit 1
    fi
fi

if [ -d "${wasm_dest_dir}" ]; then
    rm -rf "${wasm_dest_dir}"
fi

mkdir -p "${wasm_dest_dir}"

{
    cd "${thorvg_source_dir}"

    if patch -p1 --forward --dry-run < "../../${thorvg_patch_file}" > /dev/null 2>&1; then
        patch -p1 --forward < "../../${thorvg_patch_file}" > /dev/null
        echo "Applied patch: ${thorvg_patch_file}"
    else
        echo "Patch already applied or cannot be applied"
    fi

    cd - > /dev/null
}

generate_cross_file() {
    local environment=$1

    cross_file="${temp_dir}/cross-wasm-${environment}.ini"

    sed -e "s|ENVIRONMENT_PLACEHOLDER|${environment}|g" \
    -e "s|EMSDK|${emsdk}|g" \
    "${cross_file_template}" > "${cross_file}"

    echo "Cross file generated at ${cross_file}"
}

build() {
    local engine=$1
    local environment=$2

    echo "Building ${engine} engine for ${environment} environment"

    generate_cross_file "${environment}"

    local build_dir="${temp_dir}/build-${engine}-${environment}"

    rm -rf "${build_dir}"

    echo "Setting up Meson build"

    echo "Cross file: ${cross_file}"

    meson setup "${build_dir}" "${thorvg_source_dir}" \
        --cross-file="${cross_file}" \
        --buildtype=release \
        -Db_lto=true \
        -Ddefault_library=static \
        -Dstatic=true \
        -Dloaders="" \
        -Dsavers="" \
        -Dthreads=false \
        -Dbindings="capi,wasm_beta" \
        -Dpartial=false \
        -Dengines="${engine}" \
        -Dfile="false" \
        -Dextra=""

    echo "Building ThorVG"

    ninja -C "${build_dir}"

    echo "${engine} engine built successfully for ${environment} environment"

    cp "${build_dir}/src/bindings/wasm/thorvg.js" "${wasm_dest_dir}/thorvg-${engine}-${environment}.js"
    cp "${build_dir}/src/bindings/wasm/thorvg.d.ts" "${wasm_dest_dir}/thorvg-${engine}-${environment}.d.ts"
    cp "${build_dir}/src/bindings/wasm/thorvg.wasm" "${wasm_dest_dir}/thorvg-${engine}.wasm"

    echo "Copied files to ${wasm_dest_dir}"
}

build "sw" "web"
build "sw" "node"
build "gl" "web"
build "gl" "node"