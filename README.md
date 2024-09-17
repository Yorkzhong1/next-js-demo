## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

##本程序说明：
这是一个简单的程序，但是有前端和后端。其中前端主要是在src/app/page.js中体现，是一个简单的现实和删除的界面。
后端则由两部分组成：
-根目录下的users.json作为数据库
- pages/api/ 下有三个api，分别对应了：查询用户、创建用户、删除用户，供前端与users.json交互 



##Pages Router 和 App Router 的共存

App Router 使用 /src/app 目录，推荐用于构建现代的文件系统路由以及全新的 React Server Components 功能。在 Next.js 14 引入的 App Router（基于 /src/app 目录的结构）中，API 路由的导出方式有所改变。对于 API 处理函数，你需要使用命名导出（named export）而不是默认导出。对于每个 HTTP 方法（如 GET、POST 等），你需要明确地导出对应的处理函数。

Pages Router 使用 /pages 目录，沿用的是经典的 Next.js 路由和 API 文件方式。
你可以同时使用这两种方式，App Router 和 Pages Router 的路由不会冲突。
如果你想继续使用传统的 API 方式，确保你的 API 文件位于 pages/api/ 目录下。这样你就能按照原有的方式导出默认处理函数，并处理请求。