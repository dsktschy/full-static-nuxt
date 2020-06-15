<template>
  <div>
    <h1 class="title">{{ content.title.ja_jp }}</h1>
    <ValidationObserver v-slot="{ invalid, handleSubmit }" slim>
      <form
        v-if="!completed"
        :name="formValues['form-name']"
        data-netlify="true"
        @submit.prevent="handleSubmit(submit)"
      >
        <!-- To avoid error, insert hidden field that Netlify inserts, in advance -->
        <input
          :value="formValues['form-name']"
          type="hidden"
          name="form-name"
        />
        <ValidationProvider
          v-slot="{ failedRules }"
          rules="required"
          tag="label"
          class="form-item"
        >
          <div>Category:</div>
          <template v-if="!confirming">
            <select v-model="formValues.category" name="category">
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
            <input v-model="formValues.name" type="text" name="name" />
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
            <input v-model="formValues.email" type="email" name="email" />
            <p v-if="failedRules.required">Email is required</p>
            <p v-if="failedRules.email">Email must be a valid email</p>
          </template>
          <div v-else>{{ formValues.email }}</div>
        </ValidationProvider>

        <ValidationProvider rules="" tag="div" class="form-item">
          <div>Age:</div>
          <template v-if="!confirming">
            <label class="radio">
              <input
                v-model="formValues.age"
                type="radio"
                value="-20"
                name="age"
              />
              <div>-20</div>
            </label>
            <label class="radio">
              <input
                v-model="formValues.age"
                type="radio"
                value="20-40"
                name="age"
              />
              <div>20-40</div>
            </label>
            <label class="radio">
              <input
                v-model="formValues.age"
                type="radio"
                value="40-60"
                name="age"
              />
              <div>40-60</div>
            </label>
            <label class="radio">
              <input
                v-model="formValues.age"
                type="radio"
                value="60-"
                name="age"
              />
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
            <textarea v-model="formValues.message" name="message">
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
              <!-- Input that name attribute is omitted, is not shown in Netlify -->
              <input v-model="formValues.agreement" type="checkbox" />
              <div>Agree to our terms and conditions</div>
            </div>
            <p v-if="failedRules.is_true">Agreement is required</p>
          </template>
        </ValidationProvider>

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
        'form-name': 'contact',
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
      const stringifiedValues = stringify({ ...this.formValues })
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
