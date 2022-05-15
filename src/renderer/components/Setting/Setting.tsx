import React, { useCallback, useState } from 'react';
import { TimerActionTypes, TimerState } from '../Timer/action';
import styled from 'styled-components';
import { Button, Col, Icon, message, notification, Popconfirm, Row, Slider, Switch } from 'antd';
import { deleteAllUserData } from '../../monitor/sessionManager';
import { shell, ipcRenderer } from 'electron';
import { DistractingListModalButton } from './DistractingList';
import { isShallowEqualByKeys } from '../../utils';
import pkg from '../../../../package.json';
import { IpcEventName } from '../../../main/ipc/type';
import { refreshDbs } from '../../../main/db';

const Container = styled.div`
    padding: 12px 36px;
`;

const SliderContainer = styled.div`
    padding: 4px 24px;
`;

const ButtonWrapper = styled.div`
    margin: 0.6em;
`;

const Footer = styled.footer`
    border-top: 1px solid rgb(240, 240, 240);
    padding: 0.6rem 0;
    position: relative;
    margin: 0.8rem auto;
    width: 100%;
    text-align: center;
`;

const StyledIcon = styled(Icon)`
    font-size: 1.25rem;
    color: black;
    transition: color 0.1s;
    margin: 0 0.3rem;
    :hover {
        color: rgb(87, 80, 89);
    }
`;

const marks = {
    25: '25min',
    35: '35min',
    45: '45min',
    // 1: '1min',
    // 5: '5min',
    // 15: '15min',
    // 25: '25min',
};

const restMarks = {
    5: '5min',
    10: '10min',
};

const longBreakMarks = {
    10: '10min',
    15: '15min',
    20: '20min',
};

const settingUiStates = [
    'focusDuration',
    'restDuration',
    'autoUpdate',
    'longBreakDuration',
    'monitorInterval',
    'screenShotInterval',
    'useHardwareAcceleration',
    'startOnBoot',
    'distractingList',
];

