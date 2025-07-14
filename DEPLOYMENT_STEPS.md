# 📱 APK构建部署步骤

## 重要：文件结构检查
确保上传后的GitHub仓库包含以下结构：
```
你的仓库/
├── .github/
│   └── workflows/
│       └── android-build.yml  ← 这是关键文件
├── android/
├── package.json
├── capacitor.config.json
└── README.md
```

## 步骤1：启用GitHub Actions
1. 进入仓库设置页面
2. 点击左侧"Actions" > "General"
3. 选择"Allow all actions and reusable workflows"
4. 保存设置

## 步骤2：上传文件
1. 将整个deployment-package内容上传到仓库
2. 确保.github目录被正确上传（注意点号开头）
3. 提交所有更改

## 步骤3：触发构建
方式1：自动触发（推荐）
- 上传文件后会自动开始构建

方式2：手动触发
- 进入"Actions"页面
- 找到"Android Build"工作流
- 点击"Run workflow"

## 步骤4：下载APK
1. 等待构建完成（约5-10分钟）
2. 点击完成的构建任务
3. 在"Artifacts"部分下载"android-apk"
4. 解压获得可安装的APK文件

## 常见问题
- 如果没有"Run workflow"按钮，检查Actions设置是否启用
- 如果构建失败，查看错误日志并检查文件完整性
- 确保.github目录名称正确（注意点号）