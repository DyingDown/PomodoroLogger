import { PomodoroRecord } from '../renderer/monitor/type';
import { Counter } from './Counter';
import { Card } from '../renderer/components/Kanban/type';

export class Tokenizer {
    private rules: [string, RegExp][] = [
        ['appWithSuffix', /^((\w[\.-])?\w)+/],
        ['word', /^\w[\w-]*/],
        ['number', /^\d\d*\.?\d*/],
    ];

    private unwantedSymbol = /[%&\(\)（）,\{\}=+\!@#\$\^\*;:'"<>|\\\/]/;

    public tokenize(s: string): string[] {
        const ans = [];
        const ss = s.split(this.unwantedSymbol);
        for (let str of ss) {
            while (str.length) {
                let found = false;
                for (const [_, reg] of this.rules) {
                    const match = str.match(reg);
                    if (match != null) {
                        const matched = match.entries().next().value[1];
                        ans.push(matched);
                        str = str.slice(matched.length);
                        found = true;
                    }
                }

                if (!found) {
                    str = str.slice(1);
                }
            }
        }

        return ans;
    }
}

const CardTitleWeight = 2;
const CardContentWeight = 0.5;
export const getWeightsFromPomodoros = (
    records: PomodoroRecord[],
    cards: Card[] = [],
    targetMax: number = 56,
    targetMin: number = 8
): [string, number][] => {
    const tokenWeights = new Counter();
    const tokenizer = new Tokenizer();
    for (const record of records) {
        for (const app in record.apps) {
            const appRecord = record.apps[app];
            for (const title in appRecord.titleSpentTime) {
                const weight =
                    appRecord.titleSpentTime[title].normalizedWeight * record.spentTimeInHour;
                const tokens = tokenizer.tokenize(title);
                for (const token of tokens) {
                    tokenWeights.add(token, weight);
                }
            }
        }
    }

    for (const card of cards) {
        tokenizer
            .tokenize(card.title)
            .forEach((token) =>
                tokenWeights.add(token, card.spentTimeInHour.actual * CardTitleWeight)
            );
        tokenizer
            .tokenize(card.content)
            .forEach((token) =>
                tokenWeights.add(token, card.spentTimeInHour.actual * CardContentWeight)
            );
    }

    const weights = tokenWeights.getNameValuePairs({ topK: 100 });
    const max = weights.reduce((prev, cur) => Math.max(prev, cur.value), 0);
    let min = weights.reduce((prev, cur) => Math.min(prev, cur.value), 10000);
    if (max === min) {
        min = max - 1;
    }

    return weights.map((v) => [
        v.name,
        ((v.value - min) / (max - min)) * (targetMax - targetMin) + targetMin,
    ]);
};
