<template>
  <div id="sale-update" tabindex="-1" aria-hidden="true"
       class="bg-slate-800/25 fixed top-0 left-0 right-0 z-50 hidden w-full overflow-x-hidden overflow-y-auto md:inset-0 max-h-full">
    <div class="relative h-screen overflow-y-auto bg-white w-full max-w-4xl ">
      <div class="flex items-center justify-between p-4 rounded-t dark:border-gray-600">
        <p class="text-xl">{{ $t('edit') }}</p>
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

      <div class="relative px-4 pb-8 flex flex-col gap-y-4 dark:bg-gray-700">
        <div>
          <div class="bg-indigo-50 rounded-md p-2">
            <p class="text-lg text-bold">{{ $t('client') }}</p>
            <p>{{ $t('full_name') }}: {{ sale.client_name }}</p>
            <p>{{ $t('phone_number') }}: {{ sale.client_phone_number }}</p>
          </div>
        </div>
        <div v-if="block === 'apartments'" class="bg-sky-50 rounded-md p-2">
          <p class="text-lg text-bold">{{ $t('apartment') }}</p>
          <p>{{ $t('building') }}: {{ sale.building }}</p>
          <p>{{ $t('floor') }}: {{ sale.floor }}</p>
          <p>{{ $t('apartment') }}: #{{ sale.number }}</p>
          <p>{{ sale.square_meter }} {{ $t('square_meter') }}</p>
          <p>{{ sale.rooms }} {{ $t('rooms') }}</p>
          <p>1 {{ $t('square_meter') }} - {{ price(sale.price_for_square) }}</p>
        </div>
        <div v-else-if="block === 'houses'" class="bg-green-50 rounded-md p-2">
          <p class="text-lg text-bold">{{ $t('house') }}</p>
          <p>{{ $t('address') }}: {{ sale.address }}</p>
          <p>{{ $t('terrace_size') }}: {{ sale.terrace_size }} {{ $t('square_meter') }}</p>
        </div>
        <div class="flex flex-col gap-y-2">
          <div class="flex flex-col gap-y-2">
            <label class="text-sm">{{ $t('select_garage') }}</label>
            <vSelect
                class="vselect"
                v-model="form.garage"
                :options="garages"
                :get-option-label="garageLabel"
                track-by="id"
            >
            </vSelect>
          </div>
          <div v-if="form.garage">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
                $t('garage_price')
              }} ({{ $t('total') }})</label>
            <input v-model="form.garage_price" type="number"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   required/>
          </div>
        </div>

        <div class="flex flex-col gap-y-2">
          <label class="text-sm">{{ $t('type') }}</label>
          <vSelect
              class="vselect"
              v-model="form.type"
              label="name"
              track-by="key"
              :options="[
                    {
                      name: $t('sale'),
                      key: 'sale'
                    },
                    {
                      name: $t('mortgage'),
                      key: 'mortgage'
                    },
                    {
                      name: $t('repayment'),
                      key: 'repayment'
                    },
                ]"
          />
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
              $t('price')
            }} ({{ $t('total') }})</label>
          <input v-model="form.price" type="text"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required/>
        </div>
        <div v-if="form.type && form.type?.key !== 'sale'">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
              $t('deposit')
            }}</label>
          <input v-model="form.deposit" type="number" step="0.01"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required/>
        </div>
        <div v-if="form.type && form.type?.key === 'repayment'">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
              $t('repayment_months_quantity')
            }}</label>
          <input v-model="form.repayment_months_quantity" type="number"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required/>
          <p v-if="form.repayment_months_quantity && form.price">{{ $t('monthly_payment') }}: {{ price(Math.floor((form.price + (form.garage_price ?? 0) - (form.deposit ?? 0)) / form.repayment_months_quantity)) }}</p>
        </div>
        <div>
          <button v-if="!loading" type="button" @click="store"
                  class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800">
            {{ $t('save') }}
          </button>
          <button v-else type="button"
                  class="text-white flex justify-center bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800">
            <svg aria-hidden="true" class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Modal} from "flowbite";
