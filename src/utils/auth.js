import Cookies from 'js-cookie'

const TokenKey = 'Authentication'
const permissionKey = 'permissionKey'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getPermission() {
  return Cookies.get(permissionKey)
}

export function setPermission(permission) {
  return Cookies.set(permissionKey, permission)
}

export function removePermission() {
  return Cookies.remove(permissionKey)
}
