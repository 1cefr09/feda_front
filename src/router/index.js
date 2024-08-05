import Vue from 'vue';
import Router from 'vue-router';
import UserLogin from '@/components/UserLogin';
import UserRegister from '@/components/UserRegister';
import ForumHome from '@/components/ForumHome';

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
    }
  ]
});
