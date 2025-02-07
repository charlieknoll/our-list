<template>
  <q-page>
    <div class="q-pa-md-md">
      <q-pull-to-refresh
        @refresh="refresh"
        inline
      >
        <q-list class="entries">
          <q-item-label class="bg-white text-white q-px-none">
            <!-- @keyup.enter.stop="selectValue" -->
            <q-select
              filled
              v-model="selectedValue"
              use-input
              hide-dropdown-icon
              label="Type and hit enter to add"
              input-debounce="0"
              new-value-mode="add"
              :options="options"
              @filter="filterFn"
              @update:model-value="selectValue"
            ></q-select>
          </q-item-label>

          <template
            v-for="group in Object.keys(storeEntries.groupedEntries)"
            :key="group"
          >
            <q-item-label
              class="bg-green-8 text-white shadow-2 q-px-sm q-py-sm text-uppercase list-item"
            >
              {{ group }}
            </q-item-label>
            <q-slide-item
              class="q-my-none q-py-none"
              v-for="entry in storeEntries.groupedEntries[group]"
              :key="entry.id"
              left-color="grey"
              right-color="grey"
              @left="deleteEntry($event, entry)"
              @right="toggleEntry($event, entry)"
            >
              <template v-slot:left>
                <q-icon name="delete" />
              </template>
              <template v-slot:right>
                <q-icon name="done" />
              </template>
              <q-item
                class="list-item"
                clickable
                v-ripple
                :id="`id-${entry.id}`"
              >
                <q-item-section class="q-my-none q-py-none">
                  <div :class="entry.completed ? 'text-strike text-italic' : ''">
                    <q-item-label dense>{{ entry.name }}</q-item-label>
                    <q-item-label
                      caption
                      lines="1"
                      dense
                      >{{ entry.descr }}</q-item-label
                    >
                  </div>
                </q-item-section>
              </q-item>
            </q-slide-item>
          </template>
        </q-list>
      </q-pull-to-refresh>
    </div>
  </q-page>
</template>

<script setup>
import { useStoreEntries } from 'src/stores/storeEntries'
import { onMounted, ref } from 'vue'
//data
const storeEntries = useStoreEntries()
onMounted(async () => {
  await storeEntries.init()
  originalOptions.value = storeEntries.entries.map((e) => e.name)
  options.value = originalOptions.value
})
const refresh = async (done) => {
  await storeEntries.init()
  done()
}
const selectedValue = ref(null)
const options = ref([])
const originalOptions = ref([])
const selectValue = async () => {
  if (!selectedValue.value) return
  console.log('select:' + selectedValue.value)
  //locate the value in storeEntries.entries
  const needle = selectedValue.value.toLowerCase()
  const matches = storeEntries.entries.filter((v) => v.name.toLowerCase() === needle)
  if (matches.length < 1) {
    await addNewValue()
    return
  }
  const entry = matches[0]
  //if complete
  if (entry.completed) {
    await storeEntries.setCompleted(entry, false)
  }

  //set complete = false and update
  //options.value = originalOptions.value
  selectedValue.value = null
}
const toggleEntry = async (e, entry) => {
  await storeEntries.setCompleted(entry, !entry.completed)
  //e.reset()
}
const deleteEntry = async (e, entry) => {
  await storeEntries.deleteEntry(entry)
  //e.reset()
}

const addNewValue = async () => {
  console.log('new:' + selectedValue.value)
  if (selectedValue.value) {
    await storeEntries.addEntry({ name: selectedValue.value })
    selectedValue.value = null
  }
}
const filterFn = (val, update) => {
  if (val === '') {
    update(() => {
      options.value = originalOptions.value
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    options.value = originalOptions.value.filter((v) => v.toLowerCase().indexOf(needle) > -1)
  })
}
</script>
