import { Story } from './type';

export const timerStories: Story[] = [
    {
        name: 'start-timer',
        useMask: true,
        pointerTargetSelector: '#start-timer-button',
        hint: 'Click this to start the count-down timer.',
        hasConfirm: false
    },
    {
        name: 'pause-timer',
        useMask: true,
        pointerTargetSelector: '#start-timer-button',
        pointerDirection: Math.PI / 2,
        hasConfirm: false,
        hint: 'Click again to pause'
    },
    {
        name: 'clear-timer',
        useMask: true,
        pointerTargetSelector: '#clear-timer-button',
        hasConfirm: true,
        hint: 'You can reset the timer here'
    },
    {
        name: 'focus-selector',
        useMask: true,
        pointerTargetSelector: '#focus-selector',
        pointerDirection: Math.PI / 2,
        hasConfirm: true,
        hint: 'Every Pomodoro record will be linked to the Kanban which you are focusing on'
    },
    {
        name: 'switch-mode',
        useMask: true,
        pointerTargetSelector: '#timer-mode',
        hasConfirm: true,
        hint: 'There are focus sessions and rest sessions. You can click mode to switch them.'
    }
    // {
    //     name: 'more-in-timer',
    //     useMask: true,
    //     pointerTargetSelector: '#more-timer-button',
    //     hasConfirm: true,
    //     hint: 'Click this button to see visualizations charts'
    // }
];

export const kanbanStories: Story[] = [
    {
        name: 'kanban',
        useMask: true,
        pointerTargetSelector: '.ant-tabs-nav div:nth-child(2)',
        pointerDirection: Math.PI / 2,
        hint: "Let's switch to Kanban board",
        hasConfirm: false
    },
    {
        name: 'introduction',
        useMask: false,
        hint:
            'Kanban is a workflow management method designed to visualize your work. ' +
            'This is the overview page of all the kanban boards.',
        hasConfirm: true
    },
    {
        name: 'create-board',
        useMask: true,
        hint: "让我们新建一个看板吧！",
        hasConfirm: false,
        pointerTargetSelector: '#create-kanban-button',
        pointerDirection: Math.PI / 2
    },
    {
        name: 'create-board',
        useMask: false,
        hint: "让我们新建一个看板吧！",
        hasConfirm: true,
        pointerTargetSelector: '.ant-btn-primary'
    },
    {
        name: 'enter-kanban',
        useMask: true,
        pointerTargetSelector: '.kanban-brief-card',
        hint: "Let's visit this Kanban!",
        hasConfirm: false
    },
    {
        name: 'intro',
        useMask: false,
        hasConfirm: true,
        hint: '一个看板自带三个列表: 待完成的, 正在进度中和已完成. '
    },
    {
        name: 'intro',
        useMask: false,
        hasConfirm: true,
        hint: '每一个列表都有自己的卡片。 你可以创建一个新的卡片并且在列表里面移动它。'
    },
    {
        name: 'intro',
        useMask: true,
        hasConfirm: true,
        pointerTargetSelector: '#focused-list',
        pointerDirection: -Math.PI / 2,
        hint:
            // 'When focusing on this Kanban, the related Pomodoro records will be add to the cards ' +
            // 'from In Progress list'
            ''
    },
    {
        name: 'intro',
        useMask: true,
        hasConfirm: false,
        pointerTargetSelector: '.kanban-card',
        hint: ""
        // hint: "Let's go to card configure page"
    },
    {
        name: 'intro',
        useMask: false,
        hasConfirm: true,
        hint:
            // 'Pomodoro Logger enables you to manage your time accurately. ' +
            // 'It will track your exact focusing time on this task.' +
            // "Once you set your estimation, it's able to rate your estimation.",
            '',
        dialogPosition: { left: 24, bottom: 24 }
    }
];

export const allStories: Story[] = timerStories.concat(kanbanStories);
