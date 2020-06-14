<template>
  <div>
    <h1 class="title">{{ content.title.ja_jp }}</h1>
    <ValidationObserver v-slot="{ invalid, handleSubmit }" slim>
      <form
        v-if="!completed"
        data-netlify="true"
        netlify-honeypot="honeypot"
        @submit.prevent="handleSubmit(submit)"
      >
        <input v-model="formValues.honeypot" name="honeypot" class="honeypot" />

        <ValidationProvider
          v-slot="{ failedRules }"
          rules="required"
          tag="label"
          class="form-item"
        >
          <div>Category:</div>
          <template v-if="!confirming">
            <select v-model="formValues.category">
              <option value="" disabled selected>--Please choose--</option>
              <option value="products">Products</option>
              <option value="recruitment">Recruitment</option>
              <option value="other">Other</option>
            </select>
            <p v-if="failedRules.required">Category is required</p>
          </template>
          <div v-else>{{ formValues.category }}</div>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ failedRules }"
          rules="required|max:256"
          tag="label"
          class="form-item"
        >
          <div>Name:</div>
          <template v-if="!confirming">
            <input v-model="formValues.name" type="text" />
            <p v-if="failedRules.required">Name is required</p>
            <p v-if="failedRules.max">
              Name may not be greater than 256 characters
            </p>
          </template>
          <div v-else>{{ formValues.name }}</div>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ failedRules }"
          rules="required|email"
          tag="label"
          class="form-item"
        >
          <div>Email:</div>
          <template v-if="!confirming">
            <input v-model="formValues.email" type="email" />
            <p v-if="failedRules.required">Email is required</p>
            <p v-if="failedRules.email">Email must be a valid email</p>
          </template>
          <div v-else>{{ formValues.email }}</div>
        </ValidationProvider>

        <ValidationProvider rules="" tag="div" class="form-item">
          <div>Age:</div>
          <template v-if="!confirming">
            <label class="radio">
              <input v-model="formValues.age" type="radio" value="-20" />
              <div>-20</div>
            </label>
            <label class="radio">
              <input v-model="formValues.age" type="radio" value="20-40" />
              <div>20-40</div>
            </label>
            <label class="radio">
              <input v-model="formValues.age" type="radio" value="40-60" />
              <div>40-60</div>
            </label>
            <label class="radio">
              <input v-model="formValues.age" type="radio" value="60-" />
              <div>60-</div>
            </label>
          </template>
          <div v-else>{{ formValues.age }}</div>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ failedRules }"
          rules="required"
          tag="label"
          class="form-item"
        >
          <div>Message:</div>
          <template v-if="!confirming">
            <textarea v-model="formValues.message">
            Input message.
          </textarea
            >
            <p v-if="failedRules.required">Message is required</p>
          </template>
          <div v-else>{{ formValues.message }}</div>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ failedRules }"
          rules="is_true"
          tag="label"
          class="form-item"
        >
          <template v-if="!confirming">
            <div class="checkbox">
              <input v-model="formValues.agreement" type="checkbox" />
              <div>Agree to our terms and conditions</div>
            </div>
            <p v-if="failedRules.is_true">Agreement is required</p>
          </template>
        </ValidationProvider>

        <div data-netlify-recaptcha="true" />

        <button v-show="confirming" :disabled="invalid" type="submit">
          Send
        </button>
        <button :disabled="invalid" type="button" @click="toggleConfirming">
          <template v-if="!confirming">Next</template>
          <template v-else>Back</template>
        </button>
      </form>
      <div v-else>
        <p>Thank you!</p>
        <NuxtLink to="/">Go to index page</NuxtLink>
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

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },

  async asyncData({ route }) {
    return {
      content: await getPageContent(route.name)
    }
  },

  data() {
    return {
      confirming: false,
      completed: false,
      formValues: {
        honeypot: '',
        category: '',
        name: '',
        email: '',
        age: '',
        message: '',
        agreement: false
      }
    }
  },

  methods: {
    toggleConfirming() {
      this.confirming = !this.confirming
    },

    async submit() {
      const stringifiedValues = stringify({
        'form-name': 'contact',
        ...this.formValues
      })
      await postContactValues(stringifiedValues)
      this.completed = true
    }
  },

  head() {
    return createHead(
      `${this.content.title.ja_jp} | ${this.$siteDataContent.title.ja_jp}`,
      this.content.description.ja_jp,
      this.$siteDataContent.ogImage.url,
      `${process.env.NUXT_ENV_BASE_URL}${this.$route.path}`
    )
  }
}
</script>

<style scoped>
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
