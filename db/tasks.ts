import { eventBus } from "@/utils/event-bus";
import { useEffect } from "react";
import { useSettingsRepository, useTaskRepository } from "./repositories";
import { IntervalUnit, SettingsKeys } from "./schema";

const multipliers = {
    [IntervalUnit.DAYS]: 1,
    [IntervalUnit.WEEKS]: 7,
    [IntervalUnit.MONTHS]: 30
}

export function DBInitialTasks() {
    const tasks = useTaskRepository();
    const settings = useSettingsRepository();

    const cleanTasks = async () => {
        const interval = parseInt(await settings.getValue(SettingsKeys.CLEAN_UP_INTERVAL, "1") as string);
        const intervalUnit = (await settings.getValue(SettingsKeys.CLEAN_UP_INTERVAL_UNIT, IntervalUnit.DAYS)) as IntervalUnit;

        const multiplier = multipliers[intervalUnit || IntervalUnit.DAYS];

        const date = Date.now() - (interval * 24 * 60 * 60 * multiplier);
        await tasks.deleteBefore(date);
        eventBus.emit("task.deleted", null);
    }

    useEffect(() => {
        cleanTasks();
        const unsuscribe = eventBus.subscribe("settings.updated", cleanTasks);
        return () => unsuscribe();
    }, []);
    return null;
}