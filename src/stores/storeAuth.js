import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import { supabase } from 'src/supabase/supabase'
import { useStoreEntries } from 'src/stores/storeEntries'
import { useShowErrorMessage } from 'src/use/useShowErrorMessage'

export const useStoreAuth = defineStore('auth', () => {
  /*
    state
  */

  const userDetailsDefault = {
    id: null,
    email: null,
  }

  const userDetails = reactive({
    ...userDetailsDefault,
  })

  /*
    actions
  */

  const init = () => {
    const router = useRouter(),
      storeEntries = useStoreEntries()

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        console.log(event)
        if (session !== null && session.user.id !== userDetails.id) {
          userDetails.id = session.user.id
          userDetails.email = session.user.email
          router.push('/')
          storeEntries.init()
        }
      } else if (event === 'SIGNED_OUT') {
        Object.assign(userDetails, userDetailsDefault)
        router.replace('/auth')
        storeEntries.unsubscribeEntries()
        storeEntries.clearEntries()
      }
    })
  }

  const registerUser = async ({ email, password }) => {
    let { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) useShowErrorMessage(error.message)
    // if (data) console.log('data: ', data)
  }

  const loginUser = async ({ email, password }) => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) useShowErrorMessage(error.message)
    //if (data) console.log('data: ', data)
  }

  const logoutUser = async () => {
    let { error } = await supabase.auth.signOut()
    if (error) useShowErrorMessage(error.message)
    // else console.log('User was signed out')
  }

  /*
    return
  */

  return {
    // state
    userDetails,

    // actions
    init,
    registerUser,
    loginUser,
    logoutUser,
  }
})
