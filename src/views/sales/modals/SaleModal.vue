<template>
  <div id="sale-modal" tabindex="-1" aria-hidden="true"
       class="bg-slate-800/25 fixed top-0 left-0 right-0 z-50 hidden w-full overflow-x-hidden overflow-y-auto md:inset-0 max-h-full">
    <div class="relative h-screen overflow-y-auto bg-white w-full max-w-4xl ">
      <div class="flex items-center justify-between p-4 rounded-t dark:border-gray-600">
        <p class="text-xl">{{ status === 'sale' ? $t('register_sale') : $t('register_reserve') }}</p>
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
        <div v-if="request_id && request?.id">
          <div class="bg-indigo-50 rounded-md p-2">
            <p class="text-lg text-bold">{{ $t('client') }}</p>
            <p>{{ $t('full_name') }}: {{ client.name }}</p>
            <p>{{ $t('phone_number') }}: {{ client.phone_number }}</p>
          </div>
        </div>
        <div v-else>
          <div class="flex flex-col gap-y-2">
            <p>{{ $t('client_details') }}</p>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
                  $t('full_name')
                }}</label>
              <input v-model="client.name" type="text"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required/>
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
                  $t('phone_number')
                }}</label>
              <input v-model="client.phone_number" type="text"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required/>
            </div>
          </div>
        </div>
        <div v-if="block.key === 'apartments' && apartment?.id" class="bg-sky-50 rounded-md p-2">
          <p class="text-lg text-bold">{{ $t('apartment') }}</p>
          <p>{{ $t('building') }}: {{ apartment.building.name }}</p>
          <p>{{ $t('floor') }}: {{ apartment.floor.level }}</p>
          <p>{{ $t('apartment') }}: #{{ apartment.number }}</p>
          <p>{{ apartment.square_meter }} {{ $t('square_meter') }}</p>
          <p>{{ apartment.rooms }} {{ $t('rooms') }}</p>
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">1 {{ $t('square_meter') }}</label>
            <input type="number" v-model="apartment.price_for_square" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Մուտքագրել 1 քմ․֊ի արժեքը" required />
          </div>
        </div>
        <div v-else-if="block.key === 'houses' && house?.id" class="bg-green-50 rounded-md p-2">
          <p class="text-lg text-bold">{{ $t('house') }}</p>
          <div class="flex flex-col">
            <p v-for="translation in house.translations">{{ $t(translation.key) }}: {{ translation.value }}</p>
          </div>
          <p>{{ $t('terrace_size') }}: {{ house.terrace_size }} {{ $t('square_meter') }}</p>
          <div class="flex flex-col gap-y-1">
            <p>{{ $t('floors') }}</p>
            <div class="flex flex-col p-2 border rounded-md" v-for="floor in house.floors">
              <p>{{ floor.square_meter }} {{ $t('square_meter') }}</p>
              <a target="_blank" :href="floor.model_image_path" class="underline text-blue-500 hover:text-blue-700">{{ $t('model') }}</a>
            </div>
          </div>
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ընդհանուր գինը</label>
            <input type="number" v-model="house.price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Մուտքագրել ընդհանուր արժեքը արժեքը" required />
          </div>
        </div>
        <div v-if="form.apartment?.id" class="flex flex-col gap-y-2">
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
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ավտոկայանատեղի ընդհանուր գինը</label>
              <input type="number" v-model="form.garage.price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Մուտքագրել 1 քմ․֊ի արժեքը" required />
            </div>
          </div>
        </div>
        <div class="p-2 bg-green-100 flex flex-col gap-y-2">
          <label class="block mb-2 font-medium text-gray-900 dark:text-white">{{
              $t('price')
            }}</label>
          <div v-if="form.garage" class="flex flex-col">
            <div class="flex gap-x-2 text-sm font-medium text-gray-900 dark:text-white">{{
                $t('garage_price')
              }} <p class="text-sky-700" v-if="form.garage.discount">({{ form.garage.discount }} %)</p></div>
            <p>{{ price(form.garage.price - (form.garage.price * (form.garage.discount ?? 0) / 100)) }} <span class="line-through" v-if="form.garage.discount">{{ price(form.garage.price) }}</span></p>
          </div>
          <div v-if="apartment" class="flex flex-col">
            <div class="flex gap-x-2 text-sm font-medium text-gray-900 dark:text-white">{{
                $t('apartment_price')
              }} <p class="text-sky-700" v-if="apartment.discount">({{ apartment.discount }} %)</p></div>
            <p>{{ price((apartment.square_meter * apartment.price_for_square) - ((apartment.square_meter * apartment.price_for_square) * (apartment.discount ?? 0) / 100)) }} <span class="line-through" v-if="apartment.discount">{{ price(apartment.square_meter * apartment.price_for_square) }}</span></p>
          </div>
          <div v-if="apartment" class="text-xl">
            <p>{{ $t('total') }}: {{
                price((apartment.square_meter * apartment.price_for_square) - ((apartment.square_meter * apartment.price_for_square) * (apartment.discount ?? 0) / 100) +
                (form.garage ? (form.garage.price - (form.garage.price * (form.garage.discount ?? 0) / 100)) : 0))
              }}</p>
          </div>
          <div v-if="house">
            <p>{{ $t('total') }}: {{ price(house.price - ((house.discount ?? 0) * house.price / 100)) }}</p>
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
        <div v-if="status === 'sale'">
          <div class="flex flex-col gap-y-2">
            <label class="text-sm">{{ $t('sale_date') }}</label>
            <div class="flex items-center">
              <input
                  type="date"
                  v-model="form.date"
                  class="rounded border px-3 py-1.5"
              />
              <button v-if="form.date !== today" type="button" class="px-2 py-1.5 border rounded" @click="setToday">
                {{ $t('today') }}
              </button>
            </div>
          </div>
        </div>
