<template>
  <div id="add-edit-building" tabindex="-1" aria-hidden="true"
       class="bg-slate-800/25 fixed top-0 left-0 right-0 z-50 hidden w-full overflow-x-hidden overflow-y-auto md:inset-0 max-h-full">
    <div class="relative h-screen overflow-y-auto bg-white w-full max-w-4xl ">
      <div class="flex items-center justify-between p-5 rounded-t dark:border-gray-600">

        <p class="text-xl">{{ building_id ? $t('edit_building') : $t('new_building') }}</p>
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
        <ImagePicker v-if="!building_id" @changeImages="changeImages"/>
        <div class="flex flex-col gap-y-2" v-else>
          <div class="flex flex-col gap-y-2">
            <label>{{ $t('add_new_image') }}</label>
            <input @change="addNewImage($event)" ref="newImageRef"
                   class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                   id="file_input" type="file">
          </div>
          <button v-if="form.images?.length" @click="showBuildingImagesModal = true" type="button"
                   class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            {{ $t('see_current_images') }}
          </button>
        </div>
        <div class="flex gap-x-2">
          <!-- Start -->
          <label class="block">
            <span class="mb-1 block text-sm text-slate-600">{{ $t('start') }}</span>
            <input
                v-model="form.start_date"
                type="date"
                name="start_date"
                class="w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
               focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <!-- End -->
          <label class="block">
            <span class="mb-1 block text-sm text-slate-600">{{ $t('end') }}</span>
            <input
                v-model="form.end_date"
                type="date"
                name="end_date"
                class="w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
               focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
        </div>
        <div v-if="translationKeys?.length" class="p-2 bg-sky-100 flex flex-col gap-y-2">
          <div v-for="translationKey in form.translations">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
                $t(translationKey.key) + ' (' + translationKey.locale + ')'
              }}</label>
            <input v-model="translationKey.value" type="text"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   required/>
          </div>
        </div>
        <div class="flex flex-col gap-y-2">
          <p>{{ $t('entries') }}</p>
          <div v-for="(entry, index) in form.entries">
            <input v-if="!building_id" v-model="entry.name" :placeholder="$t('entry') + ' ' + (parseInt(index) + 1)" type="text"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   required/>
            <p v-else>{{ entry.name }}</p>
          </div>
          <button @click="newEntry" v-if="!building_id"
                  class="flex items-center text-sm justify-center px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
            <!-- Plus icon SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            {{ $t('new_entry') }}
          </button>
        </div>
        <div class="flex flex-col gap-y-2">
          <p>{{ $t('floors') }}</p>
          <div class="relative p-2 flex flex-col gap-y-2 bg-gray-200" v-for="(floor, index) in form.floors">
            <input :placeholder="floor.level" v-model="floor.level" type="number"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   required/>
            <select v-model="floor.type"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option v-for="type in floor_types" :value="type">{{ $t(type) }}</option>
            </select>
            <div class="flex gap-x-2">
              <div class="flex gap-x-2 items-center w-full">
                <input v-model="floor.price" :placeholder="$t('price')" type="number" step="0.01"
                       class="bg-gray-50 border w-40 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       required/>
                <p class="flex text-lg">֏</p>
                <p class="w-16">({{ $t('square_meter') }})</p>
              </div>
            </div>
            <div v-if="building_id" class="flex">
              <button v-if="!floor.loading" type="button" @click="updateFloorPrice(floor)"
                      class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800">
                {{ $t('save_price') }}
              </button>
              <button v-else type="button"
                      class="text-white flex justify-center bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800">
                <svg aria-hidden="true" class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
              </button>
            </div>

<!--            <div class="flex">-->
<!--              <input @change="changeFloorImage($event, index)"-->
<!--                     class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"-->
<!--                     type="file">-->
<!--            </div>-->
            <a target="_blank" class="text-blue-500 underline hover:text-blue-700" v-if="floor.model_image_path" :href="floor.model_image_path">{{ $t('see_current_image') }}</a>
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
        </div>

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
  <BuildingImagesModal v-if="showBuildingImagesModal" v-bind:building_id="building_id" v-bind:images="form.images"/>

</template>
<script>
import {Modal} from "flowbite";
import ImagePicker from "@/components/ImagePicker.vue";
import api from "@/utils/api.js";
import {useToast} from "vue-toastification";
import BuildingImagesModal from "@/views/buildings/modals/BuildingImagesModal.vue";

const toast = useToast();

