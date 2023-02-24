interface IEntity {
    propA: string
    propB: number
    propC: boolean
}

function createEntity(): IEntity {
    return {
        propA: '',
        propB: 0,
        propC: false
    }
}

export {createEntity};
export type {IEntity};