<!--        <div v-if="form.type && form.type?.key !== 'sale'">-->
<!--          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{-->
<!--              $t('deposit')-->
<!--            }}</label>-->
<!--          <input v-model="form.deposit" type="number" step="0.01"-->
<!--                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"-->
<!--                 required/>-->
<!--        </div>-->
<!--        <div v-if="form.type && form.type?.key === 'repayment'">-->
<!--          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{-->
<!--              $t('repayment_months_quantity')-->
<!--            }}</label>-->
<!--          <input v-model="form.repayment_months_quantity" type="number"-->
<!--                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"-->
<!--                 required/>-->
<!--          <p v-if="form.repayment_months_quantity && form.price">{{ $t('monthly_payment') }}: {{ price(Math.floor((form.price + (form.garage_price ?? 0) - (form.deposit ?? 0)) / form.repayment_months_quantity)) }}</p>-->
<!--        </div>-->
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
        building: null,
        garage: null,
        garage_price: null,
        deposit: 0,
        repayment_months_quantity: null,
        apartment: null,
        date: todayLocalISO(),
      },
      client: {
        name: null,
        phone_number: '+374'
      },
      garages: [],
      loading: false,
      block: {
        key: 'apartments'
      },
      apartment: null,
      house: null,
      today: todayLocalISO()
    }
  },
  props: ['status', 'request_id', 'apartment_id', 'house_id'],
  watch: {
    'form.building'() {
      this.garages = [];
      this.getGarages()
    },
    'form.deposit'() {
      if(this.form.price) {
        if(this.form.deposit > this.form.price) {
          this.form.deposit = this.form.price
        }
      }
    }
  },
  emits: ['updateList'],
  methods: {
    setToday() {
      this.form.date = todayLocalISO();
    },
    getHouseById() {
      api.get("houses/"+this.house_id).then((response) => {
        this.house = response.data.data
        this.form.house = this.house;
        this.block = {
          name: 'houses',
          key: 'houses'
        };
      }).catch((response) => {
      })
    },
    getApartmentById() {
      api.get("apartments/"+this.apartment_id).then((response) => {
        this.apartment = response.data.data
        this.form.building = this.apartment.building
        this.block = {
          name: 'apartments',
          key: 'apartments'
        };
        this.form.apartment = this.apartment;
      }).catch((response) => {
      })
    },
    getRequestById() {
      api.get("requests/"+this.request_id).then((response) => {
        this.request = response.data.data
        this.form.building = this.request.building
        this.form.garage = this.request.garage
        this.form.apartment = this.request.apartment
        this.form.house = this.request.house
        this.block = this.request.block;
        if(this.request.apartment) {
          this.apartment = this.request.apartment;
          this.apartment.building = this.form.building;
          this.apartment.floor = this.request.floor;
        } else if(this.request.house) {
          this.house = this.request.house
        }
        this.client.name = this.request.name;
        this.client.phone_number = this.request.phone_number;
        if(this.request.reserve) {
          if(this.request.reserve.block === 'apartments') {
            this.apartment.price_for_square = parseFloat(this.request.reserve.price) / parseFloat(this.apartment.square_meter)
            this.apartment.discount = this.request.reserve.discount;
            this.form.garage = this.request.reserve.building_garage;
            if(this.form.garage?.id) {
              this.form.garage.price = this.request.reserve.garage_price
              this.form.garage.discount = this.request.reserve.garage_discount
            }
          } else {
            this.house.price = this.request.reserve.price;
            this.house.discount = this.request.reserve.discount;
          }
          this.form.repayment_months_quantity = this.request.reserve.repayment_months_quantity;
          this.form.type = {
            key: this.request.reserve.type,
            name: this.$t(this.request.reserve.type)
          };
          this.form.date = this.request.reserve.sale_date;
        }
      }).catch((response) => {
        console.log(response)
      })
    },
    getGarages() {
      api.get("garages", {
        params: {
          status: 'active',
          building_id: this.form.building.id,
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
      if(this.block.key === 'apartments') {
        if(!this.form.apartment?.id) {
          toast.error(this.$t('select_apartment'));
          error = true;
        }
        if(!this.apartment.price_for_square || this.apartment.price_for_square < 0) {
          toast.error('Բնակարանի 1քմ․֊ի արժեքը պարտադիր է');
          error = true;
        }
        if(this.form.garage) {
          if(!this.form.garage.price || this.form.garage.price < 0) {
            toast.error('Ընտրված Ավտոկայանատեղի արժեքը պարտադիր է');
            error = true;
          }
        }
      } else {
        if(!this.form.house?.id) {
          toast.error(this.$t('select_house'));
          error = true;
        }
        if(this.form.house) {
          if(!this.form.house.price || this.form.house.price < 0) {
            toast.error('Թաունհաուսի արժեքը պարտադիր է');
            error = true;
          }
        }
      }
      if(!this.request_id) {
        if (!this.client.name?.length || !this.client.phone_number?.length) {
          toast.error(this.$t('fill_client_info'));
          error = true;
        }
      }
      if(this.status === 'sale') {
        if(!this.form.type?.key) {
          toast.error(this.$t('fill_type'));
          error = true;
        }
        if(!this.form.date) {
          toast.error(this.$t('sale_date_required'));
          error = true;
        }
        // if(this.form.garage?.id) {
        //   if(!this.form.garage_price) {
        //     toast.error(this.$t('garage_price_required'));
        //     error = true;
        //   }
        // }
        // if(!this.form.price) {
        //   toast.error(this.$t('price_required'));
        //   error = true;
        // }
        // if(this.form.type && this.form.type.key !== 'sale') {
          // if(!this.form.deposit) {
          //   toast.error(this.$t('deposit_required'));
          //   error = true;
          // }
          // if(this.form.type.key !== 'repayment') {
          //   if(!this.form.repayment_months_quantity) {
          //     toast.error(this.$t('repayment_months_quantity_required'));
          //     error = true;
          //   }
          // }
        // }
      }
      if(!error) {
        this.loading = true;
        api.post("sales/"+this.block.key, {
          status: this.status,
          type: this.form.type?.key,
          name: this.client.name,
          phone_number: this.client.phone_number,
          request_id: this.request_id,
          apartment_id: this.form?.apartment?.id,
          house_id: this.form?.house?.id,
          price: this.form?.house?.id ? this.form.house?.price : this.apartment.price_for_square,
          building_garage_id: this.form.garage?.id,
          garage_price: this.form.garage?.price,
          // garage_price: this.form.garage_price ? parseFloat(this.form.garage_price) : null,
          // price: this.form.price ? parseFloat(this.form.price) : null,
          // deposit: this.form.deposit ? parseFloat(this.form.deposit) : null,
          // repayment_months_quantity: this.form.repayment_months_quantity,
          sale_date: this.form.date
        }).then((response) => {
          this.loading = false;
          if(this.status === 'sale') {
            toast.success(this.$t('sale_successfully_created'));
          } else {
            toast.success(this.$t('reserve_successfully_created'));
          }
          this.modalObj.hide();
          this.$emit('updateList')
        }).catch((response) => {
          this.loading = false;
        })
      }
    }
  },
  mounted() {
    this.modalObj = new Modal(document.getElementById('sale-modal'), {
      placement: 'top-right',
      closable: true, backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40 modal-backdrop',
      onHide: () => {
        this.$parent.showSaleModal = false;
      },
    })
    this.modalObj.show();
    if(this.request_id) {
      this.getRequestById();
    } else if(this.apartment_id) {
      this.getApartmentById();
    } else if(this.house_id) {
      this.getHouseById();
    }
  }
}
</script>