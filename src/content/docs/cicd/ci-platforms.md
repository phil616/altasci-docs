---
title: CI 平台与配置选择
description: 了解 AltasCI 文档涉及的构建平台、配置语法和迁移时需要确认的兼容性。
category: cicd
order: 30
updated: '2026-10-29'
tags: [CI/CD, CNB, GitHub Actions, 构建平台]
---

## 平台与职责

CI 平台接收代码事件、准备构建环境并执行检查和构建。选择平台后，需要使用该平台支持的配置格式，而不是仅将文件改名。

AltasCI 的流程涉及以下平台。其中自建平台的运行限制来自接入约定，具体可用环境以目标项目配置为准。

| 平台 | 配置方式 | 阅读时关注 |
| --- | --- | --- |
| GitHub Actions | GitHub workflow | 事件、Runner、Actions 依赖与授权 |
| CNB 云原生构建 | `.cnb.yml` | CNB 的分支、事件、流水线和任务结构 |
| AltasCI CodeServer | 基于 Gitea Actions 的 workflow | 本文介绍的接入环境使用 Ubuntu Linux Runner；不能假定与 GitHub 完全相同 |
| AltasCI AI DevOps | 专门项目的事件驱动流程 | 本板块不提供该平台的配置与触发操作指南 |

## CNB 配置

CNB 在仓库根目录读取 `.cnb.yml`，通过分支与事件选择流水线。构建环境可以使用 Docker 镜像，任务通过脚本或插件执行。

CNB 的 `stages`、`imports` 和 `services` 等字段有自己的含义，不能与 GitHub workflow 的 `jobs`、`steps` 或表达式语法混写。请从 [CNB 流水线配置](/docs/cicd/cnb-pipelines/)开始，并以 [CNB 配置文件文档](https://docs.cnb.cool/zh/build/configuration.html)核对平台行为。

## GitHub Actions 与 CodeServer

GitHub Actions 的 workflow 文件位于 `.github/workflows/`。CodeServer 基于 Gitea，使用相近的 workflow 结构；工作流搜索目录、Runner 标签和镜像由实例配置决定。

复用工作流前，应逐项核对：

1. 事件与表达式是否受目标实例支持。
2. Runner 的系统、架构、标签以及可用工具是否符合项目要求。
3. `uses` 指向的 Action 是否可访问，依赖的运行时是否可用。
4. Token 权限、凭据注入和镜像访问方式是否适用于该平台。

预期结果是目标平台能够解析工作流，并在正确环境中完成已有检查与构建。语法相近不意味着所有 Action 或权限配置都能直接迁移；差异见 [Gitea 与 GitHub Actions 对照](https://docs.gitea.com/usage/actions/comparison/)。GitHub 文件结构见 [GitHub workflow 语法](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)。

## 选择构建环境

构建环境需要与项目声明的运行时和锁文件匹配。例如 Node.js 项目应使用项目支持的 Node 主版本，通过锁文件安装依赖，而不是依赖构建节点碰巧已有的工具。

编写流水线时先检查项目实际提供的检查命令。存在测试或类型检查时按项目要求运行；没有相应命令时，不应在流水线或交付说明中虚构检查结果。

## 从构建转向部署

流水线成功构建后，还需要明确制品路径、目标环境以及运行时配置。静态文件交付可以参考[应用形态与部署方式](/docs/cicd/deployment-types/)；涉及主机操作时，继续阅读 [CD 平台与部署目标](/docs/cicd/deployment-platforms/)。
