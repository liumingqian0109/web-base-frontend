module.exports = file => require('@/' + file + '.vue').default // vue-loader at least v13.0.0+
// 只能使用module.export 不能使用es6的export default
