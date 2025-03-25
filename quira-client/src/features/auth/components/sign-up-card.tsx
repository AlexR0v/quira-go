import { Button }                                                         from '@/components/ui/button.tsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle }      from '@/components/ui/card.tsx'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input }                                                          from '@/components/ui/input.tsx'
import { Separator }                                                      from '@/components/ui/separator.tsx'
import { zodResolver }                                                    from '@hookform/resolvers/zod'
import { useForm }                                                        from 'react-hook-form'
import { Link }                                                           from 'react-router'
import { z }                                                              from 'zod'

const formSchema = z.object({
  email: z.string().email({ message: 'Неверный email' }),
  name: z.string().trim()
    .min(2, { message: 'Имя должно быть не менее 5 символов' })
    .max(50, { message: 'Име должно быть не более 250 символов' }),
  password: z.string()
    .min(5, { message: 'Пароль должен быть не менее 5 символов' })
    .max(250, { message: 'Пароль должен быть не более 250 символов' }),
})

export const SignUCard = () => {
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    //mutation.mutate(values as any)
  }
  
  return (
    <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
      <CardHeader className='flex items-center justify-center text-center p-7'>
        <CardTitle className='text-2xl'>Зарегистрироваться</CardTitle>
        <CardDescription className='pt-3'>
          Нажимая кнопку "Зарегистрироваться" вы соглашаетесь с нашими
          <Link to=''>{' '}
            <span className='text-blue-500'>условиями обработки персональных данных</span>
          </Link>{' '}и{' '}
          <Link to=''>
            <span className='text-blue-500'>политикой конфиденциальности</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className='pb-3'>
        <Separator />
      </div>
      <CardContent className='p-7'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder='Введите ваше имя' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Введите email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input placeholder='Введите пароль' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='mt-3' />
            <Button
              className='w-full'
              disabled={false}
            >
              Зарегистрироваться
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className='px-7'>
        <Separator />
      </div>
      <CardContent className='p-7 flex items-center justify-center'>
        Уже есть аккаунт?
        <Link
          to='/sign-in'
          className='text-blue-500 ml-2'
        >
          Войти
        </Link>
      </CardContent>
    </Card>
  )
}