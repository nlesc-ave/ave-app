import { AveHaplotypesDataSource } from './AveHaplotypesDataSource'

describe('AveHaplotypesDataSource', () => {
  let source: AveHaplotypesDataSource

  beforeEach(() => {
    source = new AveHaplotypesDataSource('somegenomeid', '/api', [
      'acc1',
      'acc2'
    ])
  })

  describe('succesfull fetch', () => {
    let cb: (body: any) => void

    beforeEach(() => {
      cb = jest.fn()
      source.on('newdata', cb)
      const range = {
        contig: 'chr1',
        start: 3000,
        stop: 4000
      }
      source.rangeChanged(range)
    })

    afterEach(() => {
      source.off('newdata', cb)
    })
  })
})
