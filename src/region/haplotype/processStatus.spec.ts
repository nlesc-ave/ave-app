import { processStatus } from './processStatus'

describe('processStatus', () => {
  describe('when response status == 200', () => {
    it('should resolve promise', () => {
      const response = {
        status: 200,
        statusText: 'SuperSmashingGreat!'
      } as Response

      const result = processStatus(response)

      return result.then(r => {
        expect(r).toEqual(response)
      })
    })
  })

  describe('when response status == 404', () => {
    it('should reject promise', () => {
      const response = {
        status: 404,
        statusText: 'Not Found'
      } as Response

      const result = processStatus(response)

      return result.catch(e => {
        expect(e).toEqual(response)
      })
    })
  })

  describe('when response status == 0', () => {
    it('should reject promise', () => {
      const response = { status: 0, statusText: 'Nothing' } as Response

      const result = processStatus(response)

      return result.catch(e => {
        expect(e).toEqual(response)
      })
    })
  })
})
