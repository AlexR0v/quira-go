import { TTask } from "@/models/task.ts";
import { ru } from "date-fns/locale"
import { Calendar, dateFnsLocalizer, NavigateAction, View } from "react-big-calendar";
import { addMonths, format, getDay, parse, startOfWeek as startOfWeekFn, subMonths } from "date-fns";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { EventCard } from "@/features/task/components/event-card.tsx";

const startOfWeek = (date: Date) => {
    return startOfWeekFn(date, { locale: ru });
};

const locales = {
    ru: ru
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

interface Props {
    data: TTask[]
}

export const DataCalendar = ({ data }: Props) => {

    const [value, setValue] = useState(data.length ? new Date(data[0].due_date) : new Date())

    const events = data.map(task => ({
        title: task.name,
        start: new Date(task.due_date),
        end: new Date(task.due_date),
        assignee_first_name: task.assignee_first_name,
        assignee_last_name: task.assignee_last_name,
        status: task.status,
        id: task.id
    }))

    const handleNavigate = (_newDate: Date, _view: View, action: NavigateAction) => {
        if (action === "PREV") {
            setValue(subMonths(value, 1))
        } else if (action === "NEXT") {
            setValue(addMonths(value, 1))
        } else {
            if (action === "TODAY") {
                setValue(new Date())
            }
        }
    }

    return (
        <Calendar
            localizer={localizer}
            date={value}
            events={events}
            views={["month"]}
            defaultView="month"
            toolbar
            showAllEvents
            className="h-full"
            max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
            formats={{
                weekdayFormat: (date, culture, localizer) =>
                    localizer?.format(date, "EEEEEE", culture) ?? "", // Пн, Вт...
                dayFormat: (date, culture, localizer) =>
                    localizer?.format(date, "d", culture) ?? "", // Цифра дня
                monthHeaderFormat: (date, culture, localizer) =>
                    localizer?.format(date, "LLLL yyyy", culture) ?? "", // Название месяца и год: Май 2025
                dayHeaderFormat: (date, culture, localizer) =>
                    localizer?.format(date, "EEEEEE", culture) ?? "", // Названия в шапке: Пн, Вт...
                dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                    `${localizer?.format(start, "d MMM", culture)} – ${localizer?.format(end, "d MMM", culture)}`,
            }}
            messages={{
                date: "Дата",
                time: "Время",
                event: "Задача",
                allDay: "Весь день",
                week: "Неделя",
                work_week: "Рабочая неделя",
                day: "День",
                month: "Месяц",
                previous: "Назад",
                next: "Вперёд",
                yesterday: "Вчера",
                tomorrow: "Завтра",
                today: "Сегодня",
                agenda: "Повестка дня",
                noEventsInRange: "Нет задач в этом диапазоне",
                showMore: (total) => `+ ещё ${total}`,
            }}
            onNavigate={handleNavigate}
            components={{
                eventWrapper: ({ event }) => (
                    <EventCard
                        title={event.title}
                        assignee_first_name={event.assignee_first_name}
                        assignee_last_name={event.assignee_last_name}
                        status={event.status}
                        id={event.id.toString()}
                    />
                )
            }}
        />
    )
}