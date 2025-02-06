import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from 'src/supabase/supabase'
import { useShowErrorMessage } from 'src/use/useShowErrorMessage'

export const useStoreEntries = defineStore('entries', () => {
  //state
  const entries = ref([])
  const entriesLoaded = ref(false)
  const grouped = ref(true)
  //getters
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
    const { data, error } = await supabase
      .from('entries')
      .select()
      .order('completed', { ascending: true })
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
  const init = async () => {
    await loadEntries()
  }
  const addEntry = async (addEntryForm) => {
    const newEntry = Object.assign({}, addEntryForm, {
      completed: false,
      //order: generateOrderNumber(),
    })
    await supabase.from('entries').insert(newEntry)
    await loadEntries(false)
  }
  const updateEntry = async (entryId, updates, refresh = true) => {
    const { error } = await supabase.from('entries').update(updates).eq('id', entryId)
    if (error) {
      useShowErrorMessage(error)
    } else {
      if (refresh) await loadEntries(false)
    }
  }
  const setCompleted = async (entry, val) => {
    entry.completed = val
    await updateEntry(entry.id, { completed: val }, false)
  }
  return {
    entries,
    entriesLoaded,
    grouped,
    groupedEntries,
    //actions
    init,
    addEntry,
    updateEntry,
    setCompleted,
  }
})
