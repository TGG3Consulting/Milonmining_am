<template>
  <div id="add-edit-request" tabindex="-1" aria-hidden="true"
       class="bg-slate-800/25 fixed top-0 left-0 right-0 z-50 hidden w-full overflow-x-hidden overflow-y-auto md:inset-0 max-h-full">
    <div class="relative h-screen overflow-y-auto bg-white w-full max-w-4xl ">
      <div class="flex items-center justify-between p-4 rounded-t dark:border-gray-600">

        <p class="text-xl">{{ $t('request') }}</p>
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
        <div class="flex flex-col gap-y-2">
          <label>{{ $t('select_type') }}</label>
          <vSelect
              class="vselect"
              v-model="block"
              label="name"
              track-by="id"
              :options="blocks"
          />
        </div>
        <div v-if="block?.key === 'apartments'" class="flex flex-col gap-y-2">
          <div class="flex flex-col gap-y-2">
            <div class="flex flex-col gap-y-2">
              <label>{{ $t('select_building') }}</label>
              <vSelect
                  class="vselect"
                  label="name"
                  track-by="id"
                  v-model="form.building"
                  :options="buildings"
              />
            </div>
            <div v-if="form.building?.id" class="flex flex-col gap-y-2">
              <label>{{ $t('select_garage') }}</label>
              <!-- template -->
              <vSelect
                  class="vselect"
                  v-model="form.garage"
                  :options="garages"
                  multiple
                  :get-option-label="garageLabel"
                  track-by="id"
              >
              </vSelect>

            </div>
            <div class="bg-indigo-50 rounded-md flex flex-col gap-y-2 p-2">
              <p>{{ $t('select_apartment') }}</p>
              <div v-if="form.building?.id" class="flex flex-col gap-y-2">
                <label>{{ $t('select_floor') }}</label>
                <vSelect
                    class="vselect"
                    v-model="form.floor"
                    label="level"
                    track-by="id"
                    :options="floors"
                />
              </div>
              <div v-if="form.building?.id" class="flex flex-col gap-y-2">
                <label>{{ $t('rooms') }}</label>
                <vSelect
                    class="vselect"
                    v-model="form.rooms"
                    :options="[1,2,3,4]"
                />
              </div>
              <div v-if="form.building?.id" class="flex gap-x-4">
                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
                      $t('square_meter')
                    }} >=</label>
                  <input v-model="form.square_meter" type="number" step="0.01"
                         class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                         required/>
                </div>
                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
                      $t('number')
                    }}</label>
                  <input v-model="form.number" type="number"
                         class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                         required/>
                </div>
              </div>
              <div v-if="form.building?.id" class="flex flex-col gap-y-2">
                <label>{{ $t('select_apartment') }}</label>
                <!-- template -->
                <vSelect
                    class="vselect"
                    v-model="form.apartment"
                    :options="apartments.data ?? []"
                    :get-option-label="apartmentLabel"
                    track-by="id"
                >
                </vSelect>

              </div>
            </div>
          </div>

        </div>
        <div v-if="block?.key === 'houses'" class="flex flex-col gap-y-2">
          <div v-if="houses?.length" class="flex flex-col gap-y-2">
            <label>{{ $t('houses') }}</label>
            <!-- template -->
            <vSelect
                class="vselect"
                v-model="form.houses"
                :options="houses"
                multiple
                :get-option-label="houseLabel"
                track-by="id"
            >
            </vSelect>

          </div>
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
              $t('preferred_price')
            }} ({{ $t('square_meter') }})</label>
          <input v-model="form.preferred_price" type="text"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required/>
        </div>
        <div v-if="form.apartment?.id || form.house?.id">
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

