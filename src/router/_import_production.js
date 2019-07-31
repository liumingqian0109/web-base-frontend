module.exports = file => () => import('@/' + file + '.vue')
// 只能使用module.export 不能使用es6的export default
