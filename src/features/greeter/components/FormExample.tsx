import { Button, Group, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const schema = z.object({
  name: z.string().nonempty('validation.required'),
  email: z
    .string()
    .email('validation.invalidEmail')
    .nonempty('validation.required'),
})

type FormValues = z.infer<typeof schema>

export function FormExample() {
  const { t } = useTranslation()
  const form = useForm<FormValues>({
    validate: zodResolver(schema.transform((vals) => vals)),
    initialValues: {
      name: '',
      email: '',
    },
  })

  const onSubmit = (values: FormValues) => {
    alert(JSON.stringify(values, null, 2))
  }

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="xs">
        <TextInput
          label={t('name')}
          placeholder="John Doe"
          withAsterisk
          {...form.getInputProps('name')}
          error={form.errors.name ? t(String(form.errors.name)) : undefined}
        />
        <TextInput
          label={t('email')}
          placeholder="john@example.com"
          withAsterisk
          {...form.getInputProps('email')}
          error={form.errors.email ? t(String(form.errors.email)) : undefined}
        />
        <Group justify="flex-end">
          <Button type="submit">{t('submit')}</Button>
        </Group>
      </Stack>
    </form>
  )
}
