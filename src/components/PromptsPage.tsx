'use client';

import React, { useEffect, useState } from 'react';
import PromptInputAndOutputSection, { TRequestCompletionResult } from './PromptInputAndOutputSection';
import { ConfigProvider, Timeline, theme } from 'antd';

interface ISectionItem {
    children: React.ReactNode,
    color?: string;
    key: number;
    style: React.CSSProperties
}

type TSectionMutationOpType = 'add' | 'delete';
export type TSectionMutationOpFunction = (key: number, op: TSectionMutationOpType) => void;
export type TSectionCompletionFunction = (key: number, reqResult: TRequestCompletionResult) => void;

export default function PromptsPage() {
    const [promptSections, setPromptsSections] = useState<ISectionItem[]>([]);

    const onCompleteSectionRequest = (
        completedSectionKey: number,
        requestResult: TRequestCompletionResult
    ) => {
        setPromptsSections(currentSections => {
            return currentSections
                .slice()
                .map(section => {
                    if (section.key === completedSectionKey) {
                        return {
                            ...section,
                            color: requestResult === 'success'
                                ? 'green'
                                : 'red',
                        }
                    }
                    return section;
                });
        })
    }

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
                        onClickAddSection,
                        onCompleteSectionRequest
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
                onCompleteSectionRequest
            )
        ])
    }, []);
    
    return (
        <div>
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,
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
    onClickAddSection: TSectionMutationOpFunction,
    onCompleteSectionRequest: TSectionCompletionFunction,
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
                    onCompleteRequest={onCompleteSectionRequest}
                />
            </div>
        ),
        style: {
            color: 'white'
        }
    };
}