import { boot } from 'quasar/wrappers'
import { useStoreAuth } from 'src/stores/storeAuth'

export default boot(({ router }) => {
  router.beforeEach((to, from) => {
    //console.log('to: ' + to.path)
    const storeAuth = useStoreAuth()

    if (!storeAuth.userDetails.id && to.path !== '/auth') {
      return '/auth'
    }
    if (storeAuth.userDetails.id && to.path === '/auth') {
      return false
    }
  })
})
