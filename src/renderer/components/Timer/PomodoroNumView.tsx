import * as React from 'react';
import { Col, Row } from 'antd';
import { PomodoroRecord } from '../../monitor/type';
import styled, { keyframes } from 'styled-components';
import { to2digits } from '../../utils';
import shortid from 'shortid';

const SvgDot = styled.svg`
    transition: transform 0.1s cubic-bezier(0.17, 0.67, 0.96, 0.59);
    :hover {
        transform: scale(1.2);
    }
`;

const Div = styled.div``;

const swayLeft = keyframes`
    0% { transform: translateX(-18px); }
    25% { transform: translateX(0px); } 
    75% { transform: translateX(0px); } 
    100% { transform: translateX(-18px); } 
`;

const swayRight = keyframes`
    0% { transform: translateX(0px); }
    25% { transform: translateX(0px); }
    50% { transform: translateX(18px); }
    75% { transform: translateX(0px); }
    100% { transform: translateX(0px); }
`;

const scale = keyframes`
  0% {
    transform: scale(1.1);
    opacity: 1;
  }
  
  30% {
    transform: scale(1.4);
    opacity: 0.7;
  }
  
  40% {
    transform: scale(1.6);
    opacity: 0.4;
  }
  
  50% {
    transform: scale(1.4);
    opacity: 0.7;
  }
  
  60% {
    transform: scale(1.6);
    opacity: 0.4;
  }
  
  65% {
    transform: scale(1.4);
    opacity: 0.7;
  }
  
  100% {
    transform: scale(1.1);
    opacity: 1;
  }

`;

const AnimeSvgDot = styled(SvgDot)`
    animation: ${scale} 1s linear infinite;
`;

const SwayLeftDot = styled(SvgDot)`
    animation: ${swayLeft} 1.2s linear infinite;
`;

const SwayRightDot = styled(SvgDot)`
    animation: ${swayRight} 1.2s linear infinite;
`;

interface Props {
    pomodoros: PomodoroRecord[];
    color?: string;
    showNum?: boolean;
    animation?: boolean;
    newPomodoro?: PomodoroRecord;
    chooseRecord?: (record: PomodoroRecord) => void;
    inline?: boolean;
}

interface State {
    transform: { x: number; y: number }[];
}

function getTime(date: number) {
    const d = new Date(date);
    return `${to2digits(d.getHours())}:${to2digits(d.getMinutes())}`;
}

export class PomodoroNumView extends React.PureComponent<Props> {
    state: State = { transform: [] };
    iFrame: number = 0;
    key: string;

    constructor(props: Props) {
        super(props);
        this.key = shortid.generate();
    }

    createDot = (
        v: PomodoroRecord,
        index: number,
        isNew: boolean = false,
        isRunning: boolean = false
    ) => {
        const { color = 'red', animation = false } = this.props;
        const { transform } = this.state;
        let Svg = isNew ? AnimeSvgDot : SvgDot;
        const n = this.props.pomodoros.length;
        if (!isNew && isRunning && n > 1) {
            if (index === 0) {
                Svg = SwayLeftDot;
            } else if (index === n - 1) {
                Svg = SwayRightDot;
            }
        }
        const chooseThis = this.props.chooseRecord ? () => this.props.chooseRecord!(v) : undefined;
        return (
            <Svg
                key={v._id + (isNew ? 'new' : '')}
                width="1em"
                height="1em"
                fill="currentColor"
                focusable="false"
                viewBox="0 0 100 100"
                style={{
                    margin: '0 0.1rem',
                    transition: 'transform 0.2s',
                    transitionTimingFunction: 'ease',
                    cursor: 'pointer',
                    transform:
                        animation && transform[index]
                            ? `translate(${transform[index].x}px, ${transform[index].y}px)`
                            : undefined,
                }}
            >
                <defs>
                    <circle
                        r={v.efficiency != null ? (1 - v.efficiency) * 48 : 0}
                        cx={50}
                        cy={50}
                        id={`dmusk${this.key + v._id}`}
                    />
                </defs>
                <mask id={`musk${this.key + v._id}`}>
                    <rect id="bg" x="0" y="0" width="100%" height="100%" fill="white" />
                    <use xlinkHref={`#dmusk${this.key + v._id}`} fill="Black" />
                </mask>
                <circle
                    r={50}
                    cx={50}
                    cy={50}
                    color={color}
                    mask={`url(#musk${this.key + v._id})`}
                    onClick={chooseThis}
                >
                    <title>
                        {(isNew ? '[New]' : getTime(v.startTime)) +
                            (v.efficiency != null
                                ? ` Efficiency: ${Math.round(v.efficiency * 100)}%`
                                : '')}
                    </title>
                </circle>
            </Svg>
        );
    };

    render() {
        const {
            showNum = true,
            pomodoros,
            newPomodoro,
            inline = false,
            animation = false,
        } = this.props;
        const dots = pomodoros.map((v, index) => this.createDot(v, index, false, animation));
        if (newPomodoro != null) {
            dots.push(this.createDot(newPomodoro, dots.length, true));
        }

        if (showNum) {
            return (
                <Row style={{ padding: 12 }}>
                    <Col span={4} style={{ lineHeight: '1em' }}>
                        <h4>{pomodoros.length}</h4>
                    </Col>
                    <Col span={20} style={{ color: 'red' }}>
                        {dots}
                    </Col>
                </Row>
            );
        }

        if (inline) {
            return <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>{dots}</div>;
        }
        return <Div style={{ padding: 12, display: 'flex', justifyContent: 'center' }}>{dots}</Div>;
    }
}
