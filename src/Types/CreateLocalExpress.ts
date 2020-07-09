import { MicroUiConfig } from '@sackrin/react-micro-ui/lib/Types/MicroUiConfig';
import { Express } from 'express';
import CreateExpressRoute from '@typings/CreateExpressRoute';
import CreateExpressStrap from "@typings/CreateExpressStrap";
import CreateExpressBoot from "@typings/CreateExpressBoot";

type CreateLocalExpress = (args: {
  config: MicroUiConfig;
  profile?: string;
  logger?: any;
}) => {
  api: Express;
  strap: CreateExpressStrap;
  boot: CreateExpressBoot;
  route: CreateExpressRoute;
  env: any;
  config: MicroUiConfig;
  logger: any;
};

export default CreateLocalExpress;
