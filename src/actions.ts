export interface OtherAction  {
    type: '';
}

export const OtherAction: OtherAction = {type: ''};

export type API_ROOT = 'API_ROOT';
export const API_ROOT: API_ROOT = 'API_ROOT';

export interface ApiRootAction {
  type: API_ROOT;
  payload: string;
}

export const setApiRoot = (payload: string): ApiRootAction => ({
    payload,
    type: API_ROOT
});

export type FLANK = 'FLANK';
export const FLANK: FLANK = 'FLANK';

export interface FlankAction {
    type: FLANK;
    payload: number;
}

export const setFlank = (payload: number): FlankAction => ({
    payload,
    type: FLANK
});
