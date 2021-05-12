// function runAsync(x) {
//   const p = new Promise((r) => setTimeout(() => r(x, console.log(x)), 1000))
//   return p
// }
// function runReject(x) {
//   const p = new Promise((res, rej) =>
//     setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x)
//   )
//   return p
// }
// Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err))
// function runAsync(x) {
//   const p = new Promise((r) => setTimeout(() => r(x, console.log(x)), 1000))
//   return p
// }
// Promise.race([runAsync(1), runAsync(2), runAsync(3)])
//   .then((res) => console.log('result: ', res))
//   .catch((err) => console.log(err))
// function runAsync(x) {
//   const p = new Promise((r) => setTimeout(() => r(x, console.log(x)), 1000))
//   return p
// }
// function runReject(x) {
//   const p = new Promise((res, rej) =>
//     setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x)
//   )
//   return p
// }
// Promise.race([runReject(0), runAsync(1), runAsync(2), runAsync(3)])
//   .then((res) => console.log('result: ', res))
//   .catch((err) => console.log(err))
// ///////////////////////////////////////////////////
// Promise.resolve('1')
//   .then((res) => {
//     console.log(res)
//   })
//   .finally(() => {
//     console.log('finally')
//   })
// Promise.resolve('2')
//   .finally(() => {
//     console.log('finally2')
//     return '我是finally2返回的值'
//   })
//   .then((res) => {
//     console.log('finally2后面的then函数', res)
//   })
// ///////////////////////////////////////////////////
// Promise.resolve('1')
//   .finally(() => {
//     console.log('finally1')
//     throw new Error('我是finally中抛出的异常')
//   })
//   .then((res) => {
//     console.log('finally后面的then函数', res)
//   })
//   .catch((err) => {
//     console.log('捕获错误', err)
//   })
// ///////////////////////////////////////////////////
// function promise1() {
//   let p = new Promise((resolve) => {
//     console.log('promise1')
//     resolve('1')
//   })
//   return p
// }
// function promise2() {
//   return new Promise((resolve, reject) => {
//     reject('error')
//   })
// }
// promise1()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err))
//   .finally(() => console.log('finally1'))
// promise 1 1 finally1

// promise2()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err))
//   .finally(() => console.log('finally2'))
// error finally2
// Promise.resolve(1)
//   .then(2)
//   .then(Promise.resolve(3))
//   .then(console.log)
// promise 的 then / catch 期望传入的是函数，否则会发生值穿透的现象
// Promise.reject('err!!!')
//   .then(
//     (res) => {
//       console.log('success', res)
//     },
//     (err) => {
//       console.log('error', err)
//     }
//   )
//   .catch((err) => {
//     console.log('catch', err)
//   })
// Promise.resolve()
//   .then(
//     function success(res) {
//       throw new Error('error!!!')
//     },
//     function fail1(err) {
//       console.log('fail1', err)
//     }
//   )
//   .catch(function fail2(err) {
//     console.log('fail2', err)
//   })
// async function async1() {
//   console.log('async1 start')
//   await async2()
//   console.log('async1 end')
// }
// async function async2() {
//   console.log('async2')
// }
// async1()
// console.log('start')
function* fib(max) {
  var t,
    a = 0,
    b = 1,
    n = 0
  while (n < max) {
    yield a
    ;[a, b] = [b, a + b]
    n++
  }
  return
}
fib(5)
