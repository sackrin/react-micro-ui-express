import { MicroUiConfig } from '@sackrin/react-micro-ui/lib/Types/MicroUiConfig';
import CreateExpressRoute from '@typings/CreateExpressRoute';
import CreateExpressStrap from "@typings/CreateExpressStrap";
import CreateExpressBoot from "@typings/CreateExpressBoot";

type CreateExpressMicroUI = (args: {
  config: MicroUiConfig;
  profile: string;
  logger: any;
}) => {
  api: any;
  strap: CreateExpressStrap;
  boot: CreateExpressBoot;
  route: CreateExpressRoute;
  env: any;
  config: MicroUiConfig;
  logger: any;
  express: any;
} | void;

export default CreateExpressMicroUI;
