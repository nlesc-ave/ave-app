/**
 * window.fetch does not error on non-2xx status codes.
 * Chain this method as the first promise.then
 *
 * @param response Response
 *
 */
export const processStatus = async (response: Response) => {
  if (
    (response.status >= 200 && response.status < 300) ||
    response.status === 0
  ) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(response)
  }
}
