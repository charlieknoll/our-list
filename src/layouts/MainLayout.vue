<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          icon="menu"
        >
          <q-menu>
            <q-list
              dense
              style="min-width: 100px"
            >
              <q-item clickable
                ><q-item-section>List</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>
                <q-menu
                  anchor="top end"
                  self="top start"
                >
                  <q-list>
                    <q-item
                      dense
                      clickable
                      >New...</q-item
                    >
                    <q-separator />
                    <q-item
                      v-for="n in 3"
                      :key="n"
                      dense
                      clickable
                      v-close-popup
                    >
                      <q-item-section>Saved List</q-item-section>
                    </q-item>
                  </q-list>
                  <q-separator />
                  <q-item
                    clickable
                    v-close-popup
                    dense
                    ><q-item-section>Delete...</q-item-section></q-item
                  >
                </q-menu>
              </q-item>
              <q-separator />
              <q-item
                clickable
                v-close-popup
                ><q-item-section>Categories...</q-item-section></q-item
              >
              <q-item
                clickable
                v-close-popup
                ><q-item-section>Save/Replace Item Template...</q-item-section></q-item
              >
              <q-item
                clickable
                v-close-popup
                ><q-item-section>Merge Items...</q-item-section></q-item
              >
              <q-separator />
              <q-item
                clickable
                v-close-popup
                ><q-item-section>Share...</q-item-section></q-item
              >
              <q-item
                clickable
                v-close-popup
                @click="storeAuth.logoutUser"
                ><q-item-section>Signout</q-item-section></q-item
              >
            </q-list>
          </q-menu>
        </q-btn>
        <ToolbarTitle />

        <qs-btn
          icon="toc"
          flat
          dense
          selected
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import ToolbarTitle from 'components/ToolbarTitle.vue'
import QsBtn from 'components/QsBtn.vue'
import { useStoreAuth } from 'src/stores/storeAuth'
const storeAuth = useStoreAuth()
</script>
<style>
.icon-with-strikethrough {
  position: relative;
}
.icon-with-strikethrough::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 2px;
  background-color: white;
  transform: translateY(-50%);
}
</style>
