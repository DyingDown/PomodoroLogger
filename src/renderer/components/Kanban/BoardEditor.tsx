import React from 'react';
import { Button, Form, Input, Modal, Popconfirm, Tabs } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Hotkeys from 'react-hot-keys';
import { DistractingListModalButton } from '../Setting/DistractingList';
import { EditorContainer } from './style/editorStyle';
import formatMarkdown from './Card/formatMarkdown';
import { Markdown } from './style/Markdown';

const { TabPane } = Tabs;

interface FormProps {
    boardId: string;
    onSave?: any;
    onCancel?: any;
    form: any;
    visible: boolean;
    isCreating: boolean;
    onDelete: () => void;
    nameValidator: (name: string) => boolean;
}

interface State {
    showMarkdownPreview: boolean;
    isCreating: boolean;
    description: string;
}

export const EditKanbanForm = Form.create<
    FormProps & {
        wrappedComponentRef: any;
    }
>({
    name: 'form_in_modal',
})(
    class extends React.Component<FormProps, State> {
        constructor(props: FormProps) {
            super(props);
            this.state = {
                showMarkdownPreview: true,
                isCreating: false,
                description: '',
            };
        }

        componentDidMount() {
            this.setDescriptionState();
        }

        private onKeydown = (e: React.KeyboardEvent<any>) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                if (e.ctrlKey || e.shiftKey || e.altKey) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.props.onSave();
                }
            }
        };

        setDescriptionState = () => {
            this.setState({ description: this.props.form.getFieldValue('description') || '' });
        };

        static getDerivedStateFromProps(nextProps: FormProps, prevState: State) {
            const nextState = { description: nextProps.form.getFieldValue('description') || '' };
            if (nextProps.isCreating !== prevState.isCreating) {
                Object.assign(nextState, {
                    isCreating: nextProps.isCreating,
                    showMarkdownPreview: !nextProps.isCreating,
                });
            }

            return nextState;
        }

        validator = (rule: any, name: string, callback: Function) => {
            if (!this.props.isCreating || this.props.nameValidator(name)) {
                callback();
                return;
            }
            callback(`Board "${name}" already exists`);
        };

        onTabChange = (key: string) => {
            const toPreview = key === 'preview';
            if (toPreview) {
                this.setDescriptionState();
            }

            this.setState({ showMarkdownPreview: toPreview });
        };

        render() {
            const { visible, onSave, form, isCreating, onDelete, boardId, onCancel } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title={isCreating ? '创建一个新的看板' : '编辑'}
                    okText={isCreating ? '创建' : '保存'}
                    onCancel={onCancel}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    onOk={onSave}
                    style={{ minWidth: 300 }}
                    width={'60vw'}
                >
                    <EditorContainer>
                        <Form layout="vertical" onKeyDown={this.onKeydown}>
                            <Form.Item label="名字">
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '看板需要输入名字！',
                                        },
                                        { max: 48, message: '名字最长48位' },
                                        { validator: this.validator },
                                    ],
                                })(<Input onKeyDown={this.onKeydown} />)}
                            </Form.Item>
                            <Tabs
                                onChange={this.onTabChange}
                                type="card"
                                activeKey={this.state.showMarkdownPreview ? 'preview' : 'edit'}
                                style={{ marginBottom: 10, minHeight: 120 }}
                            >
                                <TabPane tab="编辑" key="edit">
                                    {getFieldDecorator('description')(
                                        <TextArea
                                            autosize={{ minRows: 3, maxRows: 5 }}
                                            onKeyDown={this.onKeydown}
                                        />
                                    )}
                                </TabPane>
                                <TabPane tab="预览" key="preview">
                                    <Markdown
                                        style={{
                                            padding: '0px 10px',
                                            border: '1px solid rgb(220, 220, 220)',
                                            borderRadius: 4,
                                            maxHeight: 'calc(100vh - 600px)',
                                            minHeight: 120,
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: formatMarkdown(this.state.description),
                                        }}
                                    />
                                </TabPane>
                            </Tabs>
                            {!isCreating ? (
                                <>
                                    <Form.Item>
                                        <Popconfirm title={'确定吗？'} onConfirm={onDelete}>
                                            <Button type={'danger'} icon={'delete'}>
                                                删除
                                            </Button>
                                        </Popconfirm>
                                    </Form.Item>
                                    <DistractingListModalButton boardId={boardId} />
                                </>
                            ) : undefined}
                        </Form>
                    </EditorContainer>
                </Modal>
            );
        }
    }
);
