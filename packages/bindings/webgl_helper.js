// Emscripten JavaScript library for WebGL context creation
// This gets compiled into the WASM module and has access to internal GL APIs

mergeInto(LibraryManager.library, {
  tvg_webgl_create_context__sig: "i$", // int return, string param ($ means auto-convert)
  tvg_webgl_create_context: function (selector) {
    if (!selector || selector.length === 0) {
      console.error("Selector is empty!");
      return 0;
    }

    var canvas = document.querySelector(selector);

    if (!canvas) {
      console.error("Canvas not found for selector:", selector);
      return 0;
    }

    var contextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: false,
      majorVersion: 2,
      minorVersion: 0,
      enableExtensionsByDefault: true,
    };

    // GL.createContext expects a canvas element
    var handle = GL.createContext(canvas, contextAttributes);

    if (handle > 0) {
      GL.makeContextCurrent(handle);
    }

    return handle;
  },
});
