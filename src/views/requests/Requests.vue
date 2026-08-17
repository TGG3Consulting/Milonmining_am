<template>
  <div class="flex flex-col gap-y-4">
    <div class="dark:border-gray-700">
      <div class="flex flex-col gap-y-4 p-4 shadow-lg border rounded-md border-gray-200 bg-slate-100 text-xl">
        <p>{{ $t('requests') }}</p>
      </div>
    </div>
    <div class="flex">
      <button type="button" @click="createRequest"
              class="bg-white group text-sm flex gap-x-2 items-center text-violet-500 hover:text-white border border-violet-500 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg px-5 py-2.5 text-center dark:border-violet-300 dark:text-violet-300 dark:hover:text-white dark:hover:bg-violet-400 dark:focus:ring-violet-900">
        {{ $t('new_request') }}
        <svg width="21" height="21" class="fill-violet-500 group-hover:fill-white" viewBox="0 0 21 21"
             xmlns="http://www.w3.org/2000/svg">
          <path class="text-violet-500"
                d="M19.037 11.7413H11.2599V19.5185C11.2599 19.8132 11.1428 20.0959 10.9343 20.3044C10.7259 20.5128 10.4432 20.6299 10.1484 20.6299C9.85367 20.6299 9.57097 20.5128 9.36254 20.3044C9.15411 20.0959 9.03701 19.8132 9.03701 19.5185V11.7413H1.25987C0.965097 11.7413 0.682401 11.6242 0.473967 11.4158C0.265534 11.2073 0.148438 10.9247 0.148438 10.6299C0.148438 10.3351 0.265534 10.0524 0.473967 9.84398C0.682401 9.63555 0.965097 9.51845 1.25987 9.51845H9.03701V1.74131C9.03701 1.59536 9.06576 1.45083 9.12161 1.31599C9.17747 1.18114 9.25933 1.05862 9.36254 0.955413C9.46574 0.852207 9.58827 0.77034 9.72311 0.714485C9.85796 0.658631 10.0025 0.629883 10.1484 0.629883C10.2944 0.629883 10.4389 0.658631 10.5738 0.714485C10.7086 0.77034 10.8311 0.852207 10.9343 0.955413C11.0375 1.05862 11.1194 1.18114 11.1753 1.31599C11.2311 1.45083 11.2599 1.59536 11.2599 1.74131V9.51845H19.037C19.183 9.51845 19.3275 9.5472 19.4623 9.60306C19.5972 9.65891 19.7197 9.74078 19.8229 9.84398C19.9261 9.94719 20.008 10.0697 20.0638 10.2046C20.1197 10.3394 20.1484 10.4839 20.1484 10.6299C20.1484 10.7758 20.1197 10.9204 20.0638 11.0552C20.008 11.1901 19.9261 11.3126 19.8229 11.4158C19.7197 11.519 19.5972 11.6009 19.4623 11.6567C19.3275 11.7126 19.183 11.7413 19.037 11.7413Z"/>
        </svg>
      </button>
    </div>
    <div class="flex bg-indigo-50 p-4 flex-col gap-y-2">
      <p class="text-lg">{{ $t('filter') }}</p>
      <div class="flex flex-col gap-y-2">
        <div class="flex">
          <select v-model="filter.block" class="block px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-opacity-50">
            <option value="">-</option>
            <option value="houses">{{ $t('houses') }}</option>
            <option value="apartments">{{ $t('apartments') }}</option>
          </select>
        </div>
        <div class="flex flex-wrap gap-y-4 gap-x-4">
          <div v-if="filter.block !== 'houses'" class="flex flex-col gap-y-2">
            <label>{{ $t('select_building') }}</label>
            <vSelect
                class="vselect"
                v-model="filter.building"
                label="name"
                track-by="id"
                :options="buildings"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label>{{ $t('status') }}</label>
            <vSelect
                class="vselect"
                v-model="filter.status"
                label="name"
                track-by="key"
                :options="[
                    {
                      name: $t('pending'),
                      key: 'pending'
                    },
                    {
                      name: $t('active'),
                      key: 'active'
                    },
                    {
                      name: $t('reserved'),
                      key: 'reserved'
                    },
                    {
                      name: $t('sold'),
                      key: 'sold'
                    }
                ]"
            />
          </div>
        </div>

        <div class="flex flex-wrap gap-x-4 gap-y-4">
          <div class="flex flex-col gap-y-2">
            <label># {{ $t('number') }}</label>
            <input type="number" v-model="filter.number"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   required/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label>{{ $t('square_meter') }} >=</label>
            <input type="number" v-model="filter.square_meter" step="0.01"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   required/>
          </div>
        </div>
      </div>
    </div>
    <div>
      <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input type="search" v-model="filter.search" id="search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" :placeholder="$t('search')" required />
      </div>
    </div>
    <div class="h-[640px] overflow-y-auto" @scroll="onScrollCallback($event, 'requests','list')">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            {{ $t('from_staff') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ $t('type') }}
          </th>
          <th v-if="filter.block !== 'houses'" scope="col" class="px-6 py-3">
            {{ $t('want_garage') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ $t('status') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ $t('client') }}
          </th>
          <th v-if="filter.block !== 'houses'" scope="col" class="px-6 py-3">
            {{ $t('apartment') }}
          </th>
          <th v-if="filter.block !== 'houses'" scope="col" class="px-6 py-3">
            {{ $t('garage') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ $t('house') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ $t('preferred_price') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ $t('date') }}
          </th>
          <th scope="col" class="px-6 py-3">
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="request in requests.data"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
          <td class="px-6 py-4">
            {{ request.from_staff ? $t('yes') : $t('no') }}
          </td>
          <td class="px-6 py-4">
            {{ request.type ? $t(request.type) : $t('reserve') }}
          </td>
          <td v-if="filter.block !== 'houses'" class="px-6 py-4">
            {{ request.want_garage ? $t('yes') : null }}
          </td>
          <td class="px-6 py-4">
            {{ request.status ? $t(request.status) : null }}
          </td>
          <td class="px-6 py-4">
            <span class="flex flex-col gap-y-2">
              <span>{{ request.name }}</span>
              <span>{{ request.phone }}</span>
            </span>
          </td>
          <td v-if="filter.block !== 'houses'" class="px-6 py-4">
            <span v-if="request.apartment_id" class="flex flex-col gap-y-2">
                <span>{{ request.building_name }}</span>
                <span>#{{ request.apartment_number }}</span>
                <span>{{ request.floor_level }} {{ $t('level') }}</span>
                <span>{{ request.apartment_square_meter }} {{ $t('square_meter') }}</span>
                <span>{{ request.apartment_rooms }} {{ $t('rooms') }}</span>
            </span>
            <span v-else>{{ $t('missing') }}</span>

          </td>
          <td v-if="filter.block !== 'houses'" class="px-6 py-4">
               <span v-if="request.garage_id" class="flex flex-col gap-y-2">
                <span>#{{ request.garage_number }}</span>
                <span>{{ request.garage_floor }} {{ $t('level') }}</span>
                <span>{{ request.garage_square_meter }} {{ $t('square_meter') }}</span>
            </span>
            <span v-else>{{ $t('missing') }}</span>
          </td>
          <td class="px-6 py-4">
            <span v-if="request.house_id" class="flex flex-col gap-y-2">
                <span>{{ request.house_address }}</span>
                <span>{{ $t('terrace_size') }}: {{ request.house_terrace_size }} {{ $t('square_meter') }}</span>
            </span>
            <span v-else>{{ $t('missing') }}</span>

          </td>
          <td class="px-6 py-4">
            {{ price(request.preferred_price) }}
          </td>
          <td class="px-6 py-4">
            {{ request.created }}
          </td>
          <td class="px-6 py-4">
            <div class="flex flex-col gap-y-2" v-if="request.status === 'active'">
              <button type="button" @click="editRequest(request.id)"
                      class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-xl text-sm px-4 py-2 me-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800">
                {{ $t('update') }}
              </button>
              <div class="flex gap-2">
                <!-- SALE -->
                <button
                    type="button" @click="openSaleModal(request.id, 'sale')"
                    class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-60 disabled:pointer-events-none dark:focus:ring-emerald-900"
                >
                  <!-- money icon -->
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7a2 2 0 0 1 2-2h14v2H5v10h14v2H5a2 2 0 0 1-2-2V7zm6 5a4 4 0 1 0 8 0 4 4 0 0 0-8 0zm2 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/></svg>
                  {{ $t('sale') }}
                </button>

                <!-- RESERVE -->
                <button
                    type="button" @click="openSaleModal(request.id, 'reserve')"
                    class="inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100 active:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-300 disabled:opacity-60 disabled:pointer-events-none dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-900/40 dark:focus:ring-amber-900"
                >
                  <!-- bookmark icon -->
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12a1 1 0 0 1 1 1v19l-7-4-7 4V3a1 1 0 0 1 1-1z"/></svg>
                  {{ $t('reserve') }}
                </button>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
  <AddRequestModal v-if="showAddEditRequestModal" v-bind:buildings="buildings" v-bind:request_id="selectedRequestId" @updateList="updateList"/>
  <SaleModal v-if="showSaleModal" v-bind:request_id="selectedRequestId" v-bind:status="selectedSaleStatus" @updateList="updateList"/>
