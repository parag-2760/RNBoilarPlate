import {ENDPOINTS} from './ApiConstants';
import Request from './ApiRequester';

class Api {
  //request type from ApiRequester
  request: Request;

  constructor() {
    //initialized the request instance
    this.request = Request.Instance;
  }

  //api requests
  //all apis should mentioned here firstly only after this, it can be used for calls

  signup(body: any) {
    return this.request.send({
      //endpoint from ApiConstants
      endpoint: ENDPOINTS.signup,
      body: body,
      method: 'post',
    });
  }

  login(body: any) {
    return this.request.send({
      endpoint: ENDPOINTS.login,
      body: body,
      method: 'post',
    });
  }
}

//created & exported object of Api class
export const api = new Api();
