'use client';

import { Col, Row, Select, Space, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { CopyOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button} from 'antd';
import { useState } from 'react';
import useMakeRequest from '@/utils/useMakeRequest';
import { 
    PromptCompletionRequestPayload, 
    PromptCompletionResponsePayload 
} from '@/app/api/prompt-completion/route';
import PromptOutputContent from './PromptOutputContent';
import { TSectionCompletionFunction, TSectionMutationOpFunction } from './PromptsPage';
import PromptSectionTitle from './PromptSectionTitle';

export type TOutputRenderStyle = 'text' | 'json' | 'html';
interface IPromptOutputRenderOption {
    value: TOutputRenderStyle;
    label: string;
}

export type TOpenAIModel = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-32k' | 'gpt-4-1106-preview';
interface IOpenAIModelSelectOption {
    value: TOpenAIModel;
    label: string;
    cost_per_1k_tokens_usd: number;
}

export type TRequestCompletionResult = 'success' | 'error';

const PROMPT_ENDPOINT = '/api/prompt-completion';
const OPENAI_MODEL_OPTIONS: IOpenAIModelSelectOption[] = [
    {
        value: 'gpt-3.5-turbo',
        label: 'gpt-3.5-turbo',
        cost_per_1k_tokens_usd: 0.0015,
    },
    { 
        value: 'gpt-4', 
        label: 'gpt-4',
        cost_per_1k_tokens_usd: 0.03,
    },
    { 
        value: 'gpt-4-32k', 
        label: 'gpt-4-32k',
        cost_per_1k_tokens_usd: 0.06,
    },
    { 
        value: 'gpt-4-1106-preview', 
        label: 'gpt-4-turbo',
        cost_per_1k_tokens_usd: 0.01,
    },
];
const OPEN_AI_DEFAULT_MODEL: TOpenAIModel = 'gpt-4-1106-preview';
const PROMPT_OUTPUT_RENDER_OPTIONS: IPromptOutputRenderOption[] = [
    { value: 'text', label: 'Text' },
    { value: 'json', label: 'JSON' },
    { value: 'html', label: 'HTML' },
];

export interface InitialSectionProps {
    label: string;
    promptInput: string;
    renderStyle: TOutputRenderStyle;
    openAIModel: TOpenAIModel;
}

interface Props {
    id: number;
    initialProps?: InitialSectionProps;
    isDeleteEnabled: boolean;
    onClickAddSection: TSectionMutationOpFunction;
    onCompleteRequest: TSectionCompletionFunction;
}

export default function PromptInputAndOutputSection(props: Props) {
    const { 
        id, 
        isDeleteEnabled, 
        onClickAddSection, 
        onCompleteRequest, 
        initialProps 
    } = props;
    
    const [promptInput, setPromptInput] = useState(
        initialProps?.promptInput ?? ''
    );
    const [promptTitle, setPromptTitle] = useState(
        initialProps?.label ?? ''
    );
    const [promptOutputStyle, setPromptOutputStyle] = useState<
        TOutputRenderStyle
    >(
        initialProps?.renderStyle ?? 'text'
    );
    const [openAIModel, setOpenAIModel] = useState<
        TOpenAIModel
    >(
        initialProps?.openAIModel ?? OPEN_AI_DEFAULT_MODEL
    );
    const [isRequestComplete, setIsRequestComplete] = useState(false);
    const [promptRequestData, makePromptRequest] = useMakeRequest<
        PromptCompletionRequestPayload,
        PromptCompletionResponsePayload
    >(PROMPT_ENDPOINT);

    const onRequestComplete = (requestResult: TRequestCompletionResult) => {
        setIsRequestComplete(true);
        onCompleteRequest(id, requestResult);
    }
    const onClickGenerateCompletion = () => {
        makePromptRequest(
            'POST', 
            { 
                prompt: promptInput, 
                open_ai_model: openAIModel 
            },
            onRequestComplete
        );
    }

    const isPromptButtonDisabled = promptInput.length === 0
        || isRequestComplete;
    const isTextAreaDisabled = isRequestComplete
        || promptRequestData.isLoading;
    const isModelSelectorDisabled = isRequestComplete
        || promptRequestData.isLoading;

    const openAIModelDetails = OPENAI_MODEL_OPTIONS.find(
        ({ value }) => value === openAIModel
    )!;
    const totalTokens = promptRequestData.data?.usage?.total_tokens;
    const estimatedCost = Number(
        (((totalTokens || 0)/1000) * openAIModelDetails.cost_per_1k_tokens_usd)
            .toPrecision(2)
    );
    const tokenUsageDetails = (
        <>
            <span>Total tokens: {totalTokens}</span>
            <span>Cost: ${estimatedCost}</span>
        </>
    );
    
    return (
        <>
            <PromptSectionTitle
                title={promptTitle}
                setTitle={setPromptTitle}
            />
            <hr style={{ margin: '16px 0' }} />
            <Row gutter={48} style={rowStyle}>
                <Col span={12}>
                    <h3 style={marginBottomStyle}>Prompt input</h3>
                    <TextArea 
                        autoSize={{ minRows: 4 }}
                        disabled={isTextAreaDisabled}
                        onChange={evt => setPromptInput(evt.target.value)}
                        placeholder='What are we prompting today?' 
                        style={{
                            ...marginBottomStyle,
                            color: isTextAreaDisabled
                                ? 'grey'
                                : undefined
                        }}
                        value={promptInput}
                    />
                    <Space direction='horizontal'>
                        <Button 
                            disabled={isPromptButtonDisabled}
                            ghost 
                            loading={promptRequestData.isLoading} 
                            onClick={onClickGenerateCompletion}
                            type='primary'
                        >
                            ✨ Generate completion
                        </Button>
                        <Select<TOpenAIModel>
                            disabled={isModelSelectorDisabled}
                            style={{ width: 160 }}
                            onChange={openAIModel => setOpenAIModel(openAIModel)}
                            options={OPENAI_MODEL_OPTIONS}
                            value={openAIModel}
                        />
                        {isRequestComplete && tokenUsageDetails}
                    </Space>
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
                        promptError={promptRequestData.error}
                        promptOutputString={promptRequestData.data?.completion ?? ''}
                        renderStyle={promptOutputStyle} 
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
                                icon={<PlusCircleOutlined />} 
                                onClick={() => onClickAddSection(id, 'add')}
                                shape='round' 
                                type='text' 
                            />
                        </Tooltip>
                        <Tooltip 
                            mouseEnterDelay={1}
                            placement='top' 
                            title='Duplicate section'
                        >
                            <Button 
                                icon={<CopyOutlined />} 
                                onClick={() => onClickAddSection(
                                    id, 
                                    'add',
                                    {
                                        label: promptTitle,
                                        promptInput: promptInput,
                                        renderStyle: promptOutputStyle,
                                        openAIModel: openAIModel
                                    }
                                )}
                                shape='round' 
                                type='text' 
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
                                    icon={<DeleteOutlined />} 
                                    onClick={() => onClickAddSection(id, 'delete')}
                                    shape='round' 
                                    type='text' 
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
    justifyContent: 'center',
    marginTop: 16, 
}