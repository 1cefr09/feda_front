import Vue from 'vue';
import Router from 'vue-router';
import UserLogin from '@/components/UserLogin';
import UserRegister from '@/components/UserRegister';
import ForumHome from '@/components/ForumHome';
import CommentList from "@/components/CommentList.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'UserLogin',
      component: UserLogin
    },
    {
      path: '/register',
      name: 'UserRegister',
      component: UserRegister
    },
    {
      path: '/home',
      name: 'ForumHome',
      component: ForumHome
    },
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/post/:postId/comments',
      name: 'CommentList',
      component: CommentList,
      props: true  // 通过 props 传递路由参数
    },
  ]
});
