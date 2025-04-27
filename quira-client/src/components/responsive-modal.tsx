import * as React from "react";
import { useMedia } from "react-use";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog.tsx";
import { Drawer, DrawerContent } from "@/components/ui/drawer.tsx";

interface Props {
    children: React.ReactNode
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const ResponsiveModal = ({children, open, onOpenChange}: Props) => {

    const isDesctop = useMedia("(min-width: 1024px)", true)

    if (isDesctop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTitle>{""}</DialogTitle>
                <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
                    {children}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DialogTitle>{""}</DialogTitle>
                <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
}