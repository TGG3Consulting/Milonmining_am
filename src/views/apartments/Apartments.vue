<template>
  <div class="flex flex-col gap-y-4">
    <div class="dark:border-gray-700">
      <div class="flex flex-col gap-y-4 p-4 shadow-lg border rounded-md border-gray-200 bg-slate-100 text-xl">
        <p>{{ $t('apartments') }}</p>
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
    <div v-if="activeTab === 'apartments'" class="flex flex-col gap-y-2">
      <div class="flex">
        <button type="button" @click="createApartment"
                class="bg-white group text-sm flex gap-x-2 items-center text-violet-500 hover:text-white border border-violet-500 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg px-5 py-2.5 text-center dark:border-violet-300 dark:text-violet-300 dark:hover:text-white dark:hover:bg-violet-400 dark:focus:ring-violet-900">
          {{ $t('new_apartment') }}
          <svg width="21" height="21" class="fill-violet-500 group-hover:fill-white" viewBox="0 0 21 21"
               xmlns="http://www.w3.org/2000/svg">
            <path class="text-violet-500"
                  d="M19.037 11.7413H11.2599V19.5185C11.2599 19.8132 11.1428 20.0959 10.9343 20.3044C10.7259 20.5128 10.4432 20.6299 10.1484 20.6299C9.85367 20.6299 9.57097 20.5128 9.36254 20.3044C9.15411 20.0959 9.03701 19.8132 9.03701 19.5185V11.7413H1.25987C0.965097 11.7413 0.682401 11.6242 0.473967 11.4158C0.265534 11.2073 0.148438 10.9247 0.148438 10.6299C0.148438 10.3351 0.265534 10.0524 0.473967 9.84398C0.682401 9.63555 0.965097 9.51845 1.25987 9.51845H9.03701V1.74131C9.03701 1.59536 9.06576 1.45083 9.12161 1.31599C9.17747 1.18114 9.25933 1.05862 9.36254 0.955413C9.46574 0.852207 9.58827 0.77034 9.72311 0.714485C9.85796 0.658631 10.0025 0.629883 10.1484 0.629883C10.2944 0.629883 10.4389 0.658631 10.5738 0.714485C10.7086 0.77034 10.8311 0.852207 10.9343 0.955413C11.0375 1.05862 11.1194 1.18114 11.1753 1.31599C11.2311 1.45083 11.2599 1.59536 11.2599 1.74131V9.51845H19.037C19.183 9.51845 19.3275 9.5472 19.4623 9.60306C19.5972 9.65891 19.7197 9.74078 19.8229 9.84398C19.9261 9.94719 20.008 10.0697 20.0638 10.2046C20.1197 10.3394 20.1484 10.4839 20.1484 10.6299C20.1484 10.7758 20.1197 10.9204 20.0638 11.0552C20.008 11.1901 19.9261 11.3126 19.8229 11.4158C19.7197 11.519 19.5972 11.6009 19.4623 11.6567C19.3275 11.7126 19.183 11.7413 19.037 11.7413Z"/>
          </svg>
        </button>
      </div>
      <div>
        <div>
          <div class="mt-2">
            <div
                class="bg-white/80 border border-slate-200 shadow-sm rounded-2xl p-4 md:p-5 space-y-4"
            >
              <!-- Header -->
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                  <div
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"
                  >
                    <!-- funnel icon -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                      <path
                          d="M4 4h16l-6.5 7.79V19l-3 1v-8.21L4 4z"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div class="flex flex-col">
                    <p class="text-sm font-semibold text-slate-800">
                      {{ $t('filter') }}
                    </p>
                    <p class="text-xs text-slate-500">
                      Ընտրեք շենք, հարկ և այլ պայմաններ՝ ցանկը նեղացնելու համար
                    </p>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2">
                  <button
                      type="button"
                      @click="storeDiscountFilter"
                      class="hidden sm:inline-flex items-center gap-x-2 px-4 py-2 rounded-full border border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-500 text-xs font-medium transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path
                          d="M19 5a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM9 19a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM5 19l14-14"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                      />
                    </svg>
                    <span>{{ $t('discount') || 'Զեղչ' }}</span>
                  </button>

                  <button
                      type="button"
                      @click="resetApartmentFilters"
                      class="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 0 1 19 5"
                      />
                    </svg>
                    <span>{{ 'Մաքրել ֆիլտրերը' }}</span>
                  </button>
                </div>
              </div>

              <!-- Main filters grid -->
              <div
                  class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                <!-- Building -->
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-slate-600">
                    {{ $t('select_building') }}
                  </label>
                  <vSelect
                      class="vselect text-sm"
                      v-model="filter.building"
                      label="name"
                      track-by="id"
                      :options="buildings"
                      :placeholder="'Ընտրել...'"
                  />
                </div>

                <!-- Floor -->
                <div
                    v-if="filter.building?.id"
                    class="flex flex-col gap-1"
                >
                  <label class="text-xs font-medium text-slate-600">
                    {{ $t('select_floor') }}
                  </label>
                  <vSelect
                      class="vselect text-sm"
                      v-model="filter.floor"
                      label="level"
                      track-by="id"
                      :options="floors"
                      :placeholder="'Ընտրել...'"
                  />
                </div>

                <!-- Status -->
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-slate-600">
                    {{ $t('status') }}
                  </label>
                  <vSelect
                      class="vselect text-sm"
                      v-model="filter.status"
                      label="name"
                      track-by="key"
                      :options="[
              { name: $t('pending'), key: 'pending' },
              { name: $t('active'), key: 'active' },
              { name: $t('reserved'), key: 'reserved' },
              { name: $t('sold'), key: 'sold' }
            ]"
                      :placeholder="'Ընտրել...'"
                  />
                </div>

                <!-- Number -->
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-slate-600">
                    # {{ $t('number') }}
                  </label>
                  <input
                      type="number"
                      v-model="filter.number"
                      class="bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2"
                      :placeholder="'Օր. 25'"
                  />
                </div>

                <!-- Rooms -->
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-slate-600">
                    {{ $t('rooms_count') }}
                  </label>
                  <input
                      type="number"
                      v-model="filter.rooms"
                      class="bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2"
                      :placeholder="'Օր. 2'"
                  />
                </div>

                <!-- Square meter -->
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-slate-600">
                    {{ $t('square_meter') }} ≥
                  </label>
                  <input
                      type="number"
                      v-model="filter.square_meter"
                      step="0.01"
                      class="bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2"
                      :placeholder="'Օր. 45'"
                  />
                </div>

                <!-- For main -->
                <div class="flex items-center gap-2 mt-1">
                  <input
                      id="for-main-checkbox"
                      v-model="filter.for_main"
                      type="checkbox"
                      class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                      for="for-main-checkbox"
                      class="text-xs font-medium text-slate-700"
                  >
                    {{ $t('for_main') }}
                  </label>
                </div>
              </div>

              <!-- Discount button for mobile -->
              <div class="flex sm:hidden">
                <button
                    @click="storeDiscountFilter"
                    type="button"
                    class="inline-flex items-center gap-x-2 px-4 py-2 rounded-full border border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-500 text-xs font-medium transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path
                        d="M19 5a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM9 19a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM5 19l14-14"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                  </svg>
                  <span>{{ 'Զեղչ' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="h-[640px] overflow-y-auto" @scroll="onScrollCallback($event, 'apartments','list')">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('status') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('discount') }}
              </th>
              <th v-if="!this.filter.building?.id" scope="col" class="px-6 py-3">
                {{ $t('building') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('entry') }}
              </th>
              <th v-if="!this.filter.floor?.id" scope="col" class="px-6 py-3">
                {{ $t('floor') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('number') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('rooms') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('square_meter') }}
              </th>
              <th scope="col" class="px-6 py-3">
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="apartment in apartments.data"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
              <td class="px-6 py-4">
                <div class="flex flex-col gap-y-2">
                  <!-- Activate -->
                  <label
                      v-if="apartment.status !== 'sold' && apartment.status !== 'reserved'"
                      class="inline-flex items-center gap-x-2 cursor-pointer"
                  >
                    <input
                        type="checkbox"
                        :checked="apartment.active"
                        @change="switcher(apartment, $event.target.checked)"
                        class="w-4 h-4"
                    />
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-300">
      {{ $t('activate') }}
    </span>
                  </label>

                  <!-- For main -->
                  <label class="inline-flex items-center gap-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        :checked="apartment.for_main"
                        @change="forMain(apartment, $event.target.checked)"
                        class="w-4 h-4"
                    />
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-300">
      {{ $t('for_main') }}
    </span>
                  </label>
                </div>

                <div class="flex flex-col gap-y-2">
                  <a class="text-blue-500 hover:text-blue-700 underline cursor-pointer" target="_blank"
                     :href="apartment.image">{{ $t('model') }}</a>
                  <a class="text-blue-500 hover:text-blue-700 underline cursor-pointer" target="_blank"
                     :href="apartment.parent_image">{{ $t('place_in_model') }}</a>
                </div>
              </td>
              <td class="px-6 py-4">
                {{ $t(apartment.status) }}
              </td>
              <td class="px-6 py-4">
                <input type="number" v-model="apartment.discount" step="0.01" :disabled="apartment.status === 'sold' || apartment.status === 'reserved'"
                       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       required/>
                <p>1 {{ $t('square_meter') }} {{ price(apartment.price - ((apartment.discount ?? 0) * apartment.price / 100)) }}</p>
                <div v-if="apartment.status !== 'sold' && apartment.status !== 'reserved'">
                  <button v-if="!apartment.loading" @click="storeDiscountByProduct('apartments', apartment)"
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
              <td v-if="!this.filter.building?.id" class="px-6 py-4">
                {{ apartment.building }}
              </td>
              <td class="px-6 py-4">
                {{ apartment.block }}
              </td>
              <td v-if="!this.filter.floor?.id" class="px-6 py-4">
                {{ apartment.floor }}
              </td>
              <td class="px-6 py-4">
                {{ apartment.number }}
              </td>
              <td class="px-6 py-4">
                {{ apartment.rooms }}
              </td>
              <td class="px-6 py-4">
                {{ apartment.square_meter }}
              </td>
              <td class="px-6 py-4">
                <div v-if="!apartment.loading" class="flex flex-col gap-y-2 gap-x-2">
                  <div class="flex flex-col gap-y-2" >
                    <button
                            type="button" @click="editApartment(apartment.id)"
                            class="inline-flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 disabled:pointer-events-none dark:focus:ring-blue-900"
                    >
                      {{ $t('update') }}
                    </button>
                    <div class="flex gap-2">
                      <!-- SALE -->
                      <button v-if="apartment.status === 'active'"
                          type="button" @click="openSaleModal(apartment.id, 'sale')"
                          class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-60 disabled:pointer-events-none dark:focus:ring-emerald-900"
                      >
                        <!-- money icon -->
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7a2 2 0 0 1 2-2h14v2H5v10h14v2H5a2 2 0 0 1-2-2V7zm6 5a4 4 0 1 0 8 0 4 4 0 0 0-8 0zm2 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/></svg>
                        {{ $t('sale') }}
                      </button>

                      <!-- RESERVE -->
                      <button v-if="apartment.status === 'active'"
                          type="button" @click="openSaleModal(apartment.id, 'reserve')"
                          class="inline-flex justify-center items-center gap-2 rounded-xl border border-amber-400 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100 active:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-300 disabled:opacity-60 disabled:pointer-events-none dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-900/40 dark:focus:ring-amber-900"
                      >
                        <!-- bookmark icon -->
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12a1 1 0 0 1 1 1v19l-7-4-7 4V3a1 1 0 0 1 1-1z"/></svg>
                        {{ $t('reserve') }}
                      </button>
                    </div>
                  </div>
                  <button v-if="apartment.status === 'reserved'"
                      type="button" @click="cancelReserve(apartment)"
                      class="inline-flex justify-center items-center gap-2 rounded-xl border border-red-400 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-red-800 hover:bg-red-100 active:bg-red-200 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-60 disabled:pointer-events-none dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-900/40 dark:focus:ring-amber-900"
                  >
                    <!-- bookmark icon -->
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12a1 1 0 0 1 1 1v19l-7-4-7 4V3a1 1 0 0 1 1-1z"/></svg>
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
      </div>
    </div>
    <div v-if="activeTab === 'garages'" class="flex flex-col gap-y-2">
      <div class="flex">
        <button type="button" @click="createGarage"
                class="bg-white group text-sm flex gap-x-2 items-center text-violet-500 hover:text-white border border-violet-500 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg px-5 py-2.5 text-center dark:border-violet-300 dark:text-violet-300 dark:hover:text-white dark:hover:bg-violet-400 dark:focus:ring-violet-900">
          {{ $t('new_garage') }}
          <svg width="21" height="21" class="fill-violet-500 group-hover:fill-white" viewBox="0 0 21 21"
               xmlns="http://www.w3.org/2000/svg">
            <path class="text-violet-500"
                  d="M19.037 11.7413H11.2599V19.5185C11.2599 19.8132 11.1428 20.0959 10.9343 20.3044C10.7259 20.5128 10.4432 20.6299 10.1484 20.6299C9.85367 20.6299 9.57097 20.5128 9.36254 20.3044C9.15411 20.0959 9.03701 19.8132 9.03701 19.5185V11.7413H1.25987C0.965097 11.7413 0.682401 11.6242 0.473967 11.4158C0.265534 11.2073 0.148438 10.9247 0.148438 10.6299C0.148438 10.3351 0.265534 10.0524 0.473967 9.84398C0.682401 9.63555 0.965097 9.51845 1.25987 9.51845H9.03701V1.74131C9.03701 1.59536 9.06576 1.45083 9.12161 1.31599C9.17747 1.18114 9.25933 1.05862 9.36254 0.955413C9.46574 0.852207 9.58827 0.77034 9.72311 0.714485C9.85796 0.658631 10.0025 0.629883 10.1484 0.629883C10.2944 0.629883 10.4389 0.658631 10.5738 0.714485C10.7086 0.77034 10.8311 0.852207 10.9343 0.955413C11.0375 1.05862 11.1194 1.18114 11.1753 1.31599C11.2311 1.45083 11.2599 1.59536 11.2599 1.74131V9.51845H19.037C19.183 9.51845 19.3275 9.5472 19.4623 9.60306C19.5972 9.65891 19.7197 9.74078 19.8229 9.84398C19.9261 9.94719 20.008 10.0697 20.0638 10.2046C20.1197 10.3394 20.1484 10.4839 20.1484 10.6299C20.1484 10.7758 20.1197 10.9204 20.0638 11.0552C20.008 11.1901 19.9261 11.3126 19.8229 11.4158C19.7197 11.519 19.5972 11.6009 19.4623 11.6567C19.3275 11.7126 19.183 11.7413 19.037 11.7413Z"/>
          </svg>
        </button>
      </div>
      <div>
        <div>
          <div class="mt-2">
            <div
                class="bg-white/80 border border-slate-200 shadow-sm rounded-2xl p-4 md:p-5 space-y-4"
            >
              <!-- Header -->
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                  <div
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                      <path
                          d="M4 4h16l-6.5 7.79V19l-3 1v-8.21L4 4z"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div class="flex flex-col">
                    <p class="text-sm font-semibold text-slate-800">
                      {{ $t('filter') }}
                    </p>
                    <p class="text-xs text-slate-500">
                      {{ 'Ֆիլտրեք Ավտոկայանատեղիների շենքի, հարկի և չափի հիման վրա' }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button
                      type="button"
                      @click="storeDiscountFilter"
                      class="hidden sm:inline-flex items-center gap-x-2 px-4 py-2 rounded-full border border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-500 text-xs font-medium transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path
                          d="M19 5a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM9 19a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM5 19l14-14"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                      />
                    </svg>
                    <span>{{ $t('discount') || 'Զեղչ' }}</span>
                  </button>

                  <button
                      type="button"
                      @click="resetGarageFilters"
                      class="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 0 1 19 5"
                      />
                    </svg>
                    <span>{{ 'Մաքրել ֆիլտրերը' }}</span>
                  </button>
                </div>
              </div>

              <!-- Grid -->
              <div
                  class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                <!-- Building -->
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-slate-600">
                    {{ $t('select_building') }}
                  </label>
                  <vSelect
                      class="vselect text-sm"
                      v-model="garage_filter.building"
                      label="name"
                      track-by="id"
                      :options="buildings"
                      :placeholder="'Ընտրել...'"
                  />
                </div>

                <!-- Floor -->
                <div
                    v-if="garage_filter.building?.id"
                    class="flex flex-col gap-1"
                >
                  <label class="text-xs font-medium text-slate-600">
                    {{ $t('select_floor') }}
                  </label>
                  <vSelect
                      class="vselect text-sm"
                      v-model="garage_filter.floor"
                      label="level"
                      track-by="id"
                      :options="garage_floors"
                      :placeholder="'Ընտրել...'"
                  />
                </div>

                <!-- Status -->
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-slate-600">
                    {{ $t('status') }}
                  </label>
                  <vSelect
                      class="vselect text-sm"
                      v-model="garage_filter.status"
                      label="name"
                      track-by="key"
                      :options="[
              { name: $t('pending'), key: 'pending' },
              { name: $t('active'), key: 'active' },
              { name: $t('reserved'), key: 'reserved' },
              { name: $t('sold'), key: 'sold' }
            ]"
                      :placeholder="'Ընտրել...'"
                  />
                </div>

                <!-- Number -->
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-slate-600">
                    # {{ $t('number') }}
                  </label>
                  <input
                      type="number"
                      v-model="garage_filter.number"
                      class="bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2"
                      :placeholder="'Օր. 12'"
                  />
                </div>

                <!-- Square meter -->
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-slate-600">
                    {{ $t('square_meter') }} ≥
                  </label>
                  <input
                      type="number"
                      v-model="garage_filter.square_meter"
                      step="0.01"
                      class="bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2"
                      :placeholder="'Օր. 18'"
                  />
                </div>
              </div>

              <!-- Discount button mobile -->
              <div class="flex sm:hidden">
                <button
                    @click="storeDiscountFilter"
                    type="button"
                    class="inline-flex items-center gap-x-2 px-4 py-2 rounded-full border border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-500 text-xs font-medium transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path
                        d="M19 5a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM9 19a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM5 19l14-14"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                  </svg>
                  <span>{{ 'Զեղչ' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="h-[640px] overflow-y-auto" @scroll="onScrollCallback($event, 'garages','garageList')">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('status') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('discount') }}
              </th>
              <th v-if="!this.garage_filter.building?.id" scope="col" class="px-6 py-3">
                {{ $t('building') }}
              </th>
              <th v-if="!this.garage_filter.floor?.id" scope="col" class="px-6 py-3">
                {{ $t('floor') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('number') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('square_meter') }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ $t('price') }}
              </th>
              <th scope="col" class="px-6 py-3">
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="garage in garages.data"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
              <td class="px-6 py-4">
                <label v-if="garage.status !== 'sold' && garage.status !== 'reserved'" class="inline-flex items-center cursor-pointer">
                  <input v-if="garage.active" @change="garageSwitcher(garage, false)" checked type="checkbox"
                         class="sr-only peer">
                  <input v-else @change="garageSwitcher(garage, true)" type="checkbox" class="sr-only peer">
                  <div
                      class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                  <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{ $t('activate') }}</span>
                </label>
              </td>
              <td class="px-6 py-4">
                {{ $t(garage.status) }}
              </td>
              <td class="px-6 py-4">
                <input type="number" v-model="garage.discount" step="0.01" :disabled="garage.status === 'sold' || garage.status === 'reserved'"
                       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       required/>
                <p>1 {{ $t('square_meter') }} {{ price(garage.price - ((garage.discount ?? 0) * garage.price / 100)) }}</p>
                <div v-if="garage.status !== 'sold' && garage.status !== 'reserved'">
                  <button v-if="!garage.loading" @click="storeDiscountByProduct('garages', garage)"
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
              <td v-if="!this.garage_filter.building?.id" class="px-6 py-4">
                {{ garage.building_name }}
              </td>
              <td v-if="!this.filter.floor?.id" class="px-6 py-4">
                {{ garage.floor }}
              </td>
              <td class="px-6 py-4">
                {{ garage.number }}
              </td>
              <td class="px-6 py-4">
                {{ garage.square_meter }}
              </td>
              <td class="px-6 py-4">
                {{ price(garage.price) }}
              </td>
              <td class="px-6 py-4">
                <button type="button" @click="editGarage(garage.id)"
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
  </div>
  <AddEditApartment v-if="showAddEditApartment" v-bind:apartment_id="selectedApartmentId" v-bind:buildings="buildings"
                    @updateList="updateList"/>
  <AddEditGarage v-if="showAddEditGarage" v-bind:garage_id="selectGarageId" v-bind:buildings="buildings"
                 @updateList="updateGarageList"/>
  <SaleModal v-if="showSaleModal" v-bind:apartment_id="selectedApartmentId" v-bind:status="selectedSaleStatus" @updateList="updateList"/>
  <DiscountStoreModal v-if="showDiscountModal" v-bind:block="activeTab" v-bind:filter="activeTab === 'apartments' ? filter : garage_filter" @updateList="updateListAfterDiscount"/>