</template>

<script>
import AddRequestModal from "@/views/requests/modals/AddRequestModal.vue";
import api from "@/utils/api.js";
import vSelect from "vue-select";
import SaleModal from "@/views/sales/modals/SaleModal.vue";
export default {
  data() {
    return {
      showAddEditRequestModal: false,
      showSaleModal: false,
      buildings: [],
      filter: {
        search: null,
        block: null
      },
      requests: {
        data: [],
        prependedData: [],
        settings: {
          scrollProcessingTime: null,
          scrollHeight: null,
          scrollTop: null,
          clientHeight: null,
          offset: null,
          limit: 20,
        }
      },
      scrollProcessingTime: null,
      timezone: null,
      selectedRequestId: null,
      selectedSaleStatus: null,
    }
  },
  watch: {
    'filter.search'() {
      this.resetPaginationSettings('requests');
      this.list();
    },
    'filter.building'() {
      this.resetPaginationSettings('requests');
      this.list();
    },
    'filter.block'() {
      this.resetPaginationSettings('requests');
      this.list();
    },
    'filter.number'() {
      this.resetPaginationSettings('requests');
      this.list();
    },
    'filter.status'() {
      this.resetPaginationSettings('requests');
      this.list();
    },
    'filter.square_meter'() {
      this.resetPaginationSettings('requests');
      this.list();
    },
  },
  methods: {
    createRequest() {
      this.selectedRequestId = null;
      this.showAddEditRequestModal = true;
    },
    editRequest(id) {
      this.selectedRequestId = id;
      this.showAddEditRequestModal = true;
    },
    getBuildings() {
      api.get("buildings").then((response) => {
        this.buildings = response.data.data
      }).catch((response) => {
      })
    },
    updateList() {
      this.list();
    },
    openSaleModal(id, type) {
      console.log(this.request);
      this.selectedRequestId = id;
      this.selectedSaleStatus = type;
      this.showSaleModal = true;
    },
    async getTimezone() {
      this.timezone = (new Date()).getTimezoneOffset() / 60;
      if (this.timezone < 0) {
        this.timezone = Math.abs(this.timezone);
      } else {
        this.timezone = 0 - this.timezone;
      }
    },
    async list() {
      await api.get("requests", {
        params: {
          limit: this.requests.settings.limit,
          offset: this.requests.settings.offset,
          search: this.filter.search,
          block: this.filter.block,
          building_id: this.filter.building?.id,
          number: this.filter.number,
          status: this.filter.status?.key,
          square_meter: this.filter.square_meter ?? null,
          timezone: this.timezone,
        }
      }).then((response) => {
        if (this.requests.settings.offset > 0) {
          this.requests.prependedData = response.data.data
          this.requests.data = this.requests.data.concat(response.data.data);
        } else {
          this.requests.data = response.data.data
        }
      }).catch((response) => {
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
    async onScrollCallback(event, listName, listMethodName) {
      const self = this;
      if (!self.scrollProcessingTime) {
        if (event.target.scrollLeft === 0) {
          self[listName].settings.scrollHeight = event.target.scrollHeight
          self[listName].settings.scrollTop = event.target.scrollTop
          self[listName].settings.clientHeight = event.target.clientHeight
          if (self[listName].settings.scrollTop + self[listName].settings.clientHeight + 50 >= self[listName].settings.scrollHeight) {
            if (!self[listName].settings.offset) {
              if (self[listName].settings.limit === self[listName].data.length) {
                self[listName].settings.offset += self[listName].settings.limit;
              }
            } else {
              if (self[listName].data.length >= self[listName].settings.limit) {
                self.scrollProcessingTime = Date.now();
                self[listMethodName]().then(function () {
                  if (self[listName].prependedData.length === self[listName].settings.limit) {
                    self.scrollProcessingTime = null;
                    self[listName].settings.offset += self[listName].settings.limit;
                  }
                });
              }
            }
          }
        }
      }
    },
    async resetPaginationSettings(listName) {
      this[listName].settings.offset = null;
      this[listName].prependedData = [];
      this.scrollProcessingTime = null;
    },
  },
  components: {
    SaleModal,
    vSelect,
    AddRequestModal
  },
  mounted() {
    this.getBuildings();
    this.getTimezone().then(() => {
      this.list();
    })
  }
}
</script>