<template>
  <div class="space-y-3">
    <!-- Upload button -->
    <div>
      <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-white text-sm hover:bg-slate-800"
          @click="open"
      >
        {{ $t('pick_images') }}
      </button>
      <input
          ref="inputEl"
          type="file"
          class="hidden"
          :name="name"
          :multiple="multiple"
          :accept="accept"
          @change="onChange"
      />
      <span v-if="files.length" class="ml-3 text-sm text-slate-500">
        Выбрано: {{ files.length }}
      </span>
    </div>

    <!-- Preview block -->
    <div v-if="files.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <div
          v-for="f in files"
          :key="f.id"
          class="rounded-lg border border-slate-200 p-2 flex items-center gap-3"
      >
        <img
            v-if="f.preview"
            :src="f.preview"
            alt=""
            class="h-16 w-16 rounded object-cover border"
        />
        <div class="min-w-0">
          <div class="truncate text-sm text-slate-700" :title="f.file.name">{{ f.file.name }}</div>
          <div class="text-xs text-slate-400">{{ prettySize(f.file.size) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImagePicker",
  props: {
    name: { type: String, default: "images[]" },
    accept: { type: String, default: "image/*" },
    multiple: { type: Boolean, default: true }
  },
  data() {
    return {
      files: [],
    }
  },
  emit: ['changeImages'],
  methods: {
    open() {
      this.$refs.inputEl.click()
    },
    onChange(e) {
      this.clearPreviews()

      const list = e.target.files
      if (!list) return

      Array.from(list).forEach(file => {
        const item = {
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
        }
        this.files.push(item)
      })
      this.$emit('changeImages', this.files)
      // leave <input> value intact for form submit
    },
    prettySize(bytes) {
      const units = ['B','KB','MB','GB']
      let i = 0, n = bytes
      while (n >= 1024 && i < units.length - 1) { n /= 1024; i++ }
      return `${n.toFixed(1)} ${units[i]}`
    },
    clearPreviews() {
      for (const f of this.files) {
        if (f.preview) URL.revokeObjectURL(f.preview)
      }
      this.files = []
    }
  },
  beforeUnmount() {
    this.clearPreviews()
  }
}
</script>
