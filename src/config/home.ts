import type { HomePageConfig } from '@/app/_components/home/type';

export const homeConfig: HomePageConfig = {
  welcome: {
    title: '欢迎来到我的主页',
    colorTitle: '「yiyue」',
    content: `我的线上博客主页示例 \n采用Next.js+Hono+Prisma开发,并运行在vercel与supabase之上! \n \n 本示例的主页与源码持续更新...`,
  },
  // video: {
  //   image: 'url(https://cn-nb1.rains3.com/3rcd/media/1739813698418.png)',
  //   video: 'https://cn-nb1.rains3.com/3rcd/media/1739846041317.mp4',
  // },
  list: {
    first: {
      title: '3R教室',
      data: [
        {
          href: '#',
          text: 'TS全栈开发(React/Nextjs+Node.js+CICD/运维)教学',
        },
        { href: '#', text: '远程工作求职指导及职业规划' },
        { href: '#', text: '海外项目谈判技巧与渠道拓展' },
        { href: '#', text: '独立开发者与被动收入实现方案' },
      ],
      button: { href: 'https://3rcd.com/classroom/', text: '购买会员' },
    },
    second: {
      title: '3R工作室',
      data: [
        { href: '#', text: '最专业的远程外包项目开发团队' },
        { href: '#', text: '可做移动/桌面/前端/后端/3D/设计等' },
        { href: '#', text: '丰富的的海外项目开发经验' },
        {
          href: '#',
          text: '提供长期维护、升级服务，为您的梦想保驾护航',
        },
      ],
      button: {
        href: 'https://3rcd.com/workroom/',
        text: '立即咨询',
        outline: true,
      },
    },
  },
  typed: [
    '国内IT市场内卷，Java,vue等常用技术栈竞争太大？',
    '处于失业或996的焦虑中无法自拔，想换一份远程工作？',
    '不想再打工，要用拥抱自由，运营个小工作室？',
    '亦或是想拥有长久可持续的被动收入，但找不到好的方法？',
    '还是你有一个非常有盈利前景的项目但是需要融资来进一步扩展业务？',
    '海外本土用工太贵，需要找远程开发者降低用工成本？',
    '又或者是想整个或部分项目外包？',
    '国内开发者大多都是Java,vue这些技术栈，与本土技术栈不匹配？',
    '不要着急，让3R社区来帮助你',
    '我们提供TS全栈开发教学/远程岗位求职指导与外包渠道拓展/独立开发和被动收入指导/人才招聘及海外项目接单等服务',
    '3R社区助力每一位IT从业者的数字游民、自由工作与远程创业梦想！',
  ],
  timeline: [],
};
