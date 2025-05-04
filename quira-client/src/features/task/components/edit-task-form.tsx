import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useParams } from "react-router";
import { createTaskSchema } from "@/features/task/schemas.ts";
import { useTaskUpdate } from "@/app/api/query-hooks/useTasks.tsx";
import { useMembersList } from "@/app/api/query-hooks/useMembers.tsx";
import { useProjectList } from "@/app/api/query-hooks/useProject.tsx";
import { Loader } from "@/components/ui/loader.tsx";
import { DatePicker } from "@/components/date-picker.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { MemberAvatar } from "@/features/members/components/member-avatar.tsx";
import { TaskStatus, TTask } from "@/models/task.ts";
import { ProjectAvatar } from "@/features/project/components/project-avatar.tsx";
import { useEffect } from "react";

interface Props {
    onCancel?: () => void
    initialValues?: TTask
}

export const EditTaskForm = ({ onCancel, initialValues }: Props) => {

    const { id, projectId } = useParams()

    const { data: members, isLoading: isLoadingMembers } = useMembersList({ size: 2000, page: 1 }, id)
    const { data: projects, isLoading: isLoadingProjects } = useProjectList({ size: 2000, page: 1 }, id)

    const { mutateAsync, isPending } = useTaskUpdate()

    const form = useForm<z.infer<typeof createTaskSchema>>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            name: '',
            project_id: projectId,
        },
    })

    useEffect(() => {
        if (initialValues) {
            form.setValue("name", initialValues.name)
            form.setValue("status", initialValues.status)
            form.setValue("project_id", initialValues.project_id)
            form.setValue("assignee_id", initialValues.assignee_id)
            form.setValue("due_date", new Date(initialValues.due_date))
        }
    }, [initialValues])

    const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
        const dueDate = values.due_date
        dueDate.setHours(0, 0, 0, 0)
        const dateToSend = new Date(dueDate.getTime() - dueDate.getTimezoneOffset() * 60000).toISOString()

        mutateAsync({
            ...values,
            workspace_id: id ?? "",
            due_date: dateToSend,
            id: initialValues?.id.toString() ?? "",
            position: initialValues?.position ?? 1000
        })
            .then(() => {
                form.reset()
                onCancel?.()
            })
    }

    if (isLoadingMembers || isLoadingProjects) {
        return <Loader/>
    }

    const membersOptions = members?.users.map((member) => ({
        first_name: member.first_name,
        last_name: member.last_name,
        value: member.id,
    }))

    const projectsOptions = projects?.projects.map((project) => ({
        label: project.name,
        value: project.id,
        image: project.image
    }))

    return (
        <Card className='w-full h-full border-none shadow-none'>
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Создать задачу
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Название задачи</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Введите заголовок задачи'
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='due_date'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Дата выполнения</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='assignee_id'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Исполнитель</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            disabled={isPending}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Выберите исполнителя"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage/>
                                            <SelectContent>
                                                {membersOptions?.map((member) => (
                                                    <SelectItem key={member.value} value={member.value.toString()}>
                                                        <div className="flex items-center gap-x-2">
                                                            <MemberAvatar className="size-6"
                                                                          firstName={member.first_name}
                                                                          lastName={member.last_name}/>
                                                            {member.first_name} {member.last_name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='status'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Статус</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            disabled={isPending}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Выберите статус"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage/>
                                            <SelectContent>
                                                <SelectItem value={TaskStatus.BACKLOG}>
                                                    Бэкдлог
                                                </SelectItem>
                                                <SelectItem value={TaskStatus.IN_PROGRESS}>
                                                    В процессе
                                                </SelectItem>
                                                <SelectItem value={TaskStatus.IN_REVIEW}>
                                                    В ревью
                                                </SelectItem>
                                                <SelectItem value={TaskStatus.TODO}>
                                                    К выполнению
                                                </SelectItem>
                                                <SelectItem value={TaskStatus.DONE}>
                                                    Выполнена
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='project_id'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Проект</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            disabled={isPending}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Выберите проект"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage/>
                                            <SelectContent>
                                                {projectsOptions?.map((priject) => (
                                                    <SelectItem key={priject.value} value={priject.value.toString()}>
                                                        <div className="flex items-center gap-x-2">
                                                            <ProjectAvatar className="size-6" image={priject.image}
                                                                           name={priject.label}/>
                                                            {priject.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator className="my-7"/>
                        <div className="flex items-center justify-between">
                            {onCancel && (
                                <Button type="button" size="lg" variant="secondary" onClick={onCancel}
                                        disabled={isPending}>
                                    Отмена
                                </Button>
                            )}
                            <Button type="submit" size="lg" variant="primary" disabled={isPending}>
                                Сохранить
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}