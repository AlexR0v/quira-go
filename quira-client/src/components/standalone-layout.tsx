import logoText from "@/assets/logo-text.svg";
import { useNavigate } from "react-router";
import { UserButton } from "@/features/auth/components/user-button.tsx";
import * as React from "react";

interface Props {
    children: React.ReactNode
}

export const StandaloneLayout = ({ children }: Props) => {

    const navigate = useNavigate()

    return (
        <div className="bg-neutral-100 min-h-screen">
            <div className="mx-auto max-w-screen-2xl p-4">
                <div className="flex justify-between items-center h-[73px]">
                    <div onClick={() => navigate("/")}>
                        <img
                            src={logoText}
                            width={164}
                            height={48}
                            alt='logo'
                        />
                    </div>
                    <UserButton/>
                </div>
                <div className="flex flex-col items-center justify-center py-4">
                    {children}
                </div>
            </div>
        </div>
    )
}