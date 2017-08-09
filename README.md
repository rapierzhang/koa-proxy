# 这是一个koa2的请求转发平台
## 使用方式

```
git clone https://github.com/jtzhangmy/koa-proxy.git
cd koa-proxy
npm install
```

### 此项目需要部署在pm2中，并且需要启动两个进程，一个是admin的后台管理界面进程，一个是请求转发的进程

```
sudo npm install -g pm2
启动mongo
pm2 start admin.js -i 1 --name admin
pm2 start app.js -i 2 --name proxy 
```

## 说明

#### 127.0.0.1:9001/admin是后台, 127.0.0.1:9000是转发平台
#### 若端口被占用，请用 lsof -i:9000查看进程PID，然后kill掉
#### 在admin中通过表单形式将所需要转发的请求填入表单，并将内容保存在mongo中
#### 例：名称： 测试， url: /test 接入的url: http://www/*.com/test/……
#### 请求方式可选POST，GET，PUT，DELETE
#### 可更改header，body字段，header添加字段
#### 保存完成后，通过build生成js代码，然后通过node调用系统命令重启pm2来使代码生效
