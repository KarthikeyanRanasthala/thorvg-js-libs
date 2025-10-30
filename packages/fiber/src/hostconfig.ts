import { HostConfig } from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import { logger } from "./logger";
import { Shape, Scene } from "bindings";
import { applyProps } from "./utils";
import { Container, HostContext, Instance, Props, Type } from "./types";

class NotImplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotImplementedError";
  }
}

export const hostConfig: HostConfig<
  Type,
  Props,
  Container,
  Instance,
  never,
  unknown,
  unknown,
  Instance,
  HostContext,
  unknown,
  unknown,
  number,
  -1,
  null
> = {
  supportsMutation: true,
  supportsPersistence: false,
  createInstance: (type, props, containerInfo) => {
    logger.log("createInstance", type, props);

    if (type === "group") {
      const scene = new Scene(containerInfo.ctx);
      applyProps({ scene, type, props });
      return { paint: scene.handle, scene, type };
    } else {
      const shape = new Shape(containerInfo.ctx);
      applyProps({ shape, type, props });
      return { paint: shape.handle, shape, type };
    }
  },
  createTextInstance: () => {
    logger.log("createTextInstance");
    throw new NotImplementedError("createTextInstance is not implemented");
  },
  appendInitialChild: (parent: Instance, child: Instance) => {
    logger.log("appendInitialChild", parent.type, child.type);
    if (parent.scene) {
      parent.scene.push(child.paint);
    }
  },
  finalizeInitialChildren: () => {
    logger.log("finalizeInitialChildren");
    return false;
  },
  shouldSetTextContent: () => {
    logger.log("shouldSetTextContent");
    return false;
  },
  getRootHostContext: () => {
    logger.log("getRootHostContext");
    return {};
  },
  getChildHostContext: (parentHostContext) => {
    logger.log("getChildHostContext");
    return parentHostContext;
  },
  getPublicInstance: (instance) => {
    logger.log("getPublicInstance");
    return instance;
  },
  prepareForCommit: () => {
    logger.log("prepareForCommit");
    return null;
  },
  resetAfterCommit: (containerInfo) => {
    logger.log("resetAfterCommit");

    containerInfo.canvas.update();
    containerInfo.canvas.draw();
    containerInfo.canvas.sync();

    if (containerInfo.htmlCanvas) {
      /**
       * Get a zero-copy view of the pixel buffer from WASM memory
       * This creates a Uint8ClampedArray view directly into WASM memory - no copying!
       *
       * Use with ABGR8888 colorspace for direct Canvas ImageData compatibility.
       * ABGR8888 on little-endian systems = RGBA format expected by Canvas.
       */
      const pixelBuffer = new Uint8ClampedArray(
        containerInfo.ctx.module.HEAPU8.buffer,
        containerInfo.canvas.bufferPtr,
        containerInfo.canvas.bufferSize
      );
      const imageData = new ImageData(
        pixelBuffer,
        containerInfo.htmlCanvas.width,
        containerInfo.htmlCanvas.height
      );
      containerInfo.htmlCanvas.getContext("2d")?.putImageData(imageData, 0, 0);
    }
  },
  preparePortalMount: () => {
    logger.log("preparePortalMount");
  },
  scheduleTimeout: (fn, delay) => {
    logger.log("scheduleTimeout");
    return setTimeout(fn, delay);
  },
  cancelTimeout: (id) => {
    logger.log("cancelTimeout");
    clearTimeout(id);
  },
  noTimeout: -1,
  isPrimaryRenderer: false,
  getInstanceFromNode: () => {
    logger.log("getInstanceFromNode");
    return null;
  },
  beforeActiveInstanceBlur: () => {
    logger.log("beforeActiveInstanceBlur");
  },
  afterActiveInstanceBlur: () => {
    logger.log("afterActiveInstanceBlur");
  },
  prepareScopeUpdate: () => {
    logger.log("prepareScopeUpdate");
  },
  getInstanceFromScope: () => {
    logger.log("getInstanceFromScope");
    return null;
  },
  detachDeletedInstance: () => {
    logger.log("detachDeletedInstance");
  },
  appendChild: (parent: Instance, child: Instance) => {
    logger.log("appendChild", parent.type, child.type);
    if (parent.scene) {
      parent.scene.push(child.paint);
    }
  },
  appendChildToContainer: (containerInfo: Container, child: Instance) => {
    logger.log("appendChildToContainer", child.type);
    containerInfo.canvas.push(child.paint);
  },
  insertBefore: (parent: Instance, child: Instance, beforeChild: Instance) => {
    logger.log("insertBefore", parent.type, child.type, beforeChild.type);
    if (parent.scene) {
      parent.scene.insertBefore(child.paint, beforeChild.paint);
    }
  },
  insertInContainerBefore: (
    containerInfo: Container,
    child: Instance,
    beforeChild: Instance
  ) => {
    logger.log("insertInContainerBefore", child.type, beforeChild.type);
    containerInfo.canvas.insertBefore(child.paint, beforeChild.paint);
  },
  removeChild: (parent: Instance, child: Instance) => {
    logger.log("removeChild", parent.type, child.type);
    if (parent.scene) {
      parent.scene.remove(child.paint);
    }
  },
  removeChildFromContainer: (containerInfo: Container, child: Instance) => {
    logger.log("removeChildFromContainer", child.type);
    containerInfo.canvas.remove(child.paint);
  },
  resetTextContent: () => {
    logger.log("resetTextContent");
  },
  commitTextUpdate: () => {
    logger.log("commitTextUpdate");
  },
  commitMount: () => {
    logger.log("commitMount");
  },
  commitUpdate: (instance, type, _, nextProps) => {
    logger.log("commitUpdate", type);

    applyProps({
      shape: instance.shape,
      scene: instance.scene,
      type,
      props: nextProps,
    });
  },
  clearContainer: () => {
    logger.log("clearContainer");
    // Don't implement clearContainer - let React handle cleanup via removeChildFromContainer
    // Calling canvas.clear() directly causes issues because React still holds references
    // to the paint handles, leading to use-after-free when React tries to clean up.
    // By leaving this empty, React will call removeChildFromContainer for each child,
    // which properly manages reference counting.
  },
  supportsHydration: false,
  NotPendingTransition: null,
  HostTransitionContext: {
    $$typeof: Symbol.for("react.context"),
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0,
    Consumer: null as any,
    Provider: null as any,
  },
  setCurrentUpdatePriority: () => {
    logger.log("setCurrentUpdatePriority");
  },
  getCurrentUpdatePriority: () => {
    logger.log("getCurrentUpdatePriority");
    return DefaultEventPriority;
  },
  resolveUpdatePriority: () => {
    logger.log("resolveUpdatePriority");
    return DefaultEventPriority;
  },
  resetFormInstance: () => {
    logger.log("resetFormInstance");
  },
  requestPostPaintCallback: () => {
    logger.log("requestPostPaintCallback");
  },
  shouldAttemptEagerTransition: () => {
    logger.log("shouldAttemptEagerTransition");
    return false;
  },
  trackSchedulerEvent: () => {
    logger.log("trackSchedulerEvent");
  },
  resolveEventType: () => {
    logger.log("resolveEventType");
    return null;
  },
  resolveEventTimeStamp: () => {
    logger.log("resolveEventTimeStamp");
    return Date.now();
  },
  maySuspendCommit: () => {
    logger.log("maySuspendCommit");
    return false;
  },
  preloadInstance: () => {
    logger.log("preloadInstance");
    return false;
  },
  startSuspendingCommit: () => {
    logger.log("startSuspendingCommit");
  },
  suspendInstance: () => {
    logger.log("suspendInstance");
  },
  waitForCommitToBeReady: () => {
    logger.log("waitForCommitToBeReady");
    return null;
  },
};