interface Props extends TimerState, TimerActionTypes {}
export const Setting: React.FunctionComponent<Props> = React.memo(
    (props: Props) => {
        const [importing, setImporting] = useState(false);
        const [exporting, setExporting] = useState(false);
        const onChangeFocus = React.useCallback((v: number | [number, number]) => {
            if (v instanceof Array) {
                return;
            }

            props.setFocusDuration(v * 60);
        }, []);

        const onChangeRest = React.useCallback((v: number | [number, number]) => {
            if (v instanceof Array) {
                return;
            }

            props.setRestDuration(v * 60);
        }, []);

        const onChangeLongBreak = React.useCallback((v: number | [number, number]) => {
            if (v instanceof Array) {
                return;
            }

            props.setLongBreakDuration(v * 60);
        }, []);

        // const switchScreenshot = React.useCallback((v: boolean) => {
        //     if (v) {
        //         props.setScreenShotInterval(1000 * 60 * 5);
        //     } else {
        //         props.setScreenShotInterval(undefined);
        //     }

        //     notification.open({
        //         message: '重启应用来应用新的设置',
        //         description: 'Screenshot setting change needs restart to be applied',
        //         duration: 0,
        //         icon: <Icon type="warning" />,
        //     });
        // }, []);

        // const switchAutoUpdate = React.useCallback((v: boolean) => {
        //     props.setAutoUpdate(v);
        // }, []);

        // const setStartOnBoot = React.useCallback((v: boolean) => {
        //     props.setStartOnBoot(v);
        //     window.api.openAtLogin(v);
        // }, []);

        // const setUseHardwareAcceleration = useCallback((v: boolean) => {
        //     props.setUseHardwareAcceleration(v);
        //     notification.open({
        //         message: 'Restart App to Apply Changes',
        //         description: 'Hardware acceleration setting change needs restart to be applied',
        //         duration: 0,
        //         icon: <Icon type="warning" />,
        //     });
        // }, []);

        const onDeleteData = useCallback(() => {
            deleteAllUserData().then(() => {
                message.info('所有用户信息都已被删除，需要重启软件来应用更改。');
                setTimeout(() => {
                    ipcRenderer.send(IpcEventName.Restart);
                }, 3000);
            });
        }, [deleteAllUserData]);

        const onImportClick = useCallback(async () => {
            setImporting(true);
            await onImportData();
            setImporting(false);
        }, []);

        const onExportClick = useCallback(async () => {
            setExporting(true);
            await onExportData();
            setExporting(false);
        }, []);

        return (
            <Container>
                <h4>专注时长</h4>
                <SliderContainer>
                    <Slider
                        marks={marks}
                        step={1}
                        min={process.env.NODE_ENV === 'production' ? 20 : 2}
                        max={60}
                        value={props.focusDuration / 60}
                        onChange={onChangeFocus}
                    />
                </SliderContainer>

                <Row>
                    <Col span={12}>
                        <h4>短休息时间</h4>
                        <SliderContainer>
                            <Slider
                                marks={restMarks}
                                step={1}
                                min={process.env.NODE_ENV === 'production' ? 5 : 1}
                                max={20}
                                value={props.restDuration / 60}
                                onChange={onChangeRest}
                            />
                        </SliderContainer>
                    </Col>
                    <Col span={12}>
                        <h4>长休息时间</h4>
                        <SliderContainer>
                            <Slider
                                marks={longBreakMarks}
                                step={1}
                                min={10}
                                max={40}
                                value={props.longBreakDuration / 60}
                                onChange={onChangeLongBreak}
                            />
                        </SliderContainer>
                    </Col>
                </Row>
                {/* <span style={{ fontWeight: 500, fontSize: 14, color: 'rgba(0, 0, 0, 0.85)' }}>
                    硬件加速
                </span>
                <Switch
                    onChange={setUseHardwareAcceleration}
                    checked={props.useHardwareAcceleration}
                    style={{ margin: 8 }}
                />
                <br /> */}

                {/* <span style={{ fontWeight: 500, fontSize: 14, color: 'rgba(0, 0, 0, 0.85)' }}>
                    开机自启
                </span>
                <Switch
                    onChange={setStartOnBoot}
                    checked={props.startOnBoot}
                    style={{ margin: 8 }}
                />
                <br /> */}
                {/* <span style={{ fontWeight: 500, fontSize: 14, color: 'rgba(0, 0, 0, 0.85' }}>
                    Auto Update
                </span>
                <Switch
                    onChange={switchAutoUpdate}
                    checked={props.autoUpdate}
                    style={{ margin: 8 }}
                />
                <br /> */}

                {/* <span style={{ fontWeight: 500, fontSize: 14, color: 'rgba(0, 0, 0, 0.85' }}>
                    Screenshot
                </span>
                <Switch
                    onChange={switchScreenshot}
                    checked={!!props.screenShotInterval}
                    style={{ margin: 8 }}
                /> */}

                <h4>数据管理</h4>
                <ButtonWrapper>
                    <Button onClick={onExportClick} loading={exporting}>
                        导出数据
                    </Button>
                </ButtonWrapper>
                <ButtonWrapper>
                    <Popconfirm
                        title={'导入数据需要重启软件，是否继续？'}
                        onConfirm={onImportClick}
                    >
                        <Button loading={importing}>导入数据</Button>
                    </Popconfirm>
                </ButtonWrapper>
                <ButtonWrapper>
                    <Popconfirm title={'确定删除？'} onConfirm={onDeleteData}>
                        <Button type="danger">删除所有数据</Button>
                    </Popconfirm>
                </ButtonWrapper>
                {/* <h4>其他</h4> */}
                {/* <ButtonWrapper>
                    <Button onClick={openIssuePage}>Feedback</Button>
                    <br />
                </ButtonWrapper> */}
                {/* <ButtonWrapper>
                    <DistractingListModalButton />
                </ButtonWrapper> */}
                {/* <Footer style={{ position: 'fixed', bottom: 0, margin: 0, left: 0 }}>
                    Open Source @GitHub
                    <StyledIcon
                        type="github"
                        onClick={openGithubPage}
                        title="This project is open-source and hosted on GitHub"
                    />
                    Version v{pkg.version}
                </Footer> */}
            </Container>
        );
    },
    (prevProps, nextProps) => {
        return isShallowEqualByKeys(prevProps, nextProps, settingUiStates);
    }
);

async function onExportData() {
    await refreshDbs();
    await window.api.exportData();
}

async function onImportData() {
    await refreshDbs();
    await window.api.importData();
}

function openIssuePage() {
    shell.openExternal('https://github.com/zxch3n/PomodoroLogger/issues/new');
}

function openGithubPage() {
    shell.openExternal('https://github.com/zxch3n/PomodoroLogger');
}
