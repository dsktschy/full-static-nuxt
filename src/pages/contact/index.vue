<template>
  <div class="page-contact">
    <h1>{{ $t(pageContent.title.id) }}</h1>

    <ValidationObserver v-slot="{ pristine, invalid, handleSubmit }" slim>
      <form
        v-if="!completed"
        :name="formValues['form-name']"
        :data-netlify="dataNetlifyValue"
        :data-netlify-honeypot="dataNetlifyHoneypotValue"
        @submit.prevent="handleSubmit(submit)"
      >
        <!-- To avoid error, insert hidden field that Netlify inserts, in advance -->
        <input
          :value="formValues['form-name']"
          type="hidden"
          name="form-name"
        />

        <!-- Trap spam submissions -->
        <input
          v-model="formValues.honeypot"
          :name="honeypotName"
          class="honeypot"
        />

        <ValidationProvider
          v-for="inputFieldContent of allInputFieldContents"
          v-slot="{ failedRules }"
          :key="inputFieldContent.id"
          :rules="createValidationProviderRules(inputFieldContent)"
          :tag="createValidationProviderTag(inputFieldContent)"
          class="form-item"
        >
          <span>{{ $t(inputFieldContent.label.id) }}</span>

          <!-- When editing -->
          <template v-if="!confirming">
            <!-- Radio buttons and check boxes -->
            <template v-if="isRadioOrCheckbox(inputFieldContent)">
              <label
                v-for="(option, i) of inputFieldContent.options"
                :key="`${inputFieldContent.name}-${i}`"
                :class="inputFieldContent.type"
              >
                <input
                  v-model="formValues[inputFieldContent.name]"
                  :name="inputFieldContent.name"
                  :value="option.value"
                  :checked="option.selected"
                  :disabled="option.disabled"
                  :type="inputFieldContent.type"
                />
                <span v-if="option.label">{{ $t(option.label.id) }}</span>
              </label>
            </template>

            <!-- Select boxes -->
            <template v-else-if="isSelect(inputFieldContent)">
              <select
                v-model="formValues[inputFieldContent.name]"
                :name="inputFieldContent.name"
                class="select"
              >
                <option
                  v-for="(option, i) of inputFieldContent.options"
                  :key="`${inputFieldContent.name}-${i}`"
                  :value="option.value"
                  :selected="option.selected"
                  :disabled="option.disabled"
                >
                  {{ $t(option.label.id) }}
                </option>
              </select>
            </template>

            <!-- Textarea -->
            <template v-else-if="isTextarea(inputFieldContent)">
              <textarea
                v-model="formValues[inputFieldContent.name]"
                :name="inputFieldContent.name"
                class="textarea"
              />
            </template>

            <!-- Text boxes -->
            <template v-else>
              <input
                v-model="formValues[inputFieldContent.name]"
                :name="inputFieldContent.name"
                type="text"
                class="text"
              />
            </template>

            <!-- Errors -->
            <span v-if="failedRules.required">
              {{ $t('input-field-error-required') }}
            </span>
            <span v-if="failedRules.email">
              {{ $t('input-field-error-email') }}
            </span>
            <span v-if="failedRules.max">
              {{
                $t('input-field-error-max', { n: inputFieldContent.rules.max })
              }}
            </span>
            <span v-if="failedRules.min">
              {{
                $t('input-field-error-min', { n: inputFieldContent.rules.min })
              }}
            </span>
          </template>

          <!-- When confirming -->
          <template v-else>
            <span v-if="isTextOrTextarea(inputFieldContent)">
              {{ formValues[inputFieldContent.name] }}
            </span>
            <template v-else-if="isSingleOptionCheckbox(inputFieldContent)">
              <span v-if="formValues[inputFieldContent.name]">
                {{ $t('input-field-checkbox-yes') }}
              </span>
              <span v-else>
                {{ $t('input-field-checkbox-no') }}
              </span>
            </template>
            <span v-else>{{
              $t(
                getOptionLabelTextId(
                  inputFieldContent,
                  formValues[inputFieldContent.name]
                )
              )
            }}</span>
          </template>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ failedRules }"
          rules="is_true"
          tag="div"
          class="form-item"
        >
          <template v-if="!confirming">
            <div class="checkbox">
              <!-- Input that name attribute is omitted, is not shown in Netlify -->
              <input v-model="formValues.agreement" type="checkbox" />
              <div
                ref="agreementOption"
                v-html="$t('page-contact-agreement-option')"
              />
            </div>
            <div v-if="failedRules.is_true">
              {{ $t('input-field-error-required') }}
            </div>
          </template>
        </ValidationProvider>

        <button
          v-show="confirming"
          :disabled="pristine || invalid"
          type="submit"
        >
          {{ $t('page-contact-send') }}
        </button>
        <button
          :disabled="pristine || invalid"
          type="button"
          @click="toggleConfirming"
        >
          <template v-if="!confirming">{{
            $t('page-contact-confirm')
          }}</template>
          <template v-else>{{ $t('page-contact-edit') }}</template>
        </button>
      </form>

      <div v-else>
        <h2>{{ $t('page-contact-completed-heading') }}</h2>
        <p>{{ $t('page-contact-completed-body') }}</p>
        <NuxtLink :to="localePath('/')">{{
          $t('page-contact-completed-index')
        }}</NuxtLink>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { getSiteDataContent } from '~/model/content/site-data.ts'
