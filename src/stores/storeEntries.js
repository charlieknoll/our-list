import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from 'src/supabase/supabase'
import { useShowErrorMessage } from 'src/use/useShowErrorMessage'
import { useStoreAuth } from 'src/stores/storeAuth'

let entriesChannel

export const useStoreEntries = defineStore('entries', () => {
  //state
  const entries = ref([])
  const entriesLoaded = ref(false)
  const grouped = ref(true)

  //getter
  const groupedEntries = computed(() => {
    return entries.value.reduce((acc, entry) => {
      if (!entry.category) entry.category = 'UNCATOREGIZED'
      if (!grouped.value && acc[''] === undefined) acc[''] = []
      const key = entry.completed ? 'completed' : grouped.value ? entry.category : ''
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(entry)
      return acc
    }, {})
  })

  //actions
  const loadEntries = async (showLoader = true) => {
    if (showLoader) entriesLoaded.value = false
    // const { data, error } = await supabase
    //   .from('entries')
    //   .select()
    //   .order('completed', { ascending: true })
    console.log('Loading...')
    const storeAuth = useStoreAuth()
    const { data, error } = await supabase
      .rpc('get_entries')
      .eq('user_id', storeAuth.userDetails.id)
      .order('category_order', { ascending: true })
      .order('id', { ascending: true })
    if (error) {
      //console.error('error', error)
      useShowErrorMessage(error)
    } else {
      //console.log('data: ', data)
      if (data) {
        entries.value = data
        entriesLoaded.value = true
      }
    }
  }
  const subscribeEntries = () => {
    const storeAuth = useStoreAuth()
    entriesChannel = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'entries',
          filter: `user_id=eq.${storeAuth.userDetails.id}`,
        },
        (payload) => {
          console.log('Change received!', payload)
          if (payload.eventType == 'INSERT') entries.value.push(payload.new)
          if (payload.eventType == 'DELETE') {
            const index = getEntryIndexById(payload.old.id)
            entries.value.splice(index, 1)
          }
          if (payload.eventType == 'UPDATE') {
            const index = getEntryIndexById(payload.old.id)
            entries.value[index] = payload.new
          }
        },
      )
      .subscribe()
  }

  const unsubscribeEntries = () => {
    supabase.removeChannel(entriesChannel)
  }
  const clearEntries = () => {
    entries.value = []
  }

  const init = async () => {
    await loadEntries()
    if (entriesLoaded.value) subscribeEntries()
  }
  const addEntry = async (addEntryForm) => {
    const storeAuth = useStoreAuth()
    const newEntry = Object.assign({}, addEntryForm, {
      completed: false,
      user_id: storeAuth.userDetails.id,
    })
    const { error } = await supabase.from('entries').insert(newEntry)
    useShowErrorMessage(error)
  }
  const updateEntry = async (entryId, updates, refresh = true) => {
    const entry = entries.value[getEntryIndexById(entryId)]
    const oldEntry = JSON.parse(JSON.stringify(entry))
    Object.assign(entry, updates)
    const { error } = await supabase.from('entries').update(updates).eq('id', entryId)
    if (error) {
      useShowErrorMessage(error)
      Object.assign(entry, oldEntry)
    }
    if (refresh) {
      //await loadEntries(false)
    }
  }
  const deleteEntry = async (entry) => {
    const { error } = await supabase.from('entries').delete().eq('id', entry.id)
    useShowErrorMessage(error)
  }
  const getEntryIndexById = function (id) {
    return entries.value.findIndex((entry) => entry.id === id)
  }
  const setCompleted = async (entry, val) => {
    //entry.completed = val
    await updateEntry(entry.id, { completed: val }, false)
  }
  // const removeSlideItemIfExists = (entryId) => {
  //   // hacky fix: when deleting (after sorting),
  //   // sometimes the slide item is not removed
  //   // from the dom. this will remove the slide
  //   // item from the dom if it still exists
  //   // (after entry removed from entries array)
  //   nextTick(() => {
  //     const slideItem = document.querySelector(`#id-${entryId}`)
  //     if (slideItem) slideItem.remove()
  //   })
  // }
  return {
    entries,
    entriesLoaded,
    grouped,
    groupedEntries,

    //actions
    init,
    addEntry,
    updateEntry,
    deleteEntry,
    setCompleted,
    loadEntries,
    unsubscribeEntries,
    clearEntries,
  }
})
