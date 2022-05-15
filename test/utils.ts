import { ApplicationSpentTime, PomodoroRecord } from '../src/renderer/monitor/type';
import { generateRandomName } from '../src/renderer/utils';

export function createRecord(
    name: string,
    time: number,
    appData: [string, number][]
): PomodoroRecord {
    const apps: Record<string, ApplicationSpentTime> = {};
    let index = 0;
    for (const [appName, value] of appData) {
        apps[appName] = {
            appName,
            screenStaticDuration: 0,
            spentTimeInHour: value,
            titleSpentTime: {}
        };

        index += 1;
    }

    return {
        apps,
        switchActivities: [],
        stayTimeInSecond: [],
        _id: generateRandomName(),
        screenStaticDuration: 0,
        startTime: new Date().getTime(),
        boardId: name,
        spentTimeInHour: time,
        switchTimes: 0
    };
}
