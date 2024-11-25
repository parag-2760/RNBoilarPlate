//consuming api requests mentioned in api class

import {api} from '..';

export const callSignup = async (body: any) => {
  try {
    const result = await api.signup(body);
  } catch (error) {
    //handle error here
  }
};