import {
  getAllPartialPageContents,
  getPageContent
} from '~/model/content/pages.ts'
import {
  getAllInputFieldContents,
  isCheckbox,
  isSelect,
  isTextarea,
  isRadioOrCheckbox,
  isRadioOrSelect,
  isTextOrTextarea,
  isSingleOptionCheckbox,
  createDefaultValue,
  createValidationProviderTag,
  createValidationProviderRules,
  getOptionLabelTextId
} from '~/model/content/input-fields.ts'
import { postContactValues } from '~/model/form/contact.ts'
import { createHead } from '~/utilities/index.ts'

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },

  async asyncData({ app }) {
    // For global
    const allPartialPageContents = await getAllPartialPageContents()

    // For page
    const siteDataContent = await getSiteDataContent()
    const routeName = app.getRouteBaseName()
    const pageContent = await getPageContent(routeName)
    const allInputFieldContents = await getAllInputFieldContents()
    const formValues = {
      'form-name': 'contact',
      honeypot: '',
      agreement: false
    }
    for (const inputFieldContent of allInputFieldContents) {
      formValues[inputFieldContent.name] = createDefaultValue(inputFieldContent)
    }

    return {
      siteDataContent,
      allPartialPageContents,
      pageContent,
      allInputFieldContents,
      formValues
    }
  },

  data() {
    return {
      confirming: false,
      completed: false,
      honeypotName: 'honeypot'
    }
  },

  computed: {
    dataNetlifyValue() {
      return process.env.NUXT_ENV_FORM_API_DIR_NAME === 'netlify'
        ? 'true'
        : null
    },

    dataNetlifyHoneypotValue() {
      return process.env.NUXT_ENV_FORM_API_DIR_NAME === 'netlify'
        ? this.honeypotName
        : null
    }
  },

  created() {
    // Assign value to global
    this.$navState.allPartialPageContents = this.allPartialPageContents
  },

  mounted() {
    const elAnchor = this.$refs.agreementOption.querySelector('a')
    elAnchor.addEventListener('click', this.goToPrivacyPage)
  },

  methods: {
    isCheckbox,
    isSelect,
    isTextarea,
    isRadioOrCheckbox,
    isRadioOrSelect,
    isTextOrTextarea,
    isSingleOptionCheckbox,
    createValidationProviderTag,
    createValidationProviderRules,
    getOptionLabelTextId,

    toggleConfirming() {
      this.confirming = !this.confirming
    },

    async submit() {
      await postContactValues(this.formValues)
      this.completed = true
    },

    goToPrivacyPage(event) {
      event.preventDefault()
      this.$router.push(this.localePath('/privacy'))
    }
  },

  head() {
    const siteTitle = this.$t(this.siteDataContent.title.id)
    return createHead(
      `${this.$t(this.pageContent.title.id)} | ${siteTitle}`,
      this.$t(this.pageContent.description.id),
      this.siteDataContent.ogImage.value.url,
      `${process.env.NUXT_ENV_BASE_URL}${this.$route.path}`
    )
  }
}
</script>

<style lang="scss" scoped>
.page-contact {
  width: 764px;
  margin: 0 auto;
}
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
