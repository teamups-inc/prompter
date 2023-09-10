'use client';

import { Col, Row, Select, Space, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button} from 'antd';
import { useState } from 'react';
import useMakeRequest from '@/utils/useMakeRequest';
import { 
    PromptCompletionRequestPayload, 
    PromptCompletionResponsePayload 
} from '@/app/api/prompt-completion/route';
import PromptOutputContent from './PromptOutputContent';
import { TSectionMutationOpFunction } from './PromptsPage';

export type TOutputRenderStyle = 'text' | 'json' | 'html';

interface IPromptOutputRenderOption {
    value: TOutputRenderStyle;
    label: string;
}

const PROMPT_ENDPOINT = '/api/prompt-completion';
const OPENAI_DEFAULT_MODEL = 'gpt-3.5-turbo';
const PROMPT_OUTPUT_RENDER_OPTIONS: IPromptOutputRenderOption[] = [
    { value: 'text', label: 'Text' },
    { value: 'json', label: 'JSON' },
    { value: 'html', label: 'HTML' },
];

interface Props {
    id: number;
    isDeleteEnabled: boolean;
    onClickAddSection: TSectionMutationOpFunction;
}

export default function PromptInputAndOutputSection(props: Props) {
    const { id, isDeleteEnabled, onClickAddSection } = props;
    
    const [promptInput, setPromptInput] = useState('');
    const [promptOutputStyle, setPromptOutputStyle] = useState<
        TOutputRenderStyle
    >('text');
    const [promptRequestData, makePromptRequest] = useMakeRequest<
        PromptCompletionRequestPayload,
        PromptCompletionResponsePayload
    >(PROMPT_ENDPOINT);

    const isPromptButtonDisabled = promptInput.length === 0;
    const onClickGenerateCompletion = () => {
        makePromptRequest(
            'POST', 
            { 
                prompt: promptInput, 
                open_ai_model: OPENAI_DEFAULT_MODEL 
            }
        );
    }
    
    return (
        <>
            <Row gutter={48} style={rowStyle}>
                <Col span={12}>
                    <h3 style={marginBottomStyle}>Prompt input</h3>
                    <TextArea 
                        autoSize={{ minRows: 4 }}
                        onChange={evt => setPromptInput(evt.target.value)}
                        placeholder='What are we prompting today?' 
                        style={marginBottomStyle}
                        value={promptInput}
                    />
                    <Button 
                        disabled={isPromptButtonDisabled}
                        ghost 
                        loading={promptRequestData.isLoading} 
                        onClick={onClickGenerateCompletion}
                        style={isPromptButtonDisabled ? disabledButtonStyle : undefined}
                    >
                        ✨ Generate completion
                    </Button>
                </Col>
                <Col span={12}>
                    <h3 style={marginBottomStyle}>Prompt output</h3>
                    <Select<TOutputRenderStyle>
                        style={{ width: 120, ...marginBottomStyle }}
                        onChange={promptOutputStyle => setPromptOutputStyle(promptOutputStyle)}
                        options={PROMPT_OUTPUT_RENDER_OPTIONS}
                        value={promptOutputStyle}
                    />
                    <PromptOutputContent
                        renderStyle={promptOutputStyle} 
                        promptOutputString={promptRequestData.data?.completion ?? ''}
                    />
                </Col>
                <Col span={24} style={addSectionButtonColStyle}>
                    <Space>
                        <Tooltip 
                            mouseEnterDelay={1}
                            placement='top' 
                            title='Add new section'
                        >
                            <Button 
                                ghost
                                icon={<PlusCircleOutlined />} 
                                onClick={() => onClickAddSection(id, 'add')}
                                shape='round' 
                                type='primary' 
                            />
                        </Tooltip>
                        {
                            isDeleteEnabled && <Tooltip
                                mouseEnterDelay={1}
                                placement='top' 
                                title='Delete section'
                            >
                                <Button 
                                    danger
                                    ghost
                                    icon={<DeleteOutlined />} 
                                    onClick={() => onClickAddSection(id, 'delete')}
                                    shape='round' 
                                    type='primary' 
                                />
                            </Tooltip>
                        }
                    </Space>
                </Col>
            </Row>
        </>
    )
}

const rowStyle: React.CSSProperties = {
    flex: 1,
    justifyContent: 'center',
};

const marginBottomStyle: React.CSSProperties = {
    marginBottom: 12,
};

const disabledButtonStyle: React.CSSProperties = {
    borderColor: 'grey',
    color: 'grey',
};

const addSectionButtonColStyle: React.CSSProperties = {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'center' 
}