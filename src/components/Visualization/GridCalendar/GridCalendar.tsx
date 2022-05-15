import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    transition: all 0.4s;
    g,
    rect {
        transition: all 0.4s;
    }
`;

const SvgContainer = styled.div`
    margin: 0;
    position: relative;
`;

const SvgText = styled.text`
    fill: #444;
    font-weight: 300;
`;

type Data = {
    [timestamp: number]: {
        count: number;
        hours: number;
    };
};

const monthList = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

interface GridData {
    month: number;
    day: number;
    week: number; // k-th week shown in the calendar; i.e. the number of the column
    count: number;
    date: number;
    year: number;
    spentHours: number;
}

interface Props {
    data: Data;
    width?: number;
    till?: string | number;
    shownWeeks?: number;
    clickDate?: (year: number, month: number, day: number) => void;
}

function getLastDayTimestamp(date: Date | string | number) {
    const d = new Date(date);
    const dateStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} 23:59:59`;
    return new Date(dateStr).getTime() + 1000;
}

function getGridData(data: Data, till: number, shownGrids: number): GridData[] {
    const firstDayTimestamp = till - shownGrids * 3600 * 1000 * 24;
    let grids = Array(shownGrids).fill(0);
    const timeSpent = Array(shownGrids).fill(0);
    for (const key in data) {
        const index = Math.floor((parseInt(key, 10) - firstDayTimestamp) / 3600 / 24 / 1000);
        grids[index] += data[key].count;
        timeSpent[index] += data[key].hours;
    }

    grids = grids.map((v, index) => {
        const date = new Date(firstDayTimestamp + index * 3600 * 1000 * 24);
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate(),
            week: Math.floor(index / 7),
            day: date.getDay(),
            count: v,
            spentHours: timeSpent[index],
        } as GridData;
    });
    return grids;
}

function getHoverInfo(data: GridData) {
    if (data.count === 0) {
        return `${data.count} pomodoros `;
    }

    return `${data.count} pomodoros (${data.spentHours.toFixed(1)}h) `;
}

