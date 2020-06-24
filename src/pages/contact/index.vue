<template>
  <div class="page-contact">
    <h1>{{ $t(pageContent.title.id) }}</h1>

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
          <span>{{ $t(inputField.label.id) }}</span>

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
                <span v-if="option.label">{{ $t(option.label.id) }}</span>
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
                  {{ $t(option.label.id) }}
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
              {{ $t('input-field-error-required') }}
            </span>
            <span v-if="failedRules.email">
              {{ $t('input-field-error-email') }}
            </span>
            <span v-if="failedRules.max">
              {{ $t('input-field-error-max', { n: inputField.rules.max }) }}
            </span>
            <span v-if="failedRules.min">
              {{ $t('input-field-error-min', { n: inputField.rules.min }) }}
            </span>
          </template>

          <!-- When confirming -->
          <template v-else>
            <span v-if="isTextOrTextarea(inputField)">
              {{ formValues[inputField.name] }}
            </span>
            <template v-else-if="isSingleOptionCheckbox(inputField)">
              <span v-if="formValues[inputField.name]">
                {{ $t('input-field-checkbox-yes') }}
              </span>
              <span v-else>
                {{ $t('input-field-checkbox-no') }}
              </span>
            </template>
            <span v-else>{{
              $t(getOptionLabelText(inputField, formValues[inputField.name]).id)
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
import { stringify } from 'querystring'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { getPageContent } from '~/assets/js/pages-fetcher'
import { postContactValues } from '~/assets/js/contact-fetcher'
import { createHead } from '~/assets/js/head-creator'
import { createPageMessage } from '~/assets/js/message-creator'
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

  async asyncData({ app, route }) {
    const routeName = app.getRouteBaseName()
    const pageContent = await getPageContent(routeName)
    const messages = {}
    for (const locale of app.i18n.locales) {
      messages[locale] = createPageMessage(locale, pageContent)
    }
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
      formValues,
      messages
    }
  },

  data() {
    return {
      confirming: false,
      completed: false
    }
  },

  created() {
    // Running in fetch causes error in template
    // Because message ($t) has no fields until running mergeLocaleMessage
    for (const locale of this.$i18n.locales) {
      this.$i18n.mergeLocaleMessage(locale, this.messages[locale])
    }
  },

  mounted() {
    const elAnchor = this.$refs.agreementOption.querySelector('a')
    elAnchor.addEventListener('click', this.goToPrivacyPage)
  },

  beforeDestroy() {
    const elAnchor = this.$refs.agreementOption.querySelector('a')
    elAnchor.removeEventListener('click', this.goToPrivacyPage)
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
    },

    goToPrivacyPage(event) {
      event.preventDefault()
      this.$router.push(this.localePath('/privacy'))
    }
  },

  head() {
    const siteTitle = this.$t(this.$siteDataContent.title.id)
    return createHead(
      `${this.$t(this.pageContent.title.id)} | ${siteTitle}`,
      this.$t(this.pageContent.description.id),
      this.$siteDataContent.ogImage.value.url,
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
