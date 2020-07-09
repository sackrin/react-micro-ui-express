import path from "path";
import { ExampleComponent } from "./Components";
import createLambdaMicroUI from "@sackrin/react-micro-ui-lambda/lib/createLambdaMicroUI";

exports.handler = async (event, context) => {
  // Retrieve the local config
  const microUIConfig = require(path.join(process.cwd(), "microui.config.js"));
  // Create the Lambda
  const { route, strap, boot } = createLambdaMicroUI(
    event,
    context,
    microUIConfig.api.mode,
    {
      profile: process.env.PROFILE || "local",
      config: microUIConfig,
    }
  );
  // SERVER SIDE RENDERED COMPONENTS
  // Strap in the front end components
  strap("ExampleComponent", ExampleComponent);
  // Boot and handle the response
  return boot(event, context);
};