</template>

<script>
import AddEditApartment from "@/views/apartments/modals/AddEditApartment.vue";
import api from "@/utils/api.js";
import {useToast} from "vue-toastification";
import vSelect from "vue-select";
import AddEditGarage from "@/views/apartments/modals/AddEditGarage.vue";
import SaleModal from "@/views/sales/modals/SaleModal.vue";
import DiscountStoreModal from "@/views/discounts/modals/DiscountStoreModal.vue";

const toast = useToast();

export default {
  components: {SaleModal, AddEditGarage, vSelect, AddEditApartment, DiscountStoreModal},
  data() {
    return {
      showSaleModal: false,
      showAddEditApartment: false,
      showAddEditGarage: false,
      selectedApartmentId: null,
      selectGarageId: null,
      selectedSaleStatus: null,
      buildings: [],
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
      garages: {
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
      filter: {
        building: null,
        floor: null,
        number: null,
        rooms: null,
        square_meter: null,
        for_main: null
      },
      garage_filter: {
        building: null,
        floor: null,
        number: null,
        square_meter: null,
        status: null
      },
      floors: [],
      garage_floors: [],
      tabs: [
        {
          name: this.$t('apartments'),
          key: 'apartments',
          active: 1
        },
        {
          name: this.$t('garages'),
          key: 'garages',
          active: 0
        }
      ],
      activeTab: 'apartments',
      discountLoading: false,
      showDiscountModal: false
    }
  },
  watch: {
    'filter.building'() {
      if (!this.filter.building?.id) {
        this.floors = [];
        this.filter.floor = null;
      } else {
        this.getFloorsByBuildingId();
      }
      this.resetPaginationSettings('apartments');
      this.list();
    },
    'filter.floor'() {
      this.resetPaginationSettings('apartments');
      this.list();
    },
    'filter.status'() {
      this.resetPaginationSettings('apartments');
      this.list();
    },
    'filter.number'() {
      this.resetPaginationSettings('apartments');
      this.list();
    },
    'filter.rooms'() {
      this.resetPaginationSettings('apartments');
      this.list();
    },
    'filter.square_meter'() {
      this.resetPaginationSettings('apartments');
      this.list();
    },
    'filter.for_main'() {
      this.resetPaginationSettings('apartments');
      this.list();
    },
    'garage_filter.building'() {
      if (!this.garage_filter.building?.id) {
        this.garage_floors = [];
        this.garage_filter.floor = null;
      } else {
        this.getFloorsByBuildingIdGarage();
      }
      this.resetPaginationSettings('garages');
      this.garageList();
    },
    'garage_filter.floor'() {
      this.resetPaginationSettings('garages');
      this.garageList();
    },
    'garage_filter.status'() {
      this.resetPaginationSettings('garages');
      this.garageList();
    },
    'garage_filter.number'() {
      this.resetPaginationSettings('garages');
      this.garageList();
    },
    'garage_filter.square_meter'() {
      this.resetPaginationSettings('garages');
      this.garageList();
    },
  },
  methods: {
    openSaleModal(id, type) {
      this.selectedApartmentId = id;
      this.selectedSaleStatus = type;
      this.showSaleModal = true;
    },
    changeTab(tabs, index) {
      tabs.map((tab, localIndex) => {
        tab.active = index === localIndex;
        if (tab.active) {
          this.activeTab = tab.key
        }
      })
    },
    updateListAfterDiscount() {
      if(this.activeTab === 'apartments') {
        this.list()
      } else {
        this.garageList();
      }
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
    updateList() {
      this.resetPaginationSettings('apartments');
      this.list();
    },
    updateGarageList() {
      this.resetPaginationSettings('garages');
      this.garageList();
    },
    getBuildings() {
      api.get("buildings").then((response) => {
        this.buildings = response.data.data
      }).catch((response) => {
      })
    },
    getFloorsByBuildingId() {
      api.get("buildings/" + this.filter.building.id + "/floors", {
        params: {
          type: 'residential'
        }
      }).then((response) => {
        this.floors = response.data.data
      }).catch((response) => {
      })
    },
    getFloorsByBuildingIdGarage() {
      api.get("buildings/" + this.garage_filter.building.id + "/floors", {
        params: {
          type: 'garage'
        }
      }).then((response) => {
        this.garage_floors = response.data.data
      }).catch((response) => {
      })
    },
    switcher(apartment, switcher) {
      apartment.active = switcher;
      api.patch("apartments/" + apartment.id + "/switcher", {
        active: apartment.active ? 1 : 0
      }).then((response) => {
        if (apartment.active) {
          toast.success(this.$t('apartment_activated'));
        } else {
          toast.success(this.$t('apartment_disabled'));
        }
        apartment.status = response.data.data;
      }).catch((response) => {
        apartment.active = !apartment.active;
      })
    },
    forMain(apartment, switcher) {
      apartment.for_main = switcher;
      api.patch("apartments/" + apartment.id + "/main", {
        for_main: apartment.for_main ? 1 : 0
      }).then((response) => {
        if (apartment.for_main) {
          toast.success(this.$t('apartment_for_main'));
        } else {
          toast.success(this.$t('apartment_not_for_main'));
        }
        apartment.for_main = response.data.data;
      }).catch((response) => {
        apartment.for_main = !apartment.for_main;
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
    garageSwitcher(garage, switcher) {
      garage.active = switcher;
      api.patch("garages/" + garage.id + "/switcher", {
        active: garage.active ? 1 : 0
      }).then((response) => {
        if (garage.active) {
          toast.success(this.$t('garage_activated'));
        } else {
          toast.success(this.$t('garage_disabled'));
        }
        garage.status = response.data.data;
      }).catch((response) => {
        garage.active = !garage.active;
      })
    },
    async list() {
      await api.get("apartments", {
        params: {
          limit: this.apartments.settings.limit,
          offset: this.apartments.settings.offset,
          building_id: this.filter.building?.id,
          floor_id: this.filter.floor?.id,
          number: this.filter.number,
          rooms: this.filter.rooms,
          status: this.filter.status?.key,
          square_meter: this.filter.square_meter,
          for_main: this.filter.for_main ? 1 : 0,
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
    async garageList() {
      await api.get("garages", {
        params: {
          limit: this.garages.settings.limit,
          offset: this.garages.settings.offset,
          building_id: this.garage_filter.building?.id,
          floor_id: this.garage_filter.floor?.id,
          number: this.garage_filter.number,
          square_meter: this.garage_filter.square_meter,
        }
      }).then((response) => {
        if (this.garages.settings.offset > 0) {
          this.garages.prependedData = response.data.data
          this.garages.data = this.garages.data.concat(response.data.data);
        } else {
          this.garages.data = response.data.data
        }
      }).catch((response) => {
      })
    },
    createApartment() {
      this.selectedApartmentId = null;
      this.showAddEditApartment = true;
    },
    createGarage() {
      this.selectGarageId = null;
      this.showAddEditGarage = true;
    },
    editApartment(id) {
      this.selectedApartmentId = id;
      this.showAddEditApartment = true;
    },
    editGarage(id) {
      this.selectGarageId = id;
      this.showAddEditGarage = true;
    },
    cancelReserve(apartment) {
      if (confirm(this.$t('are_you_sure'))) {
        apartment.loading = true;
        api.patch("apartments/" + apartment.id + "/cancelReserve")
            .then((response) => {
              toast.success(this.$t('reserve_canceled'));
              apartment.status = 'active';
              apartment.loading = false;
            }).catch((response) => {
              apartment.loading = false;
            })
      }
    },
    storeDiscountFilter() {
      this.showDiscountModal = true;
    },
    resetApartmentFilters() {
      this.filter = {
        building: null,
        floor: null,
        number: null,
        rooms: null,
        square_meter: null,
        for_main: null,
        status: null
      };
      this.floors = [];
      this.resetPaginationSettings('apartments');
      this.list();
    },
    resetGarageFilters() {
      this.garage_filter = {
        building: null,
        floor: null,
        number: null,
        square_meter: null,
        status: null
      };
      this.garage_floors = [];
      this.resetPaginationSettings('garages');
      this.garageList();
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
    this.list();
    this.garageList();
  }
}
</script>