export default {
  components: {BuildingImagesModal, ImagePicker},
  data() {
    return {
      modalObj: null,
      form: {
        start_date: null,
        end_date: null,
        translations: [],
        entries: [
          {
            name: null
          }
        ],
        images: null,
        floors: [
          {
            price: 0,
            model_image: null,
            type: null,
            level: null
          }
        ],
      },
      floor_types: [
        'garage',
        'corporate',
        'residential'
      ],
      showBuildingImagesModal: false,
      loading: false
    }
  },
  props: ['building_id', 'translationKeys', 'locales'],
  emits: ['updateList'],
  methods: {
    newEntry() {
      this.form.entries.push({
        name: null
      })
    },
    changeImages(images) {
      this.form.images = images
    },
    removeFloor(index) {
      this.form.floors.splice(index, 1);
    },
    changeFloorImage(event, index) {
      this.form.floors[index].model_image = event.target.files[0];
    },
    addNewImage(event) {
      let image = event.target.files?.[0]
      if(image) {
        const formData = new FormData();
        formData.append('image', image)
        api.post("buildings/"+this.building_id+"/image", formData).then((response) => {
          toast.success(this.$t('image_created_successfully'));
          this.$refs.newImageRef.value = '';
          this.form.images.push(response.data.data);
        }).catch((response) => {
        })
      }
    },
    newFloor() {
      this.form.floors.push({
        price: 0,
        model_image: null,
        type: null,
        level: null
      })
    },
    store() {
      let error = false;
      if (!this.form.start_date?.length || !this.form.end_date?.length) {
        toast.error(this.$t('start_and_end_date_required'));
        error = true;
      }
      this.form.translations.map((translation) => {
        if (!translation.value?.length) {
          toast.error('(' + translation.locale + ') ' + this.$t(translation.key + '_is_required'));
          error = true;
        }
      });
      this.form.entries.map((entry) => {
        if (!entry.name?.length) {
          toast.error(this.$t('entries_are_required'));
          error = true;
        }
      })
      this.form.floors.map((floor) => {
        if (!floor.type?.length) {
          toast.error(this.$t('floor_type_is_required'));
          error = true;
        }
      });
      if (!error) {
        const formData = new FormData();
        formData.append('start_date', this.form.start_date ?? '');
        formData.append('end_date',   this.form.end_date ?? '');
        if(!this.building_id) {
          (this.form.images || []).forEach((file, i) => {
            if (file) formData.append('images['+i+']', file.file);
          });
        }

        (this.form.translations || []).forEach((t, i) => {
          formData.append(`translations[${i}][locale]`, t?.locale ?? '');
          formData.append(`translations[${i}][key_id]`, t?.key_id ?? '');
          formData.append(`translations[${i}][value]`,  t?.value  ?? '');
        });

        (this.form.entries || []).forEach(b => {
          formData.append('blocks[]', b?.name ?? '');
        });
        (this.form.floors || []).forEach((f, i) => {
          formData.append(`floors[${i}][type]`,  f?.type  ?? '');
          formData.append(`floors[${i}][price]`, f?.price ?? 0);
          formData.append(`floors[${i}][level]`, f?.level ?? '');
          if (f?.model_image instanceof File) {
            formData.append(`floors[${i}][model_image]`, f.model_image);
          }
        });
        let url = 'buildings';
        if(this.building_id) {
          url += '/'+this.building_id
        }
        this.loading = true;
        api.post(url, formData).then((response) => {
          toast.success(this.$t('building_created_successfully'));
          this.modalObj.hide()
          this.$emit('updateList')
          this.loading = false
        }).catch((response) => {
          this.loading = false
        })
      }
    },
    getBuildingById() {
      api.get("buildings/"+this.building_id).then((response) => {
        this.form = response.data.data
      }).catch((response) => {
      })
    },
    updateFloorPrice(floor) {
      floor.loading = true;
      api.put("buildings/"+this.building_id+"/floors/"+floor.id+"/price", {
        price: floor.price
      }).then((response) => {
        toast.success(this.$t('floor_price_updated_successfully'));
        floor.loading = false;
      }).catch((response) => {
        toast.error(this.$t('something_went_wrong'));
        floor.loading = false;
      })
    },
  },
  mounted() {
    this.modalObj = new Modal(document.getElementById('add-edit-building'), {
      placement: 'top-right',
      closable: true, backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40 modal-backdrop',
      onHide: () => {
        this.$parent.showAddEditBuilding = false;
      },
    })
    this.modalObj.show();
    if(this.building_id) {
      this.getBuildingById();
    } else {
      this.locales.map((locale) => {
        this.translationKeys.map((translationKey) => {
          this.form.translations.push({
            locale: locale,
            key_id: translationKey.id,
            key: translationKey.key,
            value: null
          })
        })
      })
    }
  }
}
</script>