import { promisePool } from './promisePool.js'
import { PromisePool } from '@supercharge/promise-pool'

function task(second) {
    return () => {
        console.log('task start')
        return new Promise((r) => {
            console.log('promise init')
            setTimeout(() => {
                console.log('task finish')
                r()
            }, second)
        })
    }
}

let tasks = []

for (let i = 0; i < 20; i += 1) {
    tasks.push(task(2000))
}

// PromisePool.for(tasks)
//   .withConcurrency(4)
//   .process(async (item) => {
//     await item();
//   });

promisePool(tasks, 4).then(
    () => {
        console.log('fulfilled')
    },
    () => {
        console.log('failed')
    },
)
