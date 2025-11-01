import ReactReconciler from "react-reconciler";
import { LegacyRoot } from "react-reconciler/constants";
import { hostConfig } from "./hostconfig";
import { logger } from "./logger";
import {
  AnyThorVGModule,
  SwCanvas as ThorVGSwCanvas,
  GlCanvas as ThorVGGlCanvas,
  Scene,
} from "bindings";

export const createReconciler = () => ReactReconciler(hostConfig);

export type Reconciler = ReturnType<typeof createReconciler>;

export const createReconcilerContainer = ({
  reconciler,
  module,
  canvas,
}: {
  module: AnyThorVGModule;
  canvas: ThorVGSwCanvas | ThorVGGlCanvas;
  reconciler: Reconciler;
}): ReactReconciler.OpaqueRoot => {
  const rootScene = new Scene(module);
  canvas.push(rootScene.handle);

  return reconciler.createContainer(
    {
      module,
      canvas,
      rootScene,
    },
    LegacyRoot,
    null,
    false,
    null,
    "",
    logger.error,
    logger.error,
    logger.error,
    () => {},
    null
  );
};

export const updateReconcilerContainer = ({
  children,
  root,
  callback,
  reconciler,
}: {
  children: React.ReactNode;
  root: ReactReconciler.OpaqueRoot;
  callback?: () => void;
  reconciler: Reconciler;
}): void => {
  reconciler.updateContainer(children, root, null, callback ?? (() => {}));
};

export const cleanupReconcilerContainer = ({
  root,
  canvas,
  reconciler,
}: {
  root: ReactReconciler.OpaqueRoot | null;
  canvas: ThorVGSwCanvas | ThorVGGlCanvas | null;
  reconciler: Reconciler;
}): void => {
  if (root) {
    reconciler.updateContainer(null, root, null, () => {
      if (canvas) {
        canvas.destroy();
      }
    });
  } else if (canvas) {
    canvas.destroy();
  }
};