import vSelect from "vue-select";
import api from "@/utils/api.js";
import {useToast} from "vue-toastification";
const toast = useToast();
/** Format local date as YYYY-MM-DD (avoids timezone off-by-one) */
function todayLocalISO() {
  const now = new Date();
  const tzOffsetMs = now.getTimezoneOffset() * 60 * 1000; // minutes → ms
  const local = new Date(now.getTime() - tzOffsetMs);
  return local.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export default {
  components: {vSelect},
  data() {
    return {
      modalObj: null,
      request: null,
      form: {
        type: null,
        garage: null,
        garage_price: null,
        deposit: 0,
        repayment_months_quantity: null,
        date: todayLocalISO(),
      },
      garages: [],
      loading: false,
      today: todayLocalISO(),
    }
  },
  watch: {
    'form.deposit'() {
      if(this.form.price) {
        if(this.form.deposit > this.form.price) {
          this.form.deposit = this.form.price
        }
      }
    }
  },
  emits: ['updateList'],
  props: ['sale', 'block'],
  methods: {
    setToday() {
      this.form.date = todayLocalISO();
    },
    getGarages() {
      api.get("garages", {
        params: {
          status: 'active',
          building_id: this.sale.building_id,
          limit: 200
        }
      }).then((response) => {
        this.garages = response.data.data
      }).catch((response) => {
      })
    },
    garageLabel(a) {
      if (!a) return "";
      const floor = a.floor ?? "—";
      const number = a.number ?? "—";
      const sqm = a.square_meter ?? "—";
      return `${this.$t('floor')} ${floor} , No. ${number} , ${sqm} m²`;
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
    store() {
      let error = false;
      // if(!this.form.type?.key) {
      //   toast.error(this.$t('fill_type'));
      //   error = true;
      // }

      if(this.form.garage?.id) {
        if(!this.form.garage_price) {
          toast.error(this.$t('garage_price_required'));
          error = true;
        }
      }
      // if(!this.form.price) {
      //   toast.error(this.$t('price_required'));
      //   error = true;
      // }
      if(this.form.type && this.form.type.key !== 'sale') {
        if(!this.form.deposit) {
          toast.error(this.$t('deposit_required'));
          error = true;
        }
        if(this.form.type.key !== 'repayment') {
          if(!this.form.repayment_months_quantity) {
            toast.error(this.$t('repayment_months_quantity_required'));
            error = true;
          }
        }
      }
      if(!error) {
        this.loading = true;
        api.patch("sales/"+this.sale.sale_id, {
          type: this.form.type?.key,
          building_garage_id: this.form.garage?.id,
          garage_price: this.form.garage_price ? parseFloat(this.form.garage_price) : null,
          price: this.form.price ? parseFloat(this.form.price) : null,
          deposit: this.form.deposit ? parseFloat(this.form.deposit) : null,
          repayment_months_quantity: this.form.repayment_months_quantity,
        }).then((response) => {
          this.loading = false;
          toast.success(this.$t('reserve_successfully_update'));
          this.modalObj.hide();
          this.$emit('updateList')
        }).catch((response) => {
          this.loading = false;
        })
      }
    }
  },
  mounted() {
    this.modalObj = new Modal(document.getElementById('sale-update'), {
      placement: 'top-right',
      closable: true, backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40 modal-backdrop',
      onHide: () => {
        this.$parent.showSaleEditModal = false;
      },
    })
    this.modalObj.show();
    if(this.block === 'apartments') {
      this.getGarages();
      this.form.garage = this.sale.garage_id ? {
        square_meter: this.sale.garage_square_meter,
        number: this.sale.garage_number,
        id: this.sale.garage_id,
        price_for_square: this.sale.garage_price_for_square,
      } : null

      this.form.type = this.sale.type ? {
        name: this.$t(this.sale.type),
        key: this.sale.type
      } : null
      this.form.deposit = this.sale.deposit
      this.form.repayment_months_quantity = this.sale.repayment_months_quantity
      this.form.price = this.sale.price
      this.form.garage_price = this.sale.garage_price
    }
  }
}
</script>