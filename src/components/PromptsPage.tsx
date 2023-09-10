'use client';

import React, { useEffect, useState } from 'react';
import PromptInputAndOutputSection from './PromptInputAndOutputSection';
import { ConfigProvider, Timeline } from 'antd';

interface ISectionItem {
    key: number;
    children: React.ReactNode,
    style: React.CSSProperties
}

type TSectionMutationOpType = 'add' | 'delete';
export type TSectionMutationOpFunction = (key: number, op: TSectionMutationOpType) => void;

export default function PromptsPage() {
    const [promptSections, setPromptsSections] = useState<ISectionItem[]>([]);
    const onClickAddSection: TSectionMutationOpFunction = (
        clickedSectionKey: number,
        op: 'add' | 'delete'
    ) => {
        setPromptsSections(currentSections => {
            const currentSectionIndex = currentSections.findIndex(
                ({ key }) => key === clickedSectionKey
            );

            if (op === 'delete') {
                return currentSections
                    .toSpliced(
                        currentSectionIndex, // start index
                        1, // num items to delete
                    );
            }
            
            return currentSections
                .toSpliced(
                    currentSectionIndex + 1, // start index
                    0, // num items to delete
                    getSectionItem(
                        true, // newly-added sections can be deleted
                        onClickAddSection
                    ), // item to insert
                );
        });
    }

    // init first section once click handler is defined
    useEffect(() => {
        setPromptsSections([
            getSectionItem(
                false, // don't enable delete for first section
                onClickAddSection,
            )
        ])
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
                    items={promptSections}
                />
            </ConfigProvider>
        </div>
    );
}

function getSectionItem(
    isDeleteEnabled: boolean,
    onClickAddSection: TSectionMutationOpFunction
): ISectionItem {
    const key = Date.now();
    return {
        key,
        children: (
            <div style={{ padding: '60px 0'}}>
                <PromptInputAndOutputSection 
                    id={key}
                    isDeleteEnabled={isDeleteEnabled}
                    onClickAddSection={onClickAddSection}
                />
            </div>
        ),
        style: {
            color: 'white'
        }
    };
}