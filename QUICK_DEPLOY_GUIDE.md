# 🚀 快速部署指南

## 步骤1：上传文件到GitHub
1. 访问：https://github.com/cuiyanzong/Iching-uno
2. 上传这个文件夹中的所有文件

## 步骤2：触发构建
1. 在GitHub仓库点击"Actions"标签
2. 点击"Run workflow"按钮
3. 选择main分支，点击"Run workflow"

## 步骤3：下载APK
1. 等待5-10分钟构建完成
2. 在完成的构建任务中找到"Artifacts"
3. 下载"android-apk"文件
4. 解压获得APK文件

## 重要文件说明
- `.github/workflows/android-build.yml` - GitHub Actions配置（已修复）
- `package.json` - 项目依赖
- `capacitor.config.json` - Capacitor配置  
- `android/` - Android项目文件
- `README.md` - 项目说明

构建完成后你就可以获得可安装的APK文件了！