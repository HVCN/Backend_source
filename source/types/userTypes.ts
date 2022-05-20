export type InventoryTemplate = {
    location: string,
    type: string,
    container: ContainerTemplate[]
}

export type ContainerTemplate = {
    itemName: string,
    expirationDate: Date
}
