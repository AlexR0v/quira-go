import { TTask, TUpdateTaskRequest } from "@/models/task"
import { Button } from "@/components/ui/button.tsx";
import { PencilIcon, SaveIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import { useTaskUpdate } from "@/app/api/query-hooks/useTasks.tsx";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea.tsx";

interface Props {
    data: TTask
}

export const TaskDescription = ({ data }: Props) => {

    const [isEdit, setIsEdit] = useState(false)
    const [description, setIsDescription] = useState("")

    const { mutateAsync, isPending } = useTaskUpdate()

    useEffect(() => {
        setIsDescription(data.description)
    }, [data]);

    const onSubmit = async () => {
        await mutateAsync({ ...data, id: data.id.toString(), description } as TUpdateTaskRequest)
        setIsEdit(false)
    }

    return (
        <div className="flex flex-col gap-y-4 col-span-1 h-full">
            <div className="bg-muted rounded-lg p-4 h-full">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Описание задачи
                    </p>
                    {isEdit ? (
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={onSubmit}
                        >
                            <SaveIcon className="size-4 mr-2"/>
                            {isPending ? "Сохранение..." : "Сохранить"}
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setIsEdit(true)}
                        >
                            <PencilIcon className="size-4 mr-2"/>
                            Редактировать
                        </Button>
                    )}
                </div>
                <Separator className="my-4"/>
                <div className="flex flex-col gap-y-4">
                    {isEdit ? (
                        <div>
                            <Textarea
                                value={description}
                                onChange={(e) => setIsDescription(e.target.value)}
                                rows={4}
                                disabled={isPending}
                                placeholder="Введите описание задачи..."
                            />
                        </div>
                    ) : (
                        <div>
                            {data.description || <span className="text-muted-foreground">Задача не имеет описания</span>}
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}