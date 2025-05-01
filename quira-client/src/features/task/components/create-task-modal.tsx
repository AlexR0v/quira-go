import { ResponsiveModal } from "@/components/responsive-modal.tsx";
import { useCreateTaskModal } from "@/features/task/hooks/useCreateTaskModal.tsx";
import { CreateTaskForm } from "@/features/task/components/create-task-form.tsx";

export const CreateTaskModal = () => {

    const { isOpen, setIsOpen, close } = useCreateTaskModal()

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateTaskForm onCancel={close}/>
        </ResponsiveModal>
    )
}