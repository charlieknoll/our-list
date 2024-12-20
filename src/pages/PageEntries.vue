<template>
  <q-page>
    <div class="q-pa-md-md">
      <q-pull-to-refresh
        @refresh="refresh"
        inline
      >
        <q-list class="entries">
          <q-item-label class="bg-white text-white q-px-none">
            <q-select
              filled
              use-input
              v-model="selectedValue"
              hide-dropdown-icon
              label="Type and hit enter to add"
            ></q-select>
          </q-item-label>
          <template
            v-for="group in Object.keys(storeEntries.groupedEntries)"
            :key="group"
          >
            <q-item-label class="bg-green-8 text-white shadow-2 q-px-sm q-py-md text-uppercase">
              {{ group }}
            </q-item-label>
            <q-item
              class="q-my-none"
              clickable
              v-ripple
              v-for="entry in storeEntries.groupedEntries[group]"
              :key="entry.id"
            >
              <q-item-section>
                <q-item-label dense>{{ entry.name }}</q-item-label>
                <q-item-label
                  caption
                  lines="1"
                  dense
                  >{{ entry.descr }}</q-item-label
                >
              </q-item-section>
            </q-item>
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
})
const refresh = async (done) => {
  await storeEntries.init()
  done()
}
const selectedValue = ref(null)
</script>
