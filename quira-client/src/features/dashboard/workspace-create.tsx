import {Button} from '@/components/ui/button.tsx'
import {Card, CardContent} from '@/components/ui/card.tsx'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form.tsx'
import {Input} from '@/components/ui/input.tsx'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {useWorkSpaceCreate} from "@/app/api/query-hooks/useWorkSpace.tsx";

const formSchema = z.object({
    name: z.string()
        .trim()
        .min(1, {message: 'Поле обязательно для заполнения'})
        .max(250, {message: 'Название должно быть не более 250 символов'}),
})

export const CreateWorkspace = () => {

    const {mutate, isPending} = useWorkSpaceCreate()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutate(values)
    }

    return (
        <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
            <CardContent className='p-7'>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Введите name'
                                            disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className='mt-3'/>
                        <Button
                            className='w-full'
                            disabled={isPending}
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}