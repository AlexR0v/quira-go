import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils.ts";
import { Calendar } from "@/components/ui/calendar.tsx";

interface Props {
    value: Date | undefined
    onChange: (value: Date) => void
    className?: string
    placeholder?: string
    isFilter?: boolean
}

export const DatePicker = ({ value, onChange, className, placeholder = "Выберите дату" }: Props) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="lg"
                    className={cn(
                        "w-full justify-start text-left font-normal px-3",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 w-4 h-4"/>
                    {value ? format(value, "dd.MM.yyyy") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    locale={ru}
                    mode="single"
                    selected={value}
                    onSelect={date => date && onChange(new Date(new Date(date).setHours(0, 0, 0, 0)) as Date)}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}