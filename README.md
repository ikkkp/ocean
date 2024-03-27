# lib4univ-view

**lib4univ是使用基于Transformers.js 模型NLP文本知识向量抽取和AIGC构建的开源知识图谱校园文库**

lib4univ是一款基于先进技术的学术知识文库与学习平台，致力于提供智能化、个性化的学术支持和学习体验。

知识有时候难以通过简单的自然语言进行定性的描述，这源于知识的复杂性、主观性和文化差异，以及某些领域非线性结构等多重因素，这些限制了通过语言充分捕捉其多维、抽象和多样化特性的可能性。

在lib4univ的技术框架下，通过融合自然语言处理和知识谱构建技术，实现了对知识的深层次理解和高效管理。

项目使用wap2app/Vue/Hybrid App架构，使用HBuilderX基于WebView的Hybrid App开发。使用Wireshark对中南大学统一身份认证平台网络抓包分析，基于第三方登录进行学生身份校验；使用基于 OSS，MongoDB， Elasticsearch，Milvus向量数据库进行文档及知识向量的储存和搜索；使用Canvas进行文档的水印处理及生成加载骨架界面；使用Charles捕获和分析经过 HTTPS协议的加密流量；使用 Docker + Jenkins Pipeline 实现自动构建部署。

![image](https://github.com/ikkkp/ocean/assets/148513444/6d52470a-af4e-455c-8cda-63e2b88bb638)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


