import { TOutputRenderStyle } from './PromptInputAndOutputSection';

interface PromptOutputContentProps {
    promptOutputString: string;
    renderStyle: TOutputRenderStyle;
}

export default function PromptOutputContent(props: PromptOutputContentProps) {
    if (props.renderStyle === 'text') {
        return (
            <p>{props.promptOutputString}</p>
        );
    }

    if (props.renderStyle === 'html') {
        return (
            <div 
                dangerouslySetInnerHTML={{ __html: props.promptOutputString }} 
            />
        );
    }

    let jsonContent = null;
    let jsonParseError = null;
    try {
        jsonContent = JSON.parse(props.promptOutputString);
    } catch (err) {
        console.error(err);
        jsonParseError = err;
    }

    if (jsonParseError != null) {
        return (
            <>
                <p style={{ ...marginBottomStyle, color: 'red' }}>Error parsing JSON: {jsonParseError.toString()}</p>
                <p style={marginBottomStyle}>Reverting to text content.</p>
                <hr style={marginBottomStyle} />
                <PromptOutputContent 
                    renderStyle='text' 
                    promptOutputString={props.promptOutputString}
                />
            </>
        );
    }

    return (
        <>
            <pre>{JSON.stringify(jsonContent, null, 2)}</pre>
        </>
    );
}

const marginBottomStyle: React.CSSProperties = {
    marginBottom: 12,
};