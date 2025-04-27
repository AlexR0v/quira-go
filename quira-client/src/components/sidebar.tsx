import logoText from "@/assets/logo-text.svg";
import {useNavigate} from "react-router";
import {Separator} from "@/components/ui/separator.tsx";
import {Navigation} from "@/components/navigation.tsx";
import {WorkspaceSwitcher} from "@/components/workspace-switcher.tsx";

export const Sidebar = () => {

    const navigate = useNavigate()

    return (
        <aside className="h-full bg-neutral-100 p-4 w-full">
            <div onClick={() => navigate("/")}>
                <img
                    src={logoText}
                    width={164}
                    height={48}
                    alt='logo'
                />
            </div>
            <Separator className="my-4"/>
            <WorkspaceSwitcher/>
            <Separator className="my-4"/>
            <Navigation/>
        </aside>
    )
}