export default {
  components: {vSelect},
  data() {
    return {
      modalObj: null,
      loading: null,
      blocks: [
        {
          name: this.$t('house'),
          key: 'houses'
        },
        {
          name: this.$t('apartment'),
          key: 'apartments'
        }
      ],
      block: null,
      // building: null,
      form: {
        building: null,
        floor: null,
        square_meter: null,
        rooms: null,
        apartment: null,
        garage: null,
        house: null,
        preferred_price: null,
      },
      client: {
        name: null,
        phone_number: '+374'
      },
      floors: [],
      apartments: {
        data: [],
        prependedData: [],
        settings: {
          scrollProcessingTime: null,
          scrollHeight: null,
          scrollTop: null,
          clientHeight: null,
          offset: null,
          limit: 50,
        }
      },
      houses: [],
      garages: [],
    }
  },
  watch: {
    type() {
    },
    'form.building'() {
      if (this.form.building?.id) {
        // this.getBuildingById();
        this.getFloorsByBuildingId();
        this.getApartments();
        this.getGarages();
      } else {
        this.form.floor = null;
        this.form.apartments.data = [];
      }
    },
    'form.floor'() {
      this.getApartments();
    },
    'form.square_meter'() {
      this.getApartments();
    },
    'form.rooms'() {
      this.getApartments();
    }
  },
  props: ['buildings', 'request_id'],
  emits: ['updateList'],
  methods: {
    // getBuildingById() {
    //   api.get("buildings/" + this.form.building.id).then((response) => {
    //     this.building = response.data.data
    //   }).catch((response) => {
    //   })
    // },
    getFloorsByBuildingId() {
      api.get("buildings/" + this.form.building.id + "/floors").then((response) => {
        this.floors = response.data.data
      }).catch((response) => {
      })
    },
    getHouses() {
      api.get("houses", {
        params: {
          available: true
        }
      }).then((response) => {
        this.houses = response.data.data
      }).catch((response) => {
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
    getApartments() {
      api.get("apartments", {
        params: {
          limit: this.apartments.settings.limit,
          offset: this.apartments.settings.offset,
          building_id: this.form.building?.id,
          floor_id: this.form.floor?.id,
          number: this.form.number,
          rooms: this.form.rooms,
          square_meter: this.form.square_meter,
          status: 'active'
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

    apartmentLabel(a) {
      if (!a) return "";
      const floor = a.floor ?? "—";
      const number = a.number ?? "—";
      const rooms = a.rooms ?? "—";
      const sqm = a.square_meter ?? "—";
      return `${this.$t('floor')} ${floor} , No. ${number} , ${rooms} ${this.$t('rooms')} , ${sqm} m²`;
    },
    houseLabel(a) {
      return a.address + ' (' + a.floors_sum_square_meter + ' ' + this.$t('square_meter') + ')';
    },
    garageLabel(a) {
      if (!a) return "";
      const floor = a.floor ?? "—";
      const number = a.number ?? "—";
      const sqm = a.square_meter ?? "—";
      return `${this.$t('floor')} ${floor} , No. ${number} , ${sqm} m²`;
    },
    store() {
      let error = false;
      if (!this.client.name?.length || !this.client.phone_number?.length) {
        toast.error(this.$t('fill_client_info'));
        error = true;
      }
      if (this.block === 'houses' && !this.form.house?.id) {
        toast.error(this.$t('pick_houses'));
        error = true;
      }
      if (this.block === 'apartments' && !this.form.apartment?.id) {
        toast.error(this.$t('pick_apartments'));
        error = true;
      }
      if (!error) {
        this.loading = true;
        let url = 'requests';
        if(this.request_id) {
          url += '/' + this.request_id;
        }
        api.post(url, {
          name: this.client.name,
          phone_number: this.client.phone_number,
          block: this.block.key,
          relation_id: this.block.key === 'houses' ? this.form.house.id : this.form.apartment.id,
          preferred_price: this.form.preferred_price
        }).then((response) => {
          this.loading = false;
          toast.success(this.$t('request_successfully_created'));
          this.modalObj.hide();
          this.$emit('updateList')
        }).catch((response) => {
          this.loading = false;
        })
      }
    },
    getRequestById() {
      api.get("requests/"+this.request_id).then((response) => {
        this.form = response.data.data
        this.block = this.form.block;
        this.client.name = this.form.name;
        this.client.phone_number = this.form.phone_number;
      }).catch((response) => {
      })
    },
  },
  mounted() {
    this.modalObj = new Modal(document.getElementById('add-edit-request'), {
      placement: 'top-right',
      closable: true, backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40 modal-backdrop',
      onHide: () => {
        this.$parent.showAddEditRequestModal = false;
      },
    })
    this.modalObj.show();
    this.getHouses();
    if(this.request_id) {
      this.getRequestById();
    }
  }
}
</script>