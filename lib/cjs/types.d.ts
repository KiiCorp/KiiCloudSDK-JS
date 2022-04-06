export interface KiiPaginatedResult<T> {
    items: T[];
    paginationKey: string | undefined;
}
export interface KiiACLSubject {
    getACLEntityString(): string;
}
