# OUKITEL B2B 独立站项目记忆

> 更新时间：2026-06-14  
> 用途：供 Codex 或后续开发人员继续维护本项目时快速恢复上下文。  
> 原则：本文记录已确认需求、当前实现、用户修正与后续开发约束。若与用户最新明确指令冲突，以最新指令为准。

## 1. 项目定位

- 品牌：OUKITEL。
- 网站类型：全球英文及多语言 B2B 询盘型制造商官网，与 2C 商城独立。
- 核心定位：Portable Power Station Manufacturer & OEM/ODM Partner。
- 主要客户：经销商、批发商、品牌商、进口商、太阳能设备商、安装商、工程商和 EPC 公司。
- 主要区域：美国、欧洲、加勒比、南美、中东和非洲。
- 核心转化：Get a Quote / Get Wholesale Quote。
- 辅助转化：Contact、WhatsApp、产品及画册浏览。
- 视觉方向：OUKITEL 黑色、橙色科技风；专业、工业、国际化，不做单纯消费级露营网站风格。

## 2. 技术与本地环境

- 项目目录：`C:\Users\amy hu\Documents\独立站`。
- 技术栈：Next.js 15、React 19、TypeScript、App Router。
- 规划 CMS：Sanity Cloud，目前本地首页及内容以代码配置为主。
- 最新预览地址：`http://127.0.0.1:3001/en`。
- 英文旧入口仍保留：`/` 和 `/contact`。
- 多语言入口：`/{locale}` 和 `/{locale}/contact`。
- 启动文件：`启动本地预览.cmd`。必须保持启动窗口开启，关闭窗口会停止预览。
- 预览 Node 路径：`C:\Users\amy hu\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`。

## 3. 已确认联系方式

- 联系人：Amy Hu。
- 邮箱：`amy@oukitelpower.com`。
- WhatsApp：`+86 159 1402 8277`。
- 深圳办公室：26th Floor, Building C, Digital Innovation Center, Minzhi Avenue, Longhua District, Shenzhen, Guangdong, China。
- 惠州工厂：4th Floor, Building 7, Hengang Technology Industrial Park, Huiyang District, Huizhou City, Guangdong Province, China。
- 联系页已使用 OpenStreetMap 展示办公室和工厂位置。
- 页脚不显示电话号码，只保留邮箱与地址；WhatsApp 可作为浮动联系入口。

## 4. 网站架构

- 首页 `/`
- 产品中心 `/products/`
- 便携式储能 `/portable-power-stations/`
- 太阳能发电机 `/solar-generators/`
- 太阳能板 `/solar-panels/`
- 产品详情 `/products/[slug]`
- 批发合作 `/portable-power-station-wholesale/`
- 经销商计划 `/distributor-program/`
- OEM/ODM `/oem-portable-power-station/`
- 工厂实力 `/factory/`
- 应用方案 `/applications/`
- 关于我们 `/about/`
- 资源 `/resources/`
- 下载 `/downloads/`
- 联系询盘 `/contact/`
- 区域广告页 `/campaign/[region]`
- 多语言首页 `/{locale}`
- 多语言联系页 `/{locale}/contact`

## 5. 产品策略

### 广告主推型号

- P1000E Plus
- P2001E Plus
- P2001E Pro

### SEO 与经销商选品型号

- P800E
- P1000E Plus
- P1500E Plus
- P2001E Plus
- P2001E Pro
- BP2000E Pro
- P5000E Pro
- EP2500

### 型号约束

- `P200EPRO` 已确认应修正为 `P2001E Pro`。
- 产品 ID 图优先参考 OUKITEL 官方 2C 站和用户提供的实拍 ID 图。
- Banner 及产品卡不得使用错误型号外观。
- 产品参数、认证和案例必须逐项核对画册；未经确认不得虚构。

## 6. 首页内容要求

