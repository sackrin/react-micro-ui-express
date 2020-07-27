import loadable from "@loadable/component";
import { hydrate, render } from "react-dom";
import {
  renderComponent,
  hydrateComponent,
  childComponent,
} from "@sackrin/react-micro-ui/lib/Helpers";

// Enable code splitting by returning with loadable
const ExampleComponent = loadable(() =>
  import("./Components/ExampleComponent")
);

export const Components = {
  ExampleComponent,
};

export const Hydrate = hydrateComponent(hydrate, Components);
export const Render = renderComponent(render, Components);
export const Child = childComponent(Components);
