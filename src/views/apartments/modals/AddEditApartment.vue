<template>
  <div id="add-edit-apartment" tabindex="-1" aria-hidden="true"
       class="bg-slate-800/25 fixed top-0 left-0 right-0 z-50 hidden w-full overflow-x-hidden overflow-y-auto md:inset-0 max-h-full">
    <div class="relative h-screen overflow-y-auto bg-white w-full max-w-4xl ">
      <div class="flex items-center justify-between p-4 border-b border-gray-300 rounded-t dark:border-gray-600">

        <p class="text-xl">{{ apartment_id ? $t('edit_apartment') : $t('new_apartment') }}</p>
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
          <label>{{ $t('select_building') }}</label>
          <vSelect
              class="vselect"
              v-model="form.building"
              label="name"
              track-by="id"
              :options="buildings"
          />
        </div>
        <div v-if="form.building?.id" class="flex flex-col gap-y-2">
          <div class="flex flex-col gap-y-2">
            <label>{{ $t('select_block') }}</label>
            <vSelect
                class="vselect"
                v-model="form.block"
                label="name"
                track-by="id"
                :options="blocks"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label>{{ $t('select_floor') }}</label>
            <vSelect
                class="vselect"
                v-model="form.floor"
                label="level"
                track-by="id"
                :options="floors"
            />
          </div>
          <div class="flex items-center mb-4">
            <input id="duplex-checkbox" v-model="form.duplex" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="duplex-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Դուպլեքս</label>
          </div>
          <div v-if="form.building?.id && form.block?.id && form.floor?.id" class="flex flex-col gap-y-2">
            <div class="flex flex-wrap gap-x-4 gap-y-2">
              <div class="flex flex-col gap-y-2">
                <label># {{ $t('number') }}</label>
                <input type="text" v-model="form.number"
                       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       required/>
              </div>
              <div class="border-r border-gray-300"></div>
              <div class="flex flex-col gap-y-2">
                <label>{{ $t('rooms_count') }}</label>
                <input type="number" v-model="form.rooms"
                       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       required/>
              </div>
              <div class="border-r border-gray-300"></div>
              <div class="flex flex-col gap-y-2">
                <label>{{ $t('square_meter') }}</label>
                <input type="number" v-model="form.square_meter" step="0.01"
                       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       required/>
              </div>
            </div>
            <div class="flex flex-wrap gap-y-4 gap-x-4">
              <div class="flex flex-col gap-y-2">
                <label>{{ $t('model') }}</label>
                <input @change="changeImage($event)"
                       class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                       id="image" type="file">
              </div>
              <div class="flex flex-col gap-y-2">
                <label>{{ $t('place_in_model') }}</label>
                <input @change="changeParentImage($event)"
                       class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                       id="parent_image" type="file">
              </div>
            </div>
            <div class="flex gap-x-2">
              <div class="flex gap-x-2 items-center w-full">
                <input v-model="form.price" :placeholder="$t('price')" type="number" step="0.01"
                       class="bg-gray-50 border w-40 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       required/>
                <p class="flex text-lg">֏</p>
                <p class="w-16">({{ $t('square_meter') }})</p>
              </div>
            </div>
            <div class="flex flex-col gap-y-2">
              <a class="text-blue-500 hover:text-blue-700 underline cursor-pointer" target="_blank" :href="form.image">{{ $t('model') }}</a>
              <a class="text-blue-500 hover:text-blue-700 underline cursor-pointer" target="_blank" :href="form.parent_image">{{ $t('place_in_model') }}</a>
            </div>
            <button v-if="!loading" type="button" @click="store"
                    class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800">
              {{ $t('save') }}
            </button>
            <button v-else type="button"
                    class="text-white flex justify-center bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Modal} from "flowbite";
import vSelect from 'vue-select'
import api from "@/utils/api.js";
import {useToast} from "vue-toastification";
const toast = useToast();

export default {
  components: {vSelect},
  data() {
    return {
      modalObj: null,
      form: {
        building: null,
        floor: null,
        block: null,
        number: null,
        rooms: null,
        image: null,
        parent_image: null,
        square_meter: null,
        duplex: false,
        price: false,
      },
      image: null,
      parent_image: null,
      blocks: [],
      floors: [],
      loading: false,
    }
  },
  watch: {
    'form.building'() {
      if (!this.form.building) {
        this.blocks = [];
        this.floors = [];
        this.form.block = null;
        this.form.floor = null;
      } else {
        this.getBlocksByBuildingId();
        this.getFloorsByBuildingId();
      }
    }
  },
  props: ['buildings', 'apartment_id'],
  methods: {
    getBlocksByBuildingId() {
      api.get("buildings/" + this.form.building.id + "/blocks").then((response) => {
        this.blocks = response.data.data
      }).catch((response) => {
      })
    },
    getFloorsByBuildingId() {
      api.get("buildings/" + this.form.building.id + "/floors", {
        params: {
          type: 'residential'
        }
      }).then((response) => {
        this.floors = response.data.data
      }).catch((response) => {
      })
    },
    changeImage(event) {
      this.image = event.target.files[0];
      this.form.image = this.image;
    },
    changeParentImage(event) {
      this.parent_image = event.target.files[0];
      this.form.parent_image = this.parent_image;
    },
    store() {
      let error = false;
      if(!this.apartment_id) {
        Object.keys(this.form).map((key) => {
          if(!this.form[key]) {
            if(key !== 'parent_image' && key !== 'image' && key !== 'duplex') {
              error = true;
            }
          }
        })
      }
      if(error) {
        toast.error(this.$t('fill_all_fields_in_form'))
        return;
      }
      let formData = new FormData();
      formData.append('building_id', this.form.building.id);
      formData.append('block_id', this.form.block.id);
      formData.append('floor_id', this.form.floor.id);
      formData.append('number', this.form.number);
      formData.append('rooms', this.form.rooms);
      formData.append('square_meter', this.form.square_meter);
      formData.append('price', this.form.price);
      formData.append('duplex', this.form.duplex ? 1 : 0);
      if(this.image) {
        formData.append('image', this.image);
      }
      if(this.parent_image) {
        formData.append('parent_image', this.parent_image);
      }
      this.loading = true;
      let url = 'apartments';
      if(this.apartment_id) {
        url += '/' + this.apartment_id;
      }
      api.post(url, formData).then((response) => {
        toast.success(this.$t('apartment_created_successfully'));
        this.modalObj.hide()
        this.$emit('updateList')
        this.loading = false
      }).catch((response) => {
        this.loading = false
      })
    },

    getApartmentById() {
      api.get("apartments/"+this.apartment_id).then((response) => {
        this.form = response.data.data
      }).catch((response) => {
      })
    },
  },
  mounted() {
    this.modalObj = new Modal(document.getElementById('add-edit-apartment'), {
      placement: 'top-right',
      closable: true, backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40 modal-backdrop',
      onHide: () => {
        this.$parent.showAddEditApartment = false;
      },
    })
    this.modalObj.show();
    if(this.apartment_id) {
      this.getApartmentById();
    }
  }
}
</script>
