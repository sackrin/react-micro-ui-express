import ExpressMicroUIRoute from '@typings/ExpressMicroUIRoute';

type CreateExpressRoute = (path: string, method: 'get' | 'post' | 'all', handler: ExpressMicroUIRoute) => void;

export default CreateExpressRoute;
