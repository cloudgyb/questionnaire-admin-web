# questionnaire-admin-web

基于 Vue 2.6 的调查问卷项目--“问卷 Online”WEB APP 的后台管理系统的前端项目。<br>
对应后端 API 项目[《questionnaire-admin》点这里](https://github.com/cloudgyb/questionnaire-admin) 。

## 主要功能

- 后台用户登录
- 调查问卷模板管理功能
- 《问卷 Online》Web APP 的用户管理
- 系统管理
  - 系统菜单和权限管理
  - 用户角色管理
  - 系统用户管理
  - 系统日志管理
  - 系统配置管理

## Project setup

```
yarn install
```

### 配置后端 API 代理

首先启动 questionnaire-admin 后端 API 服务，然后配置 API 代理
见[vue.config.js](vue.config.js)

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 项目截图

![登录](https://github.com/cloudgyb/questionnaire-admin/raw/main/docs/screenshots/login.png "系统登录页面")
![首页](https://github.com/cloudgyb/questionnaire-admin/raw/main/docs/screenshots/index.png "系统首页")
![调查问卷模板管理](https://github.com/cloudgyb/questionnaire-admin/raw/main/docs/screenshots/questionnaire_template_manage.png "调查问卷模板管理页面")
![菜单管理](https://github.com/cloudgyb/questionnaire-admin/raw/main/docs/screenshots/sys_menu_manage.png "系统菜单管理页面")
