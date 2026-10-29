---
title: CNB 流水线配置
description: 通过公开化示例理解 CNB 的构建、静态文件交付、Docker 制品和主机部署衔接方式。
category: cicd
order: 40
updated: '2026-10-29'
tags: [CI/CD, CNB, Docker, 流水线]
---

## 使用前准备

CNB 使用仓库根目录的 `.cnb.yml` 描述流水线。本页从 AltasCI 发布实践整理出两个示例，分别说明静态前端交付，以及前后端分别构建时的容器制品交付。

示例中的目录、AppID、项目名与密钥仓库路径均为占位内容，不能作为现有生产配置直接运行。接入前需要确认项目的实际构建命令、输出目录、CLI 版本、凭据来源和部署目标。本文档网站本身不执行这些配置。

## 配置结构

常见结构为“分支 → 事件 → 流水线 → 阶段或任务”。例如 `main` 下的 `push` 用于描述主分支推送后的任务。

| 字段 | 用途 |
| --- | --- |
| `docker.image` | 指定流水线构建镜像 |
| `docker.volumes` | 声明缓存或共享数据卷 |
| `services` | 提供构建需要的附加服务，例如 Docker |
| `stages` | 组织顺序执行的阶段 |
| `script` | 执行脚本任务 |
| `imports` | 导入配置变量；引用文件的访问权限需要另外配置 |
| `lock` | 控制使用同一锁的流水线并发 |
| `ifModify` | 根据文件变更范围决定是否执行 |
| `timeout` | 控制任务执行时间，注意与锁的时间参数区分 |
| `image`、`settings` | 指定插件镜像及其参数，具体参数由插件定义 |