- H1 定位：Portable Power Station Manufacturer for Global Distributors & OEM Brands。
- Hero 需要快速说明产品、合作模式、制造能力和询盘入口。
- 主要板块：Hero、信任数据、产品分类、B2B 合作、应用场景、OEM/ODM、工厂质控、全球支持、FAQ、询盘。
- 产品分类：
  - Compact Portable Power Stations：512Wh–1024Wh、800W–1800W。
  - Professional Portable Power Stations：2048Wh–5120Wh、2400W–3600W。
  - Heavy-duty Energy Storage：5120Wh+、5000W–6000W。
- 应用场景：RV & Outdoor、Home Backup、Construction Sites、Off-grid Solar Storage、Telecom & Field Work、Emergency & Disaster Backup。
- 质量板块用语已将 `ATE test` 修正为 `ATS Test`。
- 产品分类和应用场景卡片必须统一图片容器高度，图片与文字不得重叠。

## 7. 联系表单规则

- 必填：Name、Email、Phone。
- Email 必须使用格式校验。
- Phone 支持国际号码格式校验。
- 可选：Company、Country / Region、Product Requirement、Message。
- 多语言扩展表单还包含 Business Type 和 Estimated Quantity。
- Business Type 包括 Distributor、Wholesaler、Retailer、Installer / Solar Company、OEM/ODM Brand、Project Buyer、Other 等本地化选项。
- 表单错误提示邮箱统一为 `amy@oukitelpower.com`。
- API 接口：`/api/inquiry`。
- 后续正式上线需加入邮件发送、线索库、Cloudflare Turnstile、防重复提交和隐私同意。

## 8. SEO、AIO 与 GEO

- 商业关键词优先：manufacturer、supplier、wholesale、distributor、OEM、ODM、private label。
- 首页自然覆盖 portable power station manufacturer、portable power station supplier、solar generator manufacturer、LiFePO4 portable power station、portable power station wholesale、OEM portable power station 等。
- 页面内容应包含直接答案、参数表、比较表、FAQ、作者与更新时间。
- 已使用或规划 Schema：Organization、Product、FAQ、Article、Breadcrumb、Video、ImageObject。
- 多语言页具有独立 title、description、keywords、canonical、Open Graph 和 hreflang。
- hreflang 包含 en、es、fr、de、pl、it、nl、pt、ar 与 `x-default`。
- Sitemap 已包含所有多语言首页和联系页。
- 区域广告页需设置 noindex，避免与 SEO 页面关键词内耗。

## 9. 多语言系统

### 支持语言

- `en` English
- `es` Español
- `fr` Français
- `de` Deutsch
- `pl` Polski
- `it` Italiano
- `nl` Nederlands
- `pt` Português
- `ar` العربية

### 实现规则

- 内容配置位于 `lib/i18n.ts`。
- 每种语言有独立的 B2B 本地化文案，不是简单逐字翻译。
- Header 语言切换器会保留用户在首页或 Contact 页面的位置。
- 阿拉伯语页面使用 RTL，并包含中东及 GCC 市场语境。
- 英文旧站 `/` 保持存在，多语言英文入口为 `/en`。
- 多语言联系页为 `/{locale}/contact`。

## 10. 多语言 Hero Banner

### 当前映射

- `en` → `/images/banner/oukitel-b2b-banner.png`
- `es` → `/images/banner/banner-espanol.png`
- `fr` → `/images/banner/banner-francais.png`
- `de` → `/images/banner/banner-deutsch.png`
- `pl` → `/images/banner/banner-polski.png`
- `it` → `/images/banner/banner-italiano.png`
- `nl` → `/images/banner/banner-nederlands.png`
- `pt` → `/images/banner/banner-portugues.png`
- `ar` → `/images/banner/banner-arabic.png`

### Banner 规则

- 多语言 Banner 是完整成图，尺寸均为 1672×941。
- 不允许在英文底图上再叠加其他语言文字。
- Hero 不再额外渲染网页标题、按钮、型号或遮罩，避免重复和重影。
- 图片中 P800E、P1000E Plus、P2001E Plus 型号只显示一套。
- 首屏真实 Header 默认隐藏，页面下滑后显示，避免与成图导航重复。
- Banner 右下角保留真实语言切换器。
- 图片中的 Products、Solutions、OEM/ODM、About、Contact、Quote 及两个 CTA 使用透明热区实现点击。
- 热区默认不可见，键盘聚焦时显示橙色轮廓。
- 阿拉伯语使用独立 RTL 热区坐标。
- 移动端完整等比缩放，不做居中放大裁切；允许图片中文字相对较小，以保证信息不被截断。

