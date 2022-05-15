import { connect } from 'react-redux';

import { Kanban } from './Kanban';
import { RootState } from '../../reducers';
import { KanbanActionTypes, actions } from './action';
import { TimerActionTypes, actions as timerActions } from '../Timer/action';
import { actions as boardActions, BoardActionTypes } from './Board/action';
import { genMapDispatchToProp } from '../../utils';

const mapStateToProps = (state: RootState) => {
    return {
        ...state.kanban,
        timerManager: state.timer.timerManager,
        isFocusingOnChosenBoard: state.timer.boardId === state.kanban.kanban.chosenBoardId,
        isTimerRunning: state.timer.isRunning && state.timer.isFocusing,
    };
};

const mapDispatchToProps = genMapDispatchToProp<
    KanbanActionTypes & BoardActionTypes & TimerActionTypes
>({
    ...actions,
    ...boardActions,
    ...timerActions,
});
export default connect(mapStateToProps, mapDispatchToProps)(Kanban);
