---
title: 接口字段约定
description: 查阅 Demo 使用的标识、时间、分页与响应格式。
category: reference
order: 10
updated: '2026-10-21'
tags: [Demo, 字段, 接口]
---

## 示例范围

这些字段保证 Demo 内容一致，不代表文档站提供业务 API。

## 通用字段

| 字段 | 类型 | 示例 | 含义 |
| --- | --- | --- | --- |
| project_id | string | DEMO-PROJECT-001 | 项目标识 |
| order_id | string | DEMO-ORDER-001 | 订单标识 |
| environment | string | sandbox | 业务环境 |
| request_id | string | demo-request-001 | 请求追踪编号 |
| created_at | string | 2026-10-21T10:30:00+08:00 | 带时区的创建时间 |

排障时保留时间与时区，示例标识不应直接用于生产请求。

## 分页示例

```json
{
  "code": "OK",
  "message": "success",
  "request_id": "demo-request-004",
  "data": {
    "items": [{ "project_id": "DEMO-PROJECT-001" }],
    "page": 1,
    "page_size": 20,
    "total": 1
  }
}
```

Demo 页码从 1 开始，`page_size` 为每页条数，`total` 为匹配总数。实际大小限制由具体接口确定。

## 错误响应

示例错误响应保留 `code`、`message` 与 `request_id`，`data` 为 `null`。业务结果判断应遵循接口约定，完整索引见 [错误代码总览](/docs/errors/overview/)。
