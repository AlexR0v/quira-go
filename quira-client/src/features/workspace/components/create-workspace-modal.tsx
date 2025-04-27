import { ResponsiveModal } from "@/components/responsive-modal.tsx";
import { CreateWorkspaceForm } from "@/features/workspace/components/create-workspace-form.tsx";
import { useCreateWorkspaceModal } from "@/features/workspace/hooks/useCreateWorkspaceModal.tsx";

export const CreateWorkspaceModal = () => {

    const { isOpen, setIsOpen, close } = useCreateWorkspaceModal()

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateWorkspaceForm onCancel={close}/>
        </ResponsiveModal>
    )
}