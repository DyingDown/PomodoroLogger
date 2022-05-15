import { combineReducers } from 'redux';
import { actions as boardActions, boardReducer, KanbanBoardState } from './Board/action';
import { actions as listActions, listReducer } from './List/action';
import { actions as cardActions, cardReducer, CardsState } from './Card/action';
import {
    actions as overallActions,
    KanbanState as OKanbanState,
    reducer as kanbanReducer,
} from './action';
import { ListsState } from './type';
import { EqualKey } from '../../utils';

export const reducer = combineReducers({
    boards: boardReducer,
    lists: listReducer,
    cards: cardReducer,
    kanban: kanbanReducer,
});

export interface KanbanState {
    boards: KanbanBoardState;
    lists: ListsState;
    cards: CardsState;
    kanban: OKanbanState;
}

export const uiStateNames: EqualKey[] = [
    'boards',
    'lists',
    'cards',
    {
        kanban: ['sortedBy', 'chosenBoardId', 'isSearching', 'searchReg', 'configuringBoardId'],
    },
];

export const kanbanActions = {
    boardActions,
    listActions,
    cardActions,
    overallActions,
};

export type KanbanActionTypes = { [key in keyof typeof kanbanActions]: typeof kanbanActions[key] };
