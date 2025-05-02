import { ResponsiveModal } from "@/components/responsive-modal.tsx";
import { useEditTaskModal } from "@/features/task/hooks/use-edit-task-modal.tsx";
import { EditTaskForm } from "@/features/task/components/edit-task-form.tsx";
import { TTask } from "@/models/task.ts";

interface Props {
    tasks: TTask[]
}

export const EditTaskModal = ({tasks}:Props) => {

    const { taskId, close } = useEditTaskModal()

    return (
        <ResponsiveModal open={!!taskId} onOpenChange={close}>
            <EditTaskForm
                onCancel={close}
                initialValues={tasks.find(task => task.id.toString() === taskId)}
            />
        </ResponsiveModal>
    )
}