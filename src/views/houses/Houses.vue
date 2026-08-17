<template>
  <div class="flex flex-col gap-y-4">
    <div class="dark:border-gray-700">
      <div class="flex flex-col gap-y-4 p-4 shadow-lg border rounded-md border-gray-200 bg-slate-100 text-xl">
        <p>{{ $t('houses') }}</p>
      </div>
    </div>
    <div
        class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul class="flex flex-wrap -mb-px">
        <li v-for="(tab, index) in tabs" @click="changeTab(tabs, index)" class="me-2">
          <a href="#" class="inline-block p-4 border-b-2 rounded-t-lg" :class="{
            'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300': !tab.active,
            'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500': tab.active
          }">{{ tab.name }}</a>
        </li>
      </ul>
    </div>
    <div v-if="activeTab === 'houses'">
      <button type="button" @click="createHouse"
              class="bg-white group text-sm flex gap-x-2 items-center text-violet-500 hover:text-white border border-violet-500 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg px-5 py-2.5 text-center dark:border-violet-300 dark:text-violet-300 dark:hover:text-white dark:hover:bg-violet-400 dark:focus:ring-violet-900">
        {{ $t('new_house') }}
        <svg width="21" height="21" class="fill-violet-500 group-hover:fill-white" viewBox="0 0 21 21"
             xmlns="http://www.w3.org/2000/svg">
          <path class="text-violet-500"
                d="M19.037 11.7413H11.2599V19.5185C11.2599 19.8132 11.1428 20.0959 10.9343 20.3044C10.7259 20.5128 10.4432 20.6299 10.1484 20.6299C9.85367 20.6299 9.57097 20.5128 9.36254 20.3044C9.15411 20.0959 9.03701 19.8132 9.03701 19.5185V11.7413H1.25987C0.965097 11.7413 0.682401 11.6242 0.473967 11.4158C0.265534 11.2073 0.148438 10.9247 0.148438 10.6299C0.148438 10.3351 0.265534 10.0524 0.473967 9.84398C0.682401 9.63555 0.965097 9.51845 1.25987 9.51845H9.03701V1.74131C9.03701 1.59536 9.06576 1.45083 9.12161 1.31599C9.17747 1.18114 9.25933 1.05862 9.36254 0.955413C9.46574 0.852207 9.58827 0.77034 9.72311 0.714485C9.85796 0.658631 10.0025 0.629883 10.1484 0.629883C10.2944 0.629883 10.4389 0.658631 10.5738 0.714485C10.7086 0.77034 10.8311 0.852207 10.9343 0.955413C11.0375 1.05862 11.1194 1.18114 11.1753 1.31599C11.2311 1.45083 11.2599 1.59536 11.2599 1.74131V9.51845H19.037C19.183 9.51845 19.3275 9.5472 19.4623 9.60306C19.5972 9.65891 19.7197 9.74078 19.8229 9.84398C19.9261 9.94719 20.008 10.0697 20.0638 10.2046C20.1197 10.3394 20.1484 10.4839 20.1484 10.6299C20.1484 10.7758 20.1197 10.9204 20.0638 11.0552C20.008 11.1901 19.9261 11.3126 19.8229 11.4158C19.7197 11.519 19.5972 11.6009 19.4623 11.6567C19.3275 11.7126 19.183 11.7413 19.037 11.7413Z"/>
        </svg>
      </button>
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">

          </th>
          <th scope="col" class="px-6 py-3">
            {{ $t('address') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ $t('status') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ $t('discount') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ $t('type') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ $t('price') }}
          </th>
          <th scope="col" class="px-6 py-3">
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="house in houses"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
          <td class="px-6 py-4">
            <label v-if="house.status !== 'sold' && house.status !== 'reserved'" class="inline-flex items-center cursor-pointer">
              <input v-if="house.active" @change="switcher(house, false)" checked type="checkbox" class="sr-only peer" >
              <input v-else @change="switcher(house, true)" type="checkbox" class="sr-only peer" >
              <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
              <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{ $t('activate') }}</span>
            </label>
          </td>
          <td class="px-6 py-4">
            {{ house.address }}
          </td>
          <td class="px-6 py-4">
            {{ $t(house.status) }}
          </td>
          <td class="px-6 py-4">
            <input type="number" v-model="house.discount" step="0.01" :disabled="house.status === 'sold' || house.status === 'reserved'"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   required/>
            <p>1 {{ $t('square_meter') }} {{ price(house.price - ((house.discount ?? 0) * house.price / 100)) }}</p>

            <div v-if="house.status !== 'sold' && house.status !== 'reserved'">
              <button v-if="!house.loading" @click="storeDiscountByProduct('houses', house)"
                      type="button"
                      class="flex items-center gap-x-2 px-5 py-2.5 rounded-full border-2 border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-600 transition"
              >
                <!-- Percent / discount icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 5a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM9 19a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM5 19l14-14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="font-medium text-sm">Թարմացնել</span>
              </button>
              <button v-else
                      type="button"
                      class="flex items-center gap-x-2 px-5 py-2.5 rounded-full border-2 border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-600 transition"
              >
                <svg aria-hidden="true" class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
              </button>
            </div>
          </td>
          <td class="px-6 py-4">
            {{ $t(house.type) }}
          </td>
          <td class="px-6 py-4">
            {{ price(house.price) }}
          </td>
          <td class="px-6 py-4">
            <div v-if="!house.loading" class="flex flex-wrap gap-y-2 gap-x-2">
              <div class="flex flex-col gap-y-2" v-if="house.status === 'active'">
                <button type="button" @click="editHouse(house.id)"
                        class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800">
                  {{ $t('update') }}
                </button>
                <div class="flex gap-2">
                  <!-- SALE -->
                  <button
                      type="button" @click="openSaleModal(house.id, 'sale')"
                      class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-60 disabled:pointer-events-none dark:focus:ring-emerald-900"
                  >
                    <!-- money icon -->
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7a2 2 0 0 1 2-2h14v2H5v10h14v2H5a2 2 0 0 1-2-2V7zm6 5a4 4 0 1 0 8 0 4 4 0 0 0-8 0zm2 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/></svg>
                    {{ $t('sale') }}
                  </button>

                  <!-- RESERVE -->
                  <button
                      type="button" @click="openSaleModal(house.id, 'reserve')"
                      class="inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100 active:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-300 disabled:opacity-60 disabled:pointer-events-none dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-900/40 dark:focus:ring-amber-900"
                  >
                    <!-- bookmark icon -->
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12a1 1 0 0 1 1 1v19l-7-4-7 4V3a1 1 0 0 1 1-1z"/></svg>
                    {{ $t('reserve') }}
                  </button>
                </div>
              </div>

              <button v-if="house.status === 'reserved'" type="button" @click="cancelReserve(house)"
                      class="text-white bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:ring-rose-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none dark:focus:ring-rose-800">
                {{ $t('cancel_reserve') }}
              </button>
            </div>
            <button v-else type="button"
                    class="text-white flex justify-center bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800">
              <svg aria-hidden="true" class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            </button>
          </td>
        </tr>
        </tbody>
      </table>

    </div>
    <div v-if="activeTab === 'designs'">
      <button type="button" @click="createDesign"
              class="bg-white group text-sm flex gap-x-2 items-center text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center dark:border-blue-300 dark:text-blue-300 dark:hover:text-white dark:hover:bg-blue-400 dark:focus:ring-blue-900">
        {{ $t('new_design') }}
        <svg width="21" height="21" class="fill-blue-500 group-hover:fill-white" viewBox="0 0 21 21"
             xmlns="http://www.w3.org/2000/svg">
          <path class="text-blue-500"
                d="M19.037 11.7413H11.2599V19.5185C11.2599 19.8132 11.1428 20.0959 10.9343 20.3044C10.7259 20.5128 10.4432 20.6299 10.1484 20.6299C9.85367 20.6299 9.57097 20.5128 9.36254 20.3044C9.15411 20.0959 9.03701 19.8132 9.03701 19.5185V11.7413H1.25987C0.965097 11.7413 0.682401 11.6242 0.473967 11.4158C0.265534 11.2073 0.148438 10.9247 0.148438 10.6299C0.148438 10.3351 0.265534 10.0524 0.473967 9.84398C0.682401 9.63555 0.965097 9.51845 1.25987 9.51845H9.03701V1.74131C9.03701 1.59536 9.06576 1.45083 9.12161 1.31599C9.17747 1.18114 9.25933 1.05862 9.36254 0.955413C9.46574 0.852207 9.58827 0.77034 9.72311 0.714485C9.85796 0.658631 10.0025 0.629883 10.1484 0.629883C10.2944 0.629883 10.4389 0.658631 10.5738 0.714485C10.7086 0.77034 10.8311 0.852207 10.9343 0.955413C11.0375 1.05862 11.1194 1.18114 11.1753 1.31599C11.2311 1.45083 11.2599 1.59536 11.2599 1.74131V9.51845H19.037C19.183 9.51845 19.3275 9.5472 19.4623 9.60306C19.5972 9.65891 19.7197 9.74078 19.8229 9.84398C19.9261 9.94719 20.008 10.0697 20.0638 10.2046C20.1197 10.3394 20.1484 10.4839 20.1484 10.6299C20.1484 10.7758 20.1197 10.9204 20.0638 11.0552C20.008 11.1901 19.9261 11.3126 19.8229 11.4158C19.7197 11.519 19.5972 11.6009 19.4623 11.6567C19.3275 11.7126 19.183 11.7413 19.037 11.7413Z"/>
        </svg>
      </button>
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            {{ $t('name') }}
          </th>
          <th scope="col" class="px-6 py-3">
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="design in designs"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
          <td class="px-6 py-4">
            {{ design.name }}
          </td>
          <td class="px-6 py-4">
            <button type="button" @click="editDesign(design.id)"
                    class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800">
              {{ $t('update') }}
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <AddEditHouse v-if="showAddEditHouseModal" v-bind:house_id="selectedHouseId" v-bind:locales="locales" @updateList="updateHouseList"/>
  <AddEditDesign v-if="showAddEditDesignModal" v-bind:design_id="selectedDesignId" v-bind:locales="locales" @updateList="updateDesignList"/>
  <SaleModal v-if="showSaleModal" v-bind:house_id="selectedHouseId" v-bind:status="selectedSaleStatus" @updateList="updateHouseList"/>