export const GridCalendar = React.memo((props: Props) => {
    const [chosenIndex, setChosenIndex] = React.useState<undefined | number>(undefined);
    const { till = new Date(), width = 800, data, shownWeeks = 53 } = props;
    const tillTimestamp = getLastDayTimestamp(till);
    const day = (new Date(till).getDay() + 1) % 7;
    const shownGrids = (day === 0 ? 7 : day) + (shownWeeks - 1) * 7;
    const grids = React.useMemo(() => getGridData(data, tillTimestamp, shownGrids), [
        tillTimestamp,
        data,
        shownGrids,
    ]);
    const maxCountInADay = Math.max(5, Math.max(...grids.map((v) => v.count)));
    const axisMargin = 32;
    const innerWidth = width - axisMargin;

    const gridMargin = Math.floor((innerWidth / shownWeeks) * 0.1 + 2);
    const gridWidth = Math.floor(innerWidth / shownWeeks) - gridMargin;
    const gridHeight = gridWidth;
    const height = (gridWidth + gridMargin) * 7 + gridMargin;
    let toolTipTop = chosenIndex
        ? (gridMargin + gridWidth) * (grids[chosenIndex].day + 1.8) + axisMargin
        : 0;
    if (toolTipTop + 20 > height + axisMargin) {
        toolTipTop -= 70;
    }

    let tooltipPositionLeft = undefined;
    let maxWidth = 55 * (gridWidth + gridMargin) + axisMargin;
    if (chosenIndex) {
        tooltipPositionLeft = Math.min(
            (gridMargin + gridWidth) * grids[chosenIndex].week + axisMargin,
            maxWidth - 220
        );
    }
    const Tooltip = (
        <div
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                wordBreak: 'keep-all',
                color: 'white',
                position: 'absolute',
                transition: 'all 0.1s',
                left: tooltipPositionLeft,
                maxWidth: 160,
                top: toolTipTop,
                padding: '8px 8px',
                borderRadius: 4,
                zIndex: 10,
                overflow: 'hidden',
                textOverflow: 'clip',
                display: chosenIndex ? undefined : 'none',
                pointerEvents: 'none',
            }}
        >
            <span style={{ fontWeight: 700 }}>
                {chosenIndex != null ? getHoverInfo(grids[chosenIndex]) : ''}
            </span>
            <span style={{ fontWeight: 300, fontSize: '0.7em' }}>
                {chosenIndex != null
                    ? `${grids[chosenIndex].year}-${grids[chosenIndex].month}-${grids[chosenIndex].date}`
                    : ''}
            </span>
        </div>
    );

    const createRect = (v: GridData, index: number, chosen: boolean) => {
        const onEnter = () => setChosenIndex(index);
        const onClick = props.clickDate
            ? () => props.clickDate!(v.year, v.month, v.date)
            : undefined;
        return (
            <rect
                width={gridWidth}
                height={gridHeight}
                x={v.week * (gridWidth + gridMargin)}
                y={v.day * (gridWidth + gridMargin)}
                fill={`hsl(50, ${v.count === 0 ? '0%' : '60%'}, ${
                    92 - (v.count / maxCountInADay) * 70
                }%`}
                key={index}
                stroke={chosen ? 'rgb(200, 180, 240)' : ''}
                onMouseEnter={onEnter}
                onMouseLeave={() => index === chosenIndex && setChosenIndex(undefined)}
                onClick={onClick}
                style={{
                    cursor: props.clickDate ? 'pointer' : undefined,
                }}
            />
        );
    };

    let rects = React.useMemo(() => grids.map((v, index) => createRect(v, index, false)), [
        grids,
        gridWidth,
        gridMargin,
        gridHeight,
    ]);
    if (chosenIndex != null) {
        rects = rects.concat();
        rects[chosenIndex] = createRect(grids[chosenIndex], chosenIndex, true);
    }
    const weekdays = React.useMemo(
        () =>
            ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'].map((v, index) => {
                return (
                    <SvgText
                        x={axisMargin - gridMargin}
                        y={index * (gridWidth + gridMargin)}
                        key={index}
                        alignmentBaseline="hanging"
                        textAnchor="end"
                        style={{ fontSize: gridWidth }}
                    >
                        {v}
                    </SvgText>
                );
            }),
        [gridWidth, gridHeight, axisMargin, gridMargin]
    );

    const weekMonthMap: number[] = [];
    function getMonthText() {
        grids.forEach((v) => {
            weekMonthMap[v.week] = v.month;
        });
        const firstMonthWeekPair: [number, number][] = [];
        for (let i = 0; i < weekMonthMap.length - 1; i += 1) {
            const week = i;
            const month = weekMonthMap[week];
            if (week === 0 || weekMonthMap[week] !== weekMonthMap[week - 1]) {
                firstMonthWeekPair.push([month, week]);
            }
        }

        if (firstMonthWeekPair[1][1] - firstMonthWeekPair[0][1] < 2) {
            // avoid overlapping
            firstMonthWeekPair.splice(0, 1);
        }

        return firstMonthWeekPair.map((v) => (
            <SvgText
                x={v[1] * (gridWidth + gridMargin)}
                y={axisMargin - gridMargin * 2}
                key={v[1]}
                textAnchor="start"
                style={{ fontSize: gridWidth }}
            >
                {monthList[v[0] - 1]}
            </SvgText>
        ));
    }

    const onMouseLeave = React.useCallback(() => setChosenIndex(undefined), []);
    const monthText = getMonthText();
    maxWidth = weekMonthMap.length * (gridWidth + gridMargin) + axisMargin;
    const maxHeight = 7 * (gridMargin + gridHeight) + axisMargin;
    return (
        <Container>
            <SvgContainer onMouseLeave={onMouseLeave}>
                <svg width={maxWidth} height={maxHeight}>
                    <g transform={`translate(${axisMargin}, 0)`}>{monthText}</g>
                    <g transform={`translate(0, ${axisMargin})`}>{weekdays}</g>
                    <g transform={`translate(${axisMargin}, ${axisMargin})`}>{rects}</g>
                </svg>
            </SvgContainer>
            {Tooltip}
        </Container>
    );
});

GridCalendar.displayName = 'GridCalendar';
export default GridCalendar;
