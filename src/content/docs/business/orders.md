---
title: 订单与交付
description: 演示服务订单的状态流转、验收与变更记录。
category: business
order: 30
updated: '2026-10-21'
tags: [Demo, 订单, 交付]
---

## 提交申请

在示例项目下创建订单，填写服务类型、规格与期望时间。提交前核对环境、负责人和验收标准。以下状态均为 Demo 约定。

## 状态说明

| 状态 | 含义 | 下一步 |
| --- | --- | --- |
| draft | 草稿，尚未提交 | 补齐必填内容 |
| pending | 已提交，等待确认 | 等待负责人审核 |
| processing | 正在交付 | 跟进处理进度 |
| completed | 已完成验收 | 归档交付结果 |
| cancelled | 申请已取消 | 查询取消原因 |

示例中允许草稿或待确认订单取消，处理中的订单需先联系负责人确认变更。

## 验收记录示例

```json
{
  "order_id": "DEMO-ORDER-001",
  "project_id": "DEMO-PROJECT-001",
  "status": "completed",
  "acceptance": { "checked_by": "demo-reviewer", "result": "passed" }
}
```

## 状态冲突

订单已经完成时，再次取消可能得到示例代码 `BUSINESS_STATE_CONFLICT`。先刷新状态，再按 [业务状态与资源错误](/docs/errors/business/) 排查。

需要协助时，按 [提交支持请求](/docs/help/support/) 提供订单和请求编号。
