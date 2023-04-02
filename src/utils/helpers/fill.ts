
export function fillMap<K,V>(map: Map<K,V[]>, key: K, value: V) {
    
    let arr: V[] | undefined = map.get(key);
    
    if (!arr) {
        arr = [];
        map.set(key, arr);
    }

    arr.push(value);
}
