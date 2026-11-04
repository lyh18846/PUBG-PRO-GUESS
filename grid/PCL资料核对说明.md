# PCL 资料核对说明

核对日期：2026-10-16。名单严格来自用户提供的 pclDB.json，共 100 人；与原全球 127 人库重合 43 人，新增 57 人。两套题库分别维护、分别存档。

国籍：97 人中国、2 人韩国、1 人马来西亚。70 人使用个人历史页，30 人使用战队、赛事阵容或选手门户交叉核对。查到阵容不代表已获得完整生涯，未确认的经历不参与判题。来源是 Liquipedia 的端游 PUBG 分区。

## 收录规则

- 计入选手身份的正式、替补、试训、租借经历；不计教练、主播和纯不活跃任职。
- 这是已核对的历史效力题库，不是实时阵容数据库。原文件的年龄、生日、现役状态、冠军数量等保留在原始记录中，本轮没有重新核实这些字段。
- 名单中的 Ns12 对应个人页 Pignan，Tanki995 对应 Tank。iLiu 的比赛记录使用 iL1u / iL1u419；Hhui 对照 Hhuixx7。原始选手拼写保留，相关赛事 ID 可作为搜索别名。
- 中国 Lu(PCL) 与俄罗斯 Lu 分开，使用不同数据库 ID。全民 QM 使用 QM-CN，与 Question Mark 的 QM 分开。TSG 是 Triumphant Song Gaming，TSG-TS 是 Tang Shan Gaming，避免两家同简称战队混淆。
- DouM 在 ZCG、DDT、LGD 的教练记录不计入选手效力；Shmily 的 Nova 教练任职也不计入。
- Lanren 的 MnG、77aws 的 XTR 目前未取得足够记录，保留在原始来源字段，不参与判题。
- 数据中的 team/sourceTeam 字段仅用于保留原文件的归属标签；游戏只按 careerTeamIds / players[].teams 中已核对的履历判定。

## 文件用途

- data/pcl-players.js：网页使用的 PCL 内置库，可在 VS Code 中编辑。
- data/pcl-database.json：可以在网页直接导入的完整 PCL 游戏数据库。
- data/pclDB.enriched.json：保留原列表字段，增加国籍代码、历史战队、来源和核对备注；这是原列表结构，不是游戏导入格式。
- data/pclDB.original.json：原始名单的内容副本。桌面 PUBGPROGUESS/data/pclDB.json 没有被覆盖。
- data/pcl-research-audit.json：逐人核对信息。data/team-aliases.json：两套库的战队全名、简称与队徽对应。

## 新增队徽

TEAM LOGO 共 78 张 PNG，比上版本轮新增 6 张；所有图标已接入游戏题目、选手履历、战队列表和图标库。AGAL 是 AL 的历史标识；FaZe、PeRo 文件名保留原大小写，游戏显示为 FAZE、PERO。LGCY 对应 Legacy，WIN 对应 winordie.。QM.png 是 Question Mark 的问号图标，不用于全民 QM。无相应文件的战队继续显示文字简称。

## 逐人来源

