import { TRequestCompletionResult } from '@/components/PromptInputAndOutputSection';
import { useState } from 'react';

interface FetchState<T> {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    isComplete: boolean;
};

type RequestHTTPMethod = 'POST';

function useMakeRequest<
    RequestPayloadType, 
    ResponsePayloadType
>(endpointURL: string): [
    FetchState<ResponsePayloadType>, 
    (
        httpMethod: RequestHTTPMethod,
        requestPayload: RequestPayloadType,
        onComplete: (requestResult: TRequestCompletionResult) => void,
    ) => void,
] {
        const [requestState, setRequestState] = useState<FetchState<ResponsePayloadType>>({
            data: null,
            error: null,
            isLoading: false,
            isComplete: false,
        });

        const makeRequest = (
            httpMethod: RequestHTTPMethod, 
            requestPayload: RequestPayloadType,
            onComplete: (requestResult: TRequestCompletionResult) => void,
        ) => {
            setRequestState(state => ({ ...state, isLoading: true }));

            fetch(
                endpointURL, 
                { 
                    method: httpMethod, 
                    body: JSON.stringify(requestPayload) 
                }
            )
                .then<ResponsePayloadType>(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then<void>(data => {
                    setRequestState({
                        data: data,
                        error: null,
                        isLoading: false,
                        isComplete: true,
                    });
                    onComplete('success');
                })
                .catch(error => {
                    setRequestState({
                        data: null,
                        error: error,
                        isLoading: false,
                        isComplete: true,
                    });
                    onComplete('error');
                });
        }

        return [requestState, makeRequest];
}

export default useMakeRequest;
