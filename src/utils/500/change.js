const fs = require('fs')

// 生成 最简版 cityMap
// [{
//   name: '陕西省',
//   children: [
//     '西安市', '铜川市',
//   ]
// }...]
function genCityMap() {
  const { data, province, city, area, town } = require('province-city-china/data');

  // console.log('data, province, city, area, town', data, province, city, area, town)
  console.log(province)
  // console.log(city) // 地级市
  // console.log(area) // 直辖市的区、县级市、县

  const res = []
  const provinceMap = {}
  province.forEach(({ name, province }) => {
    // res.push({ name, province })
    provinceMap[province] = { name, children: [] }
  })


  // 地级市
  city.forEach((item) => {
    provinceMap[item.province].children.push(item.name)
  })

  // 县级市
  area.forEach((item) => {
    if (item.name.includes('市')) {
      provinceMap[item.province].children.push(item.name)
    }
  })

  for (let key in provinceMap) {
    const { name, children } = provinceMap[key]
    res.push({ name, children })
  }

  const s_city = res.filter(item => item.children.length === 0)
  console.log('特殊市', s_city)

  fs.writeFileSync('./cityMap.json', JSON.stringify(res, null, 4))
  // fs.writeFileSync('./cityMap.js', "export default " + JSON.stringify(res))
  return res
}


// 恢复历史数据
function historyData() {
  const data = require('./data.json')
  const res = data.reduce((r, item) => {
    r.push(...item.data)
    return r
  }, []).sort((a, b) => a.index - b.index)

  fs.writeFileSync('./oldData.json', JSON.stringify(res, null, 4))
}

function main() {
  const cityMap = genCityMap()
  genNewData(cityMap)
}

// 按省市划分数据
function genNewData(cityMap) {
  // const { area } = require('province-city-china/data');
  const data = require('./data.json')
  const oneCity = ['北京市', '天津市', '上海市', '重庆市', '台湾省', '香港', '澳门']

  const resMap = {}
  data.forEach((item) => {
    // console.log('item.address', item.address)
    let [province, city] = item.address.match(/.+?((省|自治区)|市)/g)

    // 处理没有城市的情况
    if (!city) {
      // console.log(item.address + ' 缺少 city')
      if (oneCity.includes(province)) {
        // 特殊市
        let [, area] = item.address.match(/.+?((省|自治区)|市|区)/g)
        city = area
      } else {
        // 查找
        const target = cityMap.find(c => c.children.includes(province))
        // console.log('target', target)
        if (target) {
          city = province
          province = target.name
          item.address = province + item.address // 补齐 address
          // console.log('  补齐 ' + province)
        } else {
          // 碰到这种情况一般是县级市，所以去 area 里再找一次
          // const areaTarget = area.find(a => a.name === province)
          // if (areaTarget) {
          //   // areaTarget.province
          //   city = province
          //   province = areaTarget.name
          //   item.address = province + city + item.address // 补齐 address
          // } else {
          //   // 这要是没有就真没有了，打日志手动处理吧
          // }
          console.log("  " + item.address, ' 市不存在')
        }
      }
    }

    if (!resMap[province]) {
      resMap[province] = { name: province, children: [] }
    }

    const citys = resMap[province].children.find(i => i.name === city)
    if (!citys) {
      resMap[province].children.push({ name: city, children: [item] })
    } else {
      citys.children.push(item)
    }
  })
  fs.writeFileSync('./cdata.json', JSON.stringify(data, null, 4))

  // 根据 resMap 生成最终数组类型数据
  const res = []
  for (let key in resMap) {
    const provinceChildren = resMap[key].children.map(i => {
      return { name: i.name, count: i.children.length, children: i.children }
    })
    res.push({
      name: resMap[key].name,
      count: resMap[key].children.reduce((r, i) => r += i.children.length, 0),
      children: provinceChildren
    })
  }

  // fs.writeFileSync('./newData.json', JSON.stringify(res, null, 4))
  fs.writeFileSync('./newData.json', JSON.stringify(res))
}

main()
