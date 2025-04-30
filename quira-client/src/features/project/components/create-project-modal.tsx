import {ResponsiveModal} from "@/components/responsive-modal.tsx";
import {useCreateProjectModal} from "@/features/project/hooks/useCreateProjectModal.tsx";
import {CreateProjectForm} from "@/features/project/components/create-project-form.tsx";

export const CreateProjectModal = () => {

    const { isOpen, setIsOpen, close } = useCreateProjectModal()

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateProjectForm onCancel={close}/>
        </ResponsiveModal>
    )
}