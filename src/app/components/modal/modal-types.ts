export enum ModalTypes {
    NEW = 'NEW',
    UPDATE = 'UPDATE',
    CLOSE = 'CLOSE'
}

export interface ModalAction {
    event?: ModalTypes,
    data?: any
}