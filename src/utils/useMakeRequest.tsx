import { useState } from 'react';

interface FetchState<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
};

type RequestHTTPMethod = 'POST';

function useMakeRequest<
    RequestPayloadType, 
    ResponsePayloadType
>(endpointURL: string): [
    FetchState<ResponsePayloadType>, 
    (
        httpMethod: RequestHTTPMethod,
        requestPayload: RequestPayloadType
    ) => void,
] {
        const [requestState, setRequestState] = useState<FetchState<ResponsePayloadType>>({
            data: null,
            isLoading: false,
            error: null
        });

        const makeRequest = (
            httpMethod: RequestHTTPMethod, 
            requestPayload: RequestPayloadType,
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
                        isLoading: false,
                        error: null
                    });
                })
                .catch(error => {
                    setRequestState({
                        data: null,
                        isLoading: false,
                        error: error
                    });
                });
        }

        return [requestState, makeRequest];
}

export default useMakeRequest;