| 选手 | 国籍 | 已收录的历史战队 | 核对方式 | 来源 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Lilghost | 中国 | AXI / COC / KX / 17 | 个人历史页 | [1](https://liquipedia.net/pubg/LilGhost) |  |
| xwudd | 中国 | OMG / NH / WBG / WD / 17 | 个人历史页 | [1](https://liquipedia.net/pubg/Xwudd) |  |
| WenBo | 中国 | CTG / 17 | 个人历史页 | [1](https://liquipedia.net/pubg/WenBo) |  |
| tiantian | 中国 | LGD / DT / CTG / 17 | 个人历史页 | [1](https://liquipedia.net/pubg/Tiantian) |  |
| Xbei | 中国 | SSS / OMG / 17 | 个人历史页 | [1](https://liquipedia.net/pubg/Xbei) |  |
| 77owo | 中国 | UP / TG / VG / OIG / LGE / TIAN / 17 | 个人历史页 | [1](https://liquipedia.net/pubg/77owo) |  |
| SuJiu | 中国 | COC / 17 / TYL / EDG | 个人历史页 | [1](https://liquipedia.net/pubg/SuJiu) |  |
| shou | 中国 | 17 / SMG | 个人历史页 | [1](https://liquipedia.net/pubg/Shou) |  |
| yyxovo | 中国 | LYG / 17 / SMG / WOL / TIGER | 个人历史页 | [1](https://liquipedia.net/pubg/Yyxovo) |  |
| Axidd | 中国 | 17 / RS / CCG / EDG | 个人历史页 | [1](https://liquipedia.net/pubg/Axidd) |  |
| Solo9 | 中国 | EDG | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/EDward_Gaming) | 已通过 EDG 战队页确认国籍与效力；完整个人生涯暂未取得，不推测其他队伍。 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| GuoTvT | 中国 | EDG | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/PUBG_Champions_League/2026/Autumn) | 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| Aixleft | 中国 | RNG / PERO | 个人历史页 | [1](https://liquipedia.net/pubg/Aixleft) |  |
| Nannnnn | 中国 | COC / NH / PERO | 个人历史页 | [1](https://liquipedia.net/pubg/Nannnnn) |  |
| MMing | 中国 | NH / PERO | 个人历史页 | [1](https://liquipedia.net/pubg/MMing) |  |
| Cui71 | 韩国 | DIP / OIG / LGE / TIAN / TMA / PERO | 个人历史页 | [1](https://liquipedia.net/pubg/Cui71) |  |
| i26v6 | 韩国 | 17 / TYL / LGD / JSG / ZCG / JRG / PERO | 个人历史页 | [1](https://liquipedia.net/pubg/I26v6) |  |
| 04NB | 中国 | JSG / LGD / ZCG / PERO | 个人历史页 | [1](https://liquipedia.net/pubg/04NB) |  |
| Summer | 中国 | VC / MCG / GFY / 4AM / PERO / ZCG | 个人历史页 | [1](https://liquipedia.net/pubg/Summer) |  |
| Myl | 中国 | IFTY / KG / PERO | 个人历史页 | [1](https://liquipedia.net/pubg/MYL) |  |
| Loong | 中国 | RNG / GFY / PERO | 个人历史页 | [1](https://liquipedia.net/pubg/Loong) |  |
| Ming | 中国 | BA / NEXT / PERO / GSW | 个人历史页 | [1](https://liquipedia.net/pubg/Ming_%28Huang_Yiming%29) |  |
| AZ | 中国 | NEXT / PERO / TMA / CCG / TYL / NH / GSW | 个人历史页 | [1](https://liquipedia.net/pubg/AZ_%28Chinese_player%29) |  |
| xTong | 中国 | NEXT / TYL / CCG / GSW | 个人历史页 | [1](https://liquipedia.net/pubg/XTong) |  |
| HSmm | 中国 | NEXT / COC / NH / 4AM | 个人历史页 | [1](https://liquipedia.net/pubg/HS) |  |
| Shen | 马来西亚 | TYL / DDT / WBG / 4AM | 个人历史页 | [1](https://liquipedia.net/pubg/Shen) |  |
| SpaceMan | 中国 | DDT / WBG / TKL / JDG / 4AM | 个人历史页 | [1](https://liquipedia.net/pubg/SpaceMan) |  |
| WINDah | 中国 | DSS / NVG / 4AM | 个人历史页 | [1](https://liquipedia.net/pubg/WINDah) |  |
| GODV | 中国 | 4AM | 个人历史页 | [1](https://liquipedia.net/pubg/GodV) |  |
| ZGG01 | 中国 | KG / 4AM | 个人历史页 | [1](https://liquipedia.net/pubg/ZGG01) |  |
| xxxLu | 中国 | JTG / 4AM | 个人历史页 | [1](https://liquipedia.net/pubg/XxxLu) |  |
| Forever | 中国 | LGD / 4AM | 个人历史页 | [1](https://liquipedia.net/pubg/Forever) |  |
| Longz | 中国 | XQ / 4AM / TYL | 个人历史页 | [1](https://liquipedia.net/pubg/Long) |  |
| bobo | 中国 | STG / 4AM / TYL | 个人历史页 | [1](https://liquipedia.net/pubg/Bobo) |  |
| ATongMuu | 中国 | GFY / TYL / 4AM | 个人历史页 | [1](https://liquipedia.net/pubg/ATongMuu) |  |
| Ns12 | 中国 | COC / 4AM / CCG / TKL / JDG | 个人历史页 | [1](https://liquipedia.net/pubg/Pignan) |  |
| Dec12th | 中国 | BA / LYG / RS / XCG / STG / NH / TYL / JDG | 个人历史页 | [1](https://liquipedia.net/pubg/Dec12th) |  |
| Cold119 | 中国 | DDT / WBG / LGD / ZCG / TKL / JDG | 个人历史页 | [1](https://liquipedia.net/pubg/Cold119) |  |
| SuZe | 中国 | SYXL / ZK / TKL / JDG | 个人历史页 | [1](https://liquipedia.net/pubg/SuZe) |  |
| nanss | 中国 | EDG / JDG | 个人历史页 | [1](https://liquipedia.net/pubg/Nanss) |  |
| 1ee | 中国 | TYL | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/Tianming_Cup/2026/Season_9) | 已通过 Liquipedia 赛事阵容核对国籍与 TYL 效力关系；未取得完整个人历史页，不推测其他战队。 战队/赛事阵容页交叉核对，履历可能未全。 |
| OneDragon | 中国 | TYL | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/Tianming_Cup/2026/Season_9) | 已通过 Liquipedia 赛事阵容核对国籍与 TYL 效力关系；未取得完整个人历史页，不推测其他战队。 战队/赛事阵容页交叉核对，履历可能未全。 |
| KKong | 中国 | TYL | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/Tianming_Cup/2026/Season_9) | 已通过 Liquipedia 赛事阵容核对国籍与 TYL 效力关系；未取得完整个人历史页，不推测其他战队。 战队/赛事阵容页交叉核对，履历可能未全。 |
| HaoSkr | 中国 | TIAN / HQ / TM / TYL | 个人历史页 | [1](https://liquipedia.net/pubg/HaoSkr) |  |
| ZpYan1 | 中国 | RNG / NH / 4AM | 个人历史页 | [1](https://liquipedia.net/pubg/ZpYan1) |  |
| xiaohaixxxx | 中国 | OMG / 4AM / TMA | 个人历史页 | [1](https://liquipedia.net/pubg/Xiaohaixxxx) |  |
| SilentBT | 中国 | OMG | 个人历史页 | [1](https://liquipedia.net/pubg/SilentBT) |  |
| Xiaorong | 中国 | OMG / GT | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/Oh_My_God)、[2](https://liquipedia.net/pubg/PUBG_Global_Invitational/2018) | 仅计端游选手履历，不混入同名手游经历。 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| Clouds | 中国 | OMG | 个人历史页 | [1](https://liquipedia.net/pubg/Clouds) |  |
| Shmily | 中国 | DGG / OMG / D7G / XJ / LYG | 个人历史页 | [1](https://liquipedia.net/pubg/Shmily)、[2](https://liquipedia.net/pubg/Portal%3APlayers/Asia) | Nova Esports 为教练任职，不计入选手履历。 |
| JiaoYang | 中国 | AG / IFTY / TYL | 个人历史页 | [1](https://liquipedia.net/pubg/JiaoYang) |  |
| CRAZY112 | 中国 | LYG / 4AM / TMA | 个人历史页 | [1](https://liquipedia.net/pubg/CRAZY112) |  |
| CC108 | 中国 | NH / TIAN / GSW | 个人历史页 | [1](https://liquipedia.net/pubg/CC108) |  |
| SIA | 中国 | LYG / SSS / 1246 / DIP / TSG / TYL / CCG | 个人历史页 | [1](https://liquipedia.net/pubg/SIA) |  |
| VoliBEAR | 中国 | TSG / TYL / IFTY / SGD / TSG-TS | 个人历史页 | [1](https://liquipedia.net/pubg/VoliBEAR) |  |
| 911x | 中国 | TSG / GFY / TSG-TS | 个人历史页 | [1](https://liquipedia.net/pubg/911x) |  |
| lionkk | 中国 | OMG / WBG / ZK / PERO | 个人历史页 | [1](https://liquipedia.net/pubg/Lionkk) |  |
| LongSkr | 中国 | IFTY / TIAN / NH / CCG | 个人历史页 | [1](https://liquipedia.net/pubg/LongSkr) |  |
| Boliang | 中国 | IFTY / WUK / SGD / SYXL / CCG | 个人历史页 | [1](https://liquipedia.net/pubg/Boliang) |  |
| L1nnnn | 中国 | IFTY / I7 / XME | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/Infantry)、[2](https://liquipedia.net/pubg/BOSS_Training_Camp/2023/Season_5/Phase_5)、[3](https://liquipedia.net/pubg/Xavage_Men_Esports) | 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| LuLualways | 中国 | COC / TITAN / TMA / GSW / ZCG / LGD / TYL | 个人历史页 | [1](https://liquipedia.net/pubg/LuLualways) |  |
| YUPPIE | 中国 | 1124 / DAE / KL / TITAN / KX / TMA / YBG / SMS / ZCG / LGD / WBG | 个人历史页 | [1](https://liquipedia.net/pubg/YUPPIE) |  |
| Hang2y | 中国 | MCG / TMA / CTG | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/PUBG_Continental_Series/2021/Series_5/Asia)、[2](https://liquipedia.net/pubg/TakeMeAway_Gaming)、[3](https://liquipedia.net/pubg/Change_The_Game) | 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| EviLLee | 中国 | AXI / KG / LGE / MCG / CTG | 个人历史页 | [1](https://liquipedia.net/pubg/EviLLee) |  |
| Tanki995 | 中国 | GKS / MCG / XCG | 个人历史页 | [1](https://liquipedia.net/pubg/Tank) |  |
| LingD | 中国 | MCG / TSG-TS | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/PUBG_Global_Invitational.S/2021)、[2](https://liquipedia.net/pubg/Portal%3APlayers/Asia) | LingDuuuuuu 为赛事中使用的 ID。 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| LinShu | 中国 | VG / SNAKE / TIAN | 个人历史页 | [1](https://liquipedia.net/pubg/LinShuNN) |  |
| LuRenA | 中国 | TIAN / SYXL / ZK / SMS | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/Tianba)、[2](https://liquipedia.net/pubg/Portal%3APlayers/APAC)、[3](https://liquipedia.net/pubg/PUBG_Champions_League/2024/Autumn) | 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| mingz1 | 中国 | FPX / WBG / TIAN / PERO / SGD | 个人历史页 | [1](https://liquipedia.net/pubg/Mingz1) |  |
| PengEGM | 中国 | TSG / TYL / MCG / GFY / TSG-TS / GQG | 个人历史页 | [1](https://liquipedia.net/pubg/PengEGM) |  |
| Mamu | 中国 | PERO / DDT / WBG | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/Petrichor_Road)、[2](https://liquipedia.net/pubg/DD_Team)、[3](https://liquipedia.net/pubg/Weibo_Gaming) | 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| PaoPao | 中国 | RB / CTG / TIAN / WBG | 个人历史页 | [1](https://liquipedia.net/pubg/PaoPao) |  |
| Zyy | 中国 | HQ / TIAN / WBG | 个人历史页 | [1](https://liquipedia.net/pubg/Zyy) |  |
| Aries | 中国 | XLG / NIP / CTG | 个人历史页 | [1](https://liquipedia.net/pubg/Aries_%28Chinese_player%29) |  |
| XiaoHuxxXX | 中国 | GQG | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/PUBG_Race/2026/PGS_Prelude/1)、[2](https://liquipedia.net/pubg/PUBG_Champions_League/2026/Autumn) | 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| Tang | 中国 | RNG / LYG / TIAN / TMA | 个人历史页 | [1](https://liquipedia.net/pubg/Tang) |  |
| Running | 中国 | SSS / KZ / V5 / WBG / CTG | 个人历史页 | [1](https://liquipedia.net/pubg/Running) |  |
| Cobra | 中国 | XQ / ARK / KX / TMA | 个人历史页 | [1](https://liquipedia.net/pubg/Cobra)、[2](https://liquipedia.net/pubg/TakeMeAway_Gaming) |  |
| Lanren | 中国 | 17 / SMG / KX | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/17_Gaming)、[2](https://liquipedia.net/pubg/Still_Moving_Under_Gunfire) | 原始名单中的 MnG 暂未确认，未加入判题履历。 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| Yuren | 中国 | XQ / ARK / KX / RS / I7 | 个人历史页 | [1](https://liquipedia.net/pubg/Yuren) |  |
| Grayyyyyy | 中国 | IFTY / GFY / PERO / JUFU / JSG | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/Infantry)、[2](https://liquipedia.net/pubg/Games_Forever_Young)、[3](https://liquipedia.net/pubg/Petrichor_Road)、[4](https://liquipedia.net/pubg/Portal%3APlayers/APAC) | 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| WuFeng | 中国 | QM-CN | 个人历史页 | [1](https://liquipedia.net/pubg/WuFeng) |  |
| JiYy | 中国 | QM-CN | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/QM_Gaming) | QM 指全民 QuanMing Gaming，与 Question Mark 分开。 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| L1gEEE | 中国 | QM-CN | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/QM_Gaming) | QM 指全民 QuanMing Gaming，与 Question Mark 分开。 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| Yizz | 中国 | QM-CN | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/QM_Gaming) | QM 指全民 QuanMing Gaming，与 Question Mark 分开。 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| Yuyu | 中国 | ANS / BA / TSG / TYL / CTG / CCG / SMS / EDG | 个人历史页 | [1](https://liquipedia.net/pubg/Yuyu) |  |
| HS01 | 中国 | GQG | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/PUBG_Race/2026/PGS_Prelude/1)、[2](https://liquipedia.net/pubg/PUBG_Champions_League/2026/Autumn) | 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| Lu(PCL) | 中国 | GQG | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/PUBG_Champions_League/2026/Spring)、[2](https://liquipedia.net/pubg/PUBG_Champions_League/2026/Autumn) | 中国 PCL 选手 Lu，和俄罗斯 Lu 分开。 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| Dong | 中国 | GQG | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/PUBG_Race/2026/PGS_Prelude/1)、[2](https://liquipedia.net/pubg/PUBG_Champions_League/2026/Autumn) | 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| 129 | 中国 | NH | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/PUBG_Champions_League/2026/Autumn) | 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| 77aws | 中国 | NH | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/PUBG_Race/2026/PGS_Prelude/3) | 原始名单中的 XTR 暂未确认，未加入判题履历。 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| 16KK | 中国 | Lstars / QM / OX / COC / LGE / MnG / TBB / CCG / NH | 官方赛事记录 / 历史阵容 | [1](https://pubgesports.com/en/players/1143)、[2](https://liquipedia.net/pubg/16KK)、[3](https://liquipedia.net/pubg/16KK/Results)、[4](https://liquipedia.net/pubg/Esports_World_Cup/2024/China_Qualifier)、[5](https://liquipedia.net/pubg/Tianming_Cup/Season_10)、[6](https://liquipedia.net/pubg/Esports_World_Cup/2025/China_Qualifier) | 早期战队按赛事出场记录收录。2024 年由 TBB 转入 CCG，2025 年 1 月加入 NH。 |
| Donzz | 中国 | STG / TKL / JDG / WBG | 个人历史页 | [1](https://liquipedia.net/pubg/Donzz) |  |
| Hhui | 中国 | WBG / EDG | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/PUBG_Race/2026/PGS_Prelude/1)、[2](https://liquipedia.net/pubg/Weibo_Gaming)、[3](https://liquipedia.net/pubg/PUBG_Champions_League/2026/Autumn) | 按 Hhui / Hhuixx7 阵容记录核对。 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| iLiu | 中国 | TIAN / WBG | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/Tianba)、[2](https://liquipedia.net/pubg/PUBG_Champions_League/2026/Autumn) | 名单 iLiu 对应赛事 ID iL1u；保留原始拼写。 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| SuiX1ngKK | 中国 | SMS / ZCG / LGD / JSG / CTG / WBG | 官方赛事记录 / 历史阵容 | [1](https://pubgesports.com/en/players/1149)、[2](https://liquipedia.net/pubg/PUBG_Champions_League/2024/Spring)、[3](https://liquipedia.net/pubg/Esports_World_Cup/2024/China_Qualifier)、[4](https://liquipedia.net/pubg/BOSS_Training_Camp/2023/Season_5/Phase_5)、[5](https://liquipedia.net/pubg/LGD_Gaming)、[6](https://liquipedia.net/pubg/PUBG_Champions_League/2026/Autumn) | 曾使用 iceSuiX1ngKK、SuiX1ngKK-、SuiX1ngiCoco 和 SuiX1ngKzK 参赛。2026 PGS 代表 CTG，2026 PCL 秋季赛代表 WBG。 |
| RKBro | 中国 | WBG / JDG | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/PUBG_Champions_League/2026/Autumn)、[2](https://liquipedia.net/pubg/JD_Gaming) | 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| DouM | 中国 | VC / JT | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/VC_Gaming) | ZCG、DDT、LGD 的教练任职不计入选手历史效力。 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| Tide | 中国 | VC / FPX / 4AM / MQ | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/VC_Gaming)、[2](https://liquipedia.net/pubg/Four_Angry_Men) | Tidevice 与 Tide 为同一 Li Qingwu；不把同队另一位 paopao 混为 PaoPao。 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |
| DJBOY | 中国 | VC | 战队 / 赛事阵容 | [1](https://liquipedia.net/pubg/VC_Gaming)、[2](https://liquipedia.net/pubg/PUBG_Champions_League/2020/Spring) | 战队/赛事阵容页交叉核对；只收录已确认的经历，完整履历可能未全。 |

资料归属：Liquipedia contributors。文字资料依据 Liquipedia 的 CC BY-SA 许可整理，逐人链接用于归属与复核；战队图标由用户提供，图标权利归各自权利人。
