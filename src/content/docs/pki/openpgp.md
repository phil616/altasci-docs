---
title: 企业 OpenPGP 公钥与验证
description: 下载 AltasCI 企业 OpenPGP 信任链与人员公钥，核对完整指纹、认证签名及文件校验值。
category: pki
order: 6
updated: '2026-10-22'
tags: [OpenPGP, GPG, 公钥, 下载, 验证]
---

## 体系与适用范围

本页提供 AltasCI 企业 OpenPGP 的公开密钥材料，以及使用 GnuPG（`gpg`）进行核对的方法。公开文件包含根认证公钥、员工认证机构公钥和已认证的人员公钥，不含私钥。

认证关系如下：

```text
企业根认证密钥（信任锚）
  └─ 员工认证机构（含根密钥签发的信任签名）
       └─ 人员公钥（含员工认证机构签发的认证签名）
            ├─ 签名子密钥 [S]
            └─ 加密子密钥 [E]
```

根密钥与员工认证机构密钥仅用于认证 `[C]`。人员主密钥同样仅用于认证，日常签名与加密分别使用对应子密钥。根对员工认证机构的信任签名包含深度 `1`、信任值 `120` 和 UID 正则约束 `<[^>]+[@.]altasci\.com>$`；该约束限制信任传递范围，不构成邮箱控制权证明。

这些材料采用 OpenPGP 格式，与 [CA 证书下载](/docs/pki/downloads/) 中的 X.509 / TLS 证书分别使用，不用于浏览器 HTTPS 信任配置。当前发布范围不包含软件制品发布签名。

## 下载公开文件

将所需文件保存到同一目录。首次核对建议下载信任链包、人员公钥和校验清单；信任链包已经包含根公钥与员工认证机构公钥，无需再分别导入这两份文件。

| 文件 | 内容 | 大小 | 下载 |
| --- | --- | --- | --- |
| `altasci-trust-chain.asc` | 根公钥与已认证的员工认证机构公钥 | 1,014 字节 | <a href="/pki/openpgp/altasci-trust-chain.asc" download="altasci-trust-chain.asc">下载信任链</a> |
| `root.asc` | 企业根认证公钥 | 441 字节 | <a href="/pki/openpgp/root.asc" download="root.asc">下载根公钥</a> |
| `employee-ca-certified.asc` | 员工认证机构公钥，包含根信任签名 | 656 字节 | <a href="/pki/openpgp/employee-ca-certified.asc" download="employee-ca-certified.asc">下载认证机构公钥</a> |
| `phil616-certified.asc` | 已发布的 phil616 人员公钥，包含机构认证签名 | 1,339 字节 | <a href="/pki/openpgp/phil616-certified.asc" download="phil616-certified.asc">下载人员公钥</a> |
| `SHA256SUMS` | 上述四个公钥文件的 SHA-256 清单，使用相对文件名 | — | <a href="/pki/openpgp/SHA256SUMS" download="SHA256SUMS">下载校验清单</a> |

### 文件 SHA-256

以下校验值对应整个下载文件的原始字节，与 OpenPGP 密钥指纹的计算对象不同。

| 文件 | SHA-256 |
| --- | --- |
| `altasci-trust-chain.asc` | `e26922c24c679e5edf4be6433d97d6beb8076445f48a75b102358dc0a9b60572` |
| `root.asc` | `df267aa3bf06229194d9da9d5aac82c37f3018d47ec2cb62c5f3e2ba56b57dd5` |
| `employee-ca-certified.asc` | `848080eb26c52c7be89a311e1dc600e8c688da8d582acf5b790c0958acbd0d80` |
| `phil616-certified.asc` | `99969b6da428a83eec46551fdc7e270e5282ebda55fe17bd45ec4cb180a88aa0` |

## 密钥身份与完整指纹

以下信息从发布文件解析得到，所有密钥均创建于 2026-10-22，到期日期按 UTC 列示。核对时请比较完整指纹，不要仅凭姓名、邮箱或截断的 Key ID 判断身份。

### 企业根认证密钥

- UID：`AltasCI Inc Enterprise OpenPGP Root <gpg-ca@altasci.com>`
- 算法与用途：Ed25519，认证 `[C]`
- 到期日期：2036-10-19
- 完整指纹：`91299483FEBE25D804B9A9CCB16D9473E48D4DEB`

便于人工核对的分组形式：

```text
9129 9483 FEBE 25D8 04B9  A9CC B16D 9473 E48D 4DEB
```

根指纹是建立这条认证链信任关系的起点。设置本地信任前，必须通过已经确认身份的对接人等独立渠道核对完整指纹。本页、下载文件和同站校验清单属于同一发布渠道，彼此一致不能替代独立核对。

### 员工认证机构

- UID：`AltasCI Inc Employee OpenPGP Authority <employee-ca@altasci.com>`
- 算法与用途：Ed25519，认证 `[C]`
- 到期日期：2029-10-21
- 完整指纹：`208DA2F6C8DA148BBF5AC8B782892812C097DBE1`

### 已发布人员公钥：phil616

UID 为 `phil616 <phil616@altasci.com>`。该公钥已包含员工认证机构的认证签名。

| 部件 | 算法与用途 | 完整指纹 | 到期日期 |
| --- | --- | --- | --- |
| 主密钥 | Ed25519，认证 `[C]` | `F7AF447885F5D86D53C7D4E2A063D471D0D5B90F` | 2028-10-21 |
| 签名子密钥 | Ed25519，签名 `[S]` | `6195146775718500A463415704221FC497810ABF` | 2027-10-22 |
| 加密子密钥 | Curve25519，GnuPG 显示为 cv25519，加密 `[E]` | `9FEDAFBA3C07A3166F5A3EC28229ECC66512CB08` | 2027-10-22 |

