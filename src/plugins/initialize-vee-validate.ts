/**
 * VeeValidate doesn't come installed with any validation rule by default
 * So install with extend function
 */

import { extend } from 'vee-validate'
import { required, max, min, email } from 'vee-validate/dist/rules'

for (const entry of Object.entries({ required, max, min, email })) {
  extend(...entry)
}

// Rule for checkbox that must be true
extend('is_true', (value: boolean) => value === true)
