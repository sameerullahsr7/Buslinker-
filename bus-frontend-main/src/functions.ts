export const titleCase = (str: string) => {

    let _name = str?.toLowerCase().split(" ")

    for (let i = 0; i < _name.length; i++) {

        _name[i] = _name[i].charAt(0).toUpperCase() + _name[i].slice(1);

    }

    return _name.join(" ")

}