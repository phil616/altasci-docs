---
title: 业务状态与资源错误
description: 演示参数不正确、资源缺失及状态冲突的处理方式。
category: errors
order: 30
updated: '2026-10-21'
tags: [Demo, '400', '404', '409']
---

## INVALID_ARGUMENT

**示例 HTTP 状态：400。** 请求参数缺失或格式不符合约定。检查必填字段、类型和环境，例如 `project_id` 应使用项目标识，而不是显示名称。修正后再提交，参阅 [接口字段约定](/docs/reference/configuration/)。

## RESOURCE_NOT_FOUND

**示例 HTTP 状态：404。** 当前范围内未找到资源。检查编号是否正确、是否处于创建资源时的环境，以及资源是否已删除。实际服务也可能隐藏无权访问的资源，应结合接口约定排查。

## BUSINESS_STATE_CONFLICT

**示例 HTTP 状态：409。** 操作不适用于资源当前状态。例如，订单完成交付后再次取消会出现状态冲突。

```json
{
  "code": "BUSINESS_STATE_CONFLICT",
  "message": "已完成的订单不能取消",
  "request_id": "demo-request-003",
  "data": null
}
```

刷新订单状态并查看处理记录，确需调整结果时按业务流程申请变更，不要循环重试取消。

## 重试建议

这些 Demo 错误需先修正参数、权限或业务条件。请求超时后先确认原操作是否已执行，避免重复创建项目或订单。