## 11. 视觉与字体

- 网站统一使用 Helvetica Neue、Helvetica、Arial 等现代无衬线字体栈。
- 阿拉伯语使用 Tahoma、Arial 作为兼容字体。
- 品牌颜色：橙色为主 CTA，蓝色为辅助识别色，黑色/深灰为科技背景，白色为内容阅读区。
- 避免黑金模板感、过度动画、虚构客户、虚构认证和低质量 AI 产品图。
- 真实产品、工厂、认证和案例优先；AI 仅用于背景或应用场景合成。
- 图片容器应使用统一高度和 `object-fit: contain`，避免产品高低错乱或压住文字。

## 12. 已完成验证

- Next.js 生产构建成功，52 个静态/动态路由正常生成。
- 9 个语言首页和 9 个语言 Contact 页面均返回 HTTP 200。
- 每个语言首页均加载对应 Banner 图片。
- Hero 网页叠加文本数量为 0。
- 每个语言 Hero 有 8 个透明可访问热区。
- 阿拉伯语页面 `dir="rtl"`。
- 西语表单字段、SEO 标题、canonical、hreflang 和 Sitemap 已检查。
- 本地预览当前使用端口 3001。

## 13. 重要用户修正记录

- 邮箱曾被误写为 `amy@oukitelpowr.com`，正确邮箱是 `amy@oukitelpower.com`。
- 深圳办公室楼层由 22 楼修正为 26 楼。
- 页脚电话号码需要移除。
- `ATE test` 必须显示为 `ATS Test`。
- P1000E Plus 的产品外观必须使用用户提供或官方确认的正确 ID 图。
- 产品分类与应用场景图片不得与文字重叠。
- Hero 多语言文字不得叠加在英文图上，必须使用对应语言完整成图。
- 本地服务由临时命令启动时可能在会话结束后停止；长期预览应使用 `启动本地预览.cmd` 并保持窗口开启。
- 启动文件不能写死中文项目路径，应使用 `pushd "%~dp0"`，避免编码损坏。

## 14. 后续开发建议

- 正式上线前建立唯一产品主数据表，统一画册、关键词表和建站信息表中的型号与参数。
- 为移动端制作专用竖版 Banner，可显著提高首屏文字可读性；当前完整缩放方案以不裁切为优先。
- 正式上线前用真实 SEO 工具校准关键词搜索量和难度。
- 接入 GA4、GTM、Google Search Console、Microsoft Clarity；广告上线时接入 Google Ads、Meta、LinkedIn Pixel。
- 表单正式发布前完成 SMTP、CRM/线索库、防垃圾和隐私合规。
- 将产品、应用、市场、文章、下载、FAQ、认证和 Landing Page 迁移至 Sanity 结构化数据模型。
- 每次替换 Banner 后检查热区坐标是否仍与图内按钮一致。
- 发布前执行桌面、平板、手机视觉 QA，重点检查 Header、语言菜单、Hero 热区、产品卡、表单和 RTL。

## 15. 核心维护文件

- `lib/i18n.ts`：多语言内容和图片映射。
- `components/LocalizedHome.tsx`：多语言首页与 Hero 热区。
- `components/LocalizedContact.tsx`：多语言联系页。
- `components/Header.tsx`：导航、滚动显示和语言切换。
- `components/InquiryForm.tsx`：询盘表单及多语言字段。
- `app/globals.css`：全站视觉、响应式和 RTL 样式。
- `app/[locale]/page.tsx`：多语言首页 SEO 路由。
- `app/[locale]/contact/page.tsx`：多语言联系页 SEO 路由。
- `app/sitemap.ts`：站点地图。
- `public/images/banner/`：英文及多语言 Banner 成图。

