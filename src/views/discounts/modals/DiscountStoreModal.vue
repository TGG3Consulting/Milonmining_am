<template>
  <div id="discount-store-modal" tabindex="-1" aria-hidden="true"
       class="bg-slate-800/25 fixed top-0 left-0 right-0 z-50 hidden w-full overflow-x-hidden overflow-y-auto md:inset-0 max-h-full">
    <div class="relative h-screen overflow-y-auto bg-white w-full max-w-4xl ">
      <div class="flex items-center justify-between p-4 border-b border-gray-300 rounded-t dark:border-gray-600">

        <p class="text-xl">{{ $t('save_discount') }}</p>
        <button type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                @click="modalObj.hide()">
          <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
               xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>

      <div class="relative px-4 py-2 pb-8 flex flex-col gap-y-4 dark:bg-gray-700">
        <div class="flex flex-col gap-y-2">
          <p v-for="key in Object.keys(filter)">{{ $t(key) }}: <span
              class="font-bold">{{
              filter[key] ? (typeof filter[key] === "string" ? filter[key] : filter[key].name) : 'Բոլորը'
            }}</span>
          </p>
        </div>
        <div class="flex flex-col gap-y-2">
          <label>Զեղչի չափը</label>
          <input type="number" v-model="value" step="0.01"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required/>
        </div>
        <div class="flex">
          <button v-if="!discountLoading" @click="storeDiscountFilter"
                  type="button"
                  class="flex items-center gap-x-2 px-5 py-2.5 rounded-full border-2 border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-600 transition"
          >
            <!-- Percent / discount icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 5a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM9 19a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM5 19l14-14"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-medium text-sm">Պահպանել</span>
          </button>
          <button v-else
                  type="button"
                  class="flex items-center gap-x-2 px-5 py-2.5 rounded-full border-2 border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-600 transition"
          >
            <!-- Percent / discount icon -->
            <svg aria-hidden="true" class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-600"
                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"/>
              <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"/>
            </svg>
          </button>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              {{ $t('filters') }}
            </th>
            <th scope="col" class="px-6 py-3">
              {{ $t('status') }}
            </th>
            <th scope="col" class="px-6 py-3">
              {{ $t('discount') }}
            </th>
            <th scope="col" class="px-6 py-3">
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="discount in discounts"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <td class="px-6 py-4">
              <p v-for="key in Object.keys(discount.filter)">{{ $t(key) }}: <span
                  class="font-bold">{{
                  filter[key] ? (typeof filter[key] === "string" ? filter[key] : filter[key].name) : 'Բոլորը'
                }}</span>
              </p>
            </td>
            <td class="px-6 py-4">
              {{ $t(discount.status) }}
            </td>
            <td class="px-6 py-4">
              {{ discount.value }} %
            </td>
            <td class="px-6 py-4">
              <div v-if="!discount.loading">
                <button v-if="discount.status === 'active'" type="button" @click="archive(discount)"
                        class="text-white bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:ring-rose-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none dark:focus:ring-rose-800">
                  {{ $t('archive') }}
                </button>
              </div>
              <div v-else>
                <button
                        class="text-white bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:ring-rose-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none dark:focus:ring-rose-800">
                  <svg aria-hidden="true" class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-600"
                       viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"/>
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import {Modal} from "flowbite";
import api from "@/utils/api.js";
import {useToast} from "vue-toastification";

const toast = useToast();

export default {
  data() {
    return {
      discountLoading: false,
      modalObj: null,
      value: null,
      discounts: []
    }
  },
  props: ['block', 'filter'],
  watch: {
    value() {
      if (this.value > 100) {
        this.value = 100;
      } else if (this.value < 0) {
        this.value = 1;
      }
    }
  },
  emits: ['updateList'],
  methods: {
    storeDiscountFilter() {
      if (confirm(this.$t('are_you_sure'))) {
        this.discountLoading = true;
        api.post("discounts/", {
          filter: this.filter,
          block: this.block,
          value: this.value
        })
            .then((response) => {
              this.discountLoading = false;
              toast.success(this.$t('discount_successfully_created'));
              this.$emit('updateList');
              this.modalObj.hide();
            }).catch((response) => {
          this.discountLoading = false;
          // toast.success('Ինչ որ բան այն չէ, փորձեք մի փոքր ուշ');
        })
      }
    },
    archive(discount) {
      if (confirm('Հեռացնելուց հետո ֆիլտրի մեջ մտնող բոլոր զեղչերը կհեռացվեն, շարունակե՞լ')) {
        discount.loading = true;
        api.delete("discounts/" + discount.id)
            .then((response) => {
              discount.loading = false;
              discount.status = 'archived';
              toast.success(this.$t('discount_successfully_archived'));
              this.$emit('updateList');
            }).catch((response) => {
          discount.loading = false;
          // toast.success('Ինչ որ բան այն չէ, փորձեք մի փոքր ուշ');
        })
      }
    },
    list() {
      api.get("discounts/" + this.block)
          .then((response) => {
            this.discounts = response.data.data;
          }).catch((response) => {
        // toast.success('Ինչ որ բան այն չէ, փորձեք մի փոքր ուշ');
      })
    }
  },
  mounted() {
    this.modalObj = new Modal(document.getElementById('discount-store-modal'), {
      placement: 'top-right',
      closable: true, backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40 modal-backdrop',
      onHide: () => {
        this.$parent.showDiscountModal = false;
      },
    })
    this.modalObj.show();
    this.list();
  }
}
</script>