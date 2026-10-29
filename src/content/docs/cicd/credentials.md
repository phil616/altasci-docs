---
title: 部署凭据与应用配置
description: 了解 OpenBao、AppID 和 baoctl 的职责，以及应用环境变量与文件材料的交付方式。
category: cicd
order: 60
updated: '2026-10-29'
tags: [CI/CD, OpenBao, baoctl, 凭据管理]
---

## 配置如何进入应用

AltasCI 的主机部署流程使用 OpenBao 存放应用配置，由 `baoctl` 在目标环境同步所需材料，再由 Docker 或 systemd 加载。配置应在部署前准备好，流水线不负责凭空创建缺失的生产凭据。

OpenBao 的 KV 引擎是通用键值存储；本文的环境分类、路径布局、AppID 和文件字段是 AltasCI 与同步工具的约定，不是 OpenBao 对所有用户强制规定的格式。

```text
授权维护人员准备应用配置
        ↓
部署环境通过 baoctl 同步指定 AppID 的材料
        ↓
生成环境变量文件或应用配置文件
        ↓
容器或服务加载配置并启动
```

公开文档中的 `example-api`、`example-config` 是示例 AppID，不对应实际应用材料。

## 配置材料的路径约定

应用材料按环境、类型和应用标识组织：

```text
<环境>/<材料类型>/<AppID>/env
```

| 部分 | 含义 | 示例取值 |
| --- | --- | --- |
| 环境 | 区分生产、测试和开发材料 | `prod`、`test`、`dev` |
| 材料类型 | 环境变量或文件材料 | `apps`、`files` |
| AppID | 应用的唯一标识 | `example-api` |
| `env` | 此路径约定的固定末段 | `env` |

例如 `prod/apps/example-api/env` 表示示例应用的生产环境变量材料。这是逻辑组织方式；OpenBao 的挂载点、KV 版本、认证与实际 API 路径需要结合部署配置确认，不能直接将此路径当成通用 HTTP 接口。

## 同步环境变量

目标环境需要先完成 `baoctl` 安装、机器初始化和应用登记；材料已存在且访问已授权后，可以同步指定应用。当前工具要求 root 权限，下面以已获授权的 `sudo` 方式示意，不表示普通部署用户默认拥有这些权限：

```bash
sudo baoctl sync example-api
sudo test -s /run/baoctl/example-api.env
```

预期同步命令成功，并生成应用对应的环境变量文件。检查文件是否存在即可，不要通过打印文件内容来验证同步，避免将凭据写入日志。

AppID 并不单独决定读取哪个环境。运行 `sync` 前还应确认工具版本和环境分类，应用登记与同步参数应一致。当前工具的默认分类是 `prod/apps`；测试环境需显式使用 `--classified test`，其输出为 `/run/baoctl/example-api.env.test`，不能沿用生产环境文件名。

Docker 通过 `--env-file /run/baoctl/example-api.env` 加载；systemd 可在已有服务的 `[Service]` 段中引用：

```ini
[Service]
EnvironmentFile=/run/baoctl/example-api.env
```

以上片段只说明配置引用方式。文件更新后，应用是否需要重启或重建容器，取决于应用的加载机制和服务管理方式。`/run` 下的运行时材料还需要纳入主机重启后的恢复流程。

## 文件类型材料

对于使用配置文件或证书文件的应用，使用以下字段组织文件材料：

| 字段 | 用途 |
| --- | --- |
| `FILENAME` | 输出文件名 |
| `B64` | 文件内容的 Base64 编码 |
| `SHA256` | 原始文件的完整性校验值 |

同步工具按配置还原文件并核验校验值。例如，登记测试环境文件类应用后，使用 `baoctl sync example-config --classified test --typename files`，文件输出到 `/run/baoctl/example-config/test/<FILENAME>`；此命令同样需要 root 权限。不同类型的材料不能只更换 AppID 而省略分类参数。

Base64 是编码，不是加密；包含私钥、密码或服务端配置的材料仍须按秘密信息管理。公开 CA 证书和企业 OpenPGP 公钥应从本站的[证书下载](/docs/pki/downloads/)与[公钥下载](/docs/pki/openpgp/)入口获取，不能将应用私钥发布到这些目录。

## 区分构建与部署凭据

CI 期间的制品推送、部署主机的制品拉取和应用运行配置是三个用途。部署主机使用独立配置的拉取凭据，不依赖某次 CI 的临时 Token；前端构建只写入可公开的配置值。

当同步失败、文件缺失或环境不匹配时，应先解决配置问题，再进入服务替换步骤。应用配置的存放和同步，不等同于获得服务器或其他应用的操作权限。

## 参考资料

- [OpenBao KV 引擎](https://openbao.org/docs/secrets/kv/kv-v2/)：存储、版本及路径机制。
- [baoctl 项目](https://github.com/phil616/baoctl)：具体命令、配置与输出行为。
- [systemd `EnvironmentFile`](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html#EnvironmentFile=)：服务环境文件的读取方式。
- [部署连接方式](/docs/cicd/connections/)：发布过程如何连接目标主机。
