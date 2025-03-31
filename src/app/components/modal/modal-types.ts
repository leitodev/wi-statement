export enum ModalTypes {
    NEW = 'NEW',
    UPDATE = 'UPDATE',
    CLOSE = 'CLOSE',
    DELETE = 'DELETE',
}

export interface ModalAction {
    event?: ModalTypes,
    data?: any
}