import {GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill} from "react-icons/go"
import {SettingsIcon, UsersIcon} from "lucide-react";
import {useLocation, useNavigate, useParams} from "react-router";
import {cn} from "@/lib/utils.ts";

const routes = [
    {
        label: "Главная",
        path: "",
        icon: GoHome,
        activeIcon: GoHomeFill
    },
    {
        label: "Мои задачи",
        path: "/tasks",
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill
    },
    {
        label: "Настройки",
        path: "/settings",
        icon: SettingsIcon,
        activeIcon: SettingsIcon
    },
    {
        label: "Участники",
        path: "/members",
        icon: UsersIcon,
        activeIcon: UsersIcon
    },
]

export const Navigation = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const {id} = useParams()

    return (
        <ul className="flex flex-col">
            {routes.map(item => {
                const fullPath = `/workspaces/${id}${item.path}`
                const isActive = location.pathname === fullPath
                const Icon = isActive ? item.activeIcon : item.icon
                return (
                    <li key={item.path} onClick={() => navigate(fullPath)}>
                        <div className={cn(
                            "flex items-center gap-2.5 cursor-pointer p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                            isActive && "text-primary bg-white shadow-sm hover:opacity-100 [&>:first-child]:fill-neutral-500"
                        )}>
                            <Icon className="size-5 text-neutral-500"/>
                            {item.label}
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}