层级与可用取值以 [CNB 语法手册](https://docs.cnb.cool/zh/build/grammar.html)为准。`settings` 不是一套通用 SSH 参数格式；如果使用 SSH 插件，应先读取所选插件的说明。

## 示例一：构建并交付静态前端

此示例假设项目在 `frontend/`，提供 `npm run build`，产物位于 `frontend/dist/`。EdgeOne CLI 已作为前端开发依赖固定版本并写入锁文件；认证变量只在部署任务导入。

```yaml
# 示例应用：example-web；AppID：example-web
# 目标：main 分支推送后构建前端，并交付到示例托管项目。
# 前置：frontend/ 中已锁定 EdgeOne CLI 版本，且存在 build 脚本。
# 变量：EDGEONE_API_TOKEN 由受控配置注入，禁止填写实际 Token。
# 替换：密钥仓库路径、项目名、构建目录和公开 API 地址。
main:
  push:
    - name: 静态前端交付示例
      docker:
        image: node:24
        volumes:
          - /root/.npm:copy-on-write
      lock:
        key: example-web-production
        wait: true
        expires: 3600
        timeout: 3600
      stages:
        - name: 安装依赖
          timeout: 15m
          script: |
            set -eu
            cd frontend
            npm ci

        - name: 构建静态文件
          timeout: 20m
          script: |
            set -eu
            cd frontend
            export VITE_API_BASE_URL=https://api.example.com
            npm run build

        - name: 交付到静态托管
          timeout: 15m
          imports:
            - https://cnb.cool/<your-org>/<your-secret-repo>/-/blob/main/pages.yml
          script: |
            set -eu
            cd frontend
            npx --no-install edgeone makers deploy ./dist/ \
              -n example-web \
              -t "${EDGEONE_API_TOKEN}"
```

先安装锁定依赖，再构建，最后交付。项目已有类型检查、测试等要求时，应在交付前加入对应任务；上面的三个阶段不是对所有项目都充分的质量检查。

`VITE_API_BASE_URL` 是示例前端公开变量，会进入浏览器可下载的产物，不适合存储秘密。使用其他框架时，变量名称及读取方式需按项目调整。

这里按当前 [EdgeOne CLI 文档](https://pages.edgeone.ai/document/edgeone-cli)使用 `edgeone makers` 命令空间。若既有项目使用 `edgeone pages`，应先确认锁定 CLI 版本支持的命令，再调整配置。

缓存配置复用 [CNB 节点缓存机制](https://docs.cnb.cool/zh/build/pipeline-cache.html)，用于减少依赖重复下载，不代替 `npm ci` 或锁文件。

## 示例二：前后端分别交付

前后端同仓库时，前端可以沿用静态文件交付流程，后端则构建并推送容器镜像，再由主机部署阶段读取明确的镜像版本。

以下是另一份独立的构建示例，不要将两个完整示例直接拼接成重复的 `main` 键。这里启用 Docker 服务并使用平台默认构建环境；如果改为自定义构建镜像，需要保证 Docker CLI 可用。

```yaml
# 示例应用：example-api；AppID：example-api
# 目标：构建 backend/ 的 Docker 镜像并推送到本仓库制品路径。
# 内置变量：CNB_TOKEN_USER_NAME、CNB_TOKEN、CNB_DOCKER_REGISTRY、
#           CNB_REPO_SLUG_LOWERCASE、CNB_COMMIT。
# 此示例只交付制品，主机发布需要另行配置连接、授权与运行时材料。
main:
  push:
    - name: 后端镜像构建示例
      services:
        - docker
      lock:
        key: example-api-image-publish
        wait: true
        expires: 3600
        timeout: 3600
      stages:
        - name: 登录制品仓库
          script: |
            set -eu
            printf '%s' "${CNB_TOKEN}" | docker login \
              -u "${CNB_TOKEN_USER_NAME}" \
              --password-stdin "${CNB_DOCKER_REGISTRY}"

        - name: 构建与推送镜像
          script: |
            set -eu
            image="${CNB_DOCKER_REGISTRY}/${CNB_REPO_SLUG_LOWERCASE}"
            docker build -f backend/Dockerfile \
              -t "${image}:${CNB_COMMIT}" backend/
            docker push "${image}:${CNB_COMMIT}"
```

这些内置变量的含义见 [CNB 默认环境变量](https://docs.cnb.cool/zh/build/build-in-env.html)，镜像命名与推送方式见 [Docker 制品库](https://docs.cnb.cool/zh/artifact/docker.html)。Token 的可用权限随触发事件变化，不应将带发布凭据的任务直接开放给不可信代码。

使用 `prod` 等固定标签时，标签可能被后续构建覆盖。因此发布与恢复时应记录明确的提交标签或镜像摘要，不能只凭 `prod` 判断实际版本。

### 衔接主机部署

通过已授权的[连接通道](/docs/cicd/connections/)进入目标主机后，先确认制品版本与独立的仓库拉取凭据，再同步应用配置。流水线内的 `CNB_TOKEN` 是构建期临时令牌，部署主机应使用另行配置的拉取凭据。

下面只演示在目标主机的 root 发布脚本中准备运行配置；机器初始化、应用登记与授权需要提前完成：

```bash
set -eu
baoctl sync example-api
test -s /run/baoctl/example-api.env
# 同步成功后，再继续既有容器替换和运行检查。
```

新容器可以通过 `--env-file /run/baoctl/example-api.env` 读取配置，并按项目设置镜像引用、端口与重启策略。`--pull=always` 和 `--restart unless-stopped` 的含义见 [Docker 运行参数](https://docs.docker.com/reference/cli/docker/container/run/)，它们不提供发布回滚或业务健康检查。

同步失败时应停止后续步骤，保留旧服务。不要用忽略退出码的方式继续发布，也不要在停止旧容器之后才发现材料不可用。镜像清理应遵循版本保留策略，避免删除仍在使用或用于恢复的制品。应用配置细节见[部署凭据与应用配置](/docs/cicd/credentials/)。

## 并发与变更过滤

部署锁用于控制同一仓库内使用相同锁名的任务并发，不能跨仓库提供互斥。锁的有效期应覆盖操作过程；它本身不保证提交顺序，也不能单独保证最新版本最后上线。发布前还应核对计划交付的版本，按项目策略处理排队或取消任务。

`ifModify` 可减少无关目录变更触发的构建，但需要同时覆盖共享代码、依赖文件和配置变更。新建分支等事件的文件差异统计存在限制，具体见 [CNB `ifModify` 说明](https://docs.cnb.cool/zh/build/grammar.html#pipeline-ifmodify)。

前后端分成两条流水线后，不要假定先写的流水线会先完成；需要前后依赖时应明确编排，而不是依赖配置排列位置。

## 其他平台与交付方式

文件复制型发布、GitHub Actions 和 CodeServer 工作流需要根据目标项目另行编写，本页不将尚未提供的模板描述为可直接使用的能力。选择前先阅读[应用形态与部署方式](/docs/cicd/deployment-types/)和 [CI 平台与配置选择](/docs/cicd/ci-platforms/)。
