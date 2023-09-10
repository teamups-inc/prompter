'use client';

import React, { useEffect, useState } from 'react';
import PromptInputAndOutputSection from './PromptInputAndOutputSection';
import { ConfigProvider, Timeline } from 'antd';

interface ISectionItem {
    id: number;
    item: {
        key: number;
        children: React.ReactNode,
        style: React.CSSProperties
    }
}


export default function PromptsPage() {
    const [promptSections, setPromptsSections] = useState<ISectionItem[]>([]);
    const onClickAddSection = (clickedSectionId: number) => {
        setPromptsSections(currentSections => {
            const currentSectionIndex = currentSections.findIndex(({ id }) => id === clickedSectionId);
            return currentSections
                .toSpliced(
                    currentSectionIndex + 1, // start index
                    0, // num items to delete
                    getSectionItem(onClickAddSection), // item to insert
                );
        });
    }

    // init first section once click handler is defined
    useEffect(() => {
        setPromptsSections([getSectionItem(onClickAddSection)])
    }, []);
    
    return (
        <div>
            <ConfigProvider
                theme={{
                    components: {
                        Timeline: {
                            tailColor: 'rgba(253, 253, 253, 0.12)'
                        }
                    }
                }}
            >
                <Timeline
                    items={promptSections.map(({ item }) => item)}
                />
            </ConfigProvider>
        </div>
    );
}

function getSectionItem(
    onClickAddSection: (id: number) => void
): ISectionItem {
    const id = Date.now();
    return {
        id,
        item: {
            key: id,
            children: (
                <div style={{ padding: '60px 0'}}>
                    <PromptInputAndOutputSection 
                        id={id}
                        onClickAddSection={onClickAddSection}
                    />
                </div>
            ),
            style: {
                color: 'white'
            }
        }
    };
}