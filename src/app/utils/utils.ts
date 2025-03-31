// Функція, яка перетворює Enum в {id:number, name:string}[]
export function dropDownComponentListFromEnum(enumData: any): Array<{ id: number; name: string }> {
    return Object.values(enumData).map((value, index) => ({
        id: index + 1,
        name: value as string, // Приведення типу до string
    }));
}