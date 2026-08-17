<template>
  <div id="add-edit-house" tabindex="-1" aria-hidden="true"
       class="bg-slate-800/25 fixed top-0 left-0 right-0 z-50 hidden w-full overflow-x-hidden overflow-y-auto md:inset-0 max-h-full">
    <div class="relative h-screen overflow-y-auto bg-white w-full max-w-4xl ">
      <div class="flex items-center justify-between p-5 rounded-t dark:border-gray-600">

        <p class="text-xl">{{ house_id ? $t('edit_house') : $t('new_house') }}</p>
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
          <label>{{ $t('design') }}</label>
          <vSelect
              class="vselect"
              v-model="form.design"
              label="name"
              track-by="key"
              :options="this.designs ?? []"
          />
        </div>
        <button v-if="form.design?.id" @click="showDesignImagesModal = true" type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          {{ $t('see_design_images') }}
        </button>
        <div v-for="translation in form.translations">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
              $t('address')
            }} ({{ translation.locale }})</label>
          <input v-model="translation.value" type="text"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required/>
        </div>
        <div class="flex flex-col gap-y-2">
          <label>{{ $t('terrace_size') }}</label>
          <input type="number" v-model="form.terrace_size" step="0.01"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required/>
        </div>
        <div class="flex flex-col gap-y-2">
          <label>{{ $t('plot_size') }}</label>
          <input type="number" v-model="form.plot_size" step="0.01"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required/>
        </div>
        <div class="flex flex-col gap-y-2">
          <label>{{ $t('type') }}</label>
          <vSelect
              class="vselect"
              v-model="form.type"
              label="name"
              track-by="key"
              :options="this.types"
          />
        </div>
        <div class="flex gap-x-2 items-center w-full">
          <input v-model="form.price" :placeholder="$t('price')" type="number" step="0.01"
                 class="bg-gray-50 border w-40 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required/>
          <p class="flex text-lg">֏</p>
        </div>
        <div class="relative p-2 flex flex-col gap-y-2 bg-gray-200" v-for="(floor, index) in form.floors">
          <input :placeholder="(parseInt(index) + 1)" disabled type="text"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required/>
          <div class="flex flex-col gap-y-2">
            <input @change="changeFloorImage($event, index)"
                   class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                   type="file">
            <a target="_blank" class="text-blue-500 underline hover:text-blue-700" v-if="floor.model_image_path" :href="floor.model_image_path">{{ $t('see_current_image') }}</a>
          </div>
          <div class="flex flex-col gap-y-2">
            <label>{{ $t('square_meter') }}</label>
            <input type="number" v-model="floor.square_meter" step="0.01"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   required/>
          </div>
          <button v-if="!floor.id && (form.floors.length - 1 === index)"
                  @click="removeFloor(index)"
                  type="button"
                  class="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center
           rounded-full bg-red-600 text-white hover:bg-red-700 shadow
           focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Remove"
          >
            ×
          </button>
        </div>
        <button @click="newFloor"
                class="flex items-center text-sm justify-center px-4 py-2 font-semibold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75">
          <!-- Plus icon SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          {{ $t('new_floor') }}
        </button>


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
  <DesignImagesModal v-if="showDesignImagesModal" v-bind:images="design.images" v-bind:design_id="form.design?.id" v-bind:without_remove="true"/>
</template>
<script>
import {Modal} from "flowbite";
import vSelect from "vue-select";
import api from "@/utils/api.js";
import DesignImagesModal from "@/views/houses/modals/DesignImagesModal.vue";
import {useToast} from "vue-toastification";
const toast = useToast();

export default {
  components: {DesignImagesModal, vSelect},
  data() {
    return {
      modalObj: null,
      loading: false,
      showDesignImagesModal: false,
      form: {
        translations: null,
        type: null,
        price: null,
        terrace_size: null,
        plot_size: null,
        floors: [
          {
            model_image: null,
            square_meter: null
          }
        ],
        design: null
      },
      types: [
        {
          name: this.$t('home'),
          key: 'home'
        },
        {
          name: this.$t('townhouse'),
          key: 'townhouse'
        }
      ],
      designs: null,
      design: {
        images: null,
        name: null
      }
    }
  },
  watch: {
    'form.design'() {
      if(this.form.design) {
        this.getDesignById();
      }
    }
  },
  emits: ['updateList'],
  props: ['house_id','locales'],
  methods: {
    newFloor() {
      this.form.floors.push({
        model_image: null,
        square_meter: null
      })
    },
    removeFloor(index) {
      this.form.floors.splice(index, 1);
    },
    changeFloorImage(event, index) {
      this.form.floors[index].model_image = event.target.files[0];
    },
    getDesigns() {
      api.get("designs").then((response) => {
        this.designs = response.data.data
      }).catch((response) => {
      })
    },
    store() {
      let error = false;
      this.form.translations.map((translation) => {
        if(!translation.value?.length) {
          toast.error(this.$t('address_required'));
          let error = true
        }
      })
      if (!this.form.design?.id) {
        toast.error(this.$t('design_required'));
        error = true;
      }
      if (!this.form.type?.key) {
        toast.error(this.$t('type_required'));
        error = true;
      }
      this.form.floors.map((floor) => {
        if(this.house_id) {
          if(!floor.square_meter) {
            toast.error(this.$t('fill_floor_square_meter'));
            error = true;
          }
        } else {
          if(!floor.square_meter) {
            toast.error(this.$t('fill_floor_fields'));
            error = true;
          }
        }

      });

      if(!error) {
        let url = 'houses';
        if(this.house_id) {
          url += '/'+this.house_id
        }
        const formData = new FormData();
        formData.append('design_id', this.form.design.id);
        formData.append('type', this.form.type.key);
        formData.append('price', this.form.price);
        formData.append('terrace_size', this.form.terrace_size);
        formData.append('plot_size', this.form.plot_size);
        (this.form.translations || []).forEach((t, i) => {
          formData.append(`translations[${i}][locale]`, t?.locale ?? '');
          formData.append(`translations[${i}][key]`, t?.key ?? '');
          formData.append(`translations[${i}][value]`,  t?.value  ?? '');
        });
        (this.form.floors || []).forEach((f, i) => {
          formData.append(`floors[${i}][square_meter]`, f?.square_meter ?? '');
          if (f?.model_image instanceof File) {
            formData.append(`floors[${i}][model_image]`, f.model_image);
          }
        });
        this.loading = true;
        api.post(url, formData).then((response) => {
          toast.success(this.$t('design_created_successfully'));
          this.modalObj.hide()
          this.$emit('updateList')
          this.loading = false
        }).catch((response) => {
          this.loading = false
        })
      }
    },
    getDesignById() {
      api.get("designs/"+this.form.design.id).then((response) => {
        this.design = response.data.data
      }).catch((response) => {
      })
    },
    getHouseById() {
      api.get("houses/"+this.house_id).then((response) => {
        this.form = response.data.data
        this.types.map((type) => {
          if(type.key === this.form.type) {
            this.form.type = type;
          }
        })
      }).catch((response) => {
      })
    },
  },
  mounted() {
    this.modalObj = new Modal(document.getElementById('add-edit-house'), {
      placement: 'top-right',
      closable: true, backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40 modal-backdrop',
      onHide: () => {
        this.$parent.showAddEditHouseModal = false;
      },
    })
    this.modalObj.show();
    this.getDesigns();
    if(this.house_id) {
      this.getHouseById();
    } else {
      this.form.translations = this.locales.map((locale) => {
        return {
          locale: locale,
          key: 'address',
          value: null
        }
      })
    }
  }
}
</script>