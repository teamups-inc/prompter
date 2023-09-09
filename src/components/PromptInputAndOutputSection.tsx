'use client';

import { Col, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Button} from 'antd';

export default function PromptInputAndOutputSection() {
    return (
        <>
            <Row gutter={48} style={rowStyle}>
                <Col span={12}>
                    <h3 style={marginBottomStyle}>Prompt input</h3>
                    <TextArea 
                        autoSize={{ minRows: 4 }}
                        placeholder='What are we prompting today?' 
                        style={marginBottomStyle}
                    />
                    <Button ghost>
                        ✨ Generate completion
                    </Button>
                </Col>
                <Col span={12}>
                    <h3 style={marginBottomStyle}>Prompt output</h3>
                    <p>Here is some sample output.</p>
                </Col>
            </Row>
        </>
    )
}

const rowStyle: React.CSSProperties = {
    flex: 1,
    justifyContent: 'center',
}

const marginBottomStyle: React.CSSProperties = {
    marginBottom: 12,
}