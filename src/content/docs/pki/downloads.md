---
title: CA 证书下载
description: 下载 AltasCI 根 CA 证书及四组签发 CA 证书链，查看有效期与 SHA-256 校验值。
category: pki
order: 5
updated: '2026-10-21'
tags: [PKI, 证书, 下载]
---

## 下载列表

此页面提供 AltasCI 的五个公开 PEM 证书文件。根证书文件包含一张证书，其余四个文件均包含签发 CA 证书及根 CA 证书。文件不包含私钥。

点击下方链接下载；如浏览器直接打开文件，可使用“链接另存为”保存为 `.pem`。

| 文件 | 内容 | 下载 |
| --- | --- | --- |
| 根 CA 证书 | 1 张根 CA 证书 | <a href="/pki/certificates/altasci-root-ca.pem" download="altasci-root-ca.pem">下载 PEM</a> |
| 通用签发 CA 证书链 | 签发 CA + 根 CA，共 2 张 | <a href="/pki/certificates/altasci-general-issuing-01-chain.pem" download="altasci-general-issuing-01-chain.pem">下载 PEM</a> |
| TLS 签发 CA 证书链 | 签发 CA + 根 CA，共 2 张 | <a href="/pki/certificates/altasci-tls-issuing-01-chain.pem" download="altasci-tls-issuing-01-chain.pem">下载 PEM</a> |
| mTLS 签发 CA 证书链 | 签发 CA + 根 CA，共 2 张 | <a href="/pki/certificates/altasci-mtls-issuing-chain.pem" download="altasci-mtls-issuing-chain.pem">下载 PEM</a> |
| HTTPInfra mTLS CA 02 证书链 | 签发 CA + 根 CA，共 2 张 | <a href="/pki/certificates/altasci-http-infra-mtls-issuing-02-chain.pem" download="altasci-http-infra-mtls-issuing-02-chain.pem">下载 PEM</a> |

## 文件与证书信息

以下信息从发布文件解析得到。有效期与证书指纹对应文件中的第一张证书，时间使用 UTC；文件 SHA-256 对应整个 PEM 文件的原始字节。

### 根 CA 证书

- 文件名：`altasci-root-ca.pem`
- 证书名称（CN）：AltasCI Root CA 6130
- 文件大小：2,147 字节
- 生效时间：`2026-08-24T06:58:00Z`
- 到期时间：`2036-08-21T06:58:00Z`

**文件 SHA-256**

`81104c13399a29cda8461685dbc10a2ef69ebd7375f3a9b69d8d32d255506ec2`

**首张证书 SHA-256 指纹**

`7A:36:C4:03:82:90:A0:65:AE:01:82:41:B5:EF:BB:81:B6:D0:07:2B:96:84:F5:BB:46:DE:85:98:60:32:C9:E9`

### 通用签发 CA 证书链

- 文件名：`altasci-general-issuing-01-chain.pem`
- 证书名称（CN）：Altasci General Issuing CA 01
- 文件大小：4,460 字节
- 生效时间：`2026-08-24T07:19:49Z`
- 到期时间：`2029-08-23T07:24:49Z`

**文件 SHA-256**

`3e9d310ce012232324bbddff7773c9c03907ae6f7474012499ae67b4208df433`

**首张证书 SHA-256 指纹**

`4E:F6:F5:72:FF:D6:C7:11:3B:43:71:97:94:46:BC:70:6B:5A:9C:F2:BD:A0:DF:73:87:27:EC:BE:A7:E2:DF:05`

### TLS 签发 CA 证书链

- 文件名：`altasci-tls-issuing-01-chain.pem`
- 证书名称（CN）：Altasci TLS Issuing CA 01
- 文件大小：4,456 字节
- 生效时间：`2026-08-24T07:17:07Z`
- 到期时间：`2029-08-23T07:22:07Z`

**文件 SHA-256**

`ff0e7d33f8cc68448931f0791104d1ad0fb570a9b56cd383551dde23f8b1ed9c`

**首张证书 SHA-256 指纹**

`55:B4:B4:FA:CF:B4:6A:74:8C:68:B2:73:1B:C9:8D:86:35:91:5D:7F:86:FE:5D:83:D6:04:52:25:8E:95:E6:BA`

### mTLS 签发 CA 证书链

- 文件名：`altasci-mtls-issuing-chain.pem`
- 证书名称（CN）：AltasCI mTLS Issuing CA 2026
- 文件大小：4,460 字节
- 生效时间：`2026-08-24T06:58:31Z`
- 到期时间：`2029-08-23T07:03:31Z`

**文件 SHA-256**

`7c1d436a6fecf0a093eac1e10b5cebd6e087fe5ed47d06cb708d4be0b17d1d75`

**首张证书 SHA-256 指纹**

`CF:A4:F8:F3:22:1D:A7:CE:8D:2C:C2:C2:1E:00:0D:BE:66:F1:54:48:EA:BE:F0:41:71:B7:D9:75:A6:2C:81:9B`

### HTTPInfra mTLS CA 02 证书链

- 文件名：`altasci-http-infra-mtls-issuing-02-chain.pem`
- 证书名称（CN）：AltasCI HTTPInfra mTLS CA 02
- 文件大小：4,294 字节
- 生效时间：`2026-10-20T06:57:32Z`
- 到期时间：`2029-10-19T07:02:32Z`

**文件 SHA-256**

`c3ca9bf9fce03347b1c961c0cc5e54cd93d17c05a5e035eaa4c3c4a6c2c22b83`

**首张证书 SHA-256 指纹**

`6E:31:A8:1B:37:81:05:F5:98:E6:50:18:38:8B:AD:3E:00:F9:84:AC:2D:00:E9:F8:7D:A4:C1:EE:C9:DD:80:86`

## 校验下载文件

下载后，可以在文件所在目录计算 SHA-256，并与上方对应文件的值比较。

Linux：

```bash
sha256sum altasci-root-ca.pem
```

PowerShell：

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath ./altasci-root-ca.pem
```

校验其他文件时，将命令中的文件名替换为实际名称。文件校验值与证书指纹的计算对象不同，请勿混用。

## 使用说明

这些文件为 CA 证书或 CA 证书链，不是应用的终端证书。应根据具体服务的配置要求选用；下载本身不会修改系统或应用的信任配置。需要导入信任库时，应先确认颁发者与适用范围，并通过可信渠道核对根证书指纹。

本文仅提供文件下载与信息核对，不表示这些 CA 已被所有浏览器或操作系统默认信任。基础概念见 [PKI 基础概念](/docs/pki/overview/)。
