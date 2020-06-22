<template>
  <div>
    <h1 class="title">{{ pageContent.title.value.ja }}</h1>
    <ValidationObserver v-slot="{ pristine, invalid, handleSubmit }" slim>
      <form
        v-if="!completed"
        :name="formValues['form-name']"
        data-netlify="true"
        data-netlify-honeypot="honeypot"
        @submit.prevent="handleSubmit(submit)"
      >
        <!-- To avoid error, insert hidden field that Netlify inserts, in advance -->
        <input
          :value="formValues['form-name']"
          type="hidden"
          name="form-name"
        />

        <!-- Trap spam submissions -->
        <input v-model="formValues.honeypot" name="honeypot" class="honeypot" />

        <ValidationProvider
          v-for="inputField of pageContent.inputFields"
          v-slot="{ failedRules }"
          :key="inputField.id"
          :rules="getValidationProviderRules(inputField.rules)"
          :tag="getValidationProviderTag(inputField.type)"
          class="form-item"
        >
          <span>{{ inputField.label.value.ja }}</span>

          <!-- When editing -->
          <template v-if="!confirming">
            <!-- Radio buttons and check boxes -->
            <template v-if="isRadioOrCheckbox(inputField)">
              <label
                v-for="(option, i) of inputField.options"
                :key="`${inputField.name}-${i}`"
                :class="inputField.type"
              >
                <input
                  v-model="formValues[inputField.name]"
                  :name="inputField.name"
                  :value="option.value"
                  :checked="option.selected"
                  :disabled="option.disabled"
                  :type="inputField.type"
                />
                <span v-if="option.label">{{ option.label.value.ja }}</span>
              </label>
            </template>

            <!-- Select boxes -->
            <template v-else-if="isSelect(inputField)">
              <select
                v-model="formValues[inputField.name]"
                :name="inputField.name"
                class="select"
              >
                <option
                  v-for="(option, i) of inputField.options"
                  :key="`${inputField.name}-${i}`"
                  :value="option.value"
                  :selected="option.selected"
                  :disabled="option.disabled"
                >
                  {{ option.label.value.ja }}
                </option>
              </select>
            </template>

            <!-- Textarea -->
            <template v-else-if="isTextarea(inputField)">
              <textarea
                v-model="formValues[inputField.name]"
                :name="inputField.name"
                class="textarea"
              />
            </template>

            <!-- Text boxes -->
            <template v-else>
              <input
                v-model="formValues[inputField.name]"
                :name="inputField.name"
                type="text"
                class="text"
              />
            </template>

            <!-- Errors -->
            <span v-if="failedRules.required">
              {{ inputFieldErrorRequiredText.value.ja }}
            </span>
            <span v-if="failedRules.email">
              {{ inputFieldErrorEmailText.value.ja }}
            </span>
            <span v-if="failedRules.max">
              {{ inputFieldErrorMaxText.value.ja }}
            </span>
            <span v-if="failedRules.min">
              {{ inputFieldErrorMinText.value.ja }}
            </span>
          </template>

          <!-- When confirming -->
          <template v-else>
            <span v-if="isTextOrTextarea(inputField)">
              {{ formValues[inputField.name] }}
            </span>
            <template v-else-if="isSingleOptionCheckbox(inputField)">
              <span v-if="formValues[inputField.name]">
                {{ inputFieldCheckboxYesText.value.ja }}
              </span>
              <span v-else>
                {{ inputFieldCheckboxNoText.value.ja }}
              </span>
            </template>
            <span v-else>
              {{
                getOptionLabelText(inputField, formValues[inputField.name])
                  .value.ja
              }}
            </span>
          </template>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ failedRules }"
          rules="is_true"
          tag="div"
          class="form-item"
        >
          <template v-if="!confirming">
            <label class="checkbox">
              <!-- Input that name attribute is omitted, is not shown in Netlify -->
              <input v-model="formValues.agreement" type="checkbox" />
              <span v-html="agreementOptionText.value.ja" />
            </label>
            <span v-if="failedRules.is_true">
              {{ inputFieldErrorRequiredText.value.ja }}
            </span>
          </template>
        </ValidationProvider>

        <button
          v-show="confirming"
          :disabled="pristine || invalid"
          type="submit"
        >
          {{ sendText.value.ja }}
        </button>
        <button
          :disabled="pristine || invalid"
          type="button"
          @click="toggleConfirming"
        >
          <template v-if="!confirming">{{ confirmText.value.ja }}</template>
          <template v-else>{{ editText.value.ja }}</template>
        </button>
      </form>

      <div v-else>
        <h2>{{ completedHeadingText.value.ja }}</h2>
        <p>{{ completedBodyText.value.ja }}</p>
        <NuxtLink to="/">{{ completedIndexText.value.ja }}</NuxtLink>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import { stringify } from 'querystring'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { getPageContent } from '~/assets/js/pages-fetcher'
