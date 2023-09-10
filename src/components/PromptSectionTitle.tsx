import { CheckCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Space, Input, Button } from 'antd';
import { useState } from 'react';

const EMPTY_TITLE = '';
export default function PromptSectionTitle() {
    const [isEditMode, setIsEditMode] = useState(true);
    const [title, setTitle] = useState(EMPTY_TITLE);

    if (isEditMode) {
        return (
            <Space.Compact>
                <Input 
                    addonBefore='Label:' 
                    placeholder='Enter label' 
                    onChange={evt => setTitle(evt.target.value)}
                    style={{
                        marginBottom: 12,
                    }}
                    value={title}
                />
                <Button
                    icon={<CheckCircleOutlined />}
                    onClick={() => setIsEditMode(false)}
                />
            </Space.Compact>
        )
    }

    const displayedTitle = title === EMPTY_TITLE
        ? '(no label)'
        : title;
    return (
        <Space>
            <h2>{displayedTitle}</h2>
            <Button
                icon={<EditOutlined />}
                    onClick={() => setIsEditMode(true)}
            />
        </Space>
    )
}