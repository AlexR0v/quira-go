import {z} from "zod";
import {useWorkSpaceDelete, useWorkSpaceUpdate} from "@/app/api/query-hooks/useWorkSpace.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChangeEvent, useEffect, useRef} from "react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {ArrowLeftIcon, CopyIcon, ImageIcon} from "lucide-react";
import {useToast} from "@/hooks/use-toast.ts";
import {useNavigate} from "react-router";
import {TWorkspace} from "@/models/worksapce.ts";
import {useConfirm} from "@/hooks/use-confirm.tsx";
import {generateInviteCode} from "@/lib/utils.ts";

interface Props {
    onCancel?: () => void
    initialValues: TWorkspace
}

const formSchema = z.object({
    name: z.string()
        .trim()
        .min(1, {message: 'Поле обязательно для заполнения'})
        .max(250, {message: 'Название должно быть не более 250 символов'})
        .optional(),
    image: z.string()
        .transform(value => value === "" ? undefined : value)
        .optional(),
})

const getBase64 = (file: File) => new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error);
})

export const EditWorkspaceForm = ({onCancel, initialValues}: Props) => {

    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const {toast} = useToast()
    const {mutateAsync, isPending} = useWorkSpaceUpdate()
    const {mutateAsync: deleteMutateAsync, isPending: deleteIsPending} = useWorkSpaceDelete()
    const [DeleteModal, confirmDelete] = useConfirm(
        "Удалить рабочее пространство?",
        "Это действие нельзя будет отменить. Вы уверены?",
        "destructive",
    )
    const [ResetInviteCodeModal, confirmResetInviteCode] = useConfirm(
        "Изменить пригласительную ссылку?",
        "Это действие нельзя будет отменить. Вы уверены?",
        "destructive",
    )

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...initialValues
        },
    })

    useEffect(() => {
        form.setValue("name", initialValues.name)
        form.setValue("image", initialValues.image)
    }, [initialValues]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {

        mutateAsync({...values, id: initialValues.id.toString()})
            .then(({data}) => {
                form.reset()
                navigate(`/workspaces/${data.id}`)
            })
    }

    const handleDelete = async () => {
        const ok = await confirmDelete()
        if(!ok) return
        await deleteMutateAsync(initialValues.id.toString())
        window.location.href = "/"
    }

    const handleResetInviteCode = async () => {
        const ok = await confirmResetInviteCode()
        if(!ok) return
        await mutateAsync({
            id: initialValues.id.toString(),
            invite_code: generateInviteCode()
        })
    }

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    variant: 'destructive',
                    title: 'Ошибка',
                    description: 'Размер файла не должен превышать 5 МБ',
                })
                return
            }
            const img = await getBase64(file)
            form.setValue('image', img as string)
        }
    }

    const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.id}/join/${initialValues.invite_code}`

    return (
        <div className="flex flex-col gap-y-4">
            <DeleteModal/>
            <ResetInviteCodeModal/>
            <Card className='w-full h-full border-none shadow-none'>
                <CardHeader className="flex p-7 flex-row items-center gap-x-4 space-y-0">
                    <Button variant="secondary" size="sm" onClick={onCancel} type="button">
                        <ArrowLeftIcon className="size-4 mr-2"/>
                        Назад
                    </Button>
                    <CardTitle className="text-xl font-bold">
                        {initialValues.name}
                    </CardTitle>
                </CardHeader>
                <div className="px-7">
                    <Separator/>
                </div>
                <CardContent className="p-7">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <div className="flex flex-col gap-y-4">
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Название рабочего пространства</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Введите название'
                                                    disabled={isPending} {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='image'
                                    render={({field}) => (
                                        <div className="flex flex-col gap-y-2">
                                            <div className="flex items-center gap-x-5">
                                                {field.value ? (
                                                    <div className="size-[72px] relative rounded-md overflow-hidden">
                                                        <img
                                                            className="object-cover w-full"
                                                            src={field.value}
                                                            alt="img"
                                                        />
                                                    </div>
                                                ) : (
                                                    <Avatar className="size-[72px]">
                                                        <AvatarFallback>
                                                            <ImageIcon className="size-[36px] text-neutral-400"/>
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className="flex flex-col">
                                                    <p className="text-sm">Иконка рабочего пространства</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Формат: png, jpg, jpeg, svg. Максимальный размер - 5 МБ
                                                    </p>
                                                    <input
                                                        className="hidden"
                                                        accept=".png, .jpg, .jpeg, .svg"
                                                        type="file"
                                                        ref={inputRef}
                                                        disabled={isPending}
                                                        onChange={handleImageChange}
                                                    />
                                                    {field.value ? (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                form.setValue('image', '')
                                                                field.onChange('')
                                                                if (inputRef.current) {
                                                                    inputRef.current.value = ''
                                                                }
                                                            }}
                                                            disabled={isPending}
                                                            className="w-fit mt-2"
                                                        >
                                                            Удалить
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            type="button"
                                                            variant="light"
                                                            size="sm"
                                                            onClick={() => inputRef.current?.click()}
                                                            disabled={isPending}
                                                            className="w-fit mt-2"
                                                        >
                                                            Загрузить
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                />
                            </div>
                            <Separator className="my-7"/>
                            <div className="flex items-center justify-between">
                                <Button type="submit" className="w-full" size="lg" variant="primary"
                                        disabled={isPending}>
                                    Сохранить
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Card className=" w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Внимание!</h3>
                        <p className="text-sm text-muted-foreground">
                            Удаление рабочего пространства необратимо и приведет к удалению всех связанныхс ним данных.
                        </p>
                        <div className="py-7">
                            <Separator/>
                        </div>
                        <Button
                            className="w-fit ml-auto"
                            size="sm"
                            variant="destructive"
                            type="button"
                            disabled={deleteIsPending || isPending}
                            onClick={handleDelete}
                        >
                            Удалить Рабочее пространство
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className=" w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Приглашение участников</h3>
                        <p className="text-sm text-muted-foreground">
                            Используйте эту ссылку для приглашения участников в Рабочее пространство
                        </p>
                        <div className="mt-4">
                            <div className="flex items-center gap-x-2">
                                <Input disabled value={fullInviteLink}/>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(fullInviteLink).then(() =>
                                            toast({
                                                variant: 'success',
                                                title: 'Ссылка скопирована в буфер обмена',
                                            })
                                        )
                                    }}
                                    variant="secondary"
                                    className="size-12"
                                >
                                    <CopyIcon className="size-5"/>
                                </Button>
                            </div>
                        </div>
                        <div className="py-7">
                            <Separator/>
                        </div>
                        <Button
                            className="w-fit ml-auto"
                            size="sm"
                            variant="destructive"
                            type="button"
                            disabled={deleteIsPending || isPending}
                            onClick={handleResetInviteCode}
                        >
                            Изменить ссылку
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}