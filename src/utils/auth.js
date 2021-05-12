import Cookies from 'js-cookie'
import md5 from 'js-md5'

const TokenKey = 'userId'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, md5('cnew9hcsnzoer' + token))
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
