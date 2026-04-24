# VUE_MAP

Vue3 的地图类项目

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

### github page 配置

原方案在 main 分支打包将打包后的内容提交 git

更好的方案，使用 gh-pages，将原 main 分支打包后的产物忽略，同时将 dist 自动推送到 gh-pages 分支

- 结构变清晰，main 分支 纯代码，gh-pages 分支 纯打包
- 打包后的产物不会在污染 main 分支 git 记录
- 可以配置 action 每次提交后自动打包，节省时间
- 用单独的 gh-pages 分支来保存打包物 可以更轻松的实现上线后的回退版本