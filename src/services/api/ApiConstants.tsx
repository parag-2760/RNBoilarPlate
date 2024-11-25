//exmaple :- test.reactnative.com
export const TEST_HOST = 'TestDBURL';
//exmaple :- prod.reactnative.com
export const PROD_HOST = 'ProdDBURL';

//boolean flag for host selection
const is_prod = false;

export const HOST = is_prod ? PROD_HOST : TEST_HOST;

//example prefix for api endpoints
export const endpointURL = '/api/';

//final base url :- https://test.reactnative.com/api/ || https://prod.reactnative.com/api/
export const BASE_URL = 'https://' + HOST + endpointURL;

//all api endpoints must be mentioned here before using in app
export const ENDPOINTS = {
  //exmaple
  signup: 'signup',
  login: 'login',
};
