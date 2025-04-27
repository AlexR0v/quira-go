import {Button, ButtonProps} from "@/components/ui/button.tsx";
import {JSX, useState} from "react";
import {ResponsiveModal} from "@/components/responsive-modal.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";

export const useConfirm = (
    title: string,
    message: string,
    variant: ButtonProps['variant'] = "primary"
): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{ resolve: (v: boolean) => void } | null>(null);

    const confirm = () => {
        return new Promise(resolve => {
            setPromise({resolve})
        })
    }

    const handleClose = () => {
        setPromise(null)
    }

    const handleConfirm = () => {
        promise?.resolve(true)
        handleClose()
    }

    const handleCancel = () => {
        promise?.resolve(false)
        handleClose()
    }

    const ConfirmModal = () => {
        return (
            <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
                <Card className="w-full h-full border-none shadow-none">
                    <CardContent className="pt-8">
                        <CardHeader className="p-0">
                            <CardTitle>{title}</CardTitle>
                            <CardDescription>{message}</CardDescription>
                        </CardHeader>
                        <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
                            <Button onClick={handleCancel} variant="outline" size="sm" className="w-full lg:w-auto">
                                Отменить
                            </Button>
                            <Button onClick={handleConfirm} variant={variant} size="sm" className="w-full lg:w-auto">
                                Подтвердить
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </ResponsiveModal>
        )
    }

    return [ConfirmModal, confirm]
}