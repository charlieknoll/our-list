import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from 'src/supabase/supabase'
import { Dialog } from 'quasar'

export const useStoreEntries = defineStore('entries', () => {
  //state
  const entries = ref([])
  const entriesLoaded = ref(false)
  const grouped = ref(true)
  //getters
  const groupedEntries = computed(() => {
    return entries.value.reduce((acc, entry) => {
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
      console.error('error', error)

      Dialog.create({
        title: 'Error',
        message: `${error.message}<br><b>Hint</b><br>${error.hint}`,
        html: true,
      })
    } else {
      console.log('data: ', data)
      entries.value = data
      entriesLoaded.value = true
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
    //const { error } = await supabase.from("entries").insert(newEntry);
    //await loadEntries(false);
    entries.value.push(newEntry)
  }
  return {
    entries,
    entriesLoaded,
    grouped,
    groupedEntries,
    //actions
    init,

    addEntry,
  }
})
