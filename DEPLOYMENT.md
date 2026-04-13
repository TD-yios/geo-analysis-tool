# 部署说明

## 环境要求
- Node.js 16+
- npm 或 yarn

## 安装依赖
```bash
npm install
```

## 环境变量配置
复制 `.env.example` 为 `.env` 并配置：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```
# 前端API服务器地址（生产环境改为实际域名）
VITE_API_BASE=http://localhost:3001

# 后端服务器端口
PORT=3001
```

## 构建前端
```bash
npm run build
```

## 启动服务器

### 开发环境
```bash
npm run dev:full
```

### 生产环境
```bash
# 设置环境变量
export NODE_ENV=production

# 启动服务
npm start
```

## 目录结构
```
.
├── dist/              # 前端构建产物（生产环境需要）
├── server/            # 后端服务器
│   └── index.mjs      # 服务器入口文件
├── src/               # 前端源码
├── index.html         # HTML入口
├── package.json       # 项目配置
├── .env.example       # 环境变量模板
└── vite.config.ts     # Vite配置
```

## 生产环境部署

### 方式一：使用PM2
```bash
# 安装PM2
npm install -g pm2

# 创建ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'geo-analysis',
    script: 'server/index.mjs',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

# 启动服务
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs geo-analysis

# 停止服务
pm2 stop geo-analysis

# 重启服务
pm2 restart geo-analysis
```

### 方式二：使用Docker
创建 `Dockerfile`：
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "server/index.mjs"]
```

构建和运行：
```bash
# 构建镜像
docker build -t geo-analysis .

# 运行容器
docker run -d -p 3001:3001 --name geo-analysis geo-analysis
```

### 方式三：使用systemd
创建服务文件 `/etc/systemd/system/geo-analysis.service`：
```ini
[Unit]
Description=GEO Analysis Tool
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/geo-analysis
Environment=NODE_ENV=production
Environment=PORT=3001
ExecStart=/usr/bin/node /var/www/geo-analysis/server/index.mjs
Restart=always

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
sudo systemctl daemon-reload
sudo systemctl enable geo-analysis
sudo systemctl start geo-analysis
sudo systemctl status geo-analysis
```

## 端口说明
- 前端开发服务器：5173 (仅开发环境)
- 后端API服务器：3001

## API接口
- POST `/api/v1/analyze` - 单页分析
- POST `/api/v1/analyze-full-site-progress` - 全站分析（SSE）
- POST `/api/v1/history` - 保存历史记录
- GET `/api/v1/history` - 获取历史记录
- DELETE `/api/v1/history` - 删除历史记录

## Nginx反向代理配置
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 注意事项
1. 生产环境必须先运行 `npm run build` 构建前端
2. 服务器默认监听3001端口，可通过环境变量PORT修改
3. 历史记录存储在内存中，服务器重启会清空
4. 建议使用反向代理（如Nginx）配置HTTPS
5. 生产环境设置NODE_ENV=production以启用静态文件服务
6. 如需持久化历史记录，可改为使用数据库
