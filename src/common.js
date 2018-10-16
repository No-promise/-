// 导出excel
export function handleDownload (downloadLoading, propData, tableData) {
  downloadLoading = true // 显示加载中loading
  require.ensure([], () => {
    const {excel} = require('@/assets/plugin/vendor/Export2Excel') // 引入文件，根据自己的路径定义
    let tHeader = []
    let filterVal = []
    for (let index = 0; index < propData.length; index++) {
      tHeader.push(propData[index].label)
      filterVal.push(propData[index].prop)
    }
    let a = tHeader.shift()
    tHeader.push(a)
    let b = filterVal.shift()
    filterVal.push(b)
    const list = tableData // 获取的表格数据
    const data = formatJson(filterVal, list)
    excel(tHeader, data, '列表excel') // 导出 参数为 表头名，内容参数， 表名
    downloadLoading = false // 关闭loading
  })
}

// 数据处理
const formatJson = function (filterVal, jsonData) {
  // 根据你自己返回的数据进行自定义处理
  return jsonData.map(v => filterVal.map(j => {
    return v[j]
  }))
}
