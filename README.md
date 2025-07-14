# I Ching UNO Game

完整的离线单人卡牌游戏，结合传统中国易经六十四卦与UNO游戏机制。

## 特性

- 完全离线游戏体验
- 智能AI对手
- 综合积分系统
- 全球排行榜
- 中文语音包
- 支持移动端（APK）

## 构建APK

1. 上传本项目到GitHub仓库
2. GitHub Actions会自动构建APK
3. 构建完成后可在Releases页面下载

## 技术栈

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Mobile: Capacitor
- Database: PostgreSQL (可选)
- CI/CD: GitHub Actions

## 启动开发

```bash
npm install
npm run dev
```

## 项目结构

- `android/` - Android项目文件
- `client/` - 前端React应用
- `server/` - 后端Express服务
- `shared/` - 共享类型定义
- `public/` - 静态资源文件