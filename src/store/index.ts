const files = require.context('./module', true, /\.ts$/)
const modules:any = {}

files.keys().forEach((key:any, i:number) => {
  if (key === './index.ts') return
  modules[(key.replace(/(\.\/|\.ts)/g, ''))] = files(key).default
})

export default modules
