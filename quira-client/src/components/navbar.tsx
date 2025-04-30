import {UserButton} from "@/features/auth/components/user-button.tsx";

export const Navbar = () => {
    return (
        <nav className="w-full pt-4 px-6 flex items-center justify-between">
            <div className="flex-col hidden lg:flex">
                <h1 className="text-2xl font-semibold">Главная</h1>
                <p className="text-muted-foreground">
                    Отслеживай все свои Рабочие пространства и задачи
                </p>
            </div>
            <UserButton/>
        </nav>
    )
}