import { postContactValues } from '~/assets/js/contact-fetcher'
import { createHead } from '~/assets/js/head-creator'
import {
  isCheckbox,
  isSelect,
  isTextarea,
  isRadioOrCheckbox,
  isRadioOrSelect,
  isTextOrTextarea,
  isSingleOptionCheckbox,
  createDefaultValue
} from '~/assets/js/input-fields-utility'

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },

  async asyncData({ route }) {
    const pageContent = await getPageContent(route.name)
    const formValues = {
      'form-name': 'contact',
      honeypot: '',
      agreement: false
    }
    for (const inputField of pageContent.inputFields) {
      formValues[inputField.name] = createDefaultValue(inputField)
    }
    return {
      pageContent,
      formValues
    }
  },

  data() {
    return {
      confirming: false,
      completed: false
    }
  },

  computed: {
    inputFieldErrorRequiredText() {
      const id = 'input-field-error-required'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    inputFieldErrorEmailText() {
      const id = 'input-field-error-email'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    inputFieldErrorMaxText() {
      const id = 'input-field-error-max'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    inputFieldErrorMinText() {
      const id = 'input-field-error-min'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    agreementOptionText() {
      const id = 'page-contact-agreement-option'
      return this.pageContent.richText.find((text) => text.id === id)
    },
    confirmText() {
      const id = 'page-contact-confirm'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    editText() {
      const id = 'page-contact-edit'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    sendText() {
      const id = 'page-contact-send'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    completedHeadingText() {
      const id = 'page-contact-completed-heading'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    completedBodyText() {
      const id = 'page-contact-completed-body'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    completedIndexText() {
      const id = 'page-contact-completed-index'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    inputFieldCheckboxYesText() {
      const id = 'input-field-checkbox-yes'
      return this.pageContent.plainText.find((text) => text.id === id)
    },
    inputFieldCheckboxNoText() {
      const id = 'input-field-checkbox-no'
      return this.pageContent.plainText.find((text) => text.id === id)
    }
  },

  methods: {
    isCheckbox,
    isSelect,
    isTextarea,
    isRadioOrCheckbox,
    isRadioOrSelect,
    isTextOrTextarea,
    isSingleOptionCheckbox,

    getValidationProviderTag(inputFieldType) {
      return ['radio', 'checkbox'].includes(inputFieldType) ? 'div' : 'label'
    },

    getValidationProviderRules(inputFieldRules) {
      if (!inputFieldRules) return ''
      const ruleList = []
      if (inputFieldRules.required) ruleList.push('required')
      if (inputFieldRules.email) ruleList.push('email')
      if (inputFieldRules.max != null)
        ruleList.push(`max:${inputFieldRules.max}`)
      if (inputFieldRules.min != null)
        ruleList.push(`min:${inputFieldRules.min}`)
      return ruleList.join('|')
    },

    getOptionLabelText(inputField, formValue) {
      const option = inputField.options.find(
        (option) => option.value === formValue
      )
      return option.label
    },

    toggleConfirming() {
      this.confirming = !this.confirming
    },

    async submit() {
      const stringifiedValues = stringify({ ...this.formValues })
      await postContactValues(stringifiedValues)
      this.completed = true
    }
  },

  head() {
    return createHead(
      `${this.pageContent.title.value.ja} | ${this.$siteDataContent.title.value.ja}`,
      this.pageContent.description.value.ja,
      this.$siteDataContent.ogImage.value.url,
      `${process.env.NUXT_ENV_BASE_URL}${this.$route.path}`
    )
  }
}
</script>

<style lang="scss" scoped>
.honeypot {
  border: 0;
  padding: 0;
  display: block;
  width: 0;
  height: 0;
  appearance: none;
}
.form-item {
  display: block;
}
.radio {
  display: flex;
}
.checkbox {
  display: flex;
}
</style>
