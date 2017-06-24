export interface OtherAction  {
    type: '';
}

export const OtherAction: OtherAction = {type: ''};

export const UPDATE_API_ROOT = 'UPDATE_API_ROOT';
export type UPDATE_API_ROOT = typeof UPDATE_API_ROOT;

export interface UpdateApiRootAction {
  type: UPDATE_API_ROOT;
  payload: string;
}

export const updateApiRoot = (payload: string): UpdateApiRootAction => ({
    payload,
    type: UPDATE_API_ROOT
});

export const RESET_API_ROOT = 'RESET_API_ROOT';
export type RESET_API_ROOT = typeof RESET_API_ROOT;

export interface ResetApiRootAction {
    type: RESET_API_ROOT;
}

export const resetApiRoot = (): ResetApiRootAction => ({
    type: RESET_API_ROOT
});

export type ApiRootActions = UpdateApiRootAction | ResetApiRootAction;

export const UPDATE_FLANK = 'UPDATE_FLANK';
export type UPDATE_FLANK = typeof UPDATE_FLANK;

export interface UpdateFlankAction {
    type: UPDATE_FLANK;
    payload: number;
}

export const updateFlank = (payload: number): UpdateFlankAction => ({
    payload,
    type: UPDATE_FLANK
});

export const RESET_FLANK = 'RESET_FLANK';
export type RESET_FLANK = typeof RESET_FLANK;

export interface ResetFlankAction {
    type: RESET_FLANK;
}

export const resetFlank = (): ResetFlankAction => ({
    type: RESET_FLANK
});

export type FlankActions = UpdateFlankAction | ResetFlankAction;
export type DispatchActions = ApiRootActions | FlankActions;
