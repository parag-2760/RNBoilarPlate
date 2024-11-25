import axios, {AxiosRequestHeaders, GenericAbortSignal} from 'axios';
import NetInfo from '@react-native-community/netinfo';
import axiosRetry from 'axios-retry';

import {CommonActions} from '@react-navigation/native';
import {Platform} from 'react-native';
import {BASE_URL, HOST} from './ApiConstants';
const AXIOS_RETRY_COUNT = 3;
const AXIOS_RETRY_DELAY = 1000;

const url = (_url: string, appendInUrl?: string) =>
  `${BASE_URL}${_url}${appendInUrl || ''}`;

export type ContentType = 'JSON' | 'FORM_DATA' | 'MULTIPART_FORM_DATA';
export type HttpMethod = 'post' | 'get' | 'put' | 'delete' | 'patch';

interface IHeader {
  'Content-Type': string;
  Host: string;
  Authorization?: string;
  refreshToken?: string;
}
interface IRequest {
  //endpoint from ApiConstants
  endpoint?: string;
  // body of api call
  body?: {[key: string]: any} | null;
  //headers
  headers?: {[key: string]: any} | null;
  //method
  method?: HttpMethod;
  //if there is any extra url other then endpoint, mention it here only in appendURL
  appendInUrl?: string;
  //url params
  params?: object | null;
  externalUrl?: string;
  signal?: GenericAbortSignal;
}
class Request {
  private static _instance: Request;
  private navigation: any | undefined;
  private dispatch: any | undefined;
  private showLoader!: boolean;
  private accessToken: string | undefined;
  private refreshToken: string | undefined;
  private loaderColor: string | undefined;
  private alertButtonColor: string | undefined;
  private showAlertDialog: boolean | undefined;

  /**
   * Initialization at app start up
   */
  public setNavigation(navigation: any) {
    this.navigation = navigation;
    this.showLoader = false;
    this.showAlertDialog = true;
  }
  /**
   * Initialize dispatch at app start
   * @param dispatch
   */
  public setDispatch(dispatch: any) {
    this.dispatch = dispatch;
  }
  /**
   * set loader flag for api calling
   * @param showLoader true if you want to show loader on api call
   */
  public setLoader(showLoader: boolean) {
    this.showLoader = showLoader;
  }
  /**
  @param loaderColor set color for the full screen loader on api call
  */
  public setLoaderColor(loaderColor: string | undefined) {
    this.loaderColor = loaderColor;
  }

  /**
   *
   * @param buttonColor set color for the button in the error alert screen
   */
  public setAlertButtonColor(buttonColor: string | undefined) {
    this.alertButtonColor = buttonColor;
  }

  /**
   *
   * @param showAlertDialog set whether to show alert window
   */
  public setShowAlertDialog(showAlertDialog: boolean | undefined) {
    this.showAlertDialog = showAlertDialog;
  }

  /**
   * set access token once received in login or sign up api
   * @param accessToken
   */
  public setOrUpdateTokens(
    accessToken: string | undefined,
    refreshToken: string | undefined,
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  send = async ({
    endpoint,
    body,
    headers,
    method,
    appendInUrl,
    params,
    externalUrl,
    signal,
  }: IRequest) => {
    const urlToUse = externalUrl
      ? externalUrl
      : endpoint && url(endpoint, appendInUrl || '');

    const header: IHeader = {
      'Content-Type': 'application/json',
      Host: HOST,
    };
    if (this.accessToken) {
      header.Authorization = `Bearer ${this.accessToken}`;
    }
    if (this.refreshToken) {
      header.refreshToken = this.refreshToken;
    }
    //checking the network connection if network is not available than do not hit server
    // const { isConnected, isInternetReachable } = await NetInfo.fetch();
    const {isConnected} = await NetInfo.fetch();
    if (isConnected !== (undefined || null)) {
      if (!isConnected) {
        // perform required task when internet connection not available
      }
    }
    // const base64String = Base64.stringify(Utf8.parse(JSON.stringify(body)));
    const _params = {}; // method === 'get' ? { data: base64String } : null;

    try {
      axiosRetry(axios, {
        retries: AXIOS_RETRY_COUNT, // number of retries
        retryDelay: retryCount => {
          return AXIOS_RETRY_COUNT * AXIOS_RETRY_DELAY;
        },
      });
      const response = await axios({
        url: urlToUse,
        method: method || (body ? 'post' : 'get'),
        headers: {
          ...header,
          ...headers,
        },
        ...(body && {data: JSON.stringify(body)}),
        params: {...params, ..._params},
        transformRequest: [
          (data, _headers) => {
            this.updateTokens({headers: _headers});
            return data;
          },
        ],
        ...(signal && {signal: signal}),
      });
      // close loader
      if (this?.navigation?.canGoBack()) {
        this.navigation && this.showLoader && this.navigation.pop();
      }

      return response.data;
    } catch (error: any) {
      // close loader
      if (this?.navigation?.canGoBack()) {
        this.showLoader && this.navigation.pop();
      }
      const {response} = error;

      // if api request not reached on server
      if (response === undefined) {
        if (error?.code === 'ERR_NETWORK') {
          //Perform required task when received network error
        } else {
          this.showAlertDialog &&
            this.handleAPIError(error?.code, error?.message);
        }
        //Perform required task when received undefined in response
      }

      //Filter error response and show message accordingly
      switch (response?.status) {
        case 400:
          this.showAlertDialog &&
            this.handleAPIError(null, error.response.data.message);
          break;
        case 401: {
          //Perform required task when received 401
          break;
        }
        // session expired,logout alert
        case 502: {
          console.log('Network Error');
          break;
        }

        case 503: {
          console.log('Network Error');
          break;
        }
        default:
          this.showAlertDialog &&
            this.handleAPIError(
              null,
              'Internal server error! please try again',
            );
          break;
      }
    }
  };
  /**
   * Show the error message in custom alert box
   * @param title
   * @param message
   */
  handleAPIError(title: string | null, message: string) {
    //Handle API error here
  }

  /**
   * update tokens in storages and request class
   * @param headers
   */
  updateTokens({
    headers,
    isForce = false,
  }: {
    headers?: AxiosRequestHeaders | undefined;
    isForce?: boolean;
  }) {
    if ((headers?.access_token || false) && (headers?.refresh_token || false)) {
      this.accessToken = headers.access_token;
      this.refreshToken = headers.refresh_token;
      isForce = true;
    }
    if (isForce) {
      //Perform required task like storing access_token and refresh_token in local storage
    }
  }
}

export default Request;
