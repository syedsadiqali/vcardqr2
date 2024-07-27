import { Form } from '@remix-run/react'
import { Button } from './ui/button'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { Input } from './ui/input'
import { useIsPending } from '#app/utils/misc.js'
import { Loader2 } from 'lucide-react'
import { useRef } from 'react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().max(256).email('Email address is not valid.'),
})

export function QrForm() {
  const inputRef = useRef<HTMLInputElement>(null)
  const isPending = useIsPending()

  const [emailForm, { email }] = useForm({
    constraint: getZodConstraint(LoginSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema })
    },
  })

  return (
    <div>
      <Form
        method="POST"
        autoComplete="off"
        className="flex w-full flex-col items-start gap-1"
        {...getFormProps(emailForm)}>
        {/* Security */}
        <AuthenticityTokenInput />
        <HoneypotInputs />

        <div className="flex w-full flex-col gap-1.5">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <Input
            placeholder="Email"
            ref={inputRef}
            defaultValue={''}
            className={`bg-transparent ${
              email.errors && 'border-destructive focus-visible:ring-destructive'
            }`}
            {...getInputProps(email, { type: 'email' })}
          />
        </div>

        {/* <div className="flex flex-col">
          {!authError && email.errors && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {email.errors.join(' ')}
            </span>
          )}
          {!authEmail && authError && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {authError.message}
            </span>
          )}
        </div> */}

        <Button type="submit" className="w-full">
          {isPending ? <Loader2 className="animate-spin" /> : 'Continue with Email please'}
        </Button>
      </Form>
    </div>
  )
}
