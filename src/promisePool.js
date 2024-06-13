export class PromisePool {
    iters = null
    concurrency = null

    /**
     *
     * @param {Iterable} iters
     * @param {number} concurrency
     */
    constructor(iters) {
        if (iters !== null && typeof iters[Symbol.iterator] === 'function') {
            this.iters = iters
        }
    }

    /**
     *
     * @param {number} concurrency
     */
    static withConcurrency(concurrency) {
        const pool = new PromisePool(null)
        pool.concurrency = parseConcurrency(concurrency)

        const configPromise = new ConfigPromise()
        configPromise.concurrent = concurrency

        return configPromise
    }

    /**
     *
     * @param {number} concurrency
     */
    withConcurrency(concurrency) {}
}

function parseConcurrency(num) {
    if (typeof num !== 'number' || num <= 0) {
        throw new TypeError('concurrent num should be a positive Integer')
    }

    return Number.parseInt(num)
}

// PromisePool.withConcurrent(1)