</template>

<script>
import AddEditHouse from "@/views/houses/modals/AddEditHouse.vue";
import AddEditDesign from "@/views/houses/modals/AddEditDesign.vue";
import api from "@/utils/api.js";
import {useToast} from "vue-toastification";
import SaleModal from "@/views/sales/modals/SaleModal.vue";
const toast = useToast();

export default {
  components: {
    SaleModal,
    AddEditHouse,
    AddEditDesign
  },
  data() {
    return {
      showSaleModal: false,
      showAddEditHouseModal: false,
      showAddEditDesignModal: false,
      selectedSaleStatus: null,
      locales: [],
      selectedHouseId: null,
      selectedDesignId: null,
      tabs: [
        {
          name: this.$t('houses'),
          key: 'houses',
          active: 1
        },
        {
          name: this.$t('designs'),
          key: 'designs',
          active: 0
        }
      ],
      activeTab: 'houses',
      designs: [],
      houses: [],
    }
  },
  methods: {
    openSaleModal(id, type) {
      this.selectedHouseId = id;
      this.selectedSaleStatus = type;
      this.showSaleModal = true;
    },
    createHouse() {
      this.selectedHouseId = null;
      this.showAddEditHouseModal = true;
    },
    createDesign() {
      this.selectedDesignId = null;
      this.showAddEditDesignModal = true;
    },
    editDesign(id) {
      this.selectedDesignId = id;
      this.showAddEditDesignModal = true;
    },
    editHouse(id) {
      this.selectedHouseId = id;
      this.showAddEditHouseModal = true;
    },
    updateDesignList() {
      this.getDesigns();
    },
    updateHouseList() {
      this.getHouses();
    },
    getLocales() {
      api.get("locales").then((response) => {
        this.locales = response.data.data
      }).catch((response) => {
      })
    },
    getDesigns() {
      api.get("designs").then((response) => {
        this.designs = response.data.data
      }).catch((response) => {
      })
    },
    getHouses() {
      api.get("houses").then((response) => {
        this.houses = response.data.data
      }).catch((response) => {
      })
    },
    changeTab(tabs, index) {
      tabs.map((tab, localIndex) => {
        tab.active = index === localIndex;
        if (tab.active) {
          this.activeTab = tab.key
        }
      })
    },
    price(amount) {
      let intlFormat = new Intl.NumberFormat('hy-AM', {
        style: 'currency',
        currency: 'amd'
      })
      amount = intlFormat.format(amount);
      amount = amount.replace('AMD', '֏')
      return amount;
    },
    switcher(house, switcher) {
      console.log(switcher);
      house.active = switcher;
      api.patch("houses/"+house.id+"/switcher", {
        active: house.active ? 1 : 0
      }).then((response) => {
        if(house.active) {
          toast.success(this.$t('house_activated'));
        } else {
          toast.success(this.$t('house_disabled'));
        }
        house.status = response.data.data;
      }).catch((response) => {
        house.active = !house.active;
      })
    },
    storeDiscountByProduct(block, row) {
      row.loading = true;
      api.post("discounts/product", {
        block: block,
        product_id: row.id,
        discount: row.discount
      }).then((response) => {
        row.loading = false;
        toast.success(this.$t('discount_updated'));
      }).catch((response) => {
        row.loading = false;
      })
    },
    cancelReserve(house) {
      if (confirm(this.$t('are_you_sure'))) {
        house.loading = true;
        api.patch("houses/" + house.id + "/cancelReserve")
            .then((response) => {
              toast.success(this.$t('reserve_canceled'));
              house.status = 'active';
              house.loading = false;
            }).catch((response) => {
          house.loading = false;
        })
      }
    },
  },
  mounted() {
    this.getLocales();
    this.getDesigns();
    this.getHouses();
  }
}
</script>