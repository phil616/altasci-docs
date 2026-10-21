---
title: 项目管理
description: 演示项目的创建、成员分工与归档管理。
category: business
order: 20
updated: '2026-10-21'
tags: [Demo, 项目]
---

## 创建项目

示例流程：进入项目列表，选择「新建项目」，填写以下信息。

| 字段 | 示例值 | 说明 |
| --- | --- | --- |
| name | 演示环境建设 | 表达业务目标的名称 |
| owner | demo-owner | 项目负责人标识 |
| environment | sandbox | 隔离的演示环境 |
| description | 为内部应用准备测试环境 | 目标与使用范围 |

## 示例数据

```json
{
  "project_id": "DEMO-PROJECT-001",
  "name": "演示环境建设",
  "owner": "demo-owner",
  "environment": "sandbox",
  "status": "active"
}
```

以上数据仅用于文档展示，不会创建真实项目。

## 成员协作

示例角色分为负责人、维护者和只读成员，正式接入时应替换为实际权限模型。提交申请前检查当前项目与环境，避免将测试配置提交到生产环境。

## 项目归档

归档前确认订单已完成或取消，并记录交付材料的位置。归档后的示例项目仅供历史查询。订单状态参阅 [订单与交付](/docs/business/orders/)。
