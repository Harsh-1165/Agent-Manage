import { z as DefaultError, Y as InfiniteData, A as QueryKey, c as QueryObserver, aD as InfiniteQueryObserverResult, b as QueryClient, a8 as InfiniteQueryObserverOptions, a_ as NotifyOptions, a9 as DefaultedInfiniteQueryObserverOptions, ak as FetchNextPageOptions, al as FetchPreviousPageOptions, u as Query } from './hydration-mKPlgzt9.js';
import { Subscribable } from './subscribable.js';
import './removable.js';

type InfiniteQueryObserverListener<TData, TError> = (result: InfiniteQueryObserverResult<TData, TError>) => void;
declare class InfiniteQueryObserver<TQueryFnData = unknown, TError = DefaultError, TData = InfiniteData<TQueryFnData>, TQueryData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown> extends QueryObserver<TQueryFnData, TError, TData, InfiniteData<TQueryData, TPageParam>, TQueryKey> {
    subscribe: Subscribable<InfiniteQueryObserverListener<TData, TError>>['subscribe'];
    getCurrentResult: ReplaceReturnType<QueryObserver<TQueryFnData, TError, TData, InfiniteData<TQueryData, TPageParam>, TQueryKey>['getCurrentResult'], InfiniteQueryObserverResult<TData, TError>>;
    protected fetch: ReplaceReturnType<QueryObserver<TQueryFnData, TError, TData, InfiniteData<TQueryData, TPageParam>, TQueryKey>['fetch'], Promise<InfiniteQueryObserverResult<TData, TError>>>;
    constructor(client: QueryClient, options: InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>);
    protected bindMethods(): void;
    setOptions(options: InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>, notifyOptions?: NotifyOptions): void;
    getOptimisticResult(options: DefaultedInfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>): InfiniteQueryObserverResult<TData, TError>;
    fetchNextPage(options?: FetchNextPageOptions): Promise<InfiniteQueryObserverResult<TData, TError>>;
    fetchPreviousPage(options?: FetchPreviousPageOptions): Promise<InfiniteQueryObserverResult<TData, TError>>;
    protected createResult(query: Query<TQueryFnData, TError, InfiniteData<TQueryData, TPageParam>, TQueryKey>, options: InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>): InfiniteQueryObserverResult<TData, TError>;
}
type ReplaceReturnType<TFunction extends (...args: Array<any>) => unknown, TReturn> = (...args: Parameters<TFunction>) => TReturn;

export { InfiniteQueryObserver };
