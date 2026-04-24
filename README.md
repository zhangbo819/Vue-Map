# Vue-Map

vue3 的地图类项目

## 常见问题

### 打包后的带下划线_的文件 404

如
    _plugin-vue_export-helper-xxx.js

原因

    GitHub Pages 默认使用 Jekyll，而 Jekyll 会忽略以下划线 (.js) 开头的文件

解决

    在打包后的文件如 docs 增加 .nojekyll，这样 GitHub Pages 就不会处理这些文件

而如果直接在 docs 下放文件，每次打包后会清空，.nojekyll就没了

解决
    
    在 /public 下 增加 .nojekyll，/public 下的文件会原样复制过去