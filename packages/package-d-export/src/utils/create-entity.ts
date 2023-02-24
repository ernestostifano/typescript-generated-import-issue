import type {IEntity} from "../defines/types";

function createEntity(): IEntity {
    return {
        propA: '',
        propB: 0,
        propC: false
    }
}

export {createEntity};
export type {IEntity};
