import { Request, Response } from 'express';
import { MicroUiConfig } from '@sackrin/react-micro-ui/lib/Types/MicroUiConfig';
import { MicroUiConfigProfileEnv } from '@sackrin/react-micro-ui/lib/Types/MicroUiConfigProfileEnv';

type ExpressMicroUIRoute = <R extends {}>({
  platform,
  req,
  res,
  logger,
  env,
  config,
  method,
}: {
  platform: 'express';
  req: Request;
  res: Response;
  logger: any;
  env: MicroUiConfigProfileEnv;
  config: MicroUiConfig;
  method: string;
}) => R;

export default ExpressMicroUIRoute;
