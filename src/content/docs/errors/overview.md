---
title: 错误代码总览
description: 区分服务访问错误与演示接口错误，并按代码定位处理文档。
category: errors
order: 10
updated: '2026-10-24'
tags: [Demo, 错误码]
---

## 文档范围

本分类收录两组来源不同的错误代码，编号方式与适用范围均不相同：

| 分组 | 编号方式 | 说明 |
| --- | --- | --- |
| 服务访问错误 | `E001` 至 `E008` | 访问 AltasCI 服务时由服务实际返回，见 [服务访问错误代码](/docs/errors/access-errors/) |
| 接口演示错误 | 大写常量名，如 `ACCESS_DENIED` | 本文及其余文章用于展示响应结构的演示约定 |

以下错误名称、HTTP 状态和字段为演示约定，不代表已实现的生产接口。遇到服务返回的 `E` 系列代码时，请改用 [服务访问错误代码](/docs/errors/access-errors/)。

## 错误响应

```json
{
  "code": "BUSINESS_STATE_CONFLICT",
  "message": "当前订单状态不支持此操作",
  "request_id": "demo-request-001",
  "data": null
}
```

## 代码索引

| HTTP 状态 | Demo 代码 | 含义 | 处理说明 |
| --- | --- | --- | --- |
| 401 | AUTH_TOKEN_EXPIRED | 令牌过期 | [身份与权限错误](/docs/errors/authentication/) |
| 403 | ACCESS_DENIED | 缺少操作权限 | [身份与权限错误](/docs/errors/authentication/) |
| 400 | INVALID_ARGUMENT | 请求参数不符合约定 | [业务状态与资源错误](/docs/errors/business/) |
| 404 | RESOURCE_NOT_FOUND | 资源不存在或不可见 | [业务状态与资源错误](/docs/errors/business/) |
| 409 | BUSINESS_STATE_CONFLICT | 当前状态不支持操作 | [业务状态与资源错误](/docs/errors/business/) |

## 推荐排查流程

读取 HTTP 状态与 `code`，核对环境、参数和当前状态，保留 `request_id` 与发生时间，再按具体说明决定是否重试。

遇到错误页面上的 `E` 系列代码时，按 [服务访问错误代码](/docs/errors/access-errors/) 的索引与通用排查步骤处理。字段格式参阅 [接口字段约定](/docs/reference/configuration/)，未收录问题可按 [支持流程](/docs/help/support/) 提交。
