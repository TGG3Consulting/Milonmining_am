<template>
  <div id="add-edit-design" tabindex="-1" aria-hidden="true"
       class="bg-slate-800/25 fixed top-0 left-0 right-0 z-50 hidden w-full overflow-x-hidden overflow-y-auto md:inset-0 max-h-full">
    <div class="relative h-screen overflow-y-auto bg-white w-full max-w-4xl ">
      <div class="flex items-center justify-between p-5 rounded-t dark:border-gray-600">

        <p class="text-xl">{{ design_id ? $t('edit_design') : $t('new_design') }}</p>
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
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
              $t('name')
            }}</label>
          <input v-model="form.name" type="text"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required/>
        </div>
        <ImagePicker v-if="!design_id" @changeImages="changeImages"/>
        <div class="flex flex-col gap-y-2" v-else>
          <div class="flex flex-col gap-y-2">
            <label>{{ $t('add_new_image') }}</label>
            <input @change="addNewImage($event)" ref="newImageRef"
                   class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                   id="file_input" type="file">
          </div>
          <button v-if="form.images?.length" @click="showDesignImagesModal = true" type="button"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            {{ $t('see_current_images') }}
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
  <DesignImagesModal v-if="showDesignImagesModal"  v-bind:design_id="design_id" v-bind:images="form.images"/>
</template>

<script>
import {Modal} from "flowbite";
import ImagePicker from "@/components/ImagePicker.vue";
import DesignImagesModal from "@/views/houses/modals/DesignImagesModal.vue";
import api from "@/utils/api.js";
import {useToast} from "vue-toastification";
const toast = useToast();

export default {
  components: {DesignImagesModal, ImagePicker},
  data() {
    return {
      modalObj: null,
      form: {
        images: null
      },
      showDesignImagesModal: false,
      loading: false
    }
  },
  props: ['design_id', 'locales'],
  emits: ['updateList'],
  methods: {
    changeImages(images) {
      this.form.images = images
    },
    addNewImage(event) {
      let image = event.target.files?.[0]
      if(image) {
        const formData = new FormData();
        formData.append('image', image)
        api.post("designs/"+this.design_id+"/image", formData).then((response) => {
          toast.success(this.$t('image_created_successfully'));
          this.$refs.newImageRef.value = '';
          this.form.images.push(response.data.data);
        }).catch((response) => {
        })
      }
    },
    store() {
      let error = false;
      if (!this.form.name?.length) {
        toast.error(this.$t('name_required'));
        error = true;
      }
      if (!error) {
        const formData = new FormData();
        formData.append('name', this.form.name ?? '');
        if(!this.design_id) {
          (this.form.images || []).forEach((file, i) => {
            if (file) formData.append('images['+i+']', file.file);
          });
        }
        let url = 'designs';
        if(this.design_id) {
          url += '/'+this.design_id
        }
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
      api.get("designs/"+this.design_id).then((response) => {
        this.form = response.data.data
      }).catch((response) => {
      })
    },
  },
  mounted() {
    this.modalObj = new Modal(document.getElementById('add-edit-design'), {
      placement: 'top-right',
      closable: true, backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40 modal-backdrop',
      onHide: () => {
        this.$parent.showAddEditDesignModal = false;
      },
    })
    this.modalObj.show();
    if(this.design_id) {
      this.getDesignById();
    }
  }
}
</script>
