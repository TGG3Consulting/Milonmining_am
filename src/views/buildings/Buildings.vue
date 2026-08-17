<template>
  <div class="flex flex-col gap-y-4">
    <div class="dark:border-gray-700">
      <div class="flex flex-col gap-y-4 p-4 shadow-lg border rounded-md border-gray-200 bg-slate-100 text-xl">
        <p>{{ $t('buildings') }}</p>
      </div>
    </div>
    <div class="flex">
      <button type="button" @click="createBuilding"
              class="bg-white group text-sm flex gap-x-2 items-center text-violet-500 hover:text-white border border-violet-500 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg px-5 py-2.5 text-center dark:border-violet-300 dark:text-violet-300 dark:hover:text-white dark:hover:bg-violet-400 dark:focus:ring-violet-900">
        {{ $t('new_building') }}
        <svg width="21" height="21" class="fill-violet-500 group-hover:fill-white" viewBox="0 0 21 21"
             xmlns="http://www.w3.org/2000/svg">
          <path class="text-violet-500"
                d="M19.037 11.7413H11.2599V19.5185C11.2599 19.8132 11.1428 20.0959 10.9343 20.3044C10.7259 20.5128 10.4432 20.6299 10.1484 20.6299C9.85367 20.6299 9.57097 20.5128 9.36254 20.3044C9.15411 20.0959 9.03701 19.8132 9.03701 19.5185V11.7413H1.25987C0.965097 11.7413 0.682401 11.6242 0.473967 11.4158C0.265534 11.2073 0.148438 10.9247 0.148438 10.6299C0.148438 10.3351 0.265534 10.0524 0.473967 9.84398C0.682401 9.63555 0.965097 9.51845 1.25987 9.51845H9.03701V1.74131C9.03701 1.59536 9.06576 1.45083 9.12161 1.31599C9.17747 1.18114 9.25933 1.05862 9.36254 0.955413C9.46574 0.852207 9.58827 0.77034 9.72311 0.714485C9.85796 0.658631 10.0025 0.629883 10.1484 0.629883C10.2944 0.629883 10.4389 0.658631 10.5738 0.714485C10.7086 0.77034 10.8311 0.852207 10.9343 0.955413C11.0375 1.05862 11.1194 1.18114 11.1753 1.31599C11.2311 1.45083 11.2599 1.59536 11.2599 1.74131V9.51845H19.037C19.183 9.51845 19.3275 9.5472 19.4623 9.60306C19.5972 9.65891 19.7197 9.74078 19.8229 9.84398C19.9261 9.94719 20.008 10.0697 20.0638 10.2046C20.1197 10.3394 20.1484 10.4839 20.1484 10.6299C20.1484 10.7758 20.1197 10.9204 20.0638 11.0552C20.008 11.1901 19.9261 11.3126 19.8229 11.4158C19.7197 11.519 19.5972 11.6009 19.4623 11.6567C19.3275 11.7126 19.183 11.7413 19.037 11.7413Z"/>
        </svg>
      </button>
    </div>
    <div>


      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
            </th>
            <th scope="col" class="px-6 py-3">
              {{ $t('name') }}
            </th>
            <th scope="col" class="px-6 py-3">
              {{ $t('start') }}
            </th>
            <th scope="col" class="px-6 py-3">
              {{ $t('end') }}
            </th>
            <th scope="col" class="px-6 py-3">
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="building in buildings"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <td class="px-6 py-4">
              <label class="inline-flex items-center cursor-pointer">
                <input v-if="building.active" @change="switcher(building, false)" checked type="checkbox" class="sr-only peer" >
                <input v-else @change="switcher(building, true)" type="checkbox" class="sr-only peer" >
                <div
                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-600"></div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{ $t('activate') }}</span>
              </label>
            </td>
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <p v-for="translation in building.translation_array">{{ translation.value }}</p>
            </th>
            <td class="px-6 py-4">
              {{ building.start_date }}
            </td>
            <td class="px-6 py-4">
              {{ building.end_date }}
            </td>
            <td class="px-6 py-4">
              <button type="button" @click="editBuilding(building.id)"
                      class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800">
                {{ $t('update') }}
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <AddEditBuilding v-if="showAddEditBuilding" v-bind:building_id="selectedBuildingId"
                   v-bind:translationKeys="building_translation_keys" v-bind:locales="locales"
                   @updateList="updateList"/>
</template>
<script>
import AddEditBuilding from "@/views/buildings/modals/AddEditBuilding.vue";
import axios from "axios";
import api from '@/utils/api.ts'
import {useToast} from "vue-toastification";
const toast = useToast();

export default {
  components: {AddEditBuilding},
  data() {
    return {
      showAddEditBuilding: false,
      selectedBuildingId: null,
      building_translation_keys: null,
      locales: null,
      buildings: [],
    }
  },
  methods: {
    createBuilding() {
      this.selectedBuildingId = null;
      this.showAddEditBuilding = true;
    },
    getBuildings() {
      api.get("buildings").then((response) => {
        this.buildings = response.data.data
      }).catch((response) => {
      })
    },
    getLocales() {
      api.get("locales").then((response) => {
        this.locales = response.data.data
      }).catch((response) => {
      })
    },
    getTranslationKeys() {
      api.get("translations/keys/buildings").then((response) => {
        this.building_translation_keys = response.data.data
      }).catch((response) => {
      })
    },
    editBuilding(id) {
      this.selectedBuildingId = id;
      this.showAddEditBuilding = true
    },
    updateList() {
      this.getBuildings();
    },
    switcher(building, switcher) {
      building.active = switcher;
      api.patch("buildings/"+building.id+"/switcher", {
        active: building.active ? 1 : 0
      }).then((response) => {
        if(building.active) {
          toast.success(this.$t('building_activated'));
        } else {
          toast.success(this.$t('building_disabled'));
        }
      }).catch((response) => {
        building.active = !building.active;
      })
    }
  },
  mounted() {
    this.getTranslationKeys();
    this.getLocales();
    this.getBuildings();
  }
}
</script>