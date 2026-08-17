<template>
  <div id="building-images" tabindex="-1" aria-hidden="true"
       class="bg-slate-800/25 fixed top-0 left-0 right-0 z-50 hidden w-full overflow-x-hidden overflow-y-auto md:inset-0 max-h-full">
    <div class="relative h-screen overflow-y-auto bg-white w-full max-w-4xl ">
      <div class="flex items-center justify-between p-5 rounded-t dark:border-gray-600">

        <p class="text-xl">{{ $t('building_images') }}</p>
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

      <div class="relative px-4 pb-8 flex flex-wrap gap-x-4 gap-y-4 dark:bg-gray-700">
        <div v-for="(image, index) in images" class="inline-flex relative rounded-lg overflow-hidden border border-slate-200">
          <button type="button" @click="changeMainImage(image.id)"
                  class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800">
            {{ $t('as_main') }}
          </button>
          <img
              :src="image.path"
              alt="Preview"
              class="block h-96 w-auto object-cover"
          />

          <!-- Top-right X button -->
          <button
              @click="removeImage(index)"
              type="button"
              class="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center
           rounded-full bg-red-600 text-white hover:bg-red-700 shadow
           focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Remove"
          >
            ×
          </button>
        </div>
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
  props: ['building_id', 'images'],
  data() {
    return {
      modalObj: null
    }
  },
  methods: {
    changeMainImage(id) {
      api.patch("buildings/"+this.building_id+"/images/"+id).then((response) => {
        toast.success(this.$t('main_image_successfully_updated'));
      }).catch((response) => {
      })
    },
    removeImage(index) {
      if(confirm(this.$t('are_you_sure'))) {
        api.delete("buildings/"+this.building_id+"/images/"+this.images[index].id).then((response) => {
          this.images.splice(index, 1)
        }).catch((response) => {
        })
      }

    }
  },
  mounted() {
    this.modalObj = new Modal(document.getElementById('building-images'), {
      placement: 'top-right',
      closable: true, backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40 modal-backdrop',
      onHide: () => {
        this.$parent.showBuildingImagesModal = false;
      },
    })
    this.modalObj.show();
  }
}
</script>