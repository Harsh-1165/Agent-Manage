import { aZ as QueryBehavior, Y as InfiniteData, a2 as InfiniteQueryPageParamsOptions } from './hydration-BXpkOXt5.cjs';
import './removable.cjs';
import './subscribable.cjs';

declare function infiniteQueryBehavior<TQueryFnData, TError, TData, TPageParam>(pages?: number): QueryBehavior<TQueryFnData, TError, InfiniteData<TData, TPageParam>>;
/**
 * Checks if there is a next page.
 */
declare function hasNextPage(options: InfiniteQueryPageParamsOptions<any, any>, data?: InfiniteData<unknown>): boolean;
/**
 * Checks if there is a previous page.
 */
declare function hasPreviousPage(options: InfiniteQueryPageParamsOptions<any, any>, data?: InfiniteData<unknown>): boolean;

export { hasNextPage, hasPreviousPage, infiniteQueryBehavior };