## 核对下载文件

在下载目录执行命令。下载全部四个公钥文件和 `SHA256SUMS` 后，可批量核对。

Linux：

```bash
sha256sum -c SHA256SUMS
```

macOS：

```bash
shasum -a 256 -c SHA256SUMS
```

PowerShell：

```powershell
Get-Content -LiteralPath ./SHA256SUMS | ForEach-Object {
  $expected, $name = $_ -split '\s+', 2
  $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath "./$name" -ErrorAction Stop).Hash
  if ($actual -ine $expected) { throw "校验失败：$name" }
  "$name OK"
}
```

预期四个文件均显示 `OK`；缺少文件或校验失败时，先重新获取文件并核实来源。只下载单个文件时，可计算该文件的 SHA-256，与本页对应值逐位比较。

校验值一致表示文件与所比较的清单一致，不能单独证明发布者身份。如果网页、文件和清单一起被替换，文件校验仍可能通过。

## 使用 GnuPG 核对认证关系

以下操作使用独立目录 `altasci-verify` 保存验证用密钥环，避免混入已有密钥环的信任设置。先安装 GnuPG，并在下载目录创建一个新的空目录。

Linux / macOS：

```bash
mkdir -m 700 altasci-verify
```

PowerShell：

```powershell
New-Item -ItemType Directory -Path ./altasci-verify
```

### 导入与查看指纹

```bash
gpg --homedir ./altasci-verify --import altasci-trust-chain.asc phil616-certified.asc
gpg --homedir ./altasci-verify --keyid-format long --with-subkey-fingerprint --fingerprint
```

预期列出三把主密钥与人员的两把子密钥，完整指纹应与本页逐一对应。在新密钥环尚未建立信任时，UID 显示 `[unknown]` 是正常现象；导入公钥本身不会建立身份信任。

### 独立核对后设置根信任

仅在已经通过独立渠道确认根指纹，并决定将其作为本次验证的信任锚后，执行：

```bash
gpg --homedir ./altasci-verify --edit-key 91299483FEBE25D804B9A9CCB16D9473E48D4DEB
```

在交互界面输入 `trust`，按当前界面提示选择 `ultimate`（绝对信任），确认后输入 `quit` 退出。这会更改此验证目录中的本地 ownertrust，不会写回下载的公钥文件。不要给员工认证机构或人员公钥逐一设置 `ultimate`，以免绕过认证链。

然后使用支持信任签名的 `pgp` 信任模型重新计算：

```bash
gpg --homedir ./altasci-verify --trust-model pgp --check-trustdb
gpg --homedir ./altasci-verify --trust-model pgp --list-keys
```

在干净密钥环及当前发布材料下，预期根 UID 为 `[ultimate]`，员工认证机构和 phil616 的 UID 为 `[full]`。这些标记是本地信任计算结果，不是实时在职状态或业务授权证明。

### 检查认证签名

```bash
gpg --homedir ./altasci-verify --trust-model pgp --with-colons --check-sigs 208DA2F6C8DA148BBF5AC8B782892812C097DBE1
gpg --homedir ./altasci-verify --trust-model pgp --with-colons --check-sigs F7AF447885F5D86D53C7D4E2A063D471D0D5B90F
```

输出中，`sig` 记录第 2 字段为 `!` 表示该认证签名校验成功，第 13 字段为签名者完整指纹。应分别找到根密钥对员工认证机构、员工认证机构对 phil616 UID 的有效认证签名，并核对签名者完整指纹。人员公钥还应具有有效的自认证与子密钥绑定签名。

若只看到自认证，或预期的机构签名缺失、校验失败，请重新下载并导入完整文件；不要通过直接信任人员密钥来消除提示。

## 验证收到的签名文件

收到人员签署的原文和分离签名后，可在上述验证目录中执行。下方 `message.txt` 和 `message.txt.sig` 是示例文件名，本页不提供对应签名样本。

```bash
gpg --homedir ./altasci-verify --trust-model pgp --status-fd 1 --verify message.txt.sig message.txt
```

`Good signature` 仅表示签名与原文在密码学上匹配。还需核对实际签名子密钥及其所属主密钥的完整指纹、认证关系、有效期与已知撤销状态。人员的日常签名应来自 `[S]` 子密钥，不能将其指纹误作人员主密钥指纹。

自动化处理应同时检查进程退出码与 GnuPG 状态输出中的 `VALIDSIG` 等记录，按完整指纹白名单和适用策略判断；不能仅匹配 `Good signature` 文本就接受签名。

## 更新、撤销与当前限制

到期与撤销是不同状态。下载文件是发布时的快照，离线密钥环不会自动获知后续更新或撤销。需要重新取得更新的公钥或撤销材料并导入，才能据此判断状态；重新导入同一旧文件不能证明密钥仍然有效。

当前公开材料尚未提供独立根指纹发布地址、自动化撤销分发渠道或完整人员密钥目录。需要确认最新状态或其他人员公钥时，请通过已有且已核实身份的对接渠道联系；UID 中的邮箱不代表已公布的安全响应入口。

根据随附说明，该体系目前处于实验与过渡阶段，根与员工认证机构私钥使用同一联网主机上的不同目录保存，离线保管、备份及撤销流程尚无对外可核验的完成证明。目录隔离不能视为物理隔离。资金、生产变更、法律文件或长期保密材料等高风险用途，应另行确认身份、权限及密钥状态，不能仅依赖本页的认证链作出决定。

## 工具参考

命令与输出格式可参阅 [GnuPG 密钥管理手册](https://www.gnupg.org/documentation/manuals/gnupg/OpenPGP-Key-Management.html)；信任状态的定义见 [GnuPG Trust Values](https://www.gnupg.org/documentation/manuals/gnupg/Trust-Values.html)。
