import { HostConfig } from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import { logger } from "./logger";
import { Shape, Scene } from "bindings";
import { applyProps } from "./utils";
import { Container, HostContext, Instance, Props, Type } from "./types";
import { ElementType } from "./constants";

class NotImplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotImplementedError";
  }
}

const isGeometryType = (type: Type): boolean => {
  return (
    type === ElementType.RECT ||
    type === ElementType.CIRCLE ||
    type === ElementType.PATH
  );
};

/**
 * Reset a shape and reapply all its geometry children in order.
 * This is used whenever the geometry children change (add, remove, update, reorder).
 */
const resetAndReapplyGeometry = (instance: Instance): void => {
  if (!instance.shape) return;

  instance.shape.reset();
  for (const child of instance.geometryChildren || []) {
    applyProps({
      shape: instance.shape,
      type: child.type,
      props: child.props || {},
    });
  }
};

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
  createInstance: (type, props, container) => {
    logger.log("createInstance", type, props);

    if (type === ElementType.SCENE) {
      const scene = new Scene(container.module);
      applyProps({ scene, type, props });

      return { paint: scene.handle, scene, type };
    } else if (type === ElementType.SHAPE) {
      const shape = new Shape(container.module);
      applyProps({ shape, type, props });

      return { paint: shape.handle, shape, type, geometryChildren: [] };
    } else if (isGeometryType(type)) {
      // Geometry children don't create their own paint objects
      // They will be applied to parent Shape when appended
      return { type, props };
    } else {
      throw new NotImplementedError(`Unsupported type: ${type}`);
    }
  },
  createTextInstance: () => {
    logger.log("createTextInstance");
    throw new NotImplementedError("createTextInstance is not implemented");
  },
  appendInitialChild: (parentInstance: Instance, childInstance: Instance) => {
    logger.log("appendInitialChild");

    // If parent is a Shape and child is geometry, track and apply geometry to the shape
    if (parentInstance.shape && isGeometryType(childInstance.type)) {
      childInstance.parentInstance = parentInstance;
      parentInstance.geometryChildren = parentInstance.geometryChildren || [];
      parentInstance.geometryChildren.push(childInstance);

      applyProps({
        shape: parentInstance.shape,
        type: childInstance.type,
        props: childInstance.props || {},
      });
    } else if (parentInstance.scene && childInstance.paint) {
      // Otherwise, if parent is a scene, push child paint object
      parentInstance.scene.push(childInstance.paint);
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
  resetAfterCommit: (container) => {
    logger.log("resetAfterCommit");

    container.canvas.update();
    container.canvas.draw();
    container.canvas.sync();
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
  appendChild: (parentInstance: Instance, childInstance: Instance) => {
    logger.log("appendChild");

    // If parent is a Shape and child is geometry, track child and reset+reapply all geometry
    if (parentInstance.shape && isGeometryType(childInstance.type)) {
      childInstance.parentInstance = parentInstance;
      parentInstance.geometryChildren = parentInstance.geometryChildren || [];
      parentInstance.geometryChildren.push(childInstance);
      resetAndReapplyGeometry(parentInstance);
    } else if (parentInstance.scene && childInstance.paint) {
      // Otherwise, if parent is a scene, push child paint object
      parentInstance.scene.push(childInstance.paint);
    }
  },
  appendChildToContainer: (container: Container, childInstance: Instance) => {
    logger.log("appendChildToContainer");
    if (childInstance.paint) {
      container.rootScene.push(childInstance.paint);
    }
  },
  insertBefore: (
    parentInstance: Instance,
    childInstance: Instance,
    beforeChildInstance: Instance
  ) => {
    logger.log("insertBefore");

    // If parent is a Shape and child is geometry, insert at correct position and reset+reapply all geometry
    if (parentInstance.shape && isGeometryType(childInstance.type)) {
      childInstance.parentInstance = parentInstance;
      parentInstance.geometryChildren = parentInstance.geometryChildren || [];

      const beforeIndex =
        parentInstance.geometryChildren.indexOf(beforeChildInstance);
      if (beforeIndex !== -1) {
        parentInstance.geometryChildren.splice(beforeIndex, 0, childInstance);
      } else {
        parentInstance.geometryChildren.push(childInstance);
      }

      resetAndReapplyGeometry(parentInstance);
    } else if (
      parentInstance.scene &&
      childInstance.paint &&
      beforeChildInstance.paint
    ) {
      parentInstance.scene.insertBefore(
        childInstance.paint,
        beforeChildInstance.paint
      );
    }
  },
  insertInContainerBefore: (
    container: Container,
    childInstance: Instance,
    beforeChildInstance: Instance
  ) => {
    logger.log("insertInContainerBefore");
    if (childInstance.paint && beforeChildInstance.paint) {
      container.rootScene.insertBefore(
        childInstance.paint,
        beforeChildInstance.paint
      );
    }
  },
  removeChild: (parentInstance: Instance, childInstance: Instance) => {
    logger.log("removeChild");

    // If parent is a Shape and child is geometry, remove from tracking and reset+reapply remaining geometry
    if (parentInstance.shape && isGeometryType(childInstance.type)) {
      parentInstance.geometryChildren =
        parentInstance.geometryChildren?.filter((c) => c !== childInstance) ||
        [];
      resetAndReapplyGeometry(parentInstance);
    } else if (parentInstance.scene && childInstance.paint) {
      parentInstance.scene.remove(childInstance.paint);
    }
  },
  removeChildFromContainer: (container: Container, childInstance: Instance) => {
    logger.log("removeChildFromContainer");
    if (childInstance.paint) {
      container.rootScene.remove(childInstance.paint);
    }
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
  commitUpdate: (instance, type, oldProps, nextProps) => {
    logger.log("commitUpdate");

    // For geometry children, check if props actually changed before resetting
    if (isGeometryType(instance.type)) {
      instance.props = nextProps;

      // Trigger parent shape reset and reapply all geometry
      const parentInstance = instance.parentInstance;
      if (parentInstance) {
        resetAndReapplyGeometry(parentInstance);
      }

      return;
    }

    applyProps({
      shape: instance.shape,
      scene: instance.scene,
      type,
      props: nextProps,
    });
  },
  clearContainer: (container: Container) => {
    logger.log("clearContainer");
    container.rootScene.remove(null);
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
