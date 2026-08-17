<template>
  <div class="flex flex-col gap-y-4">
    <div class="dark:border-gray-700">
      <div class="flex flex-col gap-y-4 p-4 shadow-lg border rounded-md border-gray-200 bg-slate-100 text-xl">
        <p>{{ $t('sales') }} / {{ $t('reserve') }}</p>
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
    <div v-if="activeTab === 'apartments'">
      <div class="flex">
        <div class="flex bg-indigo-50 p-4 flex-col gap-y-2">
          <p class="text-lg">{{ $t('filter') }}</p>
          <div class="flex flex-wrap gap-y-4 gap-x-4">
            <div class="flex flex-col gap-y-2">
              <label>{{ $t('select_building') }}</label>
              <vSelect
                  class="vselect"
                  v-model="apartment_filter.building"
                  label="name"
                  track-by="id"
                  :options="buildings"
              />
            </div>
            <div v-if="apartment_filter.building?.id" class="flex flex-col gap-y-2">
              <label>{{ $t('select_floor') }}</label>
              <vSelect
                  class="vselect"
                  v-model="apartment_filter.floor"
                  label="level"
                  track-by="id"
                  :options="floors"
              />
            </div>
          </div>
          <div class="flex flex-wrap gap-x-4 gap-y-4">
            <div class="flex flex-col gap-y-2">
              <label>{{ $t('status') }}</label>
              <vSelect
                  class="vselect"
                  v-model="apartment_filter.status"
                  label="name"
                  track-by="key"
                  :options="[
                    {
                      name: $t('sale'),
                      key: 'sale'
                    },
                    {
                      name: $t('reserve'),
                      key: 'reserve'
                    },
                    {
                      name: $t('canceled'),
                      key: 'canceled'
                    },
                ]"
              />
            </div>
            <div class="flex flex-col gap-y-2">
              <label># {{ $t('number') }}</label>
              <input type="number" v-model="apartment_filter.number"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required/>
            </div>
            <div class="flex flex-col gap-y-2">
              <label>{{ $t('square_meter') }} >=</label>
              <input type="number" v-model="apartment_filter.square_meter" step="0.01"
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
          <input type="search" v-model="apartment_filter.search" id="search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" :placeholder="$t('search_client')" required />
        </div>
      </div>
      <div class="relative overflow-x-auto">
        <div class="h-[640px] overflow-y-auto" @scroll="onScrollCallback($event, 'apartments','apartmentList')">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              {{ $t('status') }}
            </th>
            <th scope="col" class="px-6 py-3">
              {{ $t('sale_date') }}
            </th>
            <th scope="col" class="px-6 py-3">
              {{ $t('client') }}
            </th>
            <th scope="col" class="px-6 py-3">
              {{ $t('type') }}
            </th>
            <th scope="col" class="px-6 py-3">
              {{ $t('info') }}
            </th>
            <th scope="col" class="px-6 py-3">
              {{ $t('apartment') }}
            </th>
            <th scope="col" class="px-6 py-3">
              {{ $t('garage') }}
            </th>
            <th scope="col" class="px-6 py-3">
              {{ $t('created') }}
            </th>
            <th scope="col" class="px-6 py-3">
              {{ $t('updated') }}
            </th>
            <th scope="col" class="px-6 py-3">
            </th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="apartment in apartments.data"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
              <td class="px-6 py-4">
                {{ $t(apartment.status) }}
              </td>
              <td class="px-6 py-4">
                  {{ apartment.sale_date }}
              </td>
              <td class="px-6 py-4">
                <p>{{ apartment.client_name }}</p>
                <p>{{ apartment.client_phone_number }}</p>
              </td>
              <td class="px-6 py-4">
                {{ apartment.type ? $t(apartment.type) : null }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col gap-y-2">
                  <p v-if="apartment.price">{{ $t('price') }}: {{ price(apartment.price - ((apartment.discount ?? 0) * apartment.price / 100)) }}</p>
                  <p v-if="apartment.garage_price">{{ $t('garage_price') }}: {{ price(apartment.garage_price - ((apartment.garage_discount ?? 0) * apartment.garage_price / 100)) }}</p>
                  <p v-if="apartment.deposit">{{ $t('deposit') }}: {{ price(apartment.deposit) }}</p>
                  <p v-if="apartment.repayment_months_quantity">{{ $t('repayment_months_quantity') }}: {{ apartment.repayment_months_quantity }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <p>{{ $t('building') }}: {{ apartment.building }}</p>
                <p>{{ $t('floor') }}: {{ apartment.floor }}</p>
                <p>{{ $t('apartment') }}: #{{ apartment.number }}</p>
                <p>{{ apartment.square_meter }} {{ $t('square_meter') }}</p>
                <p>{{ apartment.rooms }} {{ $t('rooms') }}</p>
              </td>
              <td class="px-6 py-4">
                <p v-if="apartment.garage_square_meter">{{ apartment.garage_square_meter }} {{ $t('square_meter') }}</p>
                <p v-if="apartment.garage_number">#{{ apartment.garage_number }}</p>
              </td>
              <td class="px-6 py-4">
                <p>{{ apartment.created }}</p>
              </td>
              <td class="px-6 py-4">
                <p>{{ apartment.updated }}</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col gap-y-2" >
                  <div v-if="apartment.status === 'reserve'" class="flex gap-2">
                    <!-- SALE -->
                    <button
                            type="button" @click="sale(apartment.sale_id)"
                            class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-60 disabled:pointer-events-none dark:focus:ring-emerald-900"
                    >
                      <!-- money icon -->
                      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7a2 2 0 0 1 2-2h14v2H5v10h14v2H5a2 2 0 0 1-2-2V7zm6 5a4 4 0 1 0 8 0 4 4 0 0 0-8 0zm2 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/></svg>
                      {{ $t('sale') }}
                    </button>

                    <!-- RESERVE -->
                    <button
                        type="button" @click="editReserve(apartment, 'apartments')"
                        class="inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100 active:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-300 disabled:opacity-60 disabled:pointer-events-none dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-900/40 dark:focus:ring-amber-900"
                    >
                      <!-- bookmark icon -->
                      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12a1 1 0 0 1 1 1v19l-7-4-7 4V3a1 1 0 0 1 1-1z"/></svg>
                      {{ $t('edit') }}
                    </button>
                  </div>
                  <div class="flex">
                    <button v-if="apartment.status !== 'canceled'" @click="cancel(apartment.sale_id)"
                            type="button"
                            class="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-500 text-orange-600 bg-white hover:bg-orange-50 focus:ring-4 focus:ring-orange-200 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ $t('cancel') }}
                    </button>
                  </div>
                </div>

              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
    <div v-if="activeTab === 'houses'">
      <div class="flex">
        <div class="flex bg-indigo-50 p-4 flex-col gap-y-2">
          <p class="text-lg">{{ $t('filter') }}</p>
          <div class="flex flex-wrap gap-x-4 gap-y-4">
            <div class="flex flex-col gap-y-2">
              <label>{{ $t('status') }}</label>
              <vSelect
                  class="vselect"
                  v-model="house_filter.status"
                  label="name"
                  track-by="key"
                  :options="[
                    {
                      name: $t('sale'),
                      key: 'sale'
                    },
                    {
                      name: $t('reserve'),
                      key: 'reserve'
                    },
                    {
                      name: $t('canceled'),
                      key: 'canceled'
                    },
                ]"
              />
            </div>
            <div class="flex flex-col gap-y-2">
              <label>{{ $t('type') }}</label>
              <vSelect
                  class="vselect"
                  v-model="house_filter.type"
                  label="name"
                  track-by="key"
                  :options="[
                    {
                      name: $t('house'),
                      key: 'house'
                    },
                    {
                      name: $t('townhouse'),
                      key: 'townhouse'
                    },
                ]"
              />
            </div>
          </div>
          <div class="flex flex-col gap-y-2">
            <label>{{ $t('terrace_size') }} >=</label>
            <input type="number" v-model="house_filter.terrace_size" step="0.01"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   required/>
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
          <input type="search" v-model="house_filter.search" id="search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" :placeholder="$t('search')" required />
        </div>
      </div>
      <div class="relative overflow-x-auto">
        <div class="h-[640px] overflow-y-auto" @scroll="onScrollCallback($event, 'houses','houseList')">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                {{ $t('status') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('sale_date') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('client') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('type') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('info') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('house') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('created') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('updated') }}
              </th>
              <th scope="col" class="px-6 py-3">
              </th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="house in houses.data"
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <td class="px-6 py-4">
                  {{ $t(house.status) }}
                </td>
                <td class="px-6 py-4">
                  {{ house.sale_date }}
                </td>
                <td class="px-6 py-4">
                  <p>{{ house.client_name }}</p>
                  <p>{{ house.client_phone_number }}</p>
                </td>
                <td class="px-6 py-4">
                  {{ house.type ? $t(house.type) : null }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-y-2">
                    <p v-if="house.price">{{ $t('price') }}: {{ price(house.price) }}</p>
                    <p v-if="house.deposit">{{ $t('deposit') }}: {{ price(house.deposit) }}</p>
                    <p v-if="house.repayment_months_quantity">{{ $t('repayment_months_quantity') }}: {{ house.repayment_months_quantity }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p>{{ house.address }}</p>
                  <p>{{ $t('terrace_size') }}: {{ house.terrace_size }} {{ $t('square_meter') }}</p>
                </td>
                <td class="px-6 py-4">
                  <p>{{ house.created }}</p>
                </td>
                <td class="px-6 py-4">
                  <p>{{ house.updated }}</p>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-y-2" >
                    <div v-if="house.status === 'reserve'" class="flex gap-2">
                      <!-- SALE -->
                      <button
                          type="button" @click="sale(house.sale_id)"
                          class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-60 disabled:pointer-events-none dark:focus:ring-emerald-900"
                      >
                        <!-- money icon -->
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7a2 2 0 0 1 2-2h14v2H5v10h14v2H5a2 2 0 0 1-2-2V7zm6 5a4 4 0 1 0 8 0 4 4 0 0 0-8 0zm2 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/></svg>
                        {{ $t('sale') }}
                      </button>

                      <!-- RESERVE -->
                      <button
                          type="button" @click="editReserve(house, 'houses')"
                          class="inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100 active:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-300 disabled:opacity-60 disabled:pointer-events-none dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-900/40 dark:focus:ring-amber-900"
                      >
                        <!-- bookmark icon -->
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12a1 1 0 0 1 1 1v19l-7-4-7 4V3a1 1 0 0 1 1-1z"/></svg>
                        {{ $t('edit') }}
                      </button>
                    </div>
                    <div class="flex">
                      <button v-if="house.status !== 'canceled'" @click="cancel(house.sale_id)"
                              type="button"
                              class="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-500 text-orange-600 bg-white hover:bg-orange-50 focus:ring-4 focus:ring-orange-200 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ $t('cancel') }}
                      </button>
                    </div>
                  </div>

                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <SaleEditModal v-if="showSaleEditModal" v-bind:block="selectedRowBlock" v-bind:sale="selectedSale" @updateList="updateList"/>
  <SaleDateModal v-if="showSaleFinishModal" v-bind:sale_id="selectedSaleId" @updateList="updateList"/>
</template>
<script>
import vSelect from "vue-select";
import api from "@/utils/api.js";
import SaleEditModal from "@/views/sales/modals/SaleEditModal.vue";
import SaleDateModal from "@/views/sales/modals/SaleDateModal.vue";

export default {
  components: {SaleEditModal,SaleDateModal, vSelect},
  data() {
    return {
      showSaleEditModal: false,
      showSaleFinishModal: false,
      tabs: [
        {
          name: this.$t('apartments'),
          key: 'apartments',
          active: 1
        },
        {
          name: this.$t('houses'),
          key: 'houses',
          active: 0
        }
      ],
      activeTab: 'apartments',
      apartment_filter: {
        building: null,
        floor: null,
        number: null,
        square_meter: null,
        status: null,
        search: null
      },
      buildings: [],
      house_filter: {
        status: null,
        type:  {
          name: this.$t('townhouse'),
          key: 'townhouse'
        },
        search: null,
        terrace_size: null,
      },
      apartments: {
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
      houses: {
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
      selectedRowBlock: null,
      selectedSale: null,
      selectedSaleId: null,
      timezone: null,
    }
  },
  watch: {
    'apartment_filter.building'() {
      if (!this.apartment_filter.building?.id) {
        this.floors = [];
        this.apartment_filter.floor = null;
      } else {
        this.getFloorsByBuildingId();
      }
      this.resetPaginationSettings('apartments');
      this.apartmentList();
    },
    'apartment_filter.floor'() {
      this.resetPaginationSettings('apartments');
      this.apartmentList();
    },
    'apartment_filter.number'() {
      this.resetPaginationSettings('apartments');
      this.apartmentList();
    },
    'apartment_filter.square_meter'() {
      this.resetPaginationSettings('apartments');
      this.apartmentList();
    },
    'apartment_filter.search'() {
      this.resetPaginationSettings('apartments');
      this.apartmentList();
    },
    'apartment_filter.status'() {
      this.resetPaginationSettings('apartments');
      this.apartmentList();
    },
    'house_filter.type'() {
      this.resetPaginationSettings('houses');
      this.houseList();
    },
    'house_filter.status'() {
      this.resetPaginationSettings('houses');
      this.houseList();
    },
    'house_filter.terrace_size'() {
      this.resetPaginationSettings('houses');
      this.houseList();
    },
    'house_filter.search'() {
      this.resetPaginationSettings('houses');
      this.houseList();
    },
  },
  methods: {
    cancel(saleId) {
      if(confirm(this.$t('are_you_sure'))) {
        api.delete("sales/"+saleId).then((response) => {
          this.updateList();
        }).catch((response) => {
        })
      }
    },
    updateList() {
      if(this.activeTab === 'apartments') {
        this.apartmentList();
      } else {
        this.houseList();
      }
    },
    editReserve(sale, block) {
      this.selectedRowBlock = block;
      this.selectedSale = sale
      this.showSaleEditModal = true;
    },
    sale(id) {
      this.selectedSaleId = id;
      this.showSaleFinishModal = true;
    },
    getFloorsByBuildingId() {
      api.get("buildings/" + this.apartment_filter.building.id + "/floors", {
        params: {
          type: 'residential'
        }
      }).then((response) => {
        this.floors = response.data.data
      }).catch((response) => {
      })
    },
    async getTimezone() {
      this.timezone = (new Date()).getTimezoneOffset() / 60;
      if (this.timezone < 0) {
        this.timezone = Math.abs(this.timezone);
      } else {
        this.timezone = 0 - this.timezone;
      }
    },
    async apartmentList() {
      await api.get("sales/apartments", {
        params: {
          limit: this.apartments.settings.limit,
          timezone: this.timezone,
          offset: this.apartments.settings.offset,
          building_id: this.apartment_filter.building?.id,
          floor_id: this.apartment_filter.floor?.id,
          number: this.apartment_filter.number ? parseInt(this.apartment_filter.number) : null,
          square_meter: this.apartment_filter.square_meter,
          search: this.apartment_filter.search,
          status: this.apartment_filter.status?.key,
        }
      }).then((response) => {
        if (this.apartments.settings.offset > 0) {
          this.apartments.prependedData = response.data.data
          this.apartments.data = this.apartments.data.concat(response.data.data);
        } else {
          this.apartments.data = response.data.data
        }
      }).catch((response) => {
      })
    },
    async houseList() {
      await api.get("sales/houses", {
        params: {
          limit: this.apartments.settings.limit,
          timezone: this.timezone,
          offset: this.apartments.settings.offset,
          status: this.house_filter.status?.key,
          type: this.house_filter.type?.key,
          terrace_size: this.house_filter.terrace_size ? parseFloat(this.house_filter.terrace_size) : null,
          search: this.house_filter.search,
        }
      }).then((response) => {
        if (this.houses.settings.offset > 0) {
          this.houses.prependedData = response.data.data
          this.houses.data = this.houses.data.concat(response.data.data);
        } else {
          this.houses.data = response.data.data
        }
      }).catch((response) => {
      })
    },
    getBuildings() {
      api.get("buildings").then((response) => {
        this.buildings = response.data.data
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
  mounted() {
    this.getBuildings();
    this.getTimezone().then(() => {
      this.apartmentList();
      this.houseList();
    });
  }
}
